---
title: ZuploContext
---

The `ZuploContext` object provides information about the current request and
runtime environment. It is passed as the second parameter to request handlers
and policies.

```ts
import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

export default async function (request: ZuploRequest, context: ZuploContext) {
  // Access context properties and methods
  context.log.info(`Processing request ${context.requestId}`);
  return new Response("Hello World");
}
```

## Properties

### `contextId`

A unique identifier for the current execution context. This is different from
`requestId` and is useful for correlating multiple operations within the same
execution.

```ts
const executionId = context.contextId;
context.log.info(`Execution context: ${executionId}`);
```

### `custom`

A mutable object that can be used to store custom data during request
processing. This is useful for passing data between policies and handlers.

```ts
// In a policy
context.custom.userId = "user-123";
context.custom.permissions = ["read", "write"];
context.custom.startTime = Date.now();

// In a handler
const userId = context.custom.userId;
const permissions = context.custom.permissions;
const elapsed = Date.now() - context.custom.startTime;
```

### `incomingRequestProperties`

Information about the incoming request such as geolocation data. This is a
read-only object with the following properties:

- `asn` - ASN of the incoming request, for example, 395747.
- `asOrganization` - The organization which owns the ASN of the incoming
  request, for example, Google Cloud.
- `city` - City of the incoming request, for example, "Austin".
- `continent` - Continent of the incoming request, for example, "NA".
- `country` - The
  [two-letter country code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) in
  the request.
