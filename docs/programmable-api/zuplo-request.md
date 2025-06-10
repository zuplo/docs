---
title: ZuploRequest
---

The ZuploRequest object is the main parameter passed to both
[Request Handlers](../handlers/custom-handler.md) and [Policies](../policies).
It represents the incoming request.

ZuploRequest inherits from the web standard `Request` class used with `fetch` -
you can read more about this on MDN including an explanation of how all of its
properties and methods work:
[https://developer.mozilla.org/en-US/docs/Web/API/Request](https://developer.mozilla.org/en-US/docs/Web/API/Request).

In addition to the standard properties, the following are added for convenience.

## Properties

- `params` - if you use tokens in your route’s URL, we automatically parse them
  into properties on the `params` property of your request. For example, imagine
  a route with path `/products/:productId/vendors/:vendorId`. A match on this
  would yield values as follows:

```ts
const productId = request.params.productId;
const vendorId = request.params.vendorId;
```

- `user` - an optional object identifying a ‘user’. If `undefined` this
  typically means the request is anonymous. If present, the user object will
  have a `sub` property that's a unique identifier for that user. There is also
  an optional `data` property that's of `any` type that typically contains other
  information about the user. When using JWT tokens you’ll usually find all the
  claims here.
- `query` - a dictionary of query-string values. For example, a URL with a query
  string like `https://example.com?foo=bar` would present as follows:

```ts
const foo = request.query.foo;
```

## Constructor

It can be useful to create a new ZuploRequest inside a policy (see
[policies](../policies)) to forward to the next policy or handler in the chain.
You can create a completely fresh ZuploRequest as follows:

```ts
const newRequest = new ZuploRequest("http://new-host.com/", {
  method: "POST",
  headers: {
    "content-type": "application/json",
  },
  body: "test",
});
```

## Request Query

The `request.query` property is a helper that takes your QueryString and
converts it into a JavaScript dictionary (for example `Record<string, string>`
in TypeScript). This helper property doesn't support multiple values for the
same key on a QueryString, for example:

`?foo=bar&foo=wibble`

To access the array of values in this case you can instead use the URL type and
`searchParams`:

```ts
const url = new URL(request.url);
const foo = url.searchParams.get("foo");
// foo will be an array here
```
