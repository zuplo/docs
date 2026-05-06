---
title: Stripe Integration
sidebar_label: Stripe Integration
---

:::note{title="Beta"}

API Monetization is in beta and free to try. The APIs are stable but should be
evaluated in non-production environments first. To go to production, contact
[sales@zuplo.com](mailto:sales@zuplo.com). Production pricing has not yet been
announced.

:::

Zuplo uses Stripe to handle payment processing, subscription billing, and
invoicing. Zuplo handles metering, quota enforcement, and subscription state —
Stripe handles money.

## How it works

The integration flow:

1. You define plans, features, and meters in Zuplo
2. You connect your Stripe account via the Zuplo Portal
3. Plans, features, and rate cards stay in Zuplo's catalog — Stripe is used only
   at billing time
4. Customers subscribe through your Developer Portal via Stripe Checkout
5. Stripe collects the payment method and Zuplo creates the subscription with an
   API key scoped to the plan's entitlements
6. As the customer uses the API, the monetization policy meters usage in real
   time
7. At the end of each billing period, Zuplo issues a Stripe Invoice for fixed
   fees and usage-based charges

Throughout this flow, Zuplo is the source of truth for access control and
metering. Stripe is the source of truth for payment state.

## Connecting your Stripe account

### Via the Zuplo Portal

1. Navigate to **Services → Monetization Service → Payment Provider**
2. Click **Configure** on the Stripe card
3. Enter a **Name** and paste your **Stripe API Key**
4. Click **Save**

The connection authorizes Zuplo to manage Stripe objects on your behalf —
specifically Customers, Checkout Sessions, Customer Portal Sessions, Invoices,
and Tax Calculations. See
[What Zuplo creates in Stripe](#what-zuplo-creates-in-stripe) for the full list.

### Test mode vs. live mode

Connect with a Stripe **test** key (`sk_test_...`) first to validate your
configuration end-to-end. Test mode uses Stripe's test card numbers (e.g.,
`4242 4242 4242 4242`) and never charges real money.

When you're ready to go live, configure a separate Zuplo environment (e.g.,
**Production**) with your live key (`sk_live_...`).

:::caution

Use one Stripe key type per Zuplo environment — do not replace a test key with a
live key in the same environment. Test mode and live mode are separate
environments in Stripe. Products, customers, and subscriptions created in test
mode don't transfer to live mode and vice versa.

:::

## Using a Stripe restricted key

Zuplo accepts both **secret keys** (`sk_test_*`, `sk_live_*`) and **restricted
keys** (`rk_test_*`, `rk_live_*`) when you connect Stripe. For production, use a
restricted key — it follows the principle of least privilege and limits the
blast radius if the credential is ever leaked.

A Monetization V3 restricted key needs the following eight permissions. Leave
every other permission set to **None**.

| Stripe permission                                  | Level | Why Zuplo needs it                                                                 |
| -------------------------------------------------- | ----- | ---------------------------------------------------------------------------------- |
| Connect → Accounts                                 | Read  | Verifies the key on install and reads basic account details (country, currency)    |
| Core → Customers                                   | Write | Creates and updates Stripe Customers when developers subscribe                     |
| Core → Payment Methods                             | Read  | Displays saved cards in the customer portal                                        |
| Checkout → Checkout Sessions                       | Write | Creates checkout sessions when developers add a payment method                     |
| Billing → Customer portal                          | Write | Creates customer-portal sessions for self-service plan management                  |
| Billing → Invoices                                 | Write | Issues, finalizes, and pays invoices for metered usage (also covers Invoice items) |
| Tax → Tax Calculations and Transactions            | Write | Calculates tax via Stripe Tax when tax collection is enabled                       |
| Webhook → Webhook Endpoints and Event Destinations | Write | Registers the webhook Zuplo uses to receive payment events                         |

Zuplo doesn't use Stripe Subscriptions, Products, Prices, Payment Intents, Setup
Intents, Refunds, or Stripe Billing Meters — leave all of those at **None**.

### Create the restricted key

1. In the Stripe Dashboard, go to **Developers → API keys → Create restricted
   key**.
2. Name the key something recognizable, for example `Zuplo Monetization (test)`
   or `Zuplo Monetization (production)`.
3. For each of the eight permissions above, set the level shown in the table.
4. Click **Create key**, copy the value (`rk_test_...` or `rk_live_...`), and
   paste it into **Services → Monetization Service → Payment Provider** in your
   Zuplo project.

:::caution

Use a **test** restricted key (`rk_test_*`) for preview and working-copy
environments, and a **live** restricted key (`rk_live_*`) for production. Zuplo
rejects a live key on a non-production environment and vice versa.

:::

### Troubleshoot permission errors

If you see an error like:

```
The provided key 'rk_test_...' does not have the required permissions for this endpoint.
Having the 'rak_accounts_kyc_basic_read' permission would allow this request to continue.
```

The key is missing one of the permissions in the table above. Stripe's internal
name in the error (`rak_<resource>_<action>`) maps to a row in the table. The
most common omissions:

- **`rak_accounts_kyc_basic_read`** → enable **Connect → Accounts** at **Read**.
- **`rak_tax_calculations_*`** → enable **Tax → Tax Calculations and
  Transactions** at **Write**.
- **`rak_webhook_endpoints_*`** → enable **Webhook → Webhook Endpoints and Event
  Destinations** at **Write**.
- **`rak_invoices_*`** → enable **Billing → Invoices** at **Write**.

