---
title: Migrate from AWS API Gateway to Zuplo
sidebar_label: Migrate from AWS API Gateway
---

This guide walks through migrating from AWS API Gateway (REST API, HTTP API, or
WebSocket API) to Zuplo. It covers the key differences, concept mapping, and a
step-by-step migration process.

## Why teams migrate from AWS API Gateway

AWS API Gateway is a natural choice for teams already building on AWS. However,
as API programs grow, teams encounter several limitations:

- **AWS lock-in** — AWS API Gateway only works within the AWS ecosystem. If your
  backends span multiple cloud providers or you want to avoid single-vendor
  dependency, you need a multi-cloud solution.
- **No built-in developer portal** — AWS API Gateway does not include a
  developer-facing portal. The "Serverless Developer Portal" is a reference
  implementation that requires self-hosting and maintenance.
- **Complex customization** — Custom request/response transformations use
  Velocity Template Language (VTL) for REST APIs, a templating language that is
  difficult to write, debug, and maintain. More complex logic requires separate
  Lambda functions.
- **Region-bound traffic** — AWS API Gateway routes traffic through specific AWS
  regions, not a global edge network. Users far from your selected region
  experience higher latency.
- **CloudFormation complexity** — Managing API Gateway configuration through
  CloudFormation, SAM, or CDK templates adds significant complexity and slow
  deployment cycles.
- **Limited rate limiting** — Throttling is global or stage-based with limited
  per-user or per-key customization. There is no built-in sliding window rate
  limiter.

## Concept mapping: AWS API Gateway to Zuplo

| AWS API Gateway concept        | Zuplo equivalent                                                                                              |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| REST API / HTTP API            | [OpenAPI route configuration](./openapi.md)                                                                   |
| Resource                       | Route path in OpenAPI spec                                                                                    |
| Method                         | HTTP method on a route                                                                                        |
| Integration (Lambda, HTTP)     | [Handler](../handlers/url-forward.md) (URL Forward, URL Rewrite, Custom)                                      |
| Lambda Authorizer              | [Authentication policy](../policies/api-key-inbound.md) or [custom code](../policies/custom-code-inbound.md)  |
| API Key + Usage Plan           | [API Key Authentication](../policies/api-key-inbound.md) + [Rate Limiting](../policies/rate-limit-inbound.md) |
| Stage                          | [Environment](./environments.md)                                                                              |
| Stage variables                | [Environment variables](./environment-variables.md)                                                           |
| Request/Response mapping (VTL) | [Custom code policy](../policies/custom-code-inbound.md) (TypeScript)                                         |
| CloudFormation / SAM / CDK     | [GitOps deployment](./source-control.md) via `git push`                                                       |
| CloudWatch Logs                | [Logging integrations](./logging.md) (Datadog, Splunk, etc.)                                                  |
| WAF integration                | [WAF & DDoS protection](./waf-ddos.md)                                                                        |
| Custom domain                  | [Custom domains](./custom-domains.md)                                                                         |

## Step-by-step migration

### Step 1: Export your API definition

AWS API Gateway supports exporting your API as an OpenAPI spec:

**Using the AWS Console:**

1. Navigate to your API in the API Gateway console.
2. Select **Stages** and choose the stage to export.
3. Go to the **Export** tab.
4. Select **OpenAPI 3** and **JSON** format.
5. Choose **Export as OpenAPI 3 + API Gateway Extensions** to include
   integration details.

**Using the AWS CLI:**

```bash
aws apigateway get-export \
  --rest-api-id YOUR_API_ID \
  --stage-name prod \
  --export-type oas30 \
  --accepts application/json \
  output.json
```

### Step 2: Clean up and import your OpenAPI spec

The exported spec includes AWS-specific extensions (`x-amazon-apigateway-*`)
that you need to replace with Zuplo configuration.

For each path and method, replace the `x-amazon-apigateway-integration` with
Zuplo's `x-zuplo-route` extension:

**AWS API Gateway export:**

```json
{
  "/users": {
    "get": {
      "x-amazon-apigateway-integration": {
        "type": "HTTP_PROXY",
        "httpMethod": "GET",
        "uri": "https://api.backend.example.com/users"
      }
    }
  }
}
```

**Zuplo route configuration:**

```json
{
  "/users": {
    "get": {
      "operationId": "get-users",
      "summary": "List users",
      "x-zuplo-route": {
        "corsPolicy": "none",
        "handler": {
          "export": "urlForwardHandler",
          "module": "$import(@zuplo/runtime)",
          "options": {
            "baseUrl": "https://api.backend.example.com"
          }
        },
        "policies": {
          "inbound": []
        }
      }
    }
  }
}
```

