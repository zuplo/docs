---
title: Request/Response Hooks
sidebar_label: Hooks
---

Hooks allow you to run code at specific points in the request/response pipeline.
They're accessible through the [ZuploContext](./zuplo-context.md) object and are
commonly used for cross-cutting concerns like logging, tracing, and monitoring.

:::tip

All hooks can be either synchronous or asynchronous. To make your hook
asynchronous, simply add the `async` keyword to the function.

:::

## Available Hooks

Zuplo provides two main hooks for the response pipeline:

- **`addResponseSendingHook`** - Executes before the response is sent and can
  modify it
- **`addResponseSendingFinalHook`** - Executes after all processing but cannot
  modify the response

## Hook: OnResponseSending

The `addResponseSendingHook` method adds a hook that fires just before the
response is sent to the client. This hook can modify the response by returning a
new `Response` object. Multiple hooks execute in the order they were added.

### Method Signature

```ts
context.addResponseSendingHook(
  (response: Response, request: Request, context: ZuploContext) =>
    Response | Promise<Response>,
);
```

### Example: Adding Response Headers

```ts
export default async function handler(
  request: ZuploRequest,
  context: ZuploContext,
) {
  context.addResponseSendingHook(async (response, request) => {
    // Add custom headers to all responses
    response.headers.set("X-Request-ID", context.requestId);
    response.headers.set(
      "X-Processing-Time",
      `${Date.now() - context.custom.startTime}ms`,
    );

    // Log response details
    context.log.info({
      status: response.status,
      contentType: response.headers.get("content-type"),
    });

    return response;
  });

  return fetch(request);
}
```

### Example: Tracing Policy

This example shows a tracing policy that ensures trace headers are consistent
between requests and responses:

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

The `addResponseSendingFinalHook` method adds a hook that fires immediately
before the response is sent to the client. Unlike `OnResponseSending`, this hook
cannot modify the response - it's immutable at this point. This hook is ideal
for logging, analytics, and monitoring tasks.

### Method Signature

```ts
context.addResponseSendingFinalHook(
  (response: Response, request: Request, context: ZuploContext) => void | Promise<void>
)
```

### Example: Request Duration Logging

This example logs the total request processing time:

```ts
import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

export default async function handler(
  request: ZuploRequest,
  context: ZuploContext,
) {
  const start = Date.now();

  context.addResponseSendingFinalHook(async (response, latestRequest) => {
    const end = Date.now();
    const delta = end - start;
    context.log.debug(`Request took ${delta}ms`);
  });

  return fetch(request);
}
```

### Example: Asynchronous Analytics

This hook can block the response. To run asynchronous tasks without blocking,
use `context.waitUntil()` to ensure your async work completes after the response
is sent:

```ts
export default async function handler(
  request: ZuploRequest,
  context: ZuploContext,
) {
  // Clone request before it's consumed by the handler
  const requestClone = request.clone();

  context.addResponseSendingFinalHook(async (response, latestRequest) => {
    // Clone response to read the body without consuming it
    const responseClone = response.clone();

    const asyncAnalytics = async () => {
      const requestBody = await requestClone.text();
      const responseBody = await responseClone.text();

      await fetch("https://analytics.example.com/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: context.requestId,
          requestBody,
          responseBody,
          status: response.status,
          timestamp: new Date().toISOString(),
        }),
      });
    };

    // Don't block the response
    context.waitUntil(asyncAnalytics());
  });

  return fetch(request);
}
```

## Best Practices

### 1. Order Matters

Hooks execute in the order they're added. Plan your hook order carefully:

```ts
// First hook adds authentication info
context.addResponseSendingHook((response) => {
  response.headers.set("X-User-ID", request.user?.sub || "anonymous");
  return response;
});

// Second hook adds timing (sees the user header)
context.addResponseSendingHook((response) => {
  response.headers.set("X-Processing-Time", `${Date.now() - start}ms`);
  return response;
});
```

### 2. Clone Before Reading

Always clone requests and responses before reading their bodies:

```ts
// ❌ Bad - consumes the original body
const body = await response.text();

// ✅ Good - preserves the original
const clone = response.clone();
const body = await clone.text();
```

### 3. Use waitUntil for Async Work

For operations that shouldn't block the response:

```ts
context.addResponseSendingFinalHook((response) => {
  const asyncWork = async () => {
    // Long-running operation
    await sendToAnalytics(response);
  };

  context.waitUntil(asyncWork());
});
```

### 4. Handle Errors Gracefully

Always handle errors in hooks to prevent response failures:

```ts
context.addResponseSendingHook(async (response) => {
  try {
    // Hook logic
    response.headers.set("X-Custom", "value");
  } catch (error) {
    context.log.error("Hook failed", error);
    // Return original response on error
  }
  return response;
});
```

## Hook Registration

Hooks can be registered in two ways:

1. **In Handlers or Policies** - Add hooks directly in your code using
   `context.addResponseSendingHook()` or `context.addResponseSendingFinalHook()`

2. **Globally via Runtime Extensions** - Register hooks that apply to all
   requests using [Runtime Extensions](./runtime-extensions.md)

## See Also

- [ZuploContext](./zuplo-context.md) - The context object that provides hook
  methods
- [Runtime Extensions](./runtime-extensions.md) - Global hook registration
- [waitUntil](./zuplo-context.md#waituntil) - Extending request lifetime for
  async operations
