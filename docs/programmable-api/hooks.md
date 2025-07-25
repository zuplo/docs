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

Zuplo provides several hooks for different stages of the request/response
pipeline:

### Request Pipeline Hooks

- **`addPreRoutingHook`** - Executes before route matching, can modify the
  request URL or headers
- **`addRequestHook`** - Executes after route matching but before handlers, can
  return early responses

### Response Pipeline Hooks

- **`addResponseSendingHook`** - Executes before the response is sent and can
  modify it
- **`addResponseSendingFinalHook`** - Executes after all processing but cannot
  modify the response

### Hook Types

```ts
// Pre-routing hook (available globally via runtime.addPreRoutingHook)
interface PreRoutingHook {
  (request: Request): Promise<Request> | Request;
}

// Request hook (available globally and per-context)
interface OnRequestHook {
  (
    request: ZuploRequest,
    context: ZuploContext,
  ): Promise<ZuploRequest | Response> | (ZuploRequest | Response);
}

// Response hooks (available globally and per-context)
interface OnResponseSendingHook {
  (
    response: Response,
    request: ZuploRequest,
    context: ZuploContext,
  ): Promise<Response> | Response;
}

interface OnResponseSendingFinalHook {
  (
    response: Response,
    request: ZuploRequest,
    context: ZuploContext,
  ): Promise<void> | void;
}
```

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

## Complete Hook Pipeline Example

This example demonstrates how all hooks work together in a request/response
lifecycle:

```ts
// In zuplo.runtime.ts - Global hooks
import { RuntimeExtensions } from "@zuplo/runtime";

export function runtimeInit(runtime: RuntimeExtensions) {
  // 1. Pre-routing hook - runs before route matching
  runtime.addPreRoutingHook((request) => {
    console.log("Pre-routing: Processing request", request.url);

    // Normalize URL to lowercase
    const url = new URL(request.url);
    if (url.pathname !== url.pathname.toLowerCase()) {
      url.pathname = url.pathname.toLowerCase();
      return new Request(url.toString(), request);
    }
    return request;
  });

  // 2. Request hook - runs after routing but before handlers
  runtime.addRequestHook(async (request, context) => {
    console.log("Request hook: Adding correlation ID");

    const correlationId = crypto.randomUUID();
    context.custom.startTime = Date.now();
    context.custom.correlationId = correlationId;

    const headers = new Headers(request.headers);
    headers.set("X-Correlation-ID", correlationId);

    return new ZuploRequest(request, { headers });
  });

  // 3. Response sending hook - can modify response
  runtime.addResponseSendingHook((response, request, context) => {
    console.log("Response sending: Adding security headers");

    const headers = new Headers(response.headers);
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("X-Frame-Options", "DENY");
    headers.set("X-Correlation-ID", context.custom.correlationId);

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  });

  // 4. Response sending final hook - for logging/analytics only
  runtime.addResponseSendingFinalHook(async (response, request, context) => {
    const duration = Date.now() - context.custom.startTime;
    console.log(
      `Request completed in ${duration}ms with status ${response.status}`,
    );

    // Non-blocking analytics
    const sendAnalytics = async () => {
      await fetch("https://analytics.example.com/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          correlationId: context.custom.correlationId,
          method: request.method,
          path: new URL(request.url).pathname,
          status: response.status,
          duration,
          timestamp: new Date().toISOString(),
        }),
      });
    };

    context.waitUntil(sendAnalytics());
  });
}
```

```ts
// In a handler - Local hooks that augment global ones
export default async function handler(
  request: ZuploRequest,
  context: ZuploContext,
) {
  // Handler-specific response hook
  context.addResponseSendingHook(async (response, request, context) => {
    // Add handler-specific headers
    const headers = new Headers(response.headers);
    headers.set("X-Handler", "custom-api");
    headers.set("X-Processing-Node", process.env.REGION || "unknown");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  });

  // Your handler logic
  const result = await processApiRequest(request);
  return new Response(JSON.stringify(result), {
    headers: { "Content-Type": "application/json" },
  });
}
```

