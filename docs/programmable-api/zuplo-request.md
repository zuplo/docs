---
title: ZuploRequest
---

The ZuploRequest object is the main parameter passed to both
[Request Handlers](../handlers/custom-handler.md) and
[Policies](../articles/policies.md). It represents the incoming request.

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
[policies](../articles/policies.md)) to forward to the next policy or handler in
the chain.

### Basic Constructor

```ts
const newRequest = new ZuploRequest("http://new-host.com/", {
  method: "POST",
  headers: {
    "content-type": "application/json",
  },
  body: "test",
});
```

### Constructor with Zuplo-specific Options

The constructor accepts a `ZuploRequestInit` object that extends the standard
`RequestInit` with additional properties:

```ts
const newRequest = new ZuploRequest("http://example.com/products/123", {
  method: "GET",
  headers: request.headers,
  // Zuplo-specific options
  params: {
    productId: "123",
  },
  user: {
    sub: "user-456",
    data: {
      email: "user@example.com",
      role: "admin",
    },
  },
});
```

This is particularly useful when creating internal requests or modifying the
current request while preserving user context.

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

## Cloning and Modifying Requests

When you need to create a modified version of an existing request, you can use
the ZuploRequest constructor with the existing request:

```ts
// Clone with modified headers
const modifiedRequest = new ZuploRequest(request, {
  headers: {
    ...Object.fromEntries(request.headers.entries()),
    "x-custom-header": "new-value",
  },
});

// Clone with different URL but preserve user context
const internalRequest = new ZuploRequest(
  "https://internal-api.example.com/data",
  {
    method: request.method,
    headers: request.headers,
    body: request.body,
    // Preserve Zuplo-specific properties
    user: request.user,
    params: request.params,
  },
);
```

## Type Safety with Parameters

ZuploRequest supports TypeScript generics for type-safe access to params, query
parameters, and user data:

```ts
interface MyRequestOptions {
  Params: {
    productId: string;
    vendorId: string;
  };
  Query: {
    limit?: string;
    offset?: string;
  };
  UserData: {
    role: string;
    permissions: string[];
  };
}

export default async function handler(
  request: ZuploRequest<MyRequestOptions>,
  context: ZuploContext,
) {
  // TypeScript knows these types
  const productId = request.params.productId; // string
  const limit = request.query.limit; // string | undefined
  const role = request.user?.data.role; // string | undefined
}
```

You can also use shorthands to just define a subset of these types:

```ts
new ZuploRequest<{ Query: { limit?: string } }>(request);
```

## Type Safety with User Data

For better type safety with user data, define interfaces for your user
structure:

```ts
interface MyUserData {
  email: string;
  roles: string[];
  organizationId: string;
}

export default async function handler(
  request: ZuploRequest<{ UserData: MyUserData }>,
  context: ZuploContext,
) {
  // TypeScript knows the shape of user data
  if (request.user) {
    const email = request.user.data.email; // string
    const isAdmin = request.user.data.roles.includes("admin"); // boolean
  }
}
```

## See Also

- [Request User](./request-user.md) - Working with authenticated users
- [ZuploContext](./zuplo-context.md) - The context object
- [Safely Clone a Request or Response](./safely-clone-a-request-or-response.md) -
  Best practices for cloning
- [MDN Request Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Request) -
  Web standard Request API
