---
title: HttpProblems Helper
sidebar_label: Problem Details Helper
---

Zuplo encourages developers to build APIs with standard and actionable error
messages. While any error format is supported, we default and encourage
developers to adopt the
[Problem Details for HTTP APIs](https://httpproblems.com/) proposed standard
format.

Developers can use the built-in `HttpProblems` helper that's included with Zuplo
to build standard error messages in custom policies.

For example, using the helper to return an unauthorized error on a custom
authentication policy can be done as follows.

```ts
import { ZuploContext, ZuploRequest, HttpProblems } from "@zuplo/runtime";

export default async function (request: ZuploRequest, context: ZuploContext) {
  const isAuthorized = checkAuthorization(request);

  // Handle Error state
  if (!isAuthorized) {
    return HttpProblems.unauthorized(request, context);
  }

  return request;
}
```

This will produce an error response in the standard format. Notice that trace
information is included automatically. This makes it easy for users to report
problems that can be searched in logs.

```json
{
  "type": "https://httpproblems.com/http-status/401",
  "title": "Unauthorized",
  "status": 401,
  "instance": "/test",
  "trace": {
    "timestamp": "2023-07-16T17:13:31.352Z",
    "requestId": "28f2d802-8e27-49c8-970d-39d90ef0ac61",
    "buildId": "eb9ef87d-b55d-446e-9fdd-13c209c01b95",
    "rayId": "7e7be05256e53b60-IAD"
  }
}
```

The `HttpProblems` helper supports most every
[HTTP status code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status).
Some additional examples are shown.

```ts
// General errors
HttpProblems.badRequest(request, context);
HttpProblems.internalServerError(request, context);

// Authorization errors
HttpProblems.unauthorized(request, context);
HttpProblems.forbidden(request, context);

// Success codes
HttpProblems.ok(request, context);
HttpProblems.created(request, context);
```

## Overriding Property Values

Each method on the `HttpProblems` object supports overriding the default values
of the problem response with custom values. The most common reason for this is
for setting the `detail` value to something helpful for the end-user.

```ts
HttpProblems.badRequest(request, context, {
  detail: "Something was invalid about the request",
});
```

Other properties like `status` and `title` can also be overridden, but make sure
to do so within the rules of the spec.

:::note

The most important thing to remember about problem details is that every
instance of a particular error should return the same value for `title`. Details
about a specific error should go in the `detail` property.

:::

An example of how to correctly use the `title` and `detail` properties can be
demonstrated with an error that tells the user they provided an unexpected value
for a query parameter called `take` that implements pagination. In this case,
the `title` is always the same, but the `detail` value changes to provide the
user with more detail about the error.

```txt
GET /widgets?take=1000
```

```ts
HttpProblems.badRequest(request, context, {
  title: "Invalid value for query parameter 'take'",
  detail:
    "The take parameter must be less than 100. The provided value was 1000.",
});
```

```txt
GET /widgets?take=hello
```

```ts
HttpProblems.badRequest(request, context, {
  title: "Invalid value for query parameter 'take'",
  detail:
    "The take parameter must be a number less than 100. The provided value was 'hello'",
});
```

You can see how each of these cases help the user understand the problem, but
still provide the same `title`.

## Additional Properties

It can sometimes be helpful to specify additional properties on the problem
response. The problem specification requires a few specific fields, but allows
for any additions as needed. For example, if we wanted to return an error to a
user who was above their quota on creating widgets the error might look like
this.

```ts
HttpProblems.badRequest(request, context, {
  title: "Failed to create widget. Over quota.",
  detail:
    "The account is over its quota for creating widgets. See the 'quota' field for details",
  quota: {
    currentlyUsed: 200,
    maxAllowed: 200,
    remaining: 0,
  },
});
```

## Custom Headers

At times it can be useful to send custom headers with the error response. This
can be done as shown below.

```ts
HttpProblems.badRequest(
  request,
  context,
  {
    detail: "Something was invalid about the request",
  },
  {
    "my-error-code": "230",
  },
);
```

If you want to set headers without any overrides just pass `undefined` to the
third argument.

```ts
HttpProblems.badRequest(request, context, undefined, {
  "my-error-code": "230",
});
```