Edit the key in the Stripe Dashboard, tick the missing permission, save, and
retry the connection in Zuplo.

### Rotate the key

You can replace the connected key from the same **Payment Provider** screen. The
new key must:

- Use the same prefix mode (test or live) as the existing key.
- Belong to the same Stripe account.
- Carry all eight permissions above.

## What Zuplo creates in Stripe

Zuplo's catalog (plans, features, rate cards, entitlements) is stored in Zuplo,
not in Stripe. Publishing a plan does **not** create Stripe Products, Prices, or
Subscriptions. Stripe is used only at the points where money or payment state is
involved.

The objects that Zuplo creates or manages in your Stripe account:

| Object                          | When it's created                                                          |
| ------------------------------- | -------------------------------------------------------------------------- |
| Stripe Customer                 | When a developer first subscribes — one Stripe Customer per Zuplo customer |
| Stripe Checkout Session         | When a developer subscribes to a plan that requires a payment method       |
| Stripe Customer Portal Session  | When a developer opens **Manage Billing** in the Developer Portal          |
| Stripe Invoice and Invoice Item | At the end of each billing period for fixed and usage-based charges        |
| Stripe Tax Calculation          | At invoice time when [tax collection](./tax-collection.md) is enabled      |
| Stripe Webhook Endpoint         | Once on connection, so Zuplo can react to payment events                   |

Zuplo does **not** create Stripe Products, Prices, Subscriptions, Payment
Intents, Setup Intents, Refunds, or Stripe Billing Meters. This matches the
restricted-key permissions listed above — those scopes are intentionally left at
**None**.

You won't find a Zuplo plan listed under **Products** in your Stripe dashboard.
To see what Zuplo has created, look under **Customers** and **Invoices**.

## Subscription flow

### New subscription

When a customer clicks "Subscribe" in your Developer Portal:

1. A Stripe Checkout Session is created so the customer can enter a payment
   method
2. The customer is redirected to Stripe Checkout to enter payment details
3. On successful payment, the subscription is created
4. An API key is generated scoped to the subscription's plan entitlements
5. The customer is redirected back to the Developer Portal, where they can
   immediately see their subscription, usage dashboard, and API key

### Plan changes (upgrades/downgrades)

When a customer changes their plan through the Developer Portal:

1. Zuplo records the plan change and recalculates the customer's entitlements
2. Any prorated amount is reflected on the customer's next Stripe Invoice
3. The customer's entitlements update immediately
4. The API key remains the same; its associated quota changes in real time

Upgrades take effect immediately. Downgrades take effect at the next billing
cycle.

### Cancellation

When a customer cancels:

1. The subscription is set to cancel at the end of the current billing period
   (by default)
2. The customer retains access until their current billing period ends
3. At period end, access is revoked and the API key stops working

## Proration

When customers upgrade or downgrade mid-billing-period, charges are prorated
automatically. Upgrades are charged the prorated difference for the remainder of
the billing period. Downgrades result in a prorated credit applied to the next
invoice.

## Usage-based billing

For plans with usage-based pricing (per-unit, tiered, pay-as-you-go), usage is
tracked in real time by the `MonetizationInboundPolicy`. Each API request
increments the meter immediately. At the end of the billing period, usage is
billed through Stripe automatically.

You don't need to implement usage reporting or run any batch jobs.

## Handling failed payments

When Stripe fails to collect payment, access is determined by the subscription's
payment status. By default, a 3-day grace period allows continued access while
Stripe retries the payment.

| Payment status  | Default behavior                                 |
| --------------- | ------------------------------------------------ |
| `paid`          | Full access                                      |
| `not_required`  | Full access (free plans)                         |
| `pending`       | Full access (within grace period)                |
| `failed`        | Access blocked after grace period (configurable) |
| `uncollectible` | Access blocked                                   |

The grace period is configurable via `zuplo_max_payment_overdue_days` metadata
on the plan or customer (default: 3 days).

## Customer portal

Stripe provides a hosted Customer Portal where customers can update their
payment method, view invoices, and manage their subscription. The Developer
Portal links to this from the subscription management page.

To enable the Stripe Customer Portal:

1. Configure the Customer Portal in your
   [Stripe Dashboard → Settings → Billing → Customer Portal](https://dashboard.stripe.com/settings/billing/portal)
2. Enable the features you want (update payment method, view invoices, cancel
   subscription)
3. The Developer Portal automatically includes a "Manage Billing" link that
   opens the Stripe Customer Portal

## Testing

### Test card numbers

Use Stripe's test card numbers to simulate different scenarios:

| Card number           | Scenario                                 |
| --------------------- | ---------------------------------------- |
| `4242 4242 4242 4242` | Successful payment                       |
| `4000 0000 0000 3220` | Requires 3D Secure authentication        |
| `4000 0000 0000 0341` | Attaches to customer but fails on charge |
| `4000 0000 0000 9995` | Declined (insufficient funds)            |

### Verifying the integration

After connecting Stripe and publishing plans:

1. Open your Developer Portal
2. Subscribe to a plan using test card `4242 4242 4242 4242`
3. Verify in Stripe Dashboard:
   - Customer created
   - Subscription active
   - Product and Price match your plan
4. Make API requests and verify:
   - Requests succeed within quota
   - `403 Forbidden` returned when quota exceeded (hard limit plans)
   - Usage visible in the Developer Portal dashboard
5. Cancel the subscription and verify:
   - Access revoked after billing period
   - Stripe subscription shows canceled
