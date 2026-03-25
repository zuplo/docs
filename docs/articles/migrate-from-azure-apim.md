---
title: Migrate from Azure API Management to Zuplo
sidebar_label: Migrate from Azure APIM
---

This guide walks through migrating from Azure API Management (APIM) to Zuplo. It
covers the key differences, concept mapping, policy translation, and a
step-by-step migration process.

## Why teams migrate from Azure APIM

Azure API Management is a natural choice for organizations running on Microsoft
Azure. However, teams frequently encounter friction points that prompt them to
evaluate alternatives:

- **Slow deployments** — Azure APIM deployments can take 15-45 minutes to
  propagate, creating long feedback loops during development. Creating a new
  APIM instance can take 30-60 minutes.
- **Expensive per-environment pricing** — Each APIM instance (dev, staging,
  production) is billed separately. The Developer tier starts at ~$50/month, but
  the Standard tier needed for production starts at ~$700/month per instance.
- **Poor GitOps support** — Azure APIM uses ARM templates, Bicep, or Terraform
  for infrastructure-as-code, but the policy definitions are embedded XML that
  does not merge well in version control.
- **XML policy complexity** — Like Apigee, Azure APIM policies are written in
  XML with C# expressions. The syntax is verbose and error-prone, especially for
  complex transformations.
- **Azure lock-in** — APIM is tightly integrated with the Azure ecosystem. Using
  it with non-Azure backends or multi-cloud architectures adds friction.
- **Limited developer portal customization** — The built-in developer portal has
  improved over time but still requires significant effort to customize and
  lacks features like self-serve API key management with built-in billing.

:::tip

