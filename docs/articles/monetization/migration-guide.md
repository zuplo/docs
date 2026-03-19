---
title: Migration from V1 (Stripe Monetization Plugin)
sidebar_label: Migration Guide
---

The original Stripe Monetization Plugin (`StripeMonetizationPlugin`) was sunset
on November 15, 2025. This guide walks you through migrating to the new Zuplo
API Monetization system.

## What changed

| Aspect                | V1 (Stripe Plugin)                                    | V3 (Zuplo Monetization)                                     |
| --------------------- | ----------------------------------------------------- | ----------------------------------------------------------- |
| **Metering**          | Relied on Stripe to track usage                       | Built-in metering engine in the gateway                     |
| **Plan definition**   | Stripe Products and Prices were the source of truth   | Plans defined in Zuplo with Stripe as the payment processor |
| **Quota enforcement** | Required separate rate-limiting configuration         | Integrated into the monetization policy                     |
| **Developer Portal**  | Stripe Pricing Tables embedded in the portal          | Native pricing pages built into Zudoku                      |
| **Webhook handling**  | Auto-configured route at `/__plugins/stripe/webhooks` | Handled automatically                                       |
| **Policy**            | `StripeMonetizationPlugin` (plugin model)             | `MonetizationInboundPolicy` (policy model)                  |
| **Configuration**     | Code-first in `zuplo.runtime.ts`                      | Declarative in `policies.json` + API/Portal UI              |
| **Billing models**    | Fixed monthly only                                    | Fixed, pay-as-you-go, overage, and credits                  |
| **Authentication**    | Required separate `api-key-auth` policy               | Built into the monetization policy                          |

## Migration steps

### Step 1: Inventory your current setup

Before migrating, document your V1 configuration:

**Stripe Products and Prices:**

- List all Stripe Products that map to your API plans
- Note each Product's Price (amount, currency, billing interval)
- Note any metadata on the Products that Zuplo uses

**Plugin configuration:**

- Find your `StripeMonetizationPlugin` configuration in `zuplo.runtime.ts`
- Note the `stripeSecretKey`, `webhookSigningSecret`, and `products` mapping
- Document any custom webhook handlers

**Routes:**

- Identify which routes have the monetization plugin applied
- Note any per-route configuration differences

### Step 2: Create meters

For each usage dimension you're currently tracking, create a meter:

```bash
curl -X POST https://dev.zuplo.com/v3/metering/{bucketId}/meters \
  -H "Authorization: Bearer {API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "api_requests",
    "name": "API Requests",
    "eventType": "api_request",
    "aggregation": "COUNT"
  }'
```

V1 only supported request counting. If you want to add token metering or
bandwidth metering, create additional meters now.

### Step 3: Create features

Create a feature for each meter:

```bash
curl -X POST https://dev.zuplo.com/v3/metering/{bucketId}/features \
  -H "Authorization: Bearer {API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "key": "api_calls",
    "name": "API Calls",
    "meterSlug": "api_requests"
  }'
```

Create static features for any capability toggles (Priority Support, Advanced
Analytics, etc.) that differentiate your plans.

### Step 4: Recreate plans

Map each Stripe Product to a new Zuplo plan. Here's how V1 concepts translate:

**V1 configuration (example):**

```typescript
// zuplo.runtime.ts (V1)
new StripeMonetizationPlugin({
  stripeSecretKey: env.STRIPE_SECRET_KEY,
  webhookSigningSecret: env.STRIPE_WEBHOOK_SECRET,
  products: {
    prod_free: { requests: 1000 },
    prod_starter: { requests: 10000 },
    prod_pro: { requests: 100000 },
  },
});
```

**V3 equivalent:**

Free plan:

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

Starter plan:

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

Create each plan via the API or Portal UI, then publish.

### Step 5: Connect Stripe (new connection)

Even if you had Stripe connected in V1, you need to establish a new connection:

1. Navigate to **Settings → Monetization → Billing**
2. Click **Connect Stripe Account**
3. Authorize the same Stripe account you were using
4. New Stripe Products and Prices are created corresponding to your V3 plans

:::note

