---
title: Custom Code Patterns
sidebar_label: Custom Code
---

Zuplo is fully programmable. You can write custom TypeScript code for inbound
policies, outbound policies, and request handlers to extend every part of your
API gateway. This guide covers the function signatures, common patterns, and
best practices for writing custom code.

## Custom Inbound Policy

An inbound policy runs before the request handler. It receives the incoming
request and can modify it, pass it along, or short-circuit the pipeline by
returning a `Response`.

### Function Signature

```ts
export type InboundPolicyHandler<TOptions = any> = (
  request: ZuploRequest,
  context: ZuploContext,
  options: TOptions,
  policyName: string,
) => Promise<ZuploRequest | Response>;
```

- Return a `ZuploRequest` to continue the pipeline.
- Return a `Response` to short-circuit and respond immediately.

### Example: Validate a Custom Header

```ts title="modules/require-tenant-header.ts"
import { ZuploContext, ZuploRequest, HttpProblems } from "@zuplo/runtime";

interface PolicyOptions {
  headerName: string;
}

export default async function (
  request: ZuploRequest,
  context: ZuploContext,
  options: PolicyOptions,
  policyName: string,
): Promise<ZuploRequest | Response> {
  const value = request.headers.get(options.headerName);

  if (!value) {
    return HttpProblems.badRequest(request, context, {
      detail: `Missing required header '${options.headerName}'.`,
    });
  }

  // Store the value for downstream consumption
  context.custom.tenantId = value;

  return request;
}
```

### Policy Configuration

Register the policy in `config/policies.json` and reference it on your routes:

```json title="config/policies.json"
{
  "name": "require-tenant-header",
  "policyType": "custom-code-inbound",
  "handler": {
    "export": "default",
    "module": "$import(./modules/require-tenant-header)",
    "options": {
      "headerName": "x-tenant-id"
    }
  }
}
```

For details on wiring policies to routes, see
[Policy Fundamentals](./policies.md).

## Custom Outbound Policy

An outbound policy runs after the handler returns a response. It can inspect or
transform the response before it reaches the client.

:::note

Outbound policies only execute when the response status code is in the 200-299
range (`response.ok === true`).

:::

### Function Signature

```ts
export type OutboundPolicyHandler<TOptions = any> = (
  response: Response,
  request: ZuploRequest,
  context: ZuploContext,
  options: TOptions,
  policyName: string,
) => Promise<Response>;
```

### Example: Add Custom Response Headers

```ts title="modules/add-response-headers.ts"
import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

export default async function (
  response: Response,
  request: ZuploRequest,
  context: ZuploContext,
): Promise<Response> {
  // Create a new response to get mutable headers
  const newResponse = new Response(response.body, {
    status: response.status,
    headers: response.headers,
  });

  newResponse.headers.set("x-request-id", context.requestId);
  newResponse.headers.set("x-tenant-id", context.custom.tenantId ?? "unknown");

  return newResponse;
}
```

Register outbound policies the same way as inbound, using `custom-code-outbound`
as the `policyType`. See
[Custom Code Outbound Policy](../policies/custom-code-outbound.mdx) for the full
reference.

## Custom Request Handler

A request handler is the function that produces the response for a route. Use a
custom handler when you need to orchestrate calls, build a BFF
(backend-for-frontend), or return a fully custom response.

### Function Signature

```ts
export type RequestHandler = (
  request: ZuploRequest,
  context: ZuploContext,
) => Promise<any>;
```

Returning a plain object or string automatically serializes the response as JSON
with a `content-type: application/json` header.

### Example: Aggregate Two Backend Calls

```ts title="modules/aggregate-handler.ts"
import { ZuploContext, ZuploRequest, environment } from "@zuplo/runtime";

export default async function (
  request: ZuploRequest,
  context: ZuploContext,
): Promise<Response> {
  const baseUrl = environment.BACKEND_URL;

  // Run requests in parallel
  const [usersRes, ordersRes] = await Promise.all([
    fetch(`${baseUrl}/users/${request.params.userId}`),
    fetch(`${baseUrl}/users/${request.params.userId}/orders`),
  ]);

  if (!usersRes.ok || !ordersRes.ok) {
    return new Response("Upstream error", { status: 502 });
  }

  const user = await usersRes.json();
  const orders = await ordersRes.json();

  return new Response(JSON.stringify({ user, orders }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
```

For the complete handler reference, see
[Function Handler](../handlers/custom-handler.mdx).

## Accessing Policy Options

Both inbound and outbound policies receive an `options` parameter populated from
the `handler.options` object in `config/policies.json`. Define a TypeScript
interface for type safety:

```ts title="modules/rate-limit-by-plan.ts"
import { ZuploContext, ZuploRequest, HttpProblems } from "@zuplo/runtime";

interface PolicyOptions {
  defaultLimit: number;
  premiumLimit: number;
}

export default async function (
  request: ZuploRequest,
  context: ZuploContext,
  options: PolicyOptions,
  policyName: string,
): Promise<ZuploRequest | Response> {
  const plan = request.user?.data?.plan ?? "free";
  const limit =
    plan === "premium" ? options.premiumLimit : options.defaultLimit;

  context.custom.rateLimit = limit;
  context.log.info(`Applying rate limit of ${limit} for plan '${plan}'`);

  return request;
}
```

