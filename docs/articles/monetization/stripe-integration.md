---
title: Stripe Integration
sidebar_label: Stripe Integration
---

Zuplo uses Stripe to handle payment processing, subscription billing, and
invoicing. Zuplo handles metering, quota enforcement, and subscription state —
Stripe handles money.

## How it works

The integration flow:

1. You define plans, features, and meters in Zuplo
2. You connect your Stripe account via the Zuplo Portal
3. When you publish plans, corresponding Stripe Products and Prices are created
   automatically
4. Customers subscribe through your Developer Portal via Stripe Checkout
5. Stripe processes the payment and creates the subscription
6. A Zuplo subscription is created with an API key scoped to the plan's
   entitlements
7. As the customer uses the API, the monetization policy meters usage in real
   time
8. For usage-based billing, usage is tracked continuously and billed through
   Stripe automatically

Throughout this flow, Zuplo is the source of truth for access control and
metering. Stripe is the source of truth for payment state.

## Connecting your Stripe account

### Via the Zuplo Portal

1. Navigate to **Services → Monetization Service → Payment Provider**
2. Click **Configure** on the Stripe card
3. Enter a **Name** and paste your **Stripe API Key**
4. Click **Save**

The connection authorizes Zuplo to manage Stripe objects on your behalf,
including products, prices, customers, and subscriptions.

### Test mode vs. live mode

Connect with a Stripe **test** key (`sk_test_...`) first to validate your
configuration end-to-end. Test mode uses Stripe's test card numbers (e.g.,
`4242 4242 4242 4242`) and never charges real money.

When you're ready to go live, update to your live key (`sk_live_...`).

:::caution

Always use your Stripe **test** key while developing. Test mode and live mode
are separate environments in Stripe. Products, customers, and subscriptions
don't transfer between them.

:::

## What Zuplo creates in Stripe

When you publish a plan, corresponding objects are created in Stripe
automatically:

| Zuplo concept        | Stripe object created            |
| -------------------- | -------------------------------- |
| Plan                 | Product                          |
| Rate card (flat fee) | Price (recurring, fixed amount)  |
| Rate card (per-unit) | Price (recurring, metered usage) |
| Rate card (tiered)   | Price (recurring, tiered)        |
| Feature entitlement  | Metadata on the Product          |

You can see these in your Stripe Dashboard under **Products**. These objects are
managed automatically — don't edit them directly in Stripe, as your changes may
be overwritten on the next plan publish.

## Subscription flow

### New subscription

When a customer clicks "Subscribe" in your Developer Portal:

1. A Stripe Checkout Session is created with the selected plan's prices
2. The customer is redirected to Stripe Checkout to enter payment details
3. On successful payment, the subscription is created
4. An API key is generated scoped to the subscription's plan entitlements
5. The customer is redirected back to the Developer Portal, where they can
   immediately see their subscription, usage dashboard, and API key

### Plan changes (upgrades/downgrades)

When a customer changes their plan through the Developer Portal:

1. The Stripe Subscription is updated with the new plan's prices
2. Charges are prorated automatically
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
   [Stripe Dashboard → Settings → Customer Portal](https://dashboard.stripe.com/settings/billing/portal)
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
