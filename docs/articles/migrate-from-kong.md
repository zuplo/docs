---
title: Migrate from Kong Gateway to Zuplo
sidebar_label: Migrate from Kong
---

This guide walks through migrating from Kong Gateway (Community Edition or
Enterprise) to Zuplo. Whether you're running Kong OSS on Kubernetes, Kong
Konnect, or a self-hosted Kong cluster, this guide covers the key differences,
concept mapping, and step-by-step migration process.

## Why teams migrate from Kong

Kong Gateway is a powerful, plugin-driven API gateway built on NGINX and Lua.
However, teams frequently encounter challenges that drive them to seek
alternatives:

- **Community Edition stagnation** — Kong's open-source Community Edition
  receives fewer updates and lacks critical features like the developer portal,
  RBAC, and advanced rate limiting that are reserved for Enterprise tiers.
- **Kubernetes complexity** — Running Kong in production requires managing
  Postgres or Cassandra databases, configuring the Kong Ingress Controller, and
  maintaining Kubernetes clusters across environments.
- **Lua plugin development** — Kong's plugin architecture requires Lua, a niche
  language that few developers know. This limits who on your team can extend the
  gateway and makes AI-assisted code generation less effective.
- **Cost escalation** — Kong Konnect pricing starts at ~$105/month per gateway
  service plus ~$34/million API requests, with additional charges for analytics,
  portals, and mesh management. Self-hosted Kong requires significant SRE
  investment.
- **Global scaling challenges** — Scaling Kong globally requires deploying and
  synchronizing clusters across regions manually, each with its own database and
  configuration state.

:::tip

