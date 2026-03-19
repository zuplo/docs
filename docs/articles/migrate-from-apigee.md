---
title: Migrate from Google Apigee to Zuplo
sidebar_label: Migrate from Apigee
---

This guide walks through migrating from Google Apigee (including Apigee X,
Apigee hybrid, and legacy Apigee Edge) to Zuplo. It covers the key differences,
concept mapping, policy translation, and a step-by-step migration process.

## Why teams migrate from Apigee

Apigee is one of the oldest API management platforms, acquired by Google
in 2016. While it offers deep enterprise analytics and compliance features,
teams increasingly find the platform difficult to justify:

- **Apigee Edge end-of-life** — Google has been sunsetting legacy Apigee Edge
  (on-premises and private cloud) versions, pushing customers to migrate to
  Apigee X on Google Cloud. This forced migration is an opportunity to evaluate
  modern alternatives.
- **Google Cloud lock-in** — Apigee X is tightly coupled to Google Cloud
  Platform. While Apigee hybrid exists, it adds operational complexity. Teams
  running multi-cloud or non-GCP backends face unnecessary friction.
- **High cost** — Apigee pricing starts at approximately $1,500/month for just
  100K requests, with separate charges for environments, analytics, and
  developer portals. Enterprise contracts often require five-figure monthly
  commitments.
- **XML-based policy configuration** — Apigee policies are configured in verbose
  XML files that are difficult to read, maintain, and version control. Custom
  logic uses a limited JavaScript engine.
- **Slow deployment cycles** — Apigee deployments can take several minutes to
  propagate, slowing down the development iteration loop.
- **Drupal-based developer portal** — Apigee's developer portal is built on
  Drupal, requiring significant setup, customization, and ongoing maintenance.

:::tip

