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

A subscription's lifecycle status is computed from its `activeFrom`/`activeTo`
window — it is not a stored field, and transitions happen automatically as time
passes. The four possible values reflect lifecycle only; payment status is
tracked separately (see the note below).

| Status      | API access | Description                                                         |
| ----------- | ---------- | ------------------------------------------------------------------- |
| `active`    | Yes        | Currently in effect with no scheduled end                           |
| `canceled`  | Yes        | Scheduled to end at a future date; access continues until that date |
| `inactive`  | No         | Has ended, or was canceled before becoming active                   |
| `scheduled` | No         | Has not yet started — `activeFrom` is in the future                 |

When a customer cancels a subscription with `next_billing_cycle` timing, its
status flips from `active` to `canceled` immediately (with `activeTo` set to the
period end). The customer keeps access throughout the `canceled` window, and the
status transitions to `inactive` once `activeTo` passes. A subscription in the
`canceled` state can be reactivated — see [Reactivation](#reactivation) below.

:::note

Access is also governed by payment status, which is tracked separately. If a
payment is overdue beyond the grace period (default 3 days), access is blocked
even for `active` subscriptions. The grace period is configurable per-customer,
per-plan, or per-bucket — see
[Subscription and payment validation](./monetization-policy.md#subscription-and-payment-validation).

In the Zuplo admin UI, lifecycle status and payment status are combined into
derived display labels such as "Access Blocked" or "Payment Failed" to surface
the effective state at a glance. In the Developer Portal, a subscription with a
future `activeTo` (whether `active` or `canceled`) is shown with an "Expiring"
badge and the upcoming end date.

:::

## Creating subscriptions

### Self-serve (Developer Portal)

The standard path. Customer signs up in the Developer Portal, picks a plan,
completes Stripe Checkout, and gets their API key immediately.

1. Customer visits the pricing page
2. Clicks "Subscribe" on their chosen plan
3. Completes Stripe Checkout (enters payment details)
4. Returns to the Developer Portal to review the subscription summary
5. Clicks "Confirm & Subscribe" to finalize
6. Subscription is active, API key is generated

### Programmatic (API)

Create subscriptions directly via the API for cases where the checkout happens
outside the Developer Portal (custom frontend, sales-assisted onboarding,
internal tooling):

```bash
curl -X POST https://dev.zuplo.com/v3/metering/{bucketId}/subscriptions \
  -H "Authorization: Bearer {API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "plan": { "key": "pro" },
    "customerId": "01J9ZX2A8R0K8H6VG2C1A0K3WP"
  }'
```

`plan` references the target plan by its `key` (and optionally `version`).
Provide either `customerId` (the metering customer ULID, format
`^[0-7][0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{25}$`) or `customerKey` (your own
identifier). Optional fields include `timing` (`"immediate"` by default,
`"next_billing_cycle"`, or an RFC 3339 timestamp), `startingPhase`, `name`,
`description`, `metadata`, `alignment`, and `billingAnchor`.

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
          "key": "api_requests",
          "name": "API Calls",
          "featureKey": "api_requests",
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
          "key": "api_requests",
          "name": "API Calls",
          "featureKey": "api_requests",
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

What happens if the customer cancels during the trial depends on whether the
trial phase has billable rate cards:

- **Free trial** (no priced rate cards in the trial phase, like the example
  above): access ends immediately, no payment is charged, and the trial does not
  convert to the paid phase. Cancellation cannot defer to a billing-cycle end
  because the trial phase has nothing to bill
- **Paid trial** (the trial phase has a price, e.g., a $1 introductory rate):
  access continues until the end of the trial period (default
  `next_billing_cycle` timing), the trial fee is billed on the final invoice,
  and the trial does not convert to the subsequent paid phase

## Plan changes (upgrades and downgrades)

### Customer-initiated (Developer Portal)

Customers can change plans from the **Manage Subscription** section in the
Developer Portal:

1. Customer clicks "Switch Plan" on their active subscription
2. Sees available plans with pricing comparison
3. Selects the new plan
4. Stripe handles proration (charge or credit the difference)
5. For an upgrade, new entitlements take effect immediately; for a downgrade,
   they apply at the next billing cycle
6. The API key stays the same

### Programmatic (API)

Plan changes go through the dedicated `change` endpoint, which closes the
current subscription and starts a new one on the target plan:

```bash
curl -X POST https://dev.zuplo.com/v3/metering/{bucketId}/subscriptions/{subscriptionId}/change \
  -H "Authorization: Bearer {API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "timing": "immediate",
    "plan": { "key": "enterprise" }
  }'
```

`timing` accepts `"immediate"`, `"next_billing_cycle"`, or an RFC 3339
timestamp. Optional fields include `startingPhase`, `name`, `description`,
`metadata`, `alignment`, and `billingAnchor`. To preview the proration credit
before committing, call
`POST /v3/metering/{bucketId}/subscriptions/{subscriptionId}/change/estimate-credit`
with the same body.

### Proration behavior

When a customer changes plans mid-billing-period, Zuplo uses
**max_consumption_based proration** to calculate a fair credit from the old
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
- No proration credit is issued. The customer keeps the higher-tier entitlements
  for the remainder of the current cycle they already paid for.

**Example:** A customer on Starter ($29/month, 10,000 requests) upgrades to Pro
on day 15 of a 30-day period, having used 7,000 requests.

| Factor             | Value          |
| ------------------ | -------------- |
| Time elapsed       | 50% (15 / 30)  |
| Quota consumed     | 70% (7K / 10K) |
| Max of the two     | 70%            |
| **Credit applied** | **$8.70**      |

The credit amount is calculated once at the moment of the plan change. It is
applied as a line-item discount on the next invoice's upfront flat-fee line. If
the credit exceeds that line's amount, the remainder cascades onto subsequent
invoices in chronological order until it is fully consumed.

### Quota on plan change

Each subscription tracks its own quota independently. When a customer changes
plans, a brand-new subscription is created and its entitlement starts measuring
usage from the switch time — usage from the previous plan does not count against
the new plan's quota.

Walking through the example above: a customer used 8,000 of their 10,000-request
Starter quota in the first 15 days. After upgrading to Pro on day 15, the
customer has the full 50,000-request Pro quota available from day 15 onward,
regardless of how much was used on Starter. The 8,000 stays attributed to the
Starter subscription for billing purposes only.

Gaming via short-lived upgrades is constrained by two other mechanisms:

- Downgrades take effect at the next billing cycle (not immediately), so a
  customer cannot briefly upgrade and immediately downgrade to grab a fresh
  quota.
- Max-consumption-based proration issues zero refund when the old plan's quota
  was already mostly consumed (see [Proration behavior](#proration-behavior)
  above), so paying for a short-lived upgrade is not economical.

## Cancellation

### Customer-initiated

Customers can cancel from the **Manage Subscription** section in the Developer
Portal:

1. Customer clicks "Cancel Subscription"
2. Confirmation dialog explains what happens
3. Cancellation is scheduled for the end of the current billing period
4. Customer retains full access until the period ends
5. At period end, access is revoked and the API key stops working

For free plans and subscriptions still in their free trial phase, cancellation
is immediate — there are no billable items left to consume, so end-of-period
behavior does not apply.

### Programmatic cancellation

```bash
curl -X POST https://dev.zuplo.com/v3/metering/{bucketId}/subscriptions/{subscriptionId}/cancel \
  -H "Authorization: Bearer {API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "timing": "next_billing_cycle"
  }'
```

`timing` controls when the cancellation takes effect:

- Omitted (or `"immediate"`) — the subscription is canceled immediately and
  access stops right away. Use this for refund-style flows.
- `"next_billing_cycle"` — access continues until the end of the current billing
  period, then is revoked. This matches the Developer Portal default.
- An RFC 3339 timestamp — schedule cancellation at a specific time.

### Cancellation behavior

| Scenario                                 | Default behavior                            |
| ---------------------------------------- | ------------------------------------------- |
| Active subscription canceled             | Access until period end, then revoked       |
| Free trial or free subscription canceled | Access ends immediately, no payment charged |
| Subscription with overage                | Overage billed on final invoice             |

## Reactivation

A canceled subscription (scheduled for end-of-period) can be reactivated before
the period ends:

```bash
curl -X POST https://dev.zuplo.com/v3/metering/{bucketId}/subscriptions/{subscriptionId}/unschedule-cancelation \
  -H "Authorization: Bearer {API_KEY}"
```

This removes the pending cancellation. The subscription continues as normal. For
a subscription whose period has already ended, create a new subscription on the
same plan instead.

## Subscriptions per customer

By default, each customer can hold one active subscription at a time. The
Developer Portal returns `409 Conflict` ("the maximum number of active
subscriptions has been reached") when a customer tries to subscribe while
another subscription is still active or pending cancellation — a subscription in
the `canceled` wind-down state still counts toward the cap.

Multi-subscription support is available on request. Contact
[sales@zuplo.com](mailto:sales@zuplo.com) to enable it for your bucket if you
need scenarios like:

- A primary monthly subscription plus a credit pack top-up
- Separate subscriptions for different API products
- A team subscription and a personal subscription

Each subscription is bound to its own consumer record and its own API key, both
generated when the subscription is created. When a customer holds multiple
subscriptions, they use the appropriate key for each.
