---
title: Going to Production with Monetization
sidebar_label: Going to Production
---

:::note{title="Beta"}

API Monetization is in beta and free to try. The APIs are stable but should be
evaluated in non-production environments first. To go to production, contact
[sales@zuplo.com](mailto:sales@zuplo.com). Production pricing has not yet been
announced.

:::

You have built out your monetization configuration in Stripe test mode and your
customers are ready to pay real money. This guide covers:

- The **pre-production checklist** — eight items to verify before enabling real
  charges
- **Billing model readiness** — which pricing models are production-ready today
- **Stripe live-mode cutover** — step-by-step instructions to connect live
  payments
- **Beta limitations** — constraints to design around before launch

## Before you start

Going to production with monetization requires coordination with the Zuplo team.
The monetization feature is currently in **public beta** — the APIs are stable
and the core billing flows work end-to-end, but production pricing for the
monetization feature itself has not yet been announced.

**To go live, email [sales@zuplo.com](mailto:sales@zuplo.com)** with:

- Your account slug and project slug
- The Stripe account ID you plan to use in production
- Your target go-live date
- A summary of your pricing model (flat-fee, overages, pay-as-you-go, etc.)

The Zuplo team will confirm your configuration, walk you through any
beta-specific considerations for your use case, and enable your production
bucket for live billing.

## Pre-production checklist

Work through each item before enabling real charges. Every step below links to
the relevant documentation for the details.

### 1. Authentication provider verified

Your Developer Portal must have an authentication provider configured so that
customers can sign in, subscribe, and manage their API keys. Verify that your
auth provider (Auth0, Clerk, or a custom OpenID Connect provider) works
correctly across all environments — working copy, preview, and production.