[Imburse Payments](https://zuplo.com/blog/imburse-choose-zuplo-over-azure-api-management),
a UK fintech, chose Zuplo over Azure API Management to optimize the API
experience for their customers and improve their engineering team's workflow.

:::

## Concept mapping: Azure APIM to Zuplo

| Azure APIM concept      | Zuplo equivalent                                                         |
| ----------------------- | ------------------------------------------------------------------------ |
| API                     | Routes in your [OpenAPI spec](./openapi.md)                              |
| Operation               | Route (path + method) in OpenAPI spec                                    |
| Backend                 | [URL Forward handler](../handlers/url-forward.md) target                 |
| Inbound policy (XML)    | [Inbound policy](./policies.md) (TypeScript)                             |
| Outbound policy (XML)   | [Outbound policy](./policies.md) (TypeScript)                            |
| Named value             | [Environment variable](./environment-variables.md)                       |
| Subscription key        | [API Key Authentication](../policies/api-key-inbound.md)                 |
| Product                 | API key with [metadata](./api-key-management.md)                         |
| Service (APIM instance) | [Environment](./environments.md)                                         |
| Developer portal        | [Zuplo Developer Portal](../dev-portal/introduction.md)                  |
| Application Insights    | [Logging integrations](./logging.md) (Datadog, Splunk, etc.)             |
| API revision            | Git branch with [branch-based deployment](./branch-based-deployments.md) |
| Gateway (self-hosted)   | [Self-hosted Zuplo](../self-hosted/overview.md)                          |

## Step-by-step migration

### Step 1: Export your API definition

Azure APIM stores API definitions as OpenAPI specs. Export them:

**Using the Azure Portal:**

1. Navigate to your APIM instance.
2. Select **APIs** from the sidebar.
3. Select the API you want to export.
4. Click the **...** menu and select **Export**.
5. Choose **OpenAPI v3 (JSON)**.

**Using the Azure CLI:**

```bash
az apim api export \
  --resource-group myResourceGroup \
  --service-name myApimService \
  --api-id my-api \
  --export-format openapi-link
```

### Step 2: Map Azure APIM policies to Zuplo policies

The following table maps common Azure APIM policies to Zuplo equivalents:

| Azure APIM policy                  | Zuplo policy                                                              |
| ---------------------------------- | ------------------------------------------------------------------------- |
| `check-header`                     | [Custom Code Policy](../policies/custom-code-inbound.md) checking headers |
| `set-header`                       | [Set Headers](../policies/set-headers-inbound.md)                         |
| `remove-header`                    | [Remove Headers](../policies/remove-headers-inbound.md)                   |
| `set-body`                         | [Set Body](../policies/set-body-inbound.md)                               |
| `set-query-parameter`              | [Set Query Params](../policies/set-query-params-inbound.md)               |
| `rewrite-uri`                      | [URL Rewrite handler](../handlers/url-rewrite.md)                         |
| `rate-limit` / `rate-limit-by-key` | [Rate Limiting](../policies/rate-limit-inbound.md)                        |
| `quota` / `quota-by-key`           | [Quota](../policies/quota-inbound.md)                                     |
| `validate-jwt`                     | [Open ID JWT Authentication](../policies/open-id-jwt-auth-inbound.md)     |
| `authentication-basic`             | [Basic Authentication](../policies/basic-auth-inbound.md)                 |
| `ip-filter`                        | [IP Restriction](../policies/ip-restriction-inbound.md)                   |
| `cors`                             | Built-in [CORS configuration](../programmable-api/custom-cors-policy.md)  |
| `json-to-xml` / `xml-to-json`      | [XML to JSON](../policies/xml-to-json-outbound.md) or custom code         |
| `find-and-replace`                 | [Replace String](../policies/replace-string-outbound.md)                  |
| `cache-lookup` / `cache-store`     | [Caching](../policies/caching-inbound.md)                                 |
| `mock-response`                    | [Mock API](../policies/mock-api-inbound.md)                               |
| Custom C# expression               | [Custom Code Policy](../policies/custom-code-inbound.md) (TypeScript)     |

### Step 3: Translate policy configuration

Here is an example of translating an Azure APIM rate limit policy to a Zuplo
rate limit policy.

**Azure APIM XML policy:**

```xml
<policies>
  <inbound>
    <rate-limit-by-key
      calls="100"
      renewal-period="60"
      counter-key="@(context.Subscription.Id)" />
    <set-header name="X-Request-Id" exists-action="skip">
      <value>@(Guid.NewGuid().ToString())</value>
    </set-header>
  </inbound>
</policies>
```

**Zuplo policy configuration:**

```json
{
  "policies": {
    "inbound": [
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
      },
      {
        "name": "set-request-id",
        "policyType": "set-headers-inbound",
        "handler": {
          "export": "SetHeadersInboundPolicy",
          "module": "$import(@zuplo/runtime)",
          "options": {
            "headers": [
              {
                "name": "X-Request-Id",
                "value": "$function(generateId)",
                "overwrite": false
              }
            ]
          }
        }
      }
    ]
  }
}
```

### Step 4: Translate C# policy expressions to TypeScript

Azure APIM allows inline C# expressions in XML policies. Translate these to
TypeScript custom code policies.

**Azure APIM C# expression:**

```xml
<policies>
  <inbound>
    <set-header name="X-Forwarded-For" exists-action="override">
      <value>@(context.Request.IpAddress)</value>
    </set-header>
    <choose>
      <when condition="@(context.Request.Headers
        .GetValueOrDefault("Authorization","")
        .Length == 0)">
        <return-response>
          <set-status code="401" reason="Unauthorized" />
          <set-body>{"error": "Missing authorization"}</set-body>
        </return-response>
      </when>
    </choose>
  </inbound>
</policies>
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
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return HttpProblems.unauthorized(request, context, {
      detail: "Missing authorization",
    });
  }

  // Forward the client IP
  const headers = new Headers(request.headers);
  headers.set("X-Forwarded-For", request.headers.get("x-real-ip") ?? "");

  return new ZuploRequest(request, { headers });
}
```

### Step 5: Migrate subscription keys to Zuplo API keys

Azure APIM uses subscription keys tied to products. Migrate to Zuplo's API key
system:

| Azure APIM subscription feature | Zuplo equivalent                                            |
| ------------------------------- | ----------------------------------------------------------- |
| Subscription key                | [API key](./api-key-management.md)                          |
| Product grouping                | API key metadata for access control                         |
| Subscription approval           | API key creation via Portal or API                          |
| Key regeneration                | Key rotation in the Zuplo Portal or Developer Portal        |
| Usage reporting                 | Built-in analytics and [logging](./logging.md) integrations |

### Step 6: Migrate named values to environment variables

Azure APIM named values become Zuplo
[environment variables](./environment-variables.md):

| Azure APIM named value type | Zuplo equivalent            |
| --------------------------- | --------------------------- |
| Plain value                 | Environment variable        |
| Secret value                | Secret environment variable |
| Key Vault reference         | Secret environment variable |

Access environment variables in route configuration using `$env(VARIABLE_NAME)`
or in custom code using `context.env.VARIABLE_NAME`.

### Step 7: Deploy and migrate traffic

1. Deploy your Zuplo project by pushing to your connected Git repository.
2. Set up a [custom domain](./custom-domains.md) for Zuplo.
3. Route a subset of traffic to Zuplo using Azure Front Door, Traffic Manager,
   or DNS-based routing.
4. Validate behavior matches your Azure APIM configuration.
5. Gradually shift all traffic to Zuplo.
6. Decommission your Azure APIM instances.

## Keeping Azure backends with Zuplo

You do not need to migrate your backend infrastructure. Zuplo works with any
HTTP backend, including:

- Azure App Service
- Azure Functions
- Azure Kubernetes Service (AKS)
- Azure Container Apps
- Any Azure service with an HTTP endpoint

Use [backend security](./securing-your-backend.md) options to secure the
connection between Zuplo and your Azure backends.

## Deployment model comparison

| Feature               | Azure APIM                         | Zuplo                                        |
| --------------------- | ---------------------------------- | -------------------------------------------- |
| Deployment time       | 15-45 minutes                      | Under 20 seconds                             |
| New instance creation | 30-60 minutes                      | Instant                                      |
| Environment cost      | ~$700/month per Standard instance  | Free tier available; environments are free   |
| Preview environments  | Manual setup required              | Automatic per Git branch                     |
| Global distribution   | Premium tier + multi-region config | Built-in across 300+ edge locations          |
| GitOps workflow       | ARM/Bicep + XML policies           | OpenAPI + TypeScript, native Git integration |

## Next steps

- [Set up your first Zuplo gateway](./step-1-setup-basic-gateway.md)
- [Add rate limiting](./step-2-add-rate-limiting.md)
- [Add API key authentication](./step-3-add-api-key-auth.md)
- [Configure your developer portal](../dev-portal/introduction.md)
- [Set up source control](./source-control.md)
