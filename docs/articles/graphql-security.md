---
title: Secure your GraphQL API with Zuplo
sidebar_label: Secure your GraphQL API
---

**Secure your GraphQL API with Zuplo**

GraphQL is a powerful query language for your APIs. While it offers great
flexibility for clients, it also exposes potential security risks. Fortunately,
with Zuplo, you can secure your GraphQL API by implementing various policies.
This article walks you through our security policies:
[GraphQL Complexity Limit](/docs/policies/graphql-complexity-limit-inbound), and
[GraphQL Disable Introspection](/docs/policies/graphql-disable-introspection-inbound).

## 1. Understanding the Risks

### a. Deeply Nested Queries

Without restrictions, a client can send deeply nested queries that could
potentially overwhelm your server, resulting in a Denial of Service (DoS)
attack. This is because deeply nested queries can cause the server to process a
huge amount of data and operations. While this might be a planed attack, it
could also be a mistake by a client who is unaware of the query depth limit.

### b. Query Complexity

Even without deep nesting, a query can be crafted to be very complex. This could
force your server to execute resource-intensive operations, potentially slowing
down the system or causing a DoS.

### c. Introspection

GraphQL allows clients to introspect your schema. While this is beneficial
during development, it can expose detailed schema information to potential
attackers in production.

## 2. Add your GraphQL API & setting up Policies

### Setup POST endpoint

If you did not already do so, you need to setup a POST endpoint in your API.
This endpoint will be used to send the GraphQL queries to your API. We'll use
the urlRewriteHandler to rewrite the request to your GraphQL API. For this
example let's assume your GraphQL API is hosted at
`https://api.example.com/graphql`.

To do so, add the following to your `config/routes.oas.json`

```json
{
  "post": {
    "summary": "GraphQL Query",
    "description": "The endpoint for GraphQL queries.",
    "x-zuplo-route": {
      "corsPolicy": "none",
      "handler": {
        "export": "urlRewriteHandler",
        "module": "$import(@zuplo/runtime)",
        "options": {
          "rewritePattern": "https://api.example.com/graphql"
        }
      },
      "policies": {
        "inbound": [
          "graphql-complexity-limit-policy",
          "graphql-disable-introspection-policy"
        ]
      }
    },
    "operationId": "52bdf225-eaa7-441c-afb9-b7df046a142e"
  }
}
```

For all the risks mentioned above, Zuplo offers policies that can be configured
to protect your GraphQL API. These policies can be configured for Zuplo. We'll
create the configuration for the three policies "graphql-depth-limit",
"graphql-complexity-points" and "graphql-disable-introspection-policy" next.

### a. GraphQL Depth Limit

This policy limits how deep a query can be nested. Check our our
[detailed policy documentation](/docs/policies/graphql-complexity-limit-inbound)
for more information.

Add this into your `config/policies.json`

```json
{
  "policies": [
    {
      "name": "graphql-complexity-limit-policy",
      "policyType": "graphql-complexity-limit-inbound",
      "handler": {
        "export": "GraphQLComplexityLimitInboundPolicy",
        "module": "$import(@zuplo/graphql)",
        "options": {
          "useDepthLimit": {
            "depthLimit": 20
          }
        }
      }
    }
  ]
}
```

By limiting the query depth, you prevent malicious or mistakenly deep queries
from consuming excessive server resources.

### b. GraphQL Complexity Limit

We can extend the same policy to also check for compexity. By defining a max for
each type of operation, and then it limits the total complexity a query can
have. In order to use the Complexity Limit you need to allow introspection in
your GraphQL API.

```json
{
  "policies": [
    {
      "name": "graphql-complexity-limit-policy",
      "policyType": "graphql-complexity-limit-inbound",
      "handler": {
        "export": "GraphQLComplexityLimitInboundPolicy",
        "module": "$import(@zuplo/graphql)",
        "options": {
          "useDepthLimit": {
            "depthLimit": 20
          },
          "useComplexityLimit": {
            "complexityLimit": 50,
            "endpointUrl": "https://api.example.com/graphql"
          }
        }
      }
    }
  ]
}
```

The complexity limit ensures that a potential attacker cannot overload the
system by sending overly complicated queries.

### c. GraphQL Disable Introspection

Disable introspection in production environments to hide schema details.

```json
{
  "policies": [
    {
      "name": "graphql-disable-introspection-policy",
      "policyType": "graphql-disable-introspection-inbound",
      "handler": {
        "export": "GraphQLDisableIntrospectionInboundPolicy",
        "module": "$import(@zuplo/graphql)",
        "options": {}
      }
    }
  ]
}
```

By disabling introspection in production, you prevent attackers from gaining
insights into your GraphQL schema, thereby reducing potential attack vectors.

## 4. Example Repository

For those who prefer a hands-on approach or wish to see these configurations in
action, we've created a GitHub repository with everything set up. This
repository offers a comprehensive example of how to configure and secure a
GraphQL API using Zuplo. Check out the
[GraphQL API with Zuplo example repository](https://github.com/zuplo/zuplo-graphql-example)
to dive deeper.