### Hook Execution Order

1. **Pre-routing hooks** (global only) - before route matching
2. **Request hooks** (global first, then handler-specific) - after route
   matching
3. Handler execution
4. **Response sending hooks** (global first, then handler-specific) - can modify
   response
5. **Response sending final hooks** (global first, then handler-specific) -
   read-only

## Creating Custom Plugins with Hooks

You can create reusable plugins that register hooks automatically:

```ts
// In modules/custom-observability-plugin.ts
import {
  SystemRuntimePlugin,
  RuntimeExtensions,
  ZuploRequest,
  ZuploContext,
} from "@zuplo/runtime";

interface ObservabilityOptions {
  metricsEndpoint: string;
  apiKey: string;
  enableTracing?: boolean;
}

export class CustomObservabilityPlugin extends SystemRuntimePlugin {
  constructor(private options: ObservabilityOptions) {
    super();
  }

  async initialize(runtime: RuntimeExtensions): Promise<void> {
    // Add correlation ID to all requests
    runtime.addRequestHook(this.addCorrelationId.bind(this));

    // Add trace headers to responses
    if (this.options.enableTracing) {
      runtime.addResponseSendingHook(this.addTraceHeaders.bind(this));
    }

    // Send metrics after each request
    runtime.addResponseSendingFinalHook(this.sendMetrics.bind(this));
  }

  private addCorrelationId(request: ZuploRequest, context: ZuploContext) {
    const correlationId =
      request.headers.get("x-correlation-id") || crypto.randomUUID();

    context.custom.correlationId = correlationId;
    context.custom.startTime = Date.now();

    if (!request.headers.get("x-correlation-id")) {
      const headers = new Headers(request.headers);
      headers.set("x-correlation-id", correlationId);
      return new ZuploRequest(request, { headers });
    }

    return request;
  }

  private addTraceHeaders(
    response: Response,
    request: ZuploRequest,
    context: ZuploContext,
  ) {
    const headers = new Headers(response.headers);
    headers.set("x-correlation-id", context.custom.correlationId);
    headers.set("x-trace-id", context.requestId);

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  private async sendMetrics(
    response: Response,
    request: ZuploRequest,
    context: ZuploContext,
  ) {
    const duration = Date.now() - context.custom.startTime;

    const metrics = {
      timestamp: new Date().toISOString(),
      correlationId: context.custom.correlationId,
      method: request.method,
      path: new URL(request.url).pathname,
      status: response.status,
      duration,
      userAgent: request.headers.get("user-agent"),
      contentLength: response.headers.get("content-length"),
    };

    // Send asynchronously to avoid blocking response
    const sendToMetrics = async () => {
      try {
        await fetch(this.options.metricsEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.options.apiKey}`,
          },
          body: JSON.stringify(metrics),
        });
      } catch (error) {
        context.log.error("Failed to send metrics", error);
      }
    };

    context.waitUntil(sendToMetrics());
  }
}
```

```ts
// In zuplo.runtime.ts - Register the plugin
import { RuntimeExtensions } from "@zuplo/runtime";
import { CustomObservabilityPlugin } from "./modules/custom-observability-plugin";

export function runtimeInit(runtime: RuntimeExtensions) {
  const observabilityPlugin = new CustomObservabilityPlugin({
    metricsEndpoint: "https://metrics.example.com/api/events",
    apiKey: process.env.METRICS_API_KEY!,
    enableTracing: true,
  });

  runtime.addPlugin(observabilityPlugin);
}
```

This plugin demonstrates:

- **Reusable functionality** encapsulated in a plugin class
- **Multiple hook types** working together (request, response sending, response
  final)
- **Configurable behavior** through constructor options
- **Error handling** and **non-blocking operations** with `waitUntil`
- **Context data sharing** between hooks

## See Also

- [ZuploContext](./zuplo-context.md) - The context object that provides hook
  methods
- [Runtime Extensions](./runtime-extensions.md) - Global hook registration
- [waitUntil](./zuplo-context.md#waituntil) - Extending request lifetime for
  async operations
