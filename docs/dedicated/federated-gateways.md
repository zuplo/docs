---
title: "Federated Gateways"
---

:::note{title="Beta Feature"}

This feature is in Beta - please use with care and provide feedback to the team
if you encounter any issues.

:::

With a managed dedicated Zuplo instance you can create a federated gateway that
allows you to connect multiple Zuplo projects together. This is useful for
creating a single API Gateway that can route requests to multiple backend
services, each running on its own Zuplo instance.

## Reasons to Use Federated Gateways

Federated gateways are useful for several reasons:

- **Seperation of Product Areas**: Depending on your organizational structure,
  you may want to separate different product areas into their own Zuplo
  projects. This allows teams to work independently while still being able to
  route requests through a single gateway. Each team can manage their own
  portion of the API without affecting others. Each team creates its own Zuplo
  Project with its own git repo, environment variables, etc.
- **Versioning**: You can use federated gateways to manage different versions of
  your API. For example, if you wanted to run a new version of your API
  alongside the old one and route requests to specific versions based on user or
  other context you can keep different versions in separate Zuplo projects.
- **Risk Minimization**: By separating different parts of your API into
  different Zuplo projects, you can reduce the risk of causing inadvertant
  changes to other parts of the API. This can be especially useful if your API
  is particularly large or complex.

## How to Create a Federated Gateway

Managed dedicated Zuplo environments can call other Zuplo environments deployed
in the same instance. To make a call to another Zuplo environment, you simply
make a normal HTTP request to the other environment using the url protocol
`local` with the environment name. For example, if your environment is named
`my-api-main-2s93j2`, then you would make a request to
`local://my-api-main-2s93j2`.

You can use most Zuplo request handlers to make these requests (the Lambda
handler is not supported).

For example, to create a federated gateway that forwards requests to another
Zuplo environment, you can use the URL Forward handler. Here is an example
configuration for a route that forwards requests to another Zuplo environment:

```json
{
  "handler": {
    "export": "urlForwardHandler",
    "module": "$import(@zuplo/runtime)",
    "options": {
      "baseUrl": "local://my-api-main-2s93j2"
    }
  }
}
```

:::caution

Currently, federated gateways are still exposed externally, so you should ensure
that you have proper authentication and authorization in place to prevent
unauthorized access to your federated gateway.

This can be done using the standard Zuplo authentication and authorization
mechanisms, such as API keys, JWTs, or OAuth2.

Soon you will be able to restrict access to federated gateways, which will make
it easier to secure your federated gateway without needing to implement
additional authentication mechanisms.

:::
