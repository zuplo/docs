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

The `OnResponseSendingFinal` hook on `ZuploContext` fires immediately after the
response is sent to the client. The `Response` in this hook is immutable and the
body has been used. This hook is useful for custom performing various tasks like
logging or analytics.

```ts
import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

export async function pluginWithHook(
  request: ZuploRequest,
  context: ZuploContext,
  policyName: string,
) {
  const cloned = request.clone();
  context.addResponseSendingFinalHook(
    async (response, latestRequest, context) => {
      const body = await cloned.text();
      await fetch("https://example.com", {
        method: "GET",
        body,
      });
    },
  );

  return request;
}
```
