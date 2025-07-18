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

This will produce and error response in the standard format. Notice that trace
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

## Available Methods

The `HttpProblems` class provides static methods for all standard HTTP status
codes. Each method has the same signature:

```typescript
static statusName(
  request: ZuploRequest,
  context: ZuploContext,
  overrides?: Partial<ProblemDetails>,
  additionalHeaders?: HeadersInit
): Promise<Response>
```

### Example Methods

Every status code has a corresponding method in the `HttpProblems` class, so you
can use any HTTP status code as needed. Examples include:

- `ok()` - 200 OK
- `badRequest()` - 400 Bad Request
- `unauthorized()` - 401 Unauthorized
- `notFound()` - 404 Not Found

## Method Parameters

All methods accept the same parameters:

- **request**: `ZuploRequest` - The incoming request object
- **context**: `ZuploContext` - The Zuplo context object
- **overrides**: `Partial<ProblemDetails>` (optional) - Custom values to
  override default problem details
- **additionalHeaders**: `HeadersInit` (optional) - Additional headers to
  include in the response

## Customizing Responses

You can customize the problem details by providing overrides:

```typescript
return HttpProblems.badRequest(request, context, {
  detail: "The 'email' field must be a valid email address",
  title: "Validation Error",
  extensions: {
    field: "email",
    value: request.body.email,
  },
});
```

## Adding Custom Headers

You can add custom headers to the response:

```typescript
return HttpProblems.unauthorized(
  request,
  context,
  {
    detail: "Invalid API key",
  },
  {
    "WWW-Authenticate": 'Bearer realm="api"',
    "X-Rate-Limit-Remaining": "0",
  },
);
```

## HttpStatusCode Enum

The `HttpStatusCode` enum provides numeric constants for all HTTP status codes:

```typescript
import { HttpStatusCode } from "@zuplo/runtime";

// Use in responses
return new Response("Created", {
  status: HttpStatusCode.Created, // 201
});

// Use in comparisons
if (response.status === HttpStatusCode.NotFound) {
  // Handle 404
}
```

## See Also

- [ProblemResponseFormatter](./problem-response-formatter.md)
- [Runtime Errors](./runtime-errors.md) - Error handling with RuntimeError and
  ConfigurationError

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
    "The take parameter must a number less than 100. The provided value was 'hello'",
});
```

You can see how each of these cases help the user understand the problem, but
still provide the same `title`.

## Complete Method List

The `HttpProblems` class provides static methods for all standard HTTP status
codes:

### 1xx Informational

- `continue()` - 100 Continue
- `switchingProtocols()` - 101 Switching Protocols
- `processing()` - 102 Processing (deprecated)
- `earlyHints()` - 103 Early Hints

### 2xx Success

- `ok()` - 200 OK
- `created()` - 201 Created
- `accepted()` - 202 Accepted
- `nonAuthoritativeInformation()` - 203 Non-Authoritative Information
- `noContent()` - 204 No Content
- `resetContent()` - 205 Reset Content
- `partialContent()` - 206 Partial Content
- `multiStatus()` - 207 Multi-Status
- `alreadyReported()` - 208 Already Reported
- `imUsed()` - 226 IM Used

### 3xx Redirection

- `multipleChoices()` - 300 Multiple Choices
- `movedPermanently()` - 301 Moved Permanently
- `found()` - 302 Found
- `seeOther()` - 303 See Other
- `notModified()` - 304 Not Modified
- `useProxy()` - 305 Use Proxy
- `switchProxy()` - 306 Switch Proxy (deprecated)
- `temporaryRedirect()` - 307 Temporary Redirect
- `permanentRedirect()` - 308 Permanent Redirect

### 4xx Client Errors

- `badRequest()` - 400 Bad Request
- `unauthorized()` - 401 Unauthorized
- `paymentRequired()` - 402 Payment Required
- `forbidden()` - 403 Forbidden
- `notFound()` - 404 Not Found
- `methodNotAllowed()` - 405 Method Not Allowed
- `notAcceptable()` - 406 Not Acceptable
- `proxyAuthenticationRequired()` - 407 Proxy Authentication Required
- `requestTimeout()` - 408 Request Timeout
- `conflict()` - 409 Conflict
- `gone()` - 410 Gone
- `lengthRequired()` - 411 Length Required
- `preconditionFailed()` - 412 Precondition Failed
- `contentTooLarge()` - 413 Content Too Large
- `uriTooLong()` - 414 URI Too Long
- `unsupportedMediaType()` - 415 Unsupported Media Type
- `rangeNotSatisfiable()` - 416 Range Not Satisfiable
- `expectationFailed()` - 417 Expectation Failed
- `imATeapot()` - 418 I'm a teapot
- `misdirectedRequest()` - 421 Misdirected Request
- `unprocessableContent()` - 422 Unprocessable Content
- `locked()` - 423 Locked
- `failedDependency()` - 424 Failed Dependency
- `tooEarly()` - 425 Too Early
- `upgradeRequired()` - 426 Upgrade Required
- `preconditionRequired()` - 428 Precondition Required
- `tooManyRequests()` - 429 Too Many Requests
- `requestHeaderFieldsTooLarge()` - 431 Request Header Fields Too Large
- `unavailableForLegalReasons()` - 451 Unavailable For Legal Reasons

### 5xx Server Errors

- `internalServerError()` - 500 Internal Server Error
- `notImplemented()` - 501 Not Implemented
- `badGateway()` - 502 Bad Gateway
- `serviceUnavailable()` - 503 Service Unavailable
- `gatewayTimeout()` - 504 Gateway Timeout
- `httpVersionNotSupported()` - 505 HTTP Version Not Supported
- `variantAlsoNegotiates()` - 506 Variant Also Negotiates
- `insufficientStorage()` - 507 Insufficient Storage
- `loopDetected()` - 508 Loop Detected
- `notExtended()` - 510 Not Extended
- `networkAuthenticationRequired()` - 511 Network Authentication Required

## Additional Properties

It can sometimes be helpful to specify additional properties on the problem
response. The problem specification requires a few specific fields, but allows
for any additions as needed. For example, if we wanted to return an error to a
user who was above their quote on creating widgets the error might look like
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

## HttpStatusCode Enum

For type-safe status code handling, use the `HttpStatusCode` enum:

```ts
import { HttpStatusCode } from "@zuplo/runtime";

// Use in responses
return new Response("Not Found", {
  status: HttpStatusCode.NOT_FOUND,
});

// Use in conditionals
if (response.status === HttpStatusCode.UNAUTHORIZED) {
  // Handle unauthorized
}

// Available values include:
HttpStatusCode.OK; // 200
HttpStatusCode.CREATED; // 201
HttpStatusCode.BAD_REQUEST; // 400
HttpStatusCode.UNAUTHORIZED; // 401
HttpStatusCode.FORBIDDEN; // 403
HttpStatusCode.NOT_FOUND; // 404
HttpStatusCode.INTERNAL_SERVER_ERROR; // 500
// ... and all other standard HTTP status codes
```

The enum provides constants for all standard HTTP status codes, making your code
more readable and less prone to typos.

## See Also

- [Policies](../articles/policies.md) - Building custom policies
- [Runtime Errors](./runtime-errors.md) - Error handling with RuntimeError and
  ConfigurationError
- [Custom Request Handlers](../handlers/custom-handler.md) - Building request
  handlers