```json title="config/policies.json"
{
  "name": "rate-limit-by-plan",
  "policyType": "custom-code-inbound",
  "handler": {
    "export": "default",
    "module": "$import(./modules/rate-limit-by-plan)",
    "options": {
      "defaultLimit": 100,
      "premiumLimit": 10000
    }
  }
}
```

You can also reference environment variables in policy options using the
`$env(VARIABLE_NAME)` syntax:

```json
{
  "options": {
    "apiKey": "$env(BACKEND_API_KEY)"
  }
}
```

## Passing Data Between Pipeline Stages

Use `context.custom` to share data between policies and the request handler
within a single request. It is a mutable object that lives for the lifetime of
the request.

```ts title="modules/auth-policy.ts"
// Inbound policy: attach metadata
export default async function (
  request: ZuploRequest,
  context: ZuploContext,
): Promise<ZuploRequest | Response> {
  context.custom.userId = request.user?.sub;
  context.custom.plan = request.user?.data?.plan ?? "free";
  context.custom.requestStart = Date.now();
  return request;
}
```

```ts title="modules/my-handler.ts"
// Handler: read metadata set by the policy
export default async function (
  request: ZuploRequest,
  context: ZuploContext,
): Promise<Response> {
  const userId = context.custom.userId;
  const plan = context.custom.plan;

  context.log.info(`Handling request for user ${userId} on plan ${plan}`);

  // ...build your response
  return new Response(JSON.stringify({ userId, plan }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
```

For the full `ZuploContext` reference, see
[ZuploContext](../programmable-api/zuplo-context.mdx).

## Accessing Environment Variables

Import `environment` from `@zuplo/runtime` to read environment variables in any
custom module:

```ts
import { environment } from "@zuplo/runtime";

const apiKey = environment.API_KEY; // string | undefined
```

Always validate required variables early to surface configuration errors at
startup rather than at request time:

```ts
import { environment, ConfigurationError } from "@zuplo/runtime";

const apiKey = environment.API_KEY;
if (!apiKey) {
  throw new ConfigurationError("API_KEY environment variable is not set");
}
```

For more information on setting and managing environment variables, see
[Configuring Environment Variables](./environment-variables.mdx) and the
[Environment Variables API](../programmable-api/environment.mdx).

## Common Patterns

### Forward User Metadata as Headers

Pass authenticated user information to your backend as headers so backend
services don't need to re-validate tokens:

```ts title="modules/forward-user-headers.ts"
import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

export default async function (
  request: ZuploRequest,
  context: ZuploContext,
): Promise<ZuploRequest | Response> {
  if (!request.user) {
    return request;
  }

  const newRequest = new ZuploRequest(request);
  newRequest.headers.set("x-user-id", request.user.sub);

  if (request.user.data?.email) {
    newRequest.headers.set("x-user-email", request.user.data.email);
  }

  if (request.user.data?.plan) {
    newRequest.headers.set("x-user-plan", request.user.data.plan);
  }

  return newRequest;
}
```

### Conditional Logic Based on Plan or Metadata

Route or transform requests differently based on the authenticated user's plan
or custom metadata:

```ts title="modules/plan-based-routing.ts"
import { ZuploContext, ZuploRequest, environment } from "@zuplo/runtime";

export default async function (
  request: ZuploRequest,
  context: ZuploContext,
): Promise<ZuploRequest | Response> {
  const plan = request.user?.data?.plan ?? "free";

  if (plan === "enterprise") {
    context.custom.backendUrl = environment.ENTERPRISE_BACKEND_URL;
  } else {
    context.custom.backendUrl = environment.DEFAULT_BACKEND_URL;
  }

  return request;
}
```

### Custom Response Transformation

Reshape a backend response before returning it to the client:

```ts title="modules/transform-response.ts"
import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

export default async function (
  response: Response,
  request: ZuploRequest,
  context: ZuploContext,
): Promise<Response> {
  if (response.status !== 200) {
    return response;
  }

  const data = await response.json();

  // Wrap the response in an envelope
  const envelope = {
    success: true,
    data,
    metadata: {
      requestId: context.requestId,
      timestamp: new Date().toISOString(),
    },
  };

  return new Response(JSON.stringify(envelope), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
```

## When to Use Policy vs Handler vs Hook

Zuplo provides three extension points for custom code. Choose the right one
based on your use case:

| Extension Point     | Use When                                                                                       |
| ------------------- | ---------------------------------------------------------------------------------------------- |
| **Inbound Policy**  | You need to inspect, validate, or modify the request before it reaches the handler.            |
| **Outbound Policy** | You need to inspect or transform the response after the handler runs.                          |
| **Request Handler** | You need to produce the response -- call backends, aggregate data, or return custom responses. |
| **Hook**            | You need cross-cutting logic that applies globally, such as logging or tracing.                |

Policies are configured per-route and are reusable across multiple routes. Hooks
are registered globally in `zuplo.runtime.ts` and run on every request. For a
detailed explanation of how these fit together, see
[Request Lifecycle](../concepts/request-lifecycle.mdx).