### Step 3: Map AWS integrations to Zuplo handlers

| AWS integration type | Zuplo handler                                                                                                        |
| -------------------- | -------------------------------------------------------------------------------------------------------------------- |
| HTTP / HTTP_PROXY    | [URL Forward](../handlers/url-forward.md) or [URL Rewrite](../handlers/url-rewrite.md)                               |
| Lambda               | [URL Forward](../handlers/url-forward.md) to Lambda function URL, or [AWS Lambda handler](../handlers/aws-lambda.md) |
| Mock                 | [Mock API policy](../policies/mock-api-inbound.md)                                                                   |

### Step 4: Replace VTL mappings with TypeScript

If you use Velocity Template Language (VTL) for request/response
transformations, replace them with TypeScript custom code policies.

**AWS VTL mapping template:**

```velocity
#set($inputRoot = $input.path('$'))
{
  "userId": "$inputRoot.id",
  "fullName": "$inputRoot.first_name $inputRoot.last_name",
  "email": "$inputRoot.email"
}
```

**Zuplo outbound custom code policy:**

```typescript
import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

export default async function (
  response: Response,
  request: ZuploRequest,
  context: ZuploContext,
  options: never,
  policyName: string,
) {
  const data = await response.json();

  const transformed = {
    userId: data.id,
    fullName: `${data.first_name} ${data.last_name}`,
    email: data.email,
  };

  return new Response(JSON.stringify(transformed), {
    status: response.status,
    headers: response.headers,
  });
}
```

### Step 5: Migrate Lambda authorizers

If you use Lambda authorizers for authentication, replace them with Zuplo's
built-in authentication policies or custom code policies.

**For API key authentication:**

Replace the Lambda authorizer + usage plan pattern with Zuplo's
[API Key Authentication](../policies/api-key-inbound.md) policy, which includes
built-in key management, a developer portal, and per-key rate limiting.

**For JWT / OAuth authentication:**

Replace the Lambda authorizer with one of Zuplo's JWT policies:

- [Auth0 JWT](../policies/auth0-jwt-auth-inbound.md)
- [AWS Cognito JWT](../policies/cognito-jwt-auth-inbound.md)
- [Firebase JWT](../policies/firebase-jwt-inbound.md)
- [Open ID JWT](../policies/open-id-jwt-auth-inbound.md) (generic OIDC)

:::note

You can continue using AWS Cognito as your identity provider. Use Zuplo's
[Cognito JWT Authentication](../policies/cognito-jwt-auth-inbound.md) policy to
validate Cognito tokens at the gateway.

:::

### Step 6: Replace usage plans with Zuplo rate limiting

AWS API Gateway's usage plans provide basic throttling and quota management.
Zuplo's rate limiting is more flexible:

| AWS usage plan feature       | Zuplo equivalent                                                            |
| ---------------------------- | --------------------------------------------------------------------------- |
| Throttle rate (requests/sec) | [Rate Limiting](../policies/rate-limit-inbound.md) with `timeWindowMinutes` |
| Quota (requests/period)      | [Quota policy](../policies/quota-inbound.md)                                |
| Per-key throttling           | `rateLimitBy: "user"` on the rate limit policy                              |
| Burst limit                  | Built-in — Zuplo's sliding window handles bursts naturally                  |

### Step 7: Deploy and migrate traffic

1. Deploy your Zuplo project by pushing to your connected Git repository.
2. Set up a [custom domain](./custom-domains.md) for Zuplo.
3. Update your DNS to route traffic through Zuplo.
4. Zuplo can forward requests to your existing AWS backends (Lambda, ALB, ECS)
   without changes.
5. Monitor traffic and gradually decommission your AWS API Gateway stages.

## Keeping AWS backends with Zuplo

You do not need to migrate your backend infrastructure. Zuplo works with any
HTTP backend, including:

- AWS Lambda (via function URLs or API Gateway pass-through)
- Application Load Balancers (ALB)
- Amazon ECS / EKS services
- Any AWS service with an HTTP endpoint

Use [backend security](./securing-your-backend.md) options like mTLS or shared
secrets to secure the connection between Zuplo and your AWS backends.

## Next steps

- [Set up your first Zuplo gateway](./step-1-setup-basic-gateway.md)
- [Add rate limiting](./step-2-add-rate-limiting.md)
- [Add API key authentication](./step-3-add-api-key-auth.md)
- [Configure your developer portal](../dev-portal/introduction.md)
- [Set up source control](./source-control.md)
