---
title: API Key Authentication & Authorization
sidebar_label: Authentication
---

With the [API Key Authentication Policy](../policies/api-key-inbound.md)
configured on your API routes you can build additional policies that run after
the API Key Authentication policy to perform additional checks or authorization
on the consumer.

## Request User Object

After each successful authentication the policy will set the `request.user`
object. The name of the API Key consumer is set to the `request.user.sub`
property. Any `metadata` attached to the consumer is set to the
`request.user.data` property. The interface of `request.user` is shown below.

```ts
/**
 * The User object set by the API Key Authentication policy
 */
interface User {
  /**
   * The name of the API Key consumer
   */
  sub: string;
  /**
   * The metadata attached to the API Key consumer
   */
  data: any;
}
```

So if you created a consumer with the following configuration:

```json
{
  "name": "my-consumer",
  "metadata": {
    "companyId": 12345,
    "plan": "gold"
  }
}
```

The request object would be the following:

```ts
context.log.debug(request.user);
// Outputs:
// {
//   sub: "my-consumer",
//   data: {
//     companyId: 12345,
//     plan: "gold"
//   }
// }
```

:::note

One question you might have is why is the `request.user` object not the same
shape as the API Key Consumer object. for example why doesn't it has
`request.user.name` and `request.user.metadata` properties.

The reason is because the `request.user` object is reused by many different
kinds of authentication policies and they all conform to the same interface with
`sub` and `data`.

:::

## Using Consumer Data in Code

It's possible to write additional policies that run after the API Key
Authentication policy that perform further gating or authorization of the
request based on the data set in the consumer.

For example, you could gate access to a feature by checking for the `plan` value
stored in metadata (exposed via `request.user.data.plan`).

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

Would send the following response.

```json
{
  "sub": "my-consumer",
  "data": {
    "companyId": 12345,
    "plan": "gold"
  }
}
```