[Copilot Travel](https://zuplo.com/customers/copilot-travel) switched from Kong
to Zuplo after nine months, achieving over 50% faster API implementation and
reducing development time from months to days. Their team eliminated the need
for a dedicated DevOps engineer to maintain the API gateway.

:::

## Concept mapping: Kong to Zuplo

| Kong concept               | Zuplo equivalent                                                        |
| -------------------------- | ----------------------------------------------------------------------- |
| Service                    | Backend URL configured in a [route handler](../handlers/url-forward.md) |
| Route                      | Route in your [OpenAPI spec](./openapi.md)                              |
| Plugin (Lua)               | [Policy](./policies.md) (TypeScript) or built-in policy                 |
| Consumer                   | [API key consumer](./api-key-management.md)                             |
| Consumer group             | API key metadata with custom rate limit logic                           |
| Upstream                   | [URL forward handler](../handlers/url-forward.md) target                |
| Workspace (Enterprise)     | [Environment](./environments.md)                                        |
| Kong Manager / Konnect UI  | [Zuplo Portal](./development-options.md) or local development with Git  |
| DB-less declarative config | [OpenAPI route config](./openapi.md) in Git                             |
| Admin API                  | [Zuplo API](./accounts/zuplo-api-keys.md) or `git push`                 |
| Kong Dev Portal            | [Zuplo Developer Portal](../dev-portal/introduction.md)                 |

## Step-by-step migration

### Step 1: Export your API definitions

If you have OpenAPI specs for your APIs, export them from Kong. If you're using
Kong's declarative configuration, convert your service and route definitions to
an OpenAPI spec.

**From Kong declarative config (deck):**

```yaml
# kong.yml - Your existing Kong config
services:
  - name: my-api
    url: http://backend-service:8080
    routes:
      - name: get-users
        paths:
          - /users
        methods:
          - GET
      - name: create-user
        paths:
          - /users
        methods:
          - POST
```

**Equivalent OpenAPI spec for Zuplo:**

```json
{
  "openapi": "3.1.0",
  "info": {
    "title": "My API",
    "version": "1.0.0"
  },
  "paths": {
    "/users": {
      "get": {
        "operationId": "get-users",
        "summary": "Get users",
        "x-zuplo-route": {
          "corsPolicy": "none",
          "handler": {
            "export": "urlForwardHandler",
            "module": "$import(@zuplo/runtime)",
            "options": {
              "baseUrl": "http://backend-service:8080"
            }
          },
          "policies": {
            "inbound": []
          }
        }
      },
      "post": {
        "operationId": "create-user",
        "summary": "Create user",
        "x-zuplo-route": {
          "corsPolicy": "none",
          "handler": {
            "export": "urlForwardHandler",
            "module": "$import(@zuplo/runtime)",
            "options": {
              "baseUrl": "http://backend-service:8080"
            }
          },
          "policies": {
            "inbound": []
          }
        }
      }
    }
  }
}
```

### Step 2: Map Kong plugins to Zuplo policies

The following table maps common Kong plugins to their Zuplo policy equivalents:

| Kong plugin              | Zuplo policy                                                             |
| ------------------------ | ------------------------------------------------------------------------ |
| `key-auth`               | [API Key Authentication](../policies/api-key-inbound.md)                 |
| `jwt`                    | [Open ID JWT Authentication](../policies/open-id-jwt-auth-inbound.md)    |
| `basic-auth`             | [Basic Authentication](../policies/basic-auth-inbound.md)                |
| `rate-limiting`          | [Rate Limiting](../policies/rate-limit-inbound.md)                       |
| `rate-limiting-advanced` | [Complex Rate Limiting](../policies/complex-rate-limit-inbound.md)       |
| `request-transformer`    | [Transform Body](../policies/transform-body-inbound.md)                  |
| `response-transformer`   | [Transform Body Outbound](../policies/transform-body-outbound.md)        |
| `cors`                   | Built-in [CORS configuration](../programmable-api/custom-cors-policy.md) |
| `ip-restriction`         | [IP Restriction](../policies/ip-restriction-inbound.md)                  |
| `request-size-limiting`  | [Request Size Limit](../policies/request-size-limit-inbound.md)          |
| `request-validation`     | [Request Validation](../policies/request-validation-inbound.md)          |
| `acl`                    | [ACL Policy](../policies/acl-policy-inbound.md)                          |
| Custom Lua plugin        | [Custom Code Policy](../policies/custom-code-inbound.md) (TypeScript)    |

### Step 3: Translate plugin configuration

Here is an example of translating a Kong rate limiting plugin to a Zuplo rate
limit policy.

**Kong plugin configuration:**

```yaml
plugins:
  - name: rate-limiting
    config:
      minute: 100
      policy: local
      limit_by: consumer
```

**Zuplo policy configuration:**

```json
{
  "name": "rate-limit-inbound",
  "policyType": "rate-limit-inbound",
  "handler": {
    "export": "RateLimitInboundPolicy",
    "module": "$import(@zuplo/runtime)",
    "options": {
      "rateLimitBy": "user",
      "requestsAllowed": 100,
      "timeWindowMinutes": 1
    }
  }
}
```

:::note

Zuplo's rate limiter is globally distributed across 300+ edge locations. Unlike
Kong, which enforces rate limits per-node or per-cluster (requiring Redis
synchronization), Zuplo enforces limits as a single global zone automatically.

:::

### Step 4: Migrate authentication

**Kong `key-auth` to Zuplo API Key Authentication:**

Kong uses consumers with key credentials stored in its database. In Zuplo, API
keys are managed through the built-in
[API key management system](./api-key-management.md), which includes a
self-serve developer portal for key creation and rotation.

1. Add the `api-key-inbound` policy to your routes.
2. Create API key consumers through the Zuplo Portal or API.
3. Optionally, enable the [Developer Portal](../dev-portal/introduction.md) for
   self-serve key management.

**Kong `jwt` to Zuplo JWT Authentication:**

Replace Kong's JWT plugin with one of Zuplo's JWT authentication policies:

- [Auth0 JWT](../policies/auth0-jwt-auth-inbound.md)
- [AWS Cognito JWT](../policies/cognito-jwt-auth-inbound.md)
- [Firebase JWT](../policies/firebase-jwt-inbound.md)
- [Open ID JWT](../policies/open-id-jwt-auth-inbound.md) (generic OIDC)

### Step 5: Set up your project and deploy

1. Create a new project in the [Zuplo Portal](https://portal.zuplo.com/signup)
   or using the [Zuplo CLI](../cli/overview.md).
2. Import your OpenAPI spec as the route configuration file.
3. Add policies to your routes.
4. Connect your project to [source control](./source-control.md).
5. Push to deploy — Zuplo deploys globally in under 20 seconds.

### Step 6: Migrate traffic

Run Zuplo alongside Kong during migration:

1. Point a subset of traffic to Zuplo using DNS or a load balancer.
2. Monitor both gateways for correctness and performance.
3. Gradually shift more traffic to Zuplo.
4. Decommission Kong once all traffic is migrated.

## Custom Lua plugins to TypeScript

If you have custom Kong plugins written in Lua, rewrite them as Zuplo
[custom code policies](../policies/custom-code-inbound.md) in TypeScript.

**Kong Lua plugin example:**

```lua
local MyPlugin = {}

function MyPlugin:access(conf)
  local header_value = kong.request.get_header("x-custom-header")
  if not header_value then
    return kong.response.exit(403, { message = "Missing required header" })
  end
end

return MyPlugin
```

**Equivalent Zuplo TypeScript policy:**

```typescript
import { ZuploContext, ZuploRequest, HttpProblems } from "@zuplo/runtime";

export default async function (
  request: ZuploRequest,
  context: ZuploContext,
  options: never,
  policyName: string,
) {
  const headerValue = request.headers.get("x-custom-header");
  if (!headerValue) {
    return HttpProblems.forbidden(request, context, {
      detail: "Missing required header",
    });
  }
  return request;
}
```

## Kong DB-less mode to Zuplo GitOps

If you use Kong's DB-less declarative mode, you're already familiar with
configuration-as-code. Zuplo takes this further with native GitOps:

| Kong DB-less                  | Zuplo GitOps                                                         |
| ----------------------------- | -------------------------------------------------------------------- |
| Single `kong.yml` file        | OpenAPI spec + policy configs in Git                                 |
| `deck sync` to apply changes  | `git push` triggers automatic deployment                             |
| Manual environment management | Automatic [branch-based environments](./branch-based-deployments.md) |
| No PR-based review workflow   | PR reviews with preview environments                                 |
| Manual rollback               | `git revert` and push                                                |

## Next steps

- [Set up your first Zuplo gateway](./step-1-setup-basic-gateway.md)
- [Add rate limiting](./step-2-add-rate-limiting.md)
- [Add API key authentication](./step-3-add-api-key-auth.md)
- [Configure your developer portal](../dev-portal/introduction.md)
- [Set up source control](./source-control.md)
