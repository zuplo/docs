---
title: Route Employees to Canary or Staging Backends
sidebar_label: Canary Routing for Employees
---

This guide explains how to create a Zuplo policy that routes employee requests
to canary or staging backends for testing and dogfooding purposes.

## Overview

When releasing new API versions, it's common to route internal employees or beta
testers to a canary or staging environment before rolling out to all users. This
allows teams to test new features and catch issues early without affecting
production traffic.

## How It Works

The policy checks for staging environment indicators in this order:

1. **Query parameter**: `?stage=canary` (defaults to `release`)
2. **Request header**: `x-stage`
3. **User identity**: Employee email/ID in allow list

If any condition is met, the request routes to canary backends.

## Creating a Canary Routing Policy

Create a new policy file in your project:

```typescript
// policies/canary-routing.ts
import {
  InboundPolicyHandler,
  ZuploRequest,
  environment,
} from "@zuplo/runtime";

export const canaryRoutingPolicy: InboundPolicyHandler = async (
  request,
  context,
) => {
  // Get canary users from environment variable
  const CANARY_USERS = environment.CANARY_USERS
    ? environment.CANARY_USERS.split(",").map((user) => user.trim())
    : [];

  // Check for staging indicators
  const url = new URL(request.url);
  const stageParam = url.searchParams.get("stage");
  const stageHeader = request.headers.get("x-stage");
  const canaryUser =
    request.user?.sub && CANARY_USERS.includes(request.user.sub);

  // Determine if we should route to canary
  const isCanary =
    stageParam === "canary" || stageHeader === "canary" || canaryUser;

  // Route based on stage
  if (isCanary) {
    context.route.url = environment.API_URL_CANARY;

    // Log canary routing for debugging
    context.log.info("Routing to canary backend", {
      reason: stageHeader ? "header" : canaryUser ? "user" : "query",
      user: request.user?.sub,
      stage: stageParam || stageHeader || "canary",
    });
  } else {
    context.route.url = environment.API_URL_PRODUCTION;
  }

  // Remove stage query parameter to avoid passing it to backend
  if (stageParam) {
    url.searchParams.delete("stage");
    return new ZuploRequest(url.toString(), request);
  }

  return request;
};
```

## Advanced: Multiple Backend Support

For applications with multiple backend services, extend the policy to route each
service appropriately:

```typescript
// policies/multi-service-canary-routing.ts
import {
  InboundPolicyHandler,
  ZuploRequest,
  environment,
} from "@zuplo/runtime";

export const multiServiceCanaryRoutingPolicy: InboundPolicyHandler = async (
  request,
  context,
) => {
  const CANARY_USERS = environment.CANARY_USERS
    ? environment.CANARY_USERS.split(",").map((user) => user.trim())
    : [];

  // Check staging conditions
  const url = new URL(request.url);
  const stageParam = url.searchParams.get("stage");
  const stageHeader = request.headers.get("x-stage");
  const canaryUser =
    request.user?.sub && CANARY_USERS.includes(request.user.sub);

  // Determine if we should route to canary
  const isCanary =
    stageParam === "canary" || stageHeader === "canary" || canaryUser;

  // Route multiple services based on stage
  if (isCanary) {
    // Store multiple canary URLs in context for different services
    context.custom.userApiUrl = environment.USER_API_CANARY;
    context.custom.orderApiUrl = environment.ORDER_API_CANARY;
    context.custom.inventoryApiUrl = environment.INVENTORY_API_CANARY;

    // Add stage indicator header for downstream services
    request.headers.set("X-Stage", "canary");
  } else {
    // Production URLs (release stage)
    context.custom.userApiUrl = environment.USER_API_PRODUCTION;
    context.custom.orderApiUrl = environment.ORDER_API_PRODUCTION;
    context.custom.inventoryApiUrl = environment.INVENTORY_API_PRODUCTION;

    request.headers.set("X-Stage", "release");
  }

  // Clean up query parameter
  if (stageParam) {
    url.searchParams.delete("stage");
    return new ZuploRequest(url.toString(), request);
  }

  return request;
};
```

## Percentage-Based Canary Routing

Roll out canary deployments gradually with percentage-based routing:

```typescript
// policies/percentage-canary-routing.ts
import {
  InboundPolicyHandler,
  ZuploRequest,
  environment,
} from "@zuplo/runtime";

export const percentageCanaryRoutingPolicy: InboundPolicyHandler = async (
  request,
  context,
) => {
  // Always route configured users to canary
  const CANARY_USERS = environment.CANARY_USERS
    ? environment.CANARY_USERS.split(",").map((user) => user.trim())
    : [];

  if (request.user?.sub && CANARY_USERS.includes(request.user.sub)) {
    context.route.url = environment.API_URL_CANARY;
    return request;
  }

  // Route percentage of anonymous traffic to canary
  const CANARY_PERCENTAGE = parseInt(environment.CANARY_PERCENTAGE || "0", 10);

  if (CANARY_PERCENTAGE > 0) {
    // Use a consistent hash for sticky sessions
    const sessionId = request.headers.get("x-session-id") || request.ip;
    const hash = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(sessionId),
    );
    const hashArray = Array.from(new Uint8Array(hash));
    const hashValue = hashArray[0] / 255; // Value between 0 and 1

    if (hashValue * 100 < CANARY_PERCENTAGE) {
      context.route.url = environment.API_URL_CANARY;
      request.headers.set("X-Canary-Route", "percentage");
    } else {
      context.route.url = environment.API_URL_PRODUCTION;
    }
  } else {
    context.route.url = environment.API_URL_PRODUCTION;
  }

  return request;
};
```

