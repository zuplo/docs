---
title: API Key Management
---

Zuplo allows developers to add API key authentication to their API in only a few minutes. With Zuplo's API Key Management you can either issue tokens to your customers or enable [the developer portal](../articles/developer-portal) to allow self-serve API Keys based on custom permissions and settings.

:::tip

For a complete tutorial on adding API Key authentication and management [see the quickstart](../articles/step-2-add-api-key-auth.md).

:::

## API Key Consumers

API Key Consumers are entities that can consume your API - typically people, customers, partners or services. API Key consumers are managed by **API Key Managers**. API Key Managers are people authorized to issue and manage API Keys for the API Key Consumer. Adding managers to the API Key Consumer is done by setting email addresses for each user.

Each API Key Manager who logs into the Developer Portal can issue or manage API Keys. Note that every manager on a consumer has access to all the **SAME** API keys for that consumer. If you would like each user of your API to have their own API Keys, make each user their own API Key Consumer with a single manager.

### API Key Consumer Metadata

Metadata of the API Key Consumer can be any JSON object. This metadata is what gets passed to each request in your API Gateway as the `request.user`.

For example, an API Key Consumer with the `sub` set to `big-co` and the following metadata:

```json
{
  "companyId": 123,
  "plan": "gold"
}
```

would return a `request.user` object to your route if the API Key is successfully authenticated.

```ts
async function (request: ZuploRequest, context: ZuploContext) {
  return context.user;
  // returns the following
  // {
  //   "sub": "big-co",
  //   "data": {
  //     "companyId": 123,
  //     "plan": "gold"
  //   }
  // }
}
```

### Manage API Key Consumers

API Key Consumers can be managed in the **API Key Consumers** section under the <SettingsTabIcon /> **Settings** tab.

![API Key Consumers](./api-key-management-media/api-key-consumers.png)

To add a new API Key Consumer click the **Add new consumer** button and complete the form.

![New API Key Consumer](./api-key-management-media/new-api-key-consumer.png)

## API Key Authentication & Authorization

Each route in your API that you want to be secured with API Key Authentication must be configured with the [API Key Authentication Policy](../policies/api-key-inbound.md). This policy ensures that callers to the route have a valid API key and authenticates the `user` of the request.

The API Key Consumer's `metadata` and `sub` are set as the `request.user` object on each request that is authenticated with the API Key Authentication policy. This data can be used to perform authorization, routing, etc. for each request.

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

The `metadata` could also be used to route requests to dedicated customer services.

```ts
async function (request: ZuploRequest, context: ZuploContext) {
  const { customerId } = request.user.data;
  return fetch(`https://${customerId}.customers.example.com/`
}
```

The `request.user` object can be used in both [handlers](../handlers/custom-handler.md) and [policies](../policies/custom-code-inbound.md)

## API Keys in the Developer Portal

When API Key Managers log into the Developer Portal they can copy, manage, or create new API Keys.

![API Keys in Developer Portal](./api-key-management-media/api-key-dev-portal.png)

## API Key Leak Prevention

API keys should never be stored in source control. Accidentally committing API keys to source control is a common attack vector that leads to compromises of organizations both large and small.

Zuplo participates in [GitHub's Secret Scanning](https://docs.github.com/en/code-security/secret-scanning/about-secret-scanning) program to detect if your or your customer's API Keys are accidentally checked into source control on GitHub.

If an API Key for your Zuplo API Gateway is compromised by checking it into a public or private GitHub repository, Zuplo will be notified and take action almost immediately. Depending on your API's configuration Zuplo will either alert you of the potential compromise or immediately revoke the API Key and alert you and/or your customer.
