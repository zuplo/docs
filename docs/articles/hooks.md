---
title: Request/Response Hooks
---

Hooks allow running code as part of the Request/Response pipeline. Hooks are
typically added using a plugin as shown in this document, but they can also be
added globally using [Runtime Extensions](./runtime-extensions.md).

:::tip

All hooks can be either synchronous or asynchronous. To make your hook
asynchronous simply add the `async` keyword on the function.

:::

## Hook: OnResponseSending

The `OnResponseSending` hook on `ZuploContext` fires just before the response is
sent to the client. The `Response` can be modified by returning a new `Response`
from this hook. This hook is useful for creating an inbound policy that also
needs to run some logic after the response is returned from the handler.

The example below shows a simple tracing policy that adds a trace header to the
request and ensures the same header is returned with the response.

```ts
import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

export async function tracingPlugin(
  request: ZuploRequest,
  context: ZuploContext,
  policyName: string,
) {
  // Get the trace header
  let traceparent = request.headers.get("traceparent");

  // If not set, add the header to the request
  if (!traceparent) {
    traceparent = crypto.randomUUID();
    const headers = new Headers(request.headers);
    headers.set("traceparent", traceparent);
    return new ZuploRequest(request, { headers });
  }

  context.addResponseSendingHook((response, latestRequest, context) => {
    // If the response doesn't have the trace header that matches, set it
    if (response.headers.get("traceparent") !== traceparent) {
      const headers = new Headers(response.headers);
      headers.set("traceparent", traceparent);
      return new Response(response.body, {
        headers,
      });
    }
    return response;
  });

  return request;
}
```

## Hook: OnResponseSendingFinal

The `OnResponseSendingFinal` hook on `ZuploContext` fires immediately before the
response is sent to the client. The `Response` in this hook is immutable. This
hook is useful for custom tasks like caching, logging or analytics.

This simple example shows logging the time from the start of this policy until
just before the response is sent.

```ts
import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

export async function pluginWithHook(
  request: ZuploRequest,
  context: ZuploContext,
  policyName: string,
) {
  const start = Date.now();
  async (response, latestRequest, context) => {
    const end = Date.now();
    const delta = end - start;
    context.log.debug(`request took ${delta}ms`);
  });

  return request;
}
```

Note that the call can block the response, so if you wish to run an activity
asynchronously and not block the response you shouldn't await inside the hook
and use `context.waitUntil` to ensure your asynchronous activity isn't
terminated prematurely - this is shown in the example below. This example shows
details of the request and final response being sent to an imaginary logging
service.

```ts
import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

export async function pluginWithHook(
  request: ZuploRequest,
  context: ZuploContext,
  policyName: string,
) {

  // Note we must clone the request here, before it's used by the handler
  const requestClone = request.clone();

  context.addResponseSendingFinalHook(
    async (response, latestRequest, context) => {

      // Note, we must clone the response to read the body
      // as the original will be used the by response pipeline
      // itself
      const responseClone = response.clone();

      const asyncInnerFunction = async () => {
        // Note - we must clone the response
        const requestBody = await requestClone.text();
        const responseBody = await responseClone.text();
        await fetch("https://example.com", {
          method: "GET",
          body: JSON.stringify({ requestBody, responseBody });
        });
      }

      const promise = asyncInnerFunction();

      // Don't block the response while waiting for the fetch
      context.waitUntil(promise);
    });

  return request;
}
```
