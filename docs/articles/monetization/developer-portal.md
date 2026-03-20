---
title: Developer Portal Setup
sidebar_label: Developer Portal
---

The Developer Portal is the self-serve storefront for your monetized API.
Customers browse plans, subscribe, manage their API keys, and monitor usage —
all without contacting your team. The portal is built on
[Zudoku](https://zudoku.dev), Zuplo's open-source API documentation framework.

## What the portal provides

Once monetization is enabled, the Developer Portal gains these pages:

**Pricing page** — Displays all published plans with feature comparisons,
pricing details, and subscribe buttons. Unauthenticated visitors see plans and
pricing. Authenticated users see which plan they're currently on and get
upgrade/downgrade options.

**Subscription management** — Lists all of a customer's subscriptions (current
and past), shows the current billing period, and provides
cancel/upgrade/downgrade actions.

**Usage dashboard** — Real-time view of quota consumption for the current
billing period. Shows each metered feature's usage against its entitlement, with
visual progress indicators.

**API key management** — API keys are displayed within the context of their
subscription. Each subscription has its own key, making it clear which key
corresponds to which plan. Customers can regenerate keys from this page.

## Prerequisites

Before setting up monetization in the portal, ensure:

1. **Authentication is configured** — The Developer Portal requires
   authentication so it can identify customers. Auth0, Clerk, or custom OpenID
   Connect providers are supported.
2. **Meters, features, and plans are created** — At least one plan must be
   published.
3. **Stripe is connected** — The billing provider must be linked for payment
   processing.

## Enabling monetization in the portal

Add the monetization plugin to your Developer Portal configuration. Open
`docs/zudoku.config.tsx` in your project and add the plugin:

```tsx
import { zuploMonetizationPlugin } from "@zuplo/zudoku-plugin-monetization";

const config: ZudokuConfig = {
  // ... your existing config
  plugins: [
    zuploMonetizationPlugin(),
    // ... any other plugins you have
  ],
};
```

Save and deploy. Once the plugin is enabled, ensure:

1. Stripe is connected (see [Stripe Integration](./stripe-integration.md))
2. At least one plan is published

## Configuring the pricing page

### Plan display order

Control plan display order in the Zuplo Portal under **Settings →
Monetization**. Plans can be reordered using drag-and-drop.

### Feature comparison matrix

The pricing page automatically generates a feature comparison table from your
plans' rate cards and features. Each plan column shows:

- Monthly price (or "Free" / "Custom" for special tiers)
- Included entitlements for each metered feature (e.g., "50,000 API Calls")
- Static feature availability (checkmark/cross)
- Overage pricing where applicable

### Highlighted plans

To highlight a plan as popular, set `popular` to `true` in the plan's metadata.
The pricing page displays a "Popular" badge on highlighted plans.

### Custom plan descriptions

Plans display their `name` and `description` fields on the pricing page. Set
these when creating or updating a plan via the API.

### Handling free plans

Free plans that don't require a payment method skip the Stripe Checkout flow
entirely. Whether a plan requires a payment method is controlled by the
`paymentMethodRequired` property on the plan itself.

## Usage dashboard

The usage dashboard shows real-time quota consumption for each metered feature
on the customer's active subscription.

Each meter displays:

- Current usage count
- Entitlement (quota limit)
- Usage percentage as a progress bar
- Billing period start and end dates
- Overage amount (if applicable)

The usage dashboard updates on each page load, showing current consumption
against entitlements for all metered features.

## Subscription management

The subscriptions page shows:

- **Active subscriptions** with plan name, status, current period, and API key
- **API keys** nested under their subscription for clarity
- **Quick actions**: Upgrade, Downgrade, Cancel, Manage Billing (opens Stripe
  Customer Portal)
- **Past subscriptions** with their final status and date range

### API key display

API keys are displayed within the context of their subscription. This is a
deliberate design choice — in the previous version, keys and subscriptions were
shown separately, causing confusion about which key was associated with which
plan.

Each subscription shows:

- The API key value (click to reveal/copy)
- Key creation date
- Key status (active/revoked)
- A "Regenerate" button

When a customer regenerates a key, the old key is immediately revoked and a new
one is issued. The new key inherits the same plan entitlements.

## Theming and branding

The Developer Portal inherits your project's Zudoku theme. Monetization pages
use the same fonts, colors, and layout as the rest of your portal.

## Custom domain

The Developer Portal runs at `https://your-project.zuplo.dev/docs` by default.
For production, configure a custom domain:

1. Navigate to **Settings → Custom Domains** in the Zuplo Portal
2. Add your domain (e.g., `developers.your-company.com`)
3. Configure the DNS records as instructed
4. SSL is provisioned automatically

Your monetization pages, including the Stripe Checkout redirect flow, work
seamlessly with custom domains.