The new Stripe Products are separate from your V1 Products. Your existing V1
Products remain in Stripe and continue to work for existing subscribers until
you migrate them.

:::

### Step 6: Replace the policy

Remove the V1 plugin and add the V3 policy.

**Remove from `zuplo.runtime.ts`:**

```typescript
// DELETE THIS
import { StripeMonetizationPlugin } from "@zuplo/runtime";

export default new StripeMonetizationPlugin({...});
```

**Add to `policies.json`:**

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

**Update your routes** to reference the new policy. The monetization policy
handles authentication, so remove any separate `api-key-auth` policy:

```json
{
  "x-zuplo-route": {
    "policies": {
      "inbound": ["monetization-inbound"]
    }
  }
}
```

### Step 7: Update the Developer Portal

If you were using Stripe Pricing Tables in V1, switch to the native monetization
portal:

1. Remove any Stripe Pricing Table embeds from your portal configuration
2. Enable monetization in **Developer Portal → Settings → Monetization**
3. Configure plan display order
4. Test the pricing page, subscribe flow, and usage dashboard

### Step 8: Migrate existing subscribers

Existing V1 subscribers have Stripe subscriptions tied to the old Products. You
have two options:

**Option A: Let existing subscriptions run out naturally**

Keep V1 Products active in Stripe. Existing subscribers continue on their
current plans until they cancel or you sunset them. New subscribers use the V3
system.

This is the lowest-risk approach and works if your V1 subscriber base is small.

**Option B: Migrate subscriptions programmatically**

For each existing subscriber:

1. Create a V3 subscription via the API, linking to their existing Stripe
   customer
2. Update the Stripe subscription to use the new V3 Products/Prices
3. Verify the migration by checking quota and access

```bash
curl -X POST https://dev.zuplo.com/v1/metering/{bucketId}/subscriptions \
  -H "Authorization: Bearer {API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "{AUTH0_USER_ID}",
    "planKey": "pro",
    "stripeCustomerId": "{STRIPE_CUSTOMER_ID}",
    "stripeSubscriptionId": "{EXISTING_STRIPE_SUBSCRIPTION_ID}"
  }'
```

:::caution

Test this with a single subscriber first, then batch migrate the rest.

:::

### Step 9: Clean up

After all subscribers are migrated:

1. Archive V1 Products in Stripe
2. Remove any V1-specific webhook endpoints
3. Delete the `StripeMonetizationPlugin` import from your codebase
4. Remove unused environment variables (`STRIPE_WEBHOOK_SECRET`, etc.)

## Key differences to be aware of

### Authentication is built in

In V1, the monetization plugin required a separate `api-key-auth` policy for
authentication. In V3, the `MonetizationInboundPolicy` handles API key
authentication internally. Remove standalone `api-key-auth` policies from
monetized routes.

### API keys are scoped to subscriptions

In V1, API keys existed independently from subscriptions, causing confusion. In
V3, each subscription generates its own API key. When a subscription is
canceled, its key stops working. When a customer upgrades, the same key gets the
new plan's entitlements.

This means your customers' API keys will change during migration if you create
new V3 subscriptions. Communicate this change to affected customers in advance.

### Quota enforcement is built in

V1 required separate rate-limiting policies alongside the monetization plugin.
V3 handles quota enforcement natively via the `MonetizationInboundPolicy`. You
can remove standalone rate-limiting policies that were serving as quota
enforcement.

If you still want per-second or per-minute rate limiting on top of monthly
quotas, keep those policies — they serve a different purpose (spike protection
vs. billing quota).

### Plans are versioned

V1 didn't version plans — changing a Stripe Price affected everyone. V3 versions
plans so existing subscribers keep their original pricing. This is better for
your customers, but means you need to be intentional about when to publish plan
updates.

## Rollback plan

If the migration encounters issues:

1. The V1 plugin can be re-added to `zuplo.runtime.ts` alongside V3
2. Routes can point to either the V1 plugin or V3 policy
3. Stripe Products from both versions can coexist
4. Customer API keys from V1 continue to work if the V1 plugin is still active

This gives you a safe migration path where both systems can run in parallel
during the transition.
