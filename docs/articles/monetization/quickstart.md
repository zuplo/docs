---
title: Quickstart — Monetize Your API in 30 Minutes
sidebar_label: Quickstart
---

This guide walks you through going from an unmonetized API to a fully metered,
quota-enforced, Stripe-billed API with a self-serve Developer Portal. By the
end, your customers will be able to browse plans, subscribe via Stripe Checkout,
get API keys scoped to their plan, and hit real quota limits.

## Prerequisites

- A Zuplo account with an existing API project (routes configured and working)
- A [Stripe account](https://stripe.com) (test mode is fine for setup)
- The Developer Portal enabled on your project (uses Auth0 or custom auth)

## Step 1: Create a meter

Meters define what you're counting. Start with the most common meter: request
counting.

Navigate to **Settings → Monetization → Meters** in the Zuplo Portal, or use the
API:

```bash
curl -X POST https://dev.zuplo.com/v3/metering/{bucketId}/meters \
  -H "Authorization: Bearer {YOUR_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "api_requests",
    "name": "API Requests",
    "eventType": "api_request",
    "aggregation": "COUNT"
  }'
```

**Key fields:**

| Field           | Description                                                                             |
| --------------- | --------------------------------------------------------------------------------------- |
| `slug`          | Unique identifier used in policy configuration and API calls                            |
| `eventType`     | The type of event this meter watches for                                                |
| `aggregation`   | `COUNT` (count each event) or `SUM` (sum a numeric value from the event payload)        |
| `valueProperty` | JSONPath to the numeric value when using `SUM` (e.g., `$.tokens` for AI token metering) |

> **Finding your `bucketId`:** Go to **Settings → Project Information** in the
> Zuplo Portal. The `bucketId` is listed under your project details.

## Step 2: Create a feature

Features connect meters to your product catalog. Create a metered feature for
your API requests meter:

```bash
curl -X POST https://dev.zuplo.com/v3/metering/{bucketId}/features \
  -H "Authorization: Bearer {YOUR_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "key": "api_calls",
    "name": "API Calls",
    "meterSlug": "api_requests"
  }'
```

You can also create **static features** (boolean on/off toggles) that don't link
to a meter:

```json
{
  "key": "priority_support",
  "name": "Priority Support"
}
```

## Step 3: Create a plan

Plans define your pricing tiers. Here's a typical two-tier setup with a free
tier and a paid Pro tier:

### Free plan

```bash
curl -X POST https://dev.zuplo.com/v3/metering/{bucketId}/plans \
  -H "Authorization: Bearer {YOUR_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "key": "free",
    "name": "Free",
    "currency": "USD",
    "billingCadence": "P1M",
    "phases": [
      {
        "key": "default",
        "name": "Free Tier",
        "duration": null,
        "rateCards": [
          {
            "type": "flat_fee",
            "key": "api_calls",
            "name": "API Calls",
            "featureKey": "api_calls",
            "billingCadence": null,
            "price": null,
            "entitlementTemplate": {
              "type": "metered",
              "issueAfterReset": 1000,
              "isSoftLimit": false
            }
          }
        ]
      }
    ]
  }'
```

This gives free-tier users 1,000 API calls per month with a hard limit — once
they hit 1,000, they get `403 Forbidden` until the next billing period.

### Pro plan

```bash
curl -X POST https://dev.zuplo.com/v3/metering/{bucketId}/plans \
  -H "Authorization: Bearer {YOUR_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "key": "pro",
    "name": "Pro",
    "currency": "USD",
    "billingCadence": "P1M",
    "phases": [
      {
        "key": "default",
        "name": "Pro Monthly",
        "duration": null,
        "rateCards": [
          {
            "type": "usage_based",
            "key": "api_calls",
            "name": "API Calls",
            "featureKey": "api_calls",
            "billingCadence": "P1M",
            "price": {
              "type": "tiered",
              "mode": "graduated",
              "tiers": [
                {
                  "upToAmount": "50000",
                  "flatPrice": { "type": "flat", "amount": "99.00" },
                  "unitPrice": null
                },
                {
                  "flatPrice": null,
                  "unitPrice": { "type": "unit", "amount": "0.50" }
                }
              ]
            },
            "entitlementTemplate": {
              "type": "metered",
              "issueAfterReset": 50000,
              "isSoftLimit": true
            }
          },
          {
            "type": "flat_fee",
            "key": "priority_support",
            "name": "Priority Support",
            "featureKey": "priority_support",
            "billingCadence": null,
            "price": null,
            "entitlementTemplate": {
              "type": "boolean",
              "config": true
            }
          }
        ]
      }
    ]
  }'
```

This creates a Pro plan at $99/month with 50,000 API calls included. The soft
limit means customers can exceed 50,000 requests — they are billed $0.50 per
additional request as overage. Pro users also get the Priority Support static
feature.

### Publish the plans

Plans are created in `draft` status. Publish them to make them available:

```bash
curl -X POST https://dev.zuplo.com/v3/metering/{bucketId}/plans/{planId}/publish \
  -H "Authorization: Bearer {YOUR_API_KEY}"
```

## Step 4: Connect Stripe

Navigate to **Settings → Monetization → Billing** in the Zuplo Portal.

1. Click **Connect Stripe Account**
2. Authorize Zuplo to access your Stripe account (use test mode for initial
   setup)
3. Zuplo automatically creates Stripe Products and Prices corresponding to your
   published plans
4. Verify in the Stripe Dashboard that the products appear under **Products**

When a customer subscribes through your Developer Portal, Zuplo:

- Creates a Stripe Customer (or links to an existing one)
- Creates a Stripe Subscription matching the plan
- Generates an API key scoped to the subscription's entitlements
- Keeps subscription and payment state synchronized automatically

## Step 5: Add the Monetization policy to your routes

The `MonetizationInboundPolicy` handles authentication, subscription validation,
quota enforcement, and metering. Add it to every route you want to meter and
protect.

In your `routes.oas.json`, add the policy to the route's `x-zuplo-route`
configuration:

```json
{
  "paths": {
    "/api/v1/characters": {
      "get": {
        "x-zuplo-route": {
          "policies": {
            "inbound": ["monetization-inbound"]
          }
        }
      }
    }
  }
}
```

Then define the policy in `policies.json`:

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

:::note

The `MonetizationInboundPolicy` handles API key authentication internally. You
do not need a separate `api-key-auth` policy on monetized routes — the
monetization policy replaces it.

:::

## Step 6: Configure the Developer Portal

The Developer Portal provides the self-serve experience for your customers:
browsing plans, subscribing, managing API keys, and viewing usage.

Enable monetization in the Zuplo Portal under **Developer Portal → Settings →
Monetization**. Once enabled, your Developer Portal shows:

- A **Pricing** page displaying your published plans with feature comparisons
- A **Subscribe** button that launches Stripe Checkout
- A **Subscriptions** page where customers see their active plans, usage, and
  API keys
- A **Usage** dashboard showing quota consumption for the current billing period

## Step 7: Test the flow

1. Open your Developer Portal in a browser
2. Sign up or log in as a test customer
3. Navigate to the Pricing page and subscribe to the Free plan
4. Copy the generated API key from the Subscriptions page
5. Make API requests using the key:

```bash
# This should succeed (within free tier quota)
curl -H "Authorization: Bearer {CUSTOMER_API_KEY}" \
  https://your-api.zuplo.dev/api/v1/characters

# After 1,000 requests, this should return 403 Forbidden
curl -H "Authorization: Bearer {CUSTOMER_API_KEY}" \
  https://your-api.zuplo.dev/api/v1/characters
```

6. Upgrade to the Pro plan via the Developer Portal to verify the plan change
   flows through Stripe and updates the customer's quota in real time.

## Next steps

- **[Meters](./meters.mdx)**, **[Features](./features.mdx)**,
  **[Plans](./plans.mdx)**, **[Rate Cards](./rate-cards.mdx)** — Understand the
  core monetization primitives in depth
- **[Billing Models Guide](./billing-models.md)** — Choose the right pricing
  strategy for your API
- **[Monetization Policy Reference](./monetization-policy.md)** — Advanced
  policy configuration (multi-meter, selective metering, dynamic metering)
- **[Subscription Lifecycle](./subscription-lifecycle.md)** — Manage trials,
  upgrades, downgrades, and cancellations