## Configuration

### Environment Variables

Configure your environment variables in the Zuplo dashboard:

```bash
# List of employee emails or user IDs
CANARY_USERS=alice@company.com,bob@company.com,user-123

# Backend URLs
API_URL_PRODUCTION=https://api.company.com
API_URL_CANARY=https://api-canary.company.com

# For percentage-based routing
CANARY_PERCENTAGE=10  # Route 10% of traffic to canary
```

### Adding the Policy to Routes

Add the policy to your route configuration:

```json
{
  "paths": {
    "/api/v1/*": {
      "get": {
        "x-zuplo-route": {
          "corsPolicy": "anything-goes",
          "handler": {
            "export": "urlRewriteHandler",
            "module": "$import(@zuplo/runtime)",
            "options": {
              "rewritePattern": "https://api.company.com$1"
            }
          },
          "policies": {
            "inbound": ["canary-routing", "auth-policy"]
          }
        }
      }
    }
  }
}
```

## Testing Your Policy

### 1. Using Query Parameters

Test canary routing with a query parameter:

```bash
# Route to canary backend
curl https://your-api.zuplo.app/api/v1/users?stage=canary

# Route to release backend (default)
curl https://your-api.zuplo.app/api/v1/users?stage=release

# Or omit the parameter entirely for release
curl https://your-api.zuplo.app/api/v1/users
```

### 2. Using Headers

Test with a custom header:

```bash
# Route to canary backend
curl https://your-api.zuplo.app/api/v1/users \
  -H "x-stage: canary"

# Route to release backend
curl https://your-api.zuplo.app/api/v1/users \
  -H "x-stage: release"
```

### 3. Using Authentication

Test with an authenticated employee user:

```bash
curl https://your-api.zuplo.app/api/v1/users \
  -H "Authorization: Bearer <employee-token>"
```

## Monitoring and Observability

Add comprehensive logging to track canary routing:

```typescript
export const canaryRoutingPolicy: InboundPolicyHandler = async (
  request,
  context,
) => {
  const startTime = Date.now();

  // Check stage conditions
  const url = new URL(request.url);
  const stageParam = url.searchParams.get("stage");
  const stageHeader = request.headers.get("x-stage");
  const canaryUser = /* ... check if user is in canary list ... */;

  const isCanary =
    stageParam === "canary" ||
    stageHeader === "canary" ||
    canaryUser;

  if (isCanary) {
    context.route.url = environment.API_URL_CANARY;

    // Log canary routing metrics
    context.log.info("Canary route selected", {
      userId: request.user?.sub,
      method: request.method,
      path: url.pathname,
      stage: "canary",
      duration: Date.now() - startTime,
    });

    // Add response header for debugging
    context.response.headers.set("X-Backend-Type", "canary");
  } else {
    context.route.url = environment.API_URL_PRODUCTION;
    context.response.headers.set("X-Backend-Type", "release");
  }

  return request;
};
```

## Best Practices

### 1. Gradual Rollout

Start with a small group of employees before expanding:

1. Begin with volunteer beta testers
2. Expand to engineering team
3. Include all employees
4. Optionally add percentage-based routing for external users

### 2. Feature Flags Integration

Combine with feature flags for fine-grained control:

```typescript
if (isCanaryUser) {
  context.custom.featureFlags = {
    newDashboard: true,
    betaFeatures: true,
    experimentalApi: true,
  };
}
```

### 3. Fallback Handling

Implement fallback logic for canary backend failures:

```typescript
// In your error handling policy
if (context.response.status >= 500 && context.custom.isCanary) {
  // Retry with production backend
  context.route.url = environment.API_URL_PRODUCTION;
  return context.retry();
}
```

## Security Considerations

- **Authentication**: Always verify user identity before canary routing
- **Query Parameter**: Consider restricting stage parameter to authenticated
  users only
- **Access Control**: Limit canary access to verified employees only
- **Audit Logging**: Log all staging decisions for security audits
- **Stage Validation**: Only accept valid stage values ("release" or "canary")

## Next Steps

- Learn about [custom policies](../policies/custom-code-inbound.mdx)
- Explore [environment variables](../articles/environment-variables.md)
- Set up [monitoring and analytics](../articles/logging.md) for canary
  deployments
