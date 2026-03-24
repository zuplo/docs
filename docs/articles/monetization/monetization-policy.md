---
title: Monetization Policy Reference
sidebar_label: Monetization Policy
---

:::note{title="Beta"}

API Monetization is in beta and free to try. The APIs are stable but should be
evaluated in non-production environments first. To go to production, contact
[sales@zuplo.com](mailto:sales@zuplo.com). Production pricing has not yet been
announced.

:::

The `MonetizationInboundPolicy` is the gateway enforcement mechanism. It runs on
every request to a protected route, authenticates the API key, checks the
customer's subscription and payment status, enforces quota, meters the request,
and allows or blocks access.

## Basic configuration

Add the policy to your `policies.json`:

```json
{
  "name": "monetization-inbound",
  "policyType": "monetization-inbound",
  "handler": {
    "export": "MonetizationInboundPolicy",
    "module": "$import(@zuplo/runtime)",
    "options": {
      "meters": {
        "api_requests": 1
      }
    }
  }
}
```

Then reference it in your route's inbound policy pipeline:

```json
{
  "x-zuplo-route": {
    "policies": {
      "inbound": ["monetization-inbound"]
    }
  }
}
```

:::note

The `MonetizationInboundPolicy` handles API key authentication internally. It
reads the API key from the `Authorization` header, validates it, and sets
`request.user`. You do not need a separate `api-key-auth` policy on monetized
routes — the monetization policy replaces it.

:::

## Configuration options

| Option               | Type               | Default           | Description                                       |
| -------------------- | ------------------ | ----------------- | ------------------------------------------------- |
| `meters`             | object             | (required)        | Map of meter keys to increment values             |
| `meterOnStatusCodes` | string or number[] | `"200-299"`       | Status code range to meter                        |
| `authHeader`         | string             | `"authorization"` | Header to read the API key from                   |
| `authScheme`         | string             | `"Bearer"`        | Expected auth scheme prefix                       |
| `cacheTtlSeconds`    | number             | `60`              | How long to cache subscription data (minimum 60s) |

### `meters`

The `meters` option defines which meters to increment and by how much when a
request is processed. Values must be positive numbers.

```json
// Increment the api_requests meter by 1 per request
{ "meters": { "api_requests": 1 } }

// Increment multiple meters simultaneously
{ "meters": { "api_requests": 1, "api_credits": 5 } }

// Increment by a fixed amount per request (expensive endpoint)
{ "meters": { "api_credits": 10 } }
```

### `meterOnStatusCodes`

Controls which responses count toward metering. By default, only successful
responses (2xx) are metered.

```json
// Only meter successful responses (default)
{ "meterOnStatusCodes": "200-299" }

// Only meter 200 OK
{ "meterOnStatusCodes": "200" }

// Meter success and redirects
{ "meterOnStatusCodes": "200-399" }

// Comma-separated ranges
{ "meterOnStatusCodes": "200, 201, 300-304" }

// Array of specific status codes
{ "meterOnStatusCodes": [200, 201, 202] }
```

:::caution

The wildcard `"*"` is not a valid value for `meterOnStatusCodes` and throws a
configuration error. Use a specific range like `"200-599"` if you want to meter
most responses.

:::

This is important for fairness: if your backend returns a 500 error, you
probably don't want to charge the customer for that request.

### `authHeader`

The header to read the API key from. Defaults to `"authorization"`.

### `authScheme`

The expected auth scheme prefix. Defaults to `"Bearer"`. The policy expects the
header value in the format `{authScheme} {apiKey}`.

### `cacheTtlSeconds`

How long to cache subscription and entitlement data, in seconds. Defaults to
`60` with a minimum of `60`. Increasing this value reduces calls to the gateway
service but means entitlement changes take longer to propagate.

## Subscription and payment validation

The policy checks payment status on every request. Access is granted when:

- The subscription is active and not expired
- Payment status is `paid` or `not_required` (free plans)

When payment fails, a configurable grace period (default 3 days) allows
continued access while retries are attempted. After the grace period, access is
blocked until payment succeeds.

The grace period is configurable via metadata on the plan or customer:

- Plan metadata key: `zuplo_max_payment_overdue_days`
- Customer metadata key: `zuplo_max_payment_overdue_days`
- Default: `3` (days)

## Multiple policies for different routes

Different routes can have different metering configurations. Define multiple
policy instances:

```json
[
  {
    "name": "monetization-standard",
    "policyType": "monetization-inbound",
    "handler": {
      "export": "MonetizationInboundPolicy",
      "module": "$import(@zuplo/runtime)",
      "options": {
        "meters": { "api_requests": 1 }
      }
    }
  },
  {
    "name": "monetization-ai",
    "policyType": "monetization-inbound",
    "handler": {
      "export": "MonetizationInboundPolicy",
      "module": "$import(@zuplo/runtime)",
      "options": {
        "meters": { "api_requests": 1, "tokens": 1 }
      }
    }
  },
  {
    "name": "monetization-premium",
    "policyType": "monetization-inbound",
    "handler": {
      "export": "MonetizationInboundPolicy",
      "module": "$import(@zuplo/runtime)",
      "options": {
        "meters": { "api_credits": 10 }
      }
    }
  }
]
```

Apply each to the appropriate routes:

```json
// Simple lookup -> 1 request meter
"/api/v1/search": { "inbound": ["monetization-standard"] }

// AI endpoint -> 1 request + token metering
"/api/v1/analyze": { "inbound": ["monetization-ai"] }

// Premium endpoint -> 10 credits
"/api/v1/bulk-export": { "inbound": ["monetization-premium"] }
```

## Dynamic metering

For AI APIs and other variable-cost endpoints, you may need to meter based on
the response — for example, counting the number of tokens returned by an LLM.

Use the `setMeters` and `addMeters` static methods to set meter values
programmatically at runtime from a custom policy or handler:

```typescript
import { MonetizationInboundPolicy } from "@zuplo/runtime";

// In a custom outbound policy, set meters based on the response
export default async function meterTokens(response, request, context) {
  if (response.ok) {
    const body = await response.json();
    const tokens = body.usage?.total_tokens ?? 0;

    MonetizationInboundPolicy.setMeters(context, {
      tokens_used: tokens,
    });
  }
  return response;
}
```

You can also use `addMeters` to add to existing meter values rather than
replacing them:

```typescript
MonetizationInboundPolicy.addMeters(context, {
  api_credits: creditsConsumed,
});
```

You can also read the current runtime meter values at any point:

```typescript
const meters = MonetizationInboundPolicy.getMeters(context);
// { tokens_used: 150 }
```

### How meter values are merged

The final metering hook combines static and runtime values before usage is sent:

- `options.meters` provides the static base values
- `setMeters` replaces the current runtime meter map, overriding matching static
  keys
- `addMeters` accumulates into the runtime meter map, then combines additively
  with static values
- If both static and runtime maps are empty, metering is skipped

For a meter key like `api` with `options.meters.api = 1`:

- `setMeters(context, { api: 50 })` sends `api: 50` (replaces static value)
- `addMeters(context, { api: 50 })` sends `api: 51` (adds to static value)

## Error responses

The policy returns `403 Forbidden` for all error conditions. Responses follow
the RFC 7807 Problem Details format:

```json
{
  "type": "https://httpproblems.com/http-status/403",
  "title": "Forbidden",
  "status": 403,
  "detail": "API Key has exceeded the allowed limit for \"api_requests\" meter.",
  "instance": "/api/v1/resource",
  "trace": {
    "timestamp": "2026-01-15T10:00:00Z",
    "requestId": "req_abc123",
    "buildId": "build_xyz"
  }
}
```

Common error details:

| Condition                 | `detail` message                                                    |
| ------------------------- | ------------------------------------------------------------------- |
| No auth header            | `"No Authorization Header"`                                         |
| Wrong auth scheme         | `"Invalid Authorization Scheme"`                                    |
| Invalid API key           | `"API Key is invalid or does not have access to the API"`           |
| Expired API key           | `"API Key has expired."`                                            |
| Expired subscription      | `"API Key has an expired subscription."`                            |
| Payment not made          | `"Payment has not been made."`                                      |
| Payment overdue           | `"Payment is overdue. Please update your payment method."`          |
| Quota exhausted           | `"API Key has exceeded the allowed limit for \"X\" meter."`         |
| Meter not in subscription | `"API Key does not have \"X\" meter provided by the subscription."` |

## Pipeline ordering

The monetization policy should be the first policy in the inbound pipeline since
it handles authentication:

```
1. monetization-inbound  → Authenticates, checks subscription, enforces quota, meters usage
2. rate-limiting         → (Optional) Per-second/per-minute spike protection
3. caching               → (Optional) Response caching
4. → Route handler       → Your API logic
```

If you still want per-second or per-minute rate limiting on top of monthly
quotas, add a standalone rate-limiting policy after the monetization policy.
These serve different purposes: monetization enforces billing quotas, while rate
limiting protects against traffic spikes.
