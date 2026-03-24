---
title: Billing Models Guide
sidebar_label: Billing Models
---

Zuplo supports four billing models, each targeting different business needs. You
can mix models on the same pricing page and even within the same plan.

## Fixed monthly quotas

The most common API monetization model. The customer pays a flat monthly price
and gets a fixed number of requests (or other metered units). When the quota is
exhausted, the API returns `403 Forbidden` until the next billing period.

**When to use:** Predictable revenue, simple to explain, works for most B2B SaaS
APIs.

**How customers experience it:** They subscribe, get their API key, and use the
API until their quota runs out. Clear and predictable for budgeting.

### Example: Three-tier SaaS pricing

**Free tier:**

```json
{
  "key": "free",
  "name": "Free",
  "currency": "USD",
  "billingCadence": "P1M",
  "phases": [
    {
      "key": "default",
      "name": "Free",
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
}
```

**Starter — $29/mo, 10,000 requests:**

```json
{
  "key": "starter",
  "name": "Starter",
  "currency": "USD",
  "billingCadence": "P1M",
  "phases": [
    {
      "key": "default",
      "name": "Starter Monthly",
      "duration": null,
      "rateCards": [
        {
          "type": "flat_fee",
          "key": "api_calls",
          "name": "API Calls",
          "featureKey": "api_calls",
          "billingCadence": "P1M",
          "price": {
            "type": "flat",
            "amount": "29.00"
          },
          "entitlementTemplate": {
            "type": "metered",
            "issueAfterReset": 10000,
            "isSoftLimit": false
          }
        }
      ]
    }
  ]
}
```

**Pro — $99/mo, 100,000 requests:**

```json
{
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
          "type": "flat_fee",
          "key": "api_calls",
          "name": "API Calls",
          "featureKey": "api_calls",
          "billingCadence": "P1M",
          "price": {
            "type": "flat",
            "amount": "99.00"
          },
          "entitlementTemplate": {
            "type": "metered",
            "issueAfterReset": 100000,
            "isSoftLimit": false
          }
        }
      ]
    }
  ]
}
```

**Stripe behavior:** Subscription created with a fixed-price line item. Payment
charged in advance at the start of each billing period.

## Pay-as-you-go

:::caution{title="Coming Soon"}

Pay-as-you-go billing is supported by the underlying monetization models, but
the developer portal pricing table experience has not been fully tested for this
billing model yet. If you need pure pay-as-you-go pricing, contact
[support](mailto:support@zuplo.com) to discuss your use case.

:::

No upfront commitment. The customer provides a credit card, uses the API as much
as they want, and is billed monthly in arrears for actual usage.

**When to use:** Low barrier to entry, usage-based AI APIs, developer tools
where usage is unpredictable.

**How customers experience it:** They sign up, add a payment method, and only
pay for what they use. No quota limits, no hard caps.

### Example: Per-request billing

```json
{
  "key": "paygo",
  "name": "Pay As You Go",
  "currency": "USD",
  "billingCadence": "P1M",
  "phases": [
    {
      "key": "default",
      "name": "Usage-Based",
      "duration": null,
      "rateCards": [
        {
          "type": "usage_based",
          "key": "api_calls",
          "name": "API Calls",
          "featureKey": "api_calls",
          "billingCadence": "P1M",
          "price": {
            "type": "unit",
            "amount": "0.10"
          },
          "entitlementTemplate": {
            "type": "metered",
            "isSoftLimit": true
          }
        }
      ]
    }
  ]
}
```

Setting `isSoftLimit: true` with no `issueAfterReset` means there is no included
quota and no hard limit — everything is billed per-unit.

### Example: Graduated per-request billing (volume discount)

```json
{
  "key": "paygo-graduated",
  "name": "Pay As You Go",
  "currency": "USD",
  "billingCadence": "P1M",
  "phases": [
    {
      "key": "default",
      "name": "Usage-Based",
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
                "upToAmount": "10000",
                "unitPrice": { "type": "unit", "amount": "0.10" }
              },
              {
                "upToAmount": "100000",
                "unitPrice": { "type": "unit", "amount": "0.05" }
              },
              {
                "upToAmount": null,
                "unitPrice": { "type": "unit", "amount": "0.01" }
              }
            ]
          },
          "entitlementTemplate": {
            "type": "metered",
            "isSoftLimit": true
          }
        }
      ]
    }
  ]
}
```

**Stripe behavior:** Subscription with usage-based billing. Usage is tracked
continuously and billed through the integrated billing system at the end of each
period.

**Risk consideration:** Pay-as-you-go means you're extending credit. If a
customer racks up significant usage and their card declines at invoicing time,
you absorb the loss. Consider setting a hard entitlement limit as a spending cap
if this concerns you.

## Monthly quotas with overages

A hybrid model combining the predictability of fixed quotas with the flexibility
of usage-based billing. The customer pays a fixed monthly price for a base
allowance. If they exceed it, overage is billed per-unit in arrears.

**When to use:** Enterprise APIs, weather data services, any API where you want
guaranteed revenue with upside on heavy usage.

**How customers experience it:** They get a known base cost for budgeting, with
the ability to burst beyond their quota without service interruption.

### Example: Enterprise API with overage

Overage is modeled as graduated tiered pricing. The first tier covers the
included allowance at a flat price, and subsequent tiers charge per-unit for
overage:

```json
{
  "key": "enterprise",
  "name": "Enterprise",
  "currency": "USD",
  "billingCadence": "P1M",
  "phases": [
    {
      "key": "default",
      "name": "Enterprise Monthly",
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
                "upToAmount": "1000000",
                "flatPrice": { "type": "flat", "amount": "499.00" },
                "unitPrice": null
              },
              {
                "flatPrice": null,
                "unitPrice": { "type": "unit", "amount": "0.05" }
              }
            ]
          },
          "entitlementTemplate": {
            "type": "metered",
            "issueAfterReset": 1000000,
            "isSoftLimit": true
          }
        }
      ]
    }
  ]
}
```

$499/month for 1,000,000 requests. Requests beyond 1M are billed at $0.05 each.
A customer using 1,200,000 requests pays $499 + (200,000 x $0.05) = $499 + $100
= $599.

### Example: Graduated overage pricing

For high-volume APIs, you might want overage pricing that decreases at scale:

```json
{
  "key": "enterprise",
  "name": "Enterprise",
  "currency": "USD",
  "billingCadence": "P1M",
  "phases": [
    {
      "key": "default",
      "name": "Enterprise Monthly",
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
                "upToAmount": "1000000",
                "flatPrice": { "type": "flat", "amount": "499.00" },
                "unitPrice": null
              },
              {
                "upToAmount": "5000000",
                "unitPrice": { "type": "unit", "amount": "0.05" }
              },
              {
                "unitPrice": { "type": "unit", "amount": "0.02" }
              }
            ]
          },
          "entitlementTemplate": {
            "type": "metered",
            "issueAfterReset": 1000000,
            "isSoftLimit": true
          }
        }
      ]
    }
  ]
}
```

**Stripe behavior:** Subscription with both a fixed-price component (advance
payment) and a usage-based component (arrears). Usage is tracked and billed
through the integrated billing system.

## Credits / tokens (prepaid)

Customers buy credit bundles in advance. Each API call (or token, or byte)
consumes a defined number of credits. When credits are exhausted, service stops
until the customer tops up.

**When to use:** AI APIs, marketplaces, any service where customers want to buy
in bulk at a discount and burn down over time.

**How customers experience it:** They buy a credit pack, use the API until
credits run out, then buy more. No ongoing subscription commitment.

### Example: AI token credit packs

**Small pack:**

```json
{
  "key": "credits-small",
  "name": "50,000 Credits",
  "currency": "USD",
  "billingCadence": null,
  "phases": [
    {
      "key": "default",
      "name": "Credit Pack",
      "duration": null,
      "rateCards": [
        {
          "type": "usage_based",
          "key": "api_credits",
          "name": "API Credits",
          "featureKey": "api_credits",
          "billingCadence": null,
          "price": {
            "type": "package",
            "amount": "49.00",
            "quantityPerPackage": 50000
          },
          "entitlementTemplate": {
            "type": "metered",
            "issueAfterReset": 50000,
            "isSoftLimit": false
          }
        }
      ]
    }
  ]
}
```

**Large pack (better per-credit rate):**

```json
{
  "key": "credits-large",
  "name": "500,000 Credits",
  "currency": "USD",
  "billingCadence": null,
  "phases": [
    {
      "key": "default",
      "name": "Credit Pack",
      "duration": null,
      "rateCards": [
        {
          "type": "usage_based",
          "key": "api_credits",
          "name": "API Credits",
          "featureKey": "api_credits",
          "billingCadence": null,
          "price": {
            "type": "package",
            "amount": "299.00",
            "quantityPerPackage": 500000
          },
          "entitlementTemplate": {
            "type": "metered",
            "issueAfterReset": 500000,
            "isSoftLimit": false
          }
        }
      ]
    }
  ]
}
```

**Credit mapping:** Credits are arbitrary units. You define how many credits
each API operation consumes via the `MonetizationInboundPolicy` meter
configuration:

```json
// Simple: 1 credit per request
{ "meters": { "api_credits": 1 } }

// Weighted: different endpoints consume different credits
// (configure separate policies per route)
// /v1/simple-lookup -> 1 credit
{ "meters": { "api_credits": 1 } }
// /v1/ai-analysis -> 10 credits
{ "meters": { "api_credits": 10 } }
```

**Stripe behavior:** One-time payment for the credit pack. Credit balance is
tracked internally. Customers can purchase additional packs at any time
(top-ups).

## Mixing models on one pricing page

You can offer multiple billing models simultaneously. A common pattern:

| Tier         | Model           | Configuration                                             |
| ------------ | --------------- | --------------------------------------------------------- |
| Free         | Fixed quota     | 1,000 requests/month, hard limit, no credit card required |
| Starter      | Fixed quota     | 10,000 requests/month, $29/month, hard limit              |
| Pro          | Quota + overage | 100,000 requests/month, $99/month, $0.001/request overage |
| Enterprise   | Pay-as-you-go   | Volume-discounted per-request pricing, custom terms       |
| Credit Packs | Prepaid credits | Buy 50K/$49, 500K/$299, 5M/$1,999                         |

Each is a separate plan in Zuplo. The Developer Portal displays them together on
the pricing page, and customers choose the model that fits their usage pattern.

## Choosing the right model

| Factor                          | Fixed Quota   | Pay-as-you-go  | Quota + Overage | Credits          |
| ------------------------------- | ------------- | -------------- | --------------- | ---------------- |
| Revenue predictability          | High          | Low            | Medium          | Medium           |
| Customer budget clarity         | High          | Low            | High            | High             |
| Barrier to entry                | Medium        | Low            | Medium          | Low              |
| Revenue upside from heavy users | None          | High           | High            | Medium           |
| Payment risk                    | Low (advance) | High (arrears) | Medium          | None (prepaid)   |
| Best for                        | SaaS APIs     | Dev tools, AI  | Enterprise      | AI, marketplaces |
