---
title: API Key Authentication
sidebar_label: Authentication
---

Each route in your API that you want to be secured with API Key Authentication
must be configured with the
[API Key Authentication Policy](../policies/api-key-inbound.md). This policy
ensures that callers to the route have a valid API key and authenticates the
`user` of the request.

The API Key Consumer's `metadata` and `sub` are set as the `request.user` object
on each request that is authenticated with the API Key Authentication policy.
This data can be used to perform authorization, routing, etc. for each request.

For example, features can be gated based on a `plan` value in the metadata.

```ts
async function (request: ZuploRequest, context: ZuploContext) {
  if (request.user?.data.plan !== "gold") {
    return new Response("You need to upgrade your plan", {
      status: 403
    });
  }
  return new Response("you have the gold plan!");
}
```

The `metadata` could also be used to route requests to dedicated customer
services.

```ts
async function (request: ZuploRequest, context: ZuploContext) {
  const { customerId } = request.user.data;
  return fetch(`https://${customerId}.customers.example.com/`
}
```

The `request.user` object can be used in both
[handlers](../handlers/custom-handler.md) and
[policies](../policies/custom-code-inbound.md)

If you had a simple [function handler](../handlers/custom-handler.md) as
follows, it would return a `request.user` object to your route if the API Key is
successfully authenticated:

```ts
async function (request: ZuploRequest, context: ZuploContext) {
  // auto-serialize the user object and return it as JSON
  return request.user;
}
```

Would return this:

```json
{
  "sub": "big-co",
  "data": {
    "companyId": 123,
    "plan": "gold"
  }
}
```