- `latitude` - Latitude of the incoming request, for example, "30.27130".
- `longitude` - Longitude of the incoming request, for example, "-97.74260".
- `colo` - The three-letter
  [IATA airport code](https://en.wikipedia.org/wiki/IATA_airport_code) of the
  data center that the request hit, for example, "DFW".
- `postalCode` - Postal code of the incoming request, for example, "78701".
- `httpProtocol` - The HTTP protocol of the incoming request.
- `metroCode` - Metro code (DMA) of the incoming request, for example, "635".
- `region` - If known, the
  [ISO 3166-2](https://en.wikipedia.org/wiki/ISO_3166-2) name for the first
  level region associated with the IP address of the incoming request, for
  example, "Texas".
- `regionCode` - If known, the
  [ISO 3166-2](https://en.wikipedia.org/wiki/ISO_3166-2) code for the
  first-level region associated with the IP address of the incoming request, for
  example, "TX".
- `timezone` - Timezone of the incoming request, for example, "America/Chicago".

```ts
const geo = context.incomingRequestProperties;
context.log.info({
  city: geo.city,
  country: geo.country,
  coordinates: `${geo.latitude},${geo.longitude}`,
});
```

### `log`

A logger instance for debugging and monitoring. Logs appear in your log tail in
the portal and in your integrated log solution (e.g. DataDog). Pre-production
environments are typically set to **Info** log level, while production is set to
**Error**.

```ts
context.log.debug({ some: "debug-info" });
context.log.info("info level stuff");
context.log.warn(["a", "warning"]);
context.log.error({ Oh: "my!" });
```

### `parentContext`

Reference to the parent context when using `invokeRoute`. This property is
`undefined` for the initial request context. This is useful for detecting
sub-requests and accessing parent context data.

```ts
if (context.parentContext) {
  context.log.info("This is a sub-request");
  const parentRequestId = context.parentContext.requestId;
  context.log.info(`Parent request: ${parentRequestId}`);
}
```

### `requestId`

A UUID for every request. This is used in logging and can be handy to tie events
together. The `requestId` is automatically logged with every use of the logger.

```ts
context.log.info(`Processing request ${context.requestId}`);

// Pass to upstream services for distributed tracing
const response = await fetch(upstreamUrl, {
  headers: {
    "X-Request-ID": context.requestId,
  },
});
```

### `route`

A read-only pointer to the configuration for the matched route. Includes the
label, path, methods supported, name of the version, and names of policies. This
type is immutable - the routing table cannot be updated at runtime.

```ts
const routePath = context.route.path;
const methods = context.route.methods;
const version = context.route.version;

context.log.info({
  route: routePath,
  methods: methods.join(", "),
  version: version,
});
```

## Methods

### `addResponseSendingHook`

Adds a hook that executes before a response is sent to the client. This hook can
modify the response before it is sent. Multiple hooks can be added and they
execute in the order they were added.

```ts
addResponseSendingHook(
  hook: (response: Response, request: Request, context: ZuploContext) => Response | Promise<Response>
): void
```

See [Request/Response Hooks](./hooks.md#hook-onresponsesending) for detailed
examples and usage patterns.

### `addResponseSendingFinalHook`

Adds a hook that executes after all other response processing is complete but
before the response is sent. Unlike `addResponseSendingHook`, this hook cannot
modify the response - it is for monitoring and logging purposes only.

```ts
addResponseSendingFinalHook(
  hook: (response: Response, request: Request, context: ZuploContext) => void | Promise<void>
): void
```

See [Request/Response Hooks](./hooks.md#hook-onresponsesendingfinal) for
detailed examples and usage patterns.

### `invokeInboundPolicy`

Programmatically executes an inbound policy from your policy library. This is
useful for conditionally executing policies based on request attributes.

```ts
import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

export default async function (request: ZuploRequest, context: ZuploContext) {
  // Conditionally apply rate limiting
  if (request.user.data.isFreeUser) {
    const result = await context.invokeInboundPolicy(
      "rate-limit-policy",
      request,
    );
    if (result instanceof Response) {
      return result; // Rate limit exceeded
    }
    request = result; // Use the new request object
  }

  // Continue processing
  return fetch(request);
}
```

**Important Notes:**

- The method returns either a `Request` or `Response` object
- A `Response` indicates the policy wants to short-circuit and stop processing
- A `Request` is typically a new request object created by the policy
- The original request becomes locked after invoking a policy

```ts
const result = await context.invokeInboundPolicy("my-policy", request);

if (result instanceof Response) {
  // Policy terminated the request chain
  context.log.warn(`Policy returned status: ${result.status}`);
  return result;
}

// Continue with the new request object
return fetch(result);
```

### `invokeOutboundPolicy`

Programmatically executes an outbound policy from your policy library. Outbound
policies process responses before they are sent to the client.

```ts
export default async function (request: ZuploRequest, context: ZuploContext) {
  // Make the upstream request
  const response = await fetch(request);

  // Conditionally apply response transformation
  if (response.headers.get("content-type")?.includes("application/json")) {
    return context.invokeOutboundPolicy(
      "json-transform-policy",
      response,
      request,
    );
  }

  // Apply caching policy for successful responses
  if (response.ok) {
    return context.invokeOutboundPolicy("cache-policy", response, request);
  }

  return response;
}
```

### `invokeRoute`

Invokes another route within the same API gateway. This enables internal routing
and composition of multiple routes. The invoked route runs with a new context
that has `parentContext` set to the current context.

```ts
export default async function (request: ZuploRequest, context: ZuploContext) {
  // First, validate the request using an internal route
  const validationResponse = await context.invokeRoute("/internal/validate", {
    method: "POST",
    body: JSON.stringify({
      userId: request.user?.sub,
      resource: request.params.resourceId,
      action: "read",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!validationResponse.ok) {
    return new Response("Access denied", { status: 403 });
  }

  // Then fetch user preferences from another internal route
  const prefsResponse = await context.invokeRoute(
    `/internal/users/${request.user?.sub}/preferences`,
  );
  const preferences = await prefsResponse.json();

  // Continue with main processing using the preferences
  const response = await fetch(request);

  // Apply preferences to response
  if (preferences.format === "xml") {
    return context.invokeOutboundPolicy("json-to-xml", response, request);
  }

  return response;
}
```

### `waitUntil`

Notifies the runtime to keep the process alive until the provided promise
resolves. This is essential for asynchronous work that continues after sending a
response, such as logging, analytics, or cleanup tasks.

```ts
export default async function (request: ZuploRequest, context: ZuploContext) {
  const startTime = Date.now();
  const response = await fetch(request);

  // Asynchronous work that continues after response
  const asyncWork = async () => {
    try {
      // Log to external service
      await fetch("https://analytics.example.com/api/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${context.secrets.ANALYTICS_API_KEY}`,
        },
        body: JSON.stringify({
          event: "api_call",
          properties: {
            path: request.url,
            method: request.method,
            status: response.status,
            duration: Date.now() - startTime,
            country: context.incomingRequestProperties.country,
            userId: request.user?.sub,
          },
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      context.log.error("Failed to send analytics", error);
    }
  };

  // Tell runtime to wait for async work to complete
  context.waitUntil(asyncWork());

  return response;
}
```

## Common Patterns

### Request Timing

```ts
export default async function (request: ZuploRequest, context: ZuploContext) {
  // Store start time
  context.custom.startTime = Date.now();

  // Add response hook to measure duration
  context.addResponseSendingHook(async (response) => {
    const duration = Date.now() - context.custom.startTime;
    response.headers.set("X-Response-Time", `${duration}ms`);
    return response;
  });

  return fetch(request);
}
```

For more hook examples, see [Request/Response Hooks](./hooks.md).

### Conditional Policy Execution

```ts
export default async function (request: ZuploRequest, context: ZuploContext) {
  // Apply different policies based on user type
  if (request.user?.type === "internal") {
    // Skip rate limiting for internal users
    return fetch(request);
  }

  // Apply rate limiting for external users
  const rateLimitResult = await context.invokeInboundPolicy(
    "rate-limit",
    request,
  );
  if (rateLimitResult instanceof Response) {
    return rateLimitResult;
  }

  // Apply additional security for untrusted users
  if (!request.user?.verified) {
    const securityResult = await context.invokeInboundPolicy(
      "enhanced-security",
      rateLimitResult,
    );
    if (securityResult instanceof Response) {
      return securityResult;
    }
    request = securityResult;
  }

  return fetch(request);
}
```

## See Also

- [Request/Response Hooks](./hooks.md) - Detailed guide on using hooks
- [Custom Request Handlers](../handlers/custom-handler.md) - Building custom
  handlers
- [Policies Overview](../articles/policies.md) - Understanding policies
- [Logger](./logger.md) - Detailed logging API documentation
- [Request User](./request-user.md) - Working with authenticated users
- [Routing](../articles/routing.md) - How routing works in Zuplo
