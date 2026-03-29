---
title: Subscription Lifecycle
sidebar_label: Subscription Lifecycle
---

:::note{title="Beta"}

API Monetization is in beta and free to try. The APIs are stable but should be
evaluated in non-production environments first. To go to production, contact
[sales@zuplo.com](mailto:sales@zuplo.com). Production pricing has not yet been
announced.

:::

This guide covers the full lifecycle of a customer subscription: creation,
trials, upgrades, downgrades, cancellation, and reactivation.

## Subscription states

| Status      | API access | Description                                       |
| ----------- | ---------- | ------------------------------------------------- |
| `active`    | Yes        | Subscription is active and payment is current     |
| `inactive`  | No         | Subscription is not yet active or was deactivated |
| `canceled`  | No         | Subscription has been canceled                    |
| `scheduled` | No         | Subscription is scheduled for future activation   |

:::note

Access is also governed by payment status. If a payment is overdue beyond the
grace period (default 3 days, configurable via `zuplo_max_payment_overdue_days`
metadata), access is blocked even for active subscriptions.

:::

## Creating subscriptions

### Self-serve (Developer Portal)

The standard path. Customer signs up in the Developer Portal, picks a plan,
completes Stripe Checkout, and gets their API key immediately.

1. Customer visits the pricing page
2. Clicks "Subscribe" on their chosen plan
3. Completes Stripe Checkout (enters payment details)
4. Redirected back to the Developer Portal
5. Subscription is active, API key is generated

### Programmatic (API)

Create subscriptions directly via the API for cases where the checkout happens
outside the Developer Portal (custom frontend, sales-assisted onboarding,
internal tooling):

```bash
curl -X POST https://dev.zuplo.com/v3/metering/{bucketId}/subscriptions \
  -H "Authorization: Bearer {API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "cus_abc123",
    "planKey": "pro",
    "stripeCustomerId": "cus_stripe_xyz"
  }'
```

The `customerId` is the user's identifier in your auth system (Auth0 user ID,
etc.). The `stripeCustomerId` is the customer's ID in Stripe.

## Free trials

Trials are modeled as the first phase of a multi-phase plan. No special trial
API is needed.

### How trials work

1. Customer subscribes to a plan that has a trial phase
2. The subscription is activated with the trial phase's entitlements (e.g.,
   1,000 requests)
3. When the trial phase duration expires:
   - The subscription transitions to the next phase (the paid phase)
   - Stripe charges the customer for the first paid period
   - Entitlements update to the paid phase's rate cards
4. If payment fails at trial end, access depends on the payment grace period
   configuration

### Trial configuration example

**14-day trial with automatic conversion to paid:**

```json
{
  "key": "pro-trial",
  "name": "Pro with Free Trial",
  "currency": "USD",
  "billingCadence": "P1M",
  "phases": [
    {
      "key": "trial",
      "name": "14-Day Free Trial",
      "duration": "P2W",
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
    },
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
        }
      ]
    }
  ]
}
```

This plan gives customers a 14-day trial with 1,000 requests (hard limit, no
billing). When the trial ends, they automatically transition to the paid Pro
phase at $99/month with 50,000 requests and overage billing. No cron jobs, no
webhook handlers, no transition code.

### What happens when a trial expires

If the plan has a paid phase after the trial:

- Stripe charges the customer automatically
- On success: subscription transitions to the paid phase with paid entitlements
- On failure: access depends on the payment grace period configuration

If the customer cancels during the trial:

- They retain trial access until the trial period ends
- No payment is charged
- After the trial period, access is revoked

## Plan changes (upgrades and downgrades)

### Customer-initiated (Developer Portal)

Customers can change plans from the Subscriptions page in the Developer Portal:

1. Customer clicks "Change Plan" on their active subscription
2. Sees available plans with pricing comparison
3. Selects the new plan
4. Stripe handles proration (charge or credit the difference)
5. Entitlements update immediately — the customer's quota changes in real time
6. The API key stays the same

### Programmatic (API)

```bash
curl -X PATCH https://dev.zuplo.com/v3/metering/{bucketId}/subscriptions/{subscriptionId} \
  -H "Authorization: Bearer {API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "planKey": "enterprise"
  }'
```

### Proration behavior

When a customer changes plans mid-billing-period, Zuplo uses
**max-consumption-based proration** to calculate a fair credit from the old
plan. Instead of only considering how much time has passed, the system looks at
both elapsed time and actual quota usage, then uses whichever is greater.

This prevents situations where a customer consumes most of their quota early in
the billing period, switches plans, and receives a large time-based credit that
does not reflect their actual usage.

**Upgrade (e.g., Starter → Pro):**

- New entitlements take effect immediately
- A proration credit from the old plan appears as a line-item discount on the
  new plan's invoice

**Downgrade (e.g., Pro → Starter):**

- New (lower) entitlements take effect at the next billing cycle
- A proration credit from the old plan is applied as a discount on the next
  invoice

**Example:** A customer on Starter ($29/month, 10,000 requests) upgrades to Pro
on day 15 of a 30-day period, having used 7,000 requests.

| Factor             | Value          |
| ------------------ | -------------- |
| Time elapsed       | 50% (15 / 30)  |
| Quota consumed     | 70% (7K / 10K) |
| Max of the two     | 70%            |
| **Credit applied** | **$8.70**      |

The credit is applied once and is not carried forward to future billing cycles.

### Quota reset on plan change

When a customer changes plans, the quota usage counter does **not** reset. If a
customer used 8,000 of their 10,000-request Starter quota and upgrades to Pro
(50,000 requests), they have 42,000 remaining for the current period — not
50,000.

This prevents gaming where a customer uses up their starter quota, upgrades
momentarily, and immediately downgrades.

## Cancellation

### Customer-initiated

Customers can cancel from the Developer Portal subscriptions page:

1. Customer clicks "Cancel Subscription"
2. Confirmation dialog explains what happens
3. Cancellation is scheduled for the end of the current billing period
4. Customer retains full access until the period ends
5. At period end, access is revoked and the API key stops working

### Programmatic cancellation

```bash
curl -X POST https://dev.zuplo.com/v3/metering/{bucketId}/subscriptions/{subscriptionId}/cancel \
  -H "Authorization: Bearer {API_KEY}"
```

### Cancellation behavior

| Scenario                     | Default behavior                           |
| ---------------------------- | ------------------------------------------ |
| Active subscription canceled | Access until period end, then revoked      |
| Trial subscription canceled  | Access until trial end, no payment charged |
| Subscription with overage    | Overage billed on final invoice            |

## Reactivation

A canceled subscription (scheduled for end-of-period) can be reactivated before
the period ends:

```bash
curl -X POST https://dev.zuplo.com/v3/metering/{bucketId}/subscriptions/{subscriptionId}/unschedule-cancelation \
  -H "Authorization: Bearer {API_KEY}"
```

This removes the pending cancellation. The subscription continues as normal.

A fully canceled subscription (past the period end) can be restored:

```bash
curl -X POST https://dev.zuplo.com/v3/metering/{bucketId}/subscriptions/{subscriptionId}/restore \
  -H "Authorization: Bearer {API_KEY}"
```

## Multiple subscriptions

A customer can hold multiple active subscriptions simultaneously. This supports
scenarios like:

- A primary monthly subscription plus a credit pack top-up
- Separate subscriptions for different API products
- A team subscription and a personal subscription

Each subscription generates its own API key. The customer uses the appropriate
key for each use case.