See
[Developer Portal Setup → Prerequisites](./developer-portal.md#prerequisites)
for details.

### 2. Meters, features, and plans configured

Confirm that your production bucket has the same meters, features, and plans you
tested in your working-copy or preview bucket. Monetization configuration is
scoped per-bucket, so you must recreate it in production — it does not
automatically promote between environments.

Key checks:

- **Meter keys match policy configuration.** The meter `slug`/`eventType`, the
  feature `key`, and the `meters` map in your `MonetizationInboundPolicy` must
  all use the same key. See
  [Meters → Naming Consistency](./meters.mdx#naming-consistency).
- **Plans are published.** Draft plans are not visible to customers. Publish
  each plan from the Monetization Service in the Zuplo Portal.
- **Currency is correct.** Plans support any ISO 4217 currency code (USD, EUR,
  AUD, GBP, etc.). Verify the `currency` field on every plan — you cannot change
  it after customers subscribe.
- **Plan ordering is set.** The
  [monetization configuration](./api-access.mdx#bucket-monetization-configuration)
  `planOrder` array controls both the pricing page display order and
  upgrade/downgrade logic. Make sure it reflects your intended tier hierarchy.

### 3. Stripe live-mode connected

Your production environment must use a Stripe **live** key (`sk_live_*` or
`rk_live_*`). Test keys and live keys are completely separate environments in
Stripe — customers, invoices, and payment methods created in test mode do not
exist in live mode.

For production, use a **restricted key** (`rk_live_*`) rather than a secret key.
A restricted key follows the principle of least privilege. See
[Using a Stripe restricted key](./stripe-integration.md#using-a-stripe-restricted-key)
for the exact eight permissions your key needs.

:::caution

Use one Stripe key type per Zuplo environment. Do not replace a test key with a
live key in the same environment. Zuplo rejects a live key on a non-production
bucket and a test key on a production bucket.

:::

### 4. Billing profile configured

Every bucket that processes payments needs a default billing profile. The
billing profile is created automatically when you connect Stripe, but you should
verify:

- **Supplier country** is set correctly. Tax calculations depend on this value.
  Update it via the billing profile API if needed — see
  [Tax Collection → Enable tax collection](./tax-collection.md#enable-tax-collection).
- **Tax collection** is configured for your jurisdictions. If you charge
  customers in countries where you have tax obligations, add
  [tax registrations in Stripe](./tax-collection.md#add-tax-registrations-in-stripe)
  and enable `workflow.tax.enabled` on your billing profile.
- **Tax behavior** (inclusive vs. exclusive) matches your pricing page.
  Exclusive means tax is added on top of the listed price; inclusive means tax
  is extracted from the listed price. See
  [Tax Collection → Tax behavior configuration](./tax-collection.md#tax-behavior-configuration).

Check billing readiness programmatically:

```bash
curl "https://dev.zuplo.com/v3/metering/$BUCKET_ID/billing-readiness" \
  -H "Authorization: Bearer $ZAPI_KEY"
```

The response confirms whether Stripe is connected and a default billing profile
exists.

### 5. Webhook endpoint validated

When you connect Stripe, Zuplo registers a webhook endpoint automatically so it
can react to payment events (successful charges, failed payments, disputes).
Verify the webhook is healthy:

1. Open your
   [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks).
2. Find the Zuplo-managed endpoint.
3. Confirm recent events show `200` responses — not failures or timeouts.

If the webhook is missing or unhealthy, disconnect and reconnect Stripe from the
Monetization Service's **Payment Provider** screen in the Zuplo Portal.

### 6. Quota behavior chosen and tested

Each metered entitlement can enforce a **hard limit** or a **soft limit**:

- **Hard limit** (`isSoftLimit: false`): The API returns `403 Forbidden` when
  the customer's quota is exhausted. No overage is billed.
- **Soft limit** (`isSoftLimit: true`): The customer can exceed the quota.
  Overage is billed per-unit at the end of the billing period.

Test both paths in your working-copy environment before going live:

1. Subscribe to a plan with a low quota (e.g., 10 requests).
2. Exceed the quota and verify the correct behavior — either a `403` response
   (hard limit) or continued access with usage counting above the entitlement
   (soft limit).
3. Check the Stripe test dashboard to verify that invoices include the expected
   line items.

See [Rate Cards](./rate-cards.mdx) for how `isSoftLimit` and `issueAfterReset`
interact, and [Monetization Policy Reference](./monetization-policy.md) for how
the gateway enforces limits.

### 7. Subscription lifecycle tested

Before real money is on the line, walk through every lifecycle state:

- **Subscribe** to a plan via the Developer Portal using
  [Stripe test cards](https://docs.stripe.com/testing).
- **Upgrade** from a lower plan to a higher plan. Confirm entitlements change
  immediately and the proration credit appears on the next invoice.
- **Downgrade** from a higher plan to a lower plan. Confirm the change takes
  effect at the next billing cycle, not immediately.
- **Cancel** a subscription. Confirm access continues until the billing period
  ends, then is revoked.
- **Reactivate** a canceled subscription before the period ends. Confirm access
  is restored.
- **Failed payment**: Use Stripe test card `4000 0000 0000 9995` (declined) to
  verify the grace period behavior and that access is blocked after the
  configured `maxPaymentOverdueDays`.

See [Subscription Lifecycle](./subscription-lifecycle.md) for the full details
on each state transition.

### 8. Payment grace period configured

The default grace period for overdue payments is 3 days. During this window,
customers retain API access while Stripe retries the charge. After the grace
period, access is blocked.

You can customize the grace period at three levels (each overrides the one
below):

1. **Customer metadata** — `zuplo_max_payment_overdue_days` on the customer
2. **Plan metadata** — `zuplo_max_payment_overdue_days` on the plan
3. **Bucket configuration** — `maxPaymentOverdueDays` on the
   [monetization configuration](./api-access.mdx#bucket-monetization-configuration)

Set the value to `0` to block access immediately when payment fails.

## Billing models in production

Not all billing models have the same level of portal support today. Choose the
right model for your launch based on current readiness.

### Fixed monthly quotas — production-ready

The most common and most stable model. Customers pay a flat monthly price for an
included number of requests. When the quota is exhausted, the API returns
`403 Forbidden` (hard limit) or bills overages (soft limit).

This model is fully supported in the Developer Portal pricing table, checkout
flow, usage dashboard, and invoicing.

See
[Billing Models → Fixed monthly quotas](./billing-models.md#fixed-monthly-quotas)
for configuration examples.

### Monthly quotas with overages — production-ready

A hybrid model where customers pay a base price for an included allowance, with
per-unit overage billing in arrears for usage above the limit. This is modeled
using graduated tiered pricing with `isSoftLimit: true`.

Fully supported end-to-end. See
[Billing Models → Monthly quotas with overages](./billing-models.md#monthly-quotas-with-overages)
for examples.

### Pay-as-you-go — limited portal support

Pure pay-as-you-go billing (no upfront cost, bill entirely in arrears for actual
usage) is supported by the underlying monetization models, but the **Developer
Portal pricing table experience has not been fully tested** for this billing
model yet.

If you need pay-as-you-go pricing in production, contact
[support@zuplo.com](mailto:support@zuplo.com) to discuss your use case and
current workarounds.

See [Billing Models → Pay-as-you-go](./billing-models.md#pay-as-you-go) for the
data model and configuration.

### Credits / tokens (prepaid) — limited portal support

Credit/token-based billing is supported by the underlying data model, but the
**Developer Portal experience has not been fully tested** for this billing
model.

If you need prepaid credit billing, contact
[sales@zuplo.com](mailto:sales@zuplo.com) to discuss your use case.

See
[Billing Models → Credits / tokens](./billing-models.md#credits--tokens-prepaid)
for configuration examples.

## How usage metering works with Stripe

A common point of confusion: Zuplo does **not** use Stripe Billing Meters,
Stripe Subscriptions, Stripe Products, or Stripe Prices. Zuplo manages plans,
subscriptions, metering, and entitlements internally. Stripe is used only for
**money** — collecting payments and issuing invoices.

The flow works like this:

1. Every API request that hits a monetized route is metered in real time by the
   `MonetizationInboundPolicy`.
2. Usage events are aggregated internally by Zuplo — they are not sent to Stripe
   as individual events.
3. At the end of each billing period, Zuplo calculates the total usage, applies
   the plan's pricing model (flat fee, tiered, per-unit, etc.), and creates a
   **Stripe Invoice** with the appropriate line items.
4. Stripe collects payment from the customer's saved payment method.

This means you will **not** see usage events, billing meters, or subscription
objects in your Stripe dashboard. You will see **Customers** and **Invoices**.
To check usage and subscription state, use the
[Zuplo metering API](./api-access.mdx#authentication) or the Developer Portal's
usage dashboard.

### Why usage events might not appear in Stripe

If you expected to see per-request usage events in Stripe and they are not
there, this is by design. Zuplo does not call Stripe's metered billing APIs.
Usage is materialized as invoice line items at billing time only.

To verify that metering is working:

1. Make API requests to a monetized endpoint.
2. Check the Developer Portal usage dashboard — it should show real-time usage.
3. Query the meter directly via the API:

```bash
curl -X POST "https://dev.zuplo.com/v3/metering/$BUCKET_ID/meters/api_requests/query" \
  -H "Authorization: Bearer $ZAPI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "filterSubscription": ["SUBSCRIPTION_ID"],
    "from": "2026-05-01T00:00:00Z",
    "to": "2026-05-31T23:59:59Z",
    "windowSize": "DAY"
  }'
```

If the usage dashboard shows zero despite active traffic, see
[Troubleshooting → Usage dashboard shows zero](./troubleshooting.md#usage-dashboard-shows-zero-despite-active-api-traffic).

## Connecting Stripe live mode

When your test configuration is validated and you are ready to accept real
payments, follow these steps to connect your production environment to Stripe
live mode.

### Step 1: Create a Stripe restricted key for production

1. In the [Stripe Dashboard](https://dashboard.stripe.com), switch to **live
   mode** (toggle in the top-right corner).
2. Go to **Developers → API keys → Create restricted key**.
3. Name the key `Zuplo Monetization (production)`.
4. Enable the eight permissions listed in
   [Using a Stripe restricted key](./stripe-integration.md#using-a-stripe-restricted-key).
5. Click **Create key** and copy the value (`rk_live_...`).

### Step 2: Connect to your production environment

1. Open your project's
   [**Services**](https://portal.zuplo.com/+/account/project/services) page in
   the Zuplo Portal.
2. Select the **Production** environment.
3. Open the Monetization Service, then go to **Payment Provider**.
4. Click **Configure** on the Stripe card.
5. Paste your live restricted key (`rk_live_...`) and click **Save**.

### Step 3: Recreate your monetization configuration

Because monetization configuration is scoped per-bucket, you need to set up
meters, features, plans, and the monetization configuration in your production
bucket. You can do this through the Portal UI or via the
[monetization APIs](./api-access.mdx).

### Step 4: Verify with a real charge

1. Publish at least one plan in your production environment.
2. Open the Developer Portal on your production URL.
3. Subscribe to a plan using a real payment method.
4. Confirm in the Stripe Dashboard (live mode):
   - A **Customer** was created.
   - The **Webhook** endpoint is registered and showing `200` responses.
5. Make a few API requests and verify the usage dashboard updates.
6. Cancel the test subscription when done.

### Step 5: Monitor first production transactions

After going live, keep a close eye on:

- **Stripe Dashboard → Invoices**: Verify that invoices are created at the end
  of each billing period with the correct line items.
- **Stripe Dashboard → Webhooks**: Confirm all webhook deliveries are
  succeeding.
- **Developer Portal → Usage Dashboard**: Verify that customer-facing usage
  numbers match your expectations.
- **API responses**: Spot-check that monetized routes return `200` for
  subscribed customers and `403` for unauthenticated or over-quota requests.

## Known beta limitations

The following limitations apply during the beta period. Design around them when
planning your production launch. As noted in
[Before you start](#before-you-start), production access requires coordination
with the Zuplo sales team, and production pricing for the monetization feature
has not yet been announced.

### Pay-as-you-go and credits portal experience

Pure pay-as-you-go and credit/token-based billing models are supported by the
underlying data model and APIs, but the Developer Portal pricing table has not
been fully tested for these models. If your business requires either model,
coordinate with Zuplo support for guidance on workarounds.

### Configuration does not promote between environments

Meters, features, plans, and monetization configuration are scoped to individual
buckets. There is no built-in promotion mechanism to copy configuration from
working-copy to production. You must recreate or script the configuration in
each environment separately using the APIs documented in
[API Access](./api-access.mdx).

### Single active subscription per customer (default)

By default, each customer can hold one active subscription at a time.
Multi-subscription support (e.g., a primary subscription plus a credit pack) is
available on request — contact [sales@zuplo.com](mailto:sales@zuplo.com) to
enable it for your bucket.

See
[Subscription Lifecycle → Subscriptions per customer](./subscription-lifecycle.md#subscriptions-per-customer)
for details on multi-subscription scenarios.

## Zuplo plan requirements for monetization

Monetization is available during beta on all Zuplo plan tiers, including Free
and Builder. However, production workloads typically need capabilities that
exceed what the Free and Builder tiers offer.

Here is what each Zuplo plan includes:

- **Free** — Up to 2 gateway developers, no custom domains, community support
  only. Suitable for testing monetization, not for production billing.
- **Builder** ($25/month) — Up to 2 gateway developers, 2 custom domains,
  community support. Can work for small-scale production if you do not need
  additional team members, more custom domains, or priority support.
- **Enterprise** (custom pricing) — Custom developer limits, custom domains,
  configurable log retention, SLA up to 99.999%, and priority support. Required
  for teams that need more than 2 gateway developers, additional custom domains,
  extended log retention, or a support SLA for production billing.

There is currently no self-serve plan between Builder and Enterprise. If you
need capabilities beyond Builder but are not ready for a full Enterprise
engagement, email [sales@zuplo.com](mailto:sales@zuplo.com) to discuss your
options.

For current plan details and pricing, see the
[Zuplo pricing page](https://zuplo.com/pricing).

## Getting help when going live

### When to contact sales

- You are ready to enable production billing for the first time.
- You need to discuss production pricing for the monetization feature.
- You need multi-subscription support or a feature not yet available in
  self-serve.
- You need a Zuplo plan between Builder and Enterprise.

Email [sales@zuplo.com](mailto:sales@zuplo.com).

### When to contact support

- Something is not working as expected in your monetization configuration.
- You need help debugging a specific billing or metering issue.
- You have questions about a beta limitation or workaround.

Email [support@zuplo.com](mailto:support@zuplo.com).

### What to include in your request

To help the team resolve your issue quickly, include:

- **Account slug** — your Zuplo account identifier
- **Project slug** — the project with monetization enabled
- **Bucket ID** — found in Project Services → Bucket Details
- **Stripe account ID** — starts with `acct_`, found in Stripe Dashboard →
  Settings
- **Plan keys** — the plan keys involved in the issue
- **Subscription ID** — if the issue is subscription-specific
- **Steps to reproduce** — what you did, what you expected, what happened
  instead

## Next steps

Once you have completed the checklist, connected Stripe live mode, and verified
your first real charge, your monetized API is in production. Monitor your
[Stripe Dashboard](https://dashboard.stripe.com) webhooks and invoices closely
during the first billing cycle.

- [Troubleshooting](./troubleshooting.md) — common issues and debugging tools
- [Subscription Lifecycle](./subscription-lifecycle.md) — managing ongoing
  upgrades, downgrades, and cancellations
- [Billing Models Guide](./billing-models.md) — exploring additional pricing
  strategies as your business grows
