---
title: Custom Request Handlers
sidebar_label: Custom Handler
---

As an API gateway, the Request Handler is the most important part of a zup. A
request handler is a module with an export that fulfills the following type
definition (typescript):

```ts
export type RequestHandler = (
  request: ZuploRequest,
  context: ZuploContext
) => Promise<any>;
```

An example implementation is provided in the default module template (when you
add a new module):

```ts
import { ZuploRequest, ZuploContext } from "@zuplo/runtime";

export default async function (request: ZuploRequest, context: ZuploContext) {
  return "What zup?";
}
```

This is a request handler that receives a request (of type `ZuploRequest` - more
on this [here](../reference/zuplo-request.md)) and returns a response of type
`string`. You can return any type from a Request Handler and Zuplo will
auto-serialize the response to JSON and add a `content-type` header to your
response of `application/json`. This makes it very easy to build simple JSON
APIs.

## Parameters & Query strings

You can read parameters specified on the route path as follows:

Route = `/foos/:foo/bars/:bar`

This route has two parameters `foo` and `bar`. They can be accessed in the
request handler on the `request.params` object:

```ts
// GET root/foos/123/bars/car
export default async function (request: ZuploRequest, context: ZuploContext) {
  return request.params.foo + request.params.bar;
}

// returns 123car
```

You can read **query strings** as follows:

URL = `/foos?productId=xkcd&carId=1234`

```ts
// GET /foos?productId=xkcd&carId=1234
export default async function (request: ZuploRequest, context: ZuploContext) {
  return request.query.productId + request.query.carId;
}

// returns xkcd1234
```

## Reading the body

The `ZuploRequest` object inherits from the web standards `Request` object. You
can read about it on MDN here:
[https://developer.mozilla.org/en-US/docs/Web/API/Request](https://developer.mozilla.org/en-US/docs/Web/API/Request)

The `Request` type has three properties that allow access to the incoming body
of the request. The `body` property is of type
[ReadableStream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)
and is the most efficient way to reuse a body in an outgoing request.

If you want to read the body you have two options:

- `await request.text()` - this method reads the full body into a string.
- `await request.json()` - this method reads the body and performs a
  JSON.parse() to read the body into an object in memory. Use only if you’re
  confident the body is well-formed JSON (consider pre-validation with the
  [Validate Policy](../policies/validate-json-schema-inbound.md)).

## Response Class

If you want more control over the response you can return an instance of the
`Response` class.

The `Response` class is also from web standards - you can read about it on MDN
here:
[https://developer.mozilla.org/en-US/docs/Web/API/Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)

Here's an example

```ts
import { ZuploRequest, ZuploContext } from "@zuplo/runtime";

export default async function (request: ZuploRequest, context: ZuploContext) {
  const response = new Response(`<html><body>What zup?</body></html>`, {
    status: 200,
    headers: {
      "content-type": "text/html",
    },
  });
  return response;
}
```
