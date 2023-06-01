---
title: API Key Authentication
---

Zuplo allows developers to rapidly add API key based authentication to an API in
minutes. There are several benefits to using Zuplo's API Key solution including

- adheres to
  [best practices of API Key implementation](https://zuplo.com/blog/2022/12/01/api-key-authentication)
- includes
  [GitHub secret scanning](https://github.blog/changelog/2022-07-13-zuplo-is-now-a-github-secret-scanning-partner/)
- integrated into the Zuplo Developer Portal or integrate into your own console
  using [our API](./api-key-api.md).

:::tip

For a complete tutorial on adding API Key authentication and management
[see the quickstart](../articles/step-2-add-api-key-auth.md).

:::

## Key Concepts

### Consumers

An API Key Consumer is an entity or 'identify' that can invoke your API -
typically people, customers, partners or services. You can create consumers in
the Zuplo portal (portal.zuplo.com) or via the [API Key API](./api-key-api.md).

If you're using the Zuplo [Developer Portal](./developer-portal.md), we have an
integration with the API Key API that allows developers to access their API
keys, create new ones and delete them. To enable this, you must assign one or
more managers, via e-mail, to be a manager for your API Key Consumer. This is
optional if you are not using the [Developer Portal](./developer-portal.md).

You can assign managers in the Zuplo Portal (portal.zuplo.com) or via the API.

### Consumer Metadata

Each consumer can be assigned metadata. This information (a small JSON object)
is made available to the runtime when a user access your API using that key. The
consumer metadata is passed into the runtime pipeline as the `request.user.data`
property. Note the `sub` property of the `request.user` object is the name of
the consumer.

For example, an API Key Consumer with the `sub` set to `big-co` and the
following metadata:

```json
{
  "companyId": 123,
  "plan": "gold"
}
```

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

### Managing Consumers in the Zuplo Portal

API Key Consumers can be managed in the **API Key Consumers** section under the
<SettingsTabIcon /> **Settings** tab.

![API Key Consumers](./api-key-management-media/api-key-consumers.png)

To add a new API Key Consumer click the **Add new consumer** button and complete
the form.

![New API Key Consumer](./api-key-management-media/new-api-key-consumer.png)

## API Key Authentication & Authorization

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

## API Keys in the Developer Portal

When API Key Managers log into the Developer Portal they can copy, manage, or
create new API Keys.

![API Keys in Developer Portal](./api-key-management-media/api-key-dev-portal.png)