Zuplo has a video walkthrough of the Apigee to Zuplo migration process:
[Migrating from Apigee API Management Made Easy](https://zuplo.com/videos/migrating-from-apigee-api-management-made-easy).

:::

## Concept mapping: Apigee to Zuplo

| Apigee concept          | Zuplo equivalent                                                       |
| ----------------------- | ---------------------------------------------------------------------- |
| API Proxy               | Routes in your [OpenAPI spec](./openapi.md)                            |
| ProxyEndpoint           | Route path + [handler](../handlers/url-forward.md)                     |
| TargetEndpoint          | [URL forward handler](../handlers/url-forward.md) base URL             |
| Policy (XML)            | [Policy](./policies.md) (TypeScript) or built-in policy                |
| PreFlow / PostFlow      | Inbound / outbound [policies](./policies.md)                           |
| Conditional flow        | Custom code in a [custom policy](../policies/custom-code-inbound.md)   |
| SharedFlow              | Reusable [custom code module](../programmable-api/reusing-code.md)     |
| Environment             | [Environment](./environments.md)                                       |
| API Product             | API key with [metadata](./api-key-management.md)                       |
| Developer App           | [API key consumer](./api-key-management.md)                            |
| Apigee Developer Portal | [Zuplo Developer Portal](../dev-portal/introduction.md)                |
| VerifyAPIKey policy     | [API Key Authentication](../policies/api-key-inbound.md)               |
| OAuthV2 policy          | [JWT authentication policies](../policies/open-id-jwt-auth-inbound.md) |
| SpikeArrest             | [Rate Limiting](../policies/rate-limit-inbound.md)                     |
| Quota                   | [Quota policy](../policies/quota-inbound.md)                           |
| KVM (Key Value Map)     | [Environment variables](./environment-variables.md)                    |
| Management API          | [Zuplo API](./accounts/zuplo-api-keys.md)                              |

## Step-by-step migration

### Step 1: Export your API definitions

Apigee API proxies contain OpenAPI specs or can generate them. Export your API
definitions:

1. In the Apigee console, navigate to your API proxy.
2. Download the OpenAPI spec from the **Develop** tab, or export the proxy
   bundle as a ZIP file and extract the spec.
3. If no spec exists, create one from your proxy's endpoint and resource
   definitions.

### Step 2: Map Apigee policies to Zuplo policies

The following table maps common Apigee policies to Zuplo equivalents:

| Apigee policy             | Zuplo policy                                                                                     |
| ------------------------- | ------------------------------------------------------------------------------------------------ |
| `VerifyAPIKey`            | [API Key Authentication](../policies/api-key-inbound.md)                                         |
| `OAuthV2`                 | [Open ID JWT Authentication](../policies/open-id-jwt-auth-inbound.md)                            |
| `BasicAuthentication`     | [Basic Authentication](../policies/basic-auth-inbound.md)                                        |
| `SpikeArrest`             | [Rate Limiting](../policies/rate-limit-inbound.md)                                               |
| `Quota`                   | [Quota](../policies/quota-inbound.md)                                                            |
| `AssignMessage`           | [Set Headers](../policies/set-headers-inbound.md) or [Set Body](../policies/set-body-inbound.md) |
| `ExtractVariables`        | [Custom Code Policy](../policies/custom-code-inbound.md)                                         |
| `XMLToJSON` / `JSONToXML` | [XML to JSON](../policies/xml-to-json-outbound.md) or custom code                                |
| `RaiseFault`              | Custom code returning an error [Response](../programmable-api/http-problems.md)                  |
| `AccessControl`           | [IP Restriction](../policies/ip-restriction-inbound.md)                                          |
| `CORS`                    | Built-in [CORS configuration](../programmable-api/custom-cors-policy.md)                         |
| `JavaScript` callout      | [Custom Code Policy](../policies/custom-code-inbound.md) (TypeScript)                            |
| `ServiceCallout`          | [Custom Code Policy](../policies/custom-code-inbound.md) using `fetch()`                         |

### Step 3: Translate policy configuration

Here is an example of translating an Apigee SpikeArrest policy to a Zuplo rate
limit policy.

**Apigee XML policy:**

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<SpikeArrest name="SA-RateLimit">
  <Rate>100pm</Rate>
  <Identifier ref="request.header.x-api-key"/>
  <UseEffectiveCount>true</UseEffectiveCount>
</SpikeArrest>
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

Apigee's SpikeArrest uses a smoothing algorithm that spreads allowed requests
evenly across the time window. Zuplo's rate limiter uses a sliding window
algorithm and is globally distributed — limits are enforced across all 300+ edge
locations as a single zone, unlike Apigee which synchronizes within a region but
not across regions by default.

:::

### Step 4: Translate JavaScript callouts to TypeScript

If you use Apigee JavaScript callouts, rewrite them as Zuplo custom code
policies in TypeScript.

**Apigee JavaScript callout:**

```javascript
var apiKey = context.getVariable("request.header.x-api-key");
var clientId = context.getVariable("request.header.x-client-id");

if (!apiKey || !clientId) {
  context.setVariable("isError", true);
  context.setVariable("errorMessage", "Missing required headers");
}

var payload = JSON.parse(context.getVariable("request.content"));
payload.enriched = true;
payload.timestamp = new Date().toISOString();
context.setVariable("request.content", JSON.stringify(payload));
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
  const apiKey = request.headers.get("x-api-key");
  const clientId = request.headers.get("x-client-id");

  if (!apiKey || !clientId) {
    return HttpProblems.badRequest(request, context, {
      detail: "Missing required headers",
    });
  }

  const payload = await request.json();
  payload.enriched = true;
  payload.timestamp = new Date().toISOString();

  return new ZuploRequest(request, {
    body: JSON.stringify(payload),
    headers: {
      ...Object.fromEntries(request.headers.entries()),
      "content-type": "application/json",
    },
  });
}
```

### Step 5: Migrate your developer portal

Apigee's Drupal-based developer portal requires significant setup and
maintenance. Zuplo's [Developer Portal](../dev-portal/introduction.md) is
automatically generated from your OpenAPI spec and includes:

- Interactive API reference documentation
- Self-serve API key management
- Built-in authentication
- Customizable theming
- Zero maintenance — it updates automatically when your API changes

### Step 6: Migrate environment configuration

**Apigee KVMs to Zuplo environment variables:**

Apigee uses Key Value Maps (KVMs) for environment-specific configuration. In
Zuplo, use [environment variables](./environment-variables.md):

| Apigee KVM                          | Zuplo environment variable          |
| ----------------------------------- | ----------------------------------- |
| `kvm.get("backend-url")`            | `$env(BACKEND_URL)` in route config |
| `context.getVariable("my-kvm.key")` | `context.env.MY_KEY` in custom code |
| Encrypted KVM entries               | Secret environment variables        |

### Step 7: Deploy and migrate traffic

1. Deploy your Zuplo project by pushing to your connected Git repository.
2. Set up a [custom domain](./custom-domains.md) for your Zuplo gateway.
3. Route a subset of traffic to Zuplo using DNS-based traffic splitting.
4. Monitor both gateways and compare behavior.
5. Gradually shift all traffic to Zuplo.
6. Decommission your Apigee environment.

## Apigee Edge to Zuplo: a special case

If you are migrating from legacy Apigee Edge (on-premises or private cloud)
rather than Apigee X, the migration to Zuplo is an opportunity to modernize
without the complexity of moving to Apigee X:

- **Skip the Apigee X migration** — Instead of migrating from Edge to X (which
  Google recommends but requires significant effort), migrate directly to Zuplo.
- **Eliminate infrastructure** — Apigee Edge requires managing on-premises
  infrastructure. Zuplo is fully managed.
- **Reduce costs** — Apigee X pricing is often higher than Edge licensing. Zuplo
  offers transparent, usage-based pricing starting with a free tier.

## Next steps

- [Set up your first Zuplo gateway](./step-1-setup-basic-gateway.md)
- [Add rate limiting](./step-2-add-rate-limiting.md)
- [Add API key authentication](./step-3-add-api-key-auth.md)
- [Configure your developer portal](../dev-portal/introduction.md)
- [Set up source control](./source-control.md)
