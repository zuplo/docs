---
title: API Errors
---

Well-designed API errors are as important as the successful responses your API
returns. A good error response tells the caller what went wrong, whether the
problem is on their side or yours, and what they can do about it. Zuplo
encourages every API to return standard, actionable error messages so that
developers integrating with your API spend less time guessing and more time
building.

This page explains the error format Zuplo uses by default, how it shows up in
the gateway, and how to customize the shape of error responses when your API has
its own conventions.

## Why standard errors matter

When every endpoint invents its own error shape, client code becomes brittle.
Developers have to special-case each response, parse ad-hoc fields, and guess at
whether a failure is retryable. Standardizing errors across your API produces
three concrete benefits:

- **Faster integration** -- consumers write one error handler that works
  everywhere.
- **Better observability** -- logs, dashboards, and tools can parse errors
  consistently.
- **Clearer contracts** -- your OpenAPI document can describe errors using the
  same schema for every operation.

A good error response is short, machine-readable, and specific. It identifies
the kind of problem, says what happened in human terms, and includes enough
context (a request ID, a field name, a retry hint) that the caller can take the
next step without opening a support ticket.

## The Problem Details format

Zuplo defaults to the [Problem Details for HTTP APIs](https://httpproblems.com/)
format defined by [RFC 7807](https://datatracker.ietf.org/doc/html/rfc7807).
Problem Details is a small, widely adopted JSON schema for representing errors
from HTTP APIs. Responses use the `application/problem+json` content type and
follow a consistent shape.

A typical Problem Details response from Zuplo looks like this:

```json
{
  "type": "https://httpproblems.com/http-status/401",
  "title": "Unauthorized",
  "status": 401,
  "instance": "/v1/widgets",
  "trace": {
    "timestamp": "2026-04-19T17:13:31.352Z",
    "requestId": "28f2d802-8e27-49c8-970d-39d90ef0ac61",
    "buildId": "eb9ef87d-b55d-446e-9fdd-13c209c01b95"
  }
}
```

The standard fields are:

- **`type`** -- a URI that identifies the kind of problem. Every occurrence of
  the same problem should share the same `type`.
- **`title`** -- a short, human-readable summary that should stay consistent for
  a given `type`.
- **`status`** -- the HTTP status code, duplicated in the body so clients that
  log only the payload still see it.
- **`detail`** -- a human-readable explanation of this particular occurrence.
  This is the field that varies from request to request.
- **`instance`** -- a URI or path that identifies the specific request that
  produced the error.

Problem Details also allows **extensions** -- arbitrary additional fields that
carry problem-specific data. Zuplo uses extensions to include a `trace` object
containing the request ID, build ID, and timestamp on every error, which makes
support requests easy to correlate with logs.

:::tip

Keep `title` stable for a given error type and put request-specific information
in `detail` or in extensions. Clients match on `type` and `title`; humans read
`detail`.

:::

## How Zuplo uses Problem Details

Zuplo's built-in policies, handlers, and system errors all return Problem
Details responses out of the box. When an inbound policy rejects a request --
for example, the
[API Key Authentication policy](../policies/api-key-inbound.mdx) when a key is
missing, or the [Rate Limiting policy](../policies/rate-limit-inbound.mdx) when
a caller exceeds their quota -- the response body is a Problem Details object
with a `type`, `title`, `status`, and `trace`. The same is true for system
responses like unmatched routes and unsupported HTTP methods.

This means that consumers of a Zuplo-fronted API get a consistent error contract
for free across gateway errors, even before you write any custom code.

### Returning Problem Details from custom code

When you write a [custom handler](../handlers/custom-handler.mdx) or a
[custom policy](../articles/policies.mdx), return Problem Details responses
using the `HttpProblems` helper from `@zuplo/runtime`. The helper has a method
for every HTTP status code and automatically fills in `type`, `title`, `status`,
`instance`, and `trace`.

```ts
import { HttpProblems, ZuploContext, ZuploRequest } from "@zuplo/runtime";

export default async function (request: ZuploRequest, context: ZuploContext) {
  if (!request.user) {
    return HttpProblems.unauthorized(request, context);
  }

  return request;
}
```

For the full list of methods and options, see the
[HttpProblems helper reference](../programmable-api/http-problems.mdx).

### Adding context with `detail` and extensions

Override the default fields when you have something more useful to say. Use
`detail` for a human-readable explanation of the specific failure, and use
extension members for structured data that clients can act on.

```ts
return HttpProblems.badRequest(request, context, {
  title: "Invalid value for query parameter 'take'",
  detail:
    "The take parameter must be a number less than 100. The provided value was 'hello'.",
  extensions: {
    parameter: "take",
    providedValue: "hello",
  },
});
```

The `title` stays consistent for every instance of this error, while `detail`
and the `parameter` extension tell the caller exactly what to fix.

### Throwing runtime errors

If your code throws rather than returning a response, use `RuntimeError` and
`ConfigurationError` to attach structured context that the gateway can surface.
Thrown errors are converted to Problem Details responses automatically, and any
`extensionMembers` you attach flow through to the response body.

```ts
import { RuntimeError } from "@zuplo/runtime";

throw new RuntimeError({
  message: "Upstream database timed out",
  extensionMembers: {
    service: "orders-db",
    timeoutMs: 5000,
  },
});
```

See [Runtime Errors](../programmable-api/runtime-errors.mdx) for details on both
error classes and patterns for mapping them to problem responses.

## Customizing the error response format

Problem Details is the default, but it isn't the only option. If your API
already has an established error schema, or if you want to wrap every error in a
custom envelope, Zuplo provides two levels of customization.

### Per-response overrides

The simplest customization is to override fields on individual responses.
`HttpProblems` lets you change `title`, `detail`, `type`, `instance`, and add
arbitrary extensions without giving up the standard format.

```ts
return HttpProblems.tooManyRequests(
  request,
  context,
  {
    type: "https://errors.example.com/rate-limit-exceeded",
    detail: "You've exceeded the 1000 requests per hour plan limit.",
    extensions: {
      plan: "free",
      upgradeUrl: "https://example.com/upgrade",
    },
  },
  {
    "Retry-After": "3600",
  },
);
```

This approach keeps the Problem Details shape while letting you customize types,
link to documentation, and include plan-specific or caller-specific metadata.

### Formatting every error with `ProblemResponseFormatter`

For more control, use the
[`ProblemResponseFormatter`](../programmable-api/problem-response-formatter.mdx)
to build problem responses directly. This is useful when you want to compute the
problem body yourself -- for example, mapping an upstream error payload into
your own error taxonomy.

```ts
import { ProblemResponseFormatter } from "@zuplo/runtime";

const problemDetails = {
  type: "https://errors.example.com/validation-failed",
  title: "Validation Failed",
  status: 400,
  detail: "The request body contains invalid fields.",
  instance: request.url,
  extensions: {
    code: "VAL_001",
    fields: ["email", "phone"],
  },
};

return ProblemResponseFormatter.format(problemDetails, request, context);
```

### Replacing the error format globally

To change the shape of every error response the gateway returns -- including
errors raised by built-in policies -- register a global error handler in your
[runtime extensions](../programmable-api/runtime-extensions.mdx). The handler
runs for any unhandled error in the pipeline and returns the response of your
choice.

```ts
import { RuntimeExtensions } from "@zuplo/runtime";

export function runtimeInit(runtime: RuntimeExtensions) {
  runtime.addErrorHandler(async (error, request, context) => {
    return new Response(
      JSON.stringify({
        error: {
          code: "internal_error",
          message: error.message,
          requestId: context.requestId,
        },
      }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      },
    );
  });
}
```

Global error handlers let you keep Problem Details internally while projecting a
different schema to your callers, or replace the format entirely if your API has
an established error contract.

:::caution

Replacing the default format means you also take responsibility for including
trace information, preserving status codes, and documenting the new schema in
your OpenAPI document. Most APIs are best served by customizing Problem Details
fields rather than replacing the format.

:::

### Customizing specific system errors

Some gateway behaviors have dedicated extension points for error customization.
For example, you can replace the default 404 response by registering a
[not-found handler](../programmable-api/not-found-handler.mdx), which is useful
for serving custom error pages or matching your API's error schema on unmatched
routes.

## Choosing an approach

| Scenario                                             | Approach                                                       |
| ---------------------------------------------------- | -------------------------------------------------------------- |
| Return a one-off error from a handler or policy      | `HttpProblems` with `detail` and extensions                    |
| Build problem responses from external error payloads | `ProblemResponseFormatter.format()`                            |
| Attach context to thrown errors                      | `RuntimeError` with `extensionMembers`                         |
| Replace the error schema for every response          | Global error handler via `runtime.addErrorHandler`             |
| Customize only the 404 response                      | [Not-found handler](../programmable-api/not-found-handler.mdx) |

## Related resources

- [HttpProblems helper](../programmable-api/http-problems.mdx)
- [ProblemResponseFormatter](../programmable-api/problem-response-formatter.mdx)
- [Runtime Errors](../programmable-api/runtime-errors.mdx)
- [Not-found Handler](../programmable-api/not-found-handler.mdx)
- [Runtime Extensions](../programmable-api/runtime-extensions.mdx)
- [Custom Handlers](../handlers/custom-handler.mdx)
- [Policies](../articles/policies.mdx)
- [RFC 7807: Problem Details for HTTP APIs](https://datatracker.ietf.org/doc/html/rfc7807)
