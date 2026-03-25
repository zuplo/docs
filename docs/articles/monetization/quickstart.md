---
title: Quickstart — Monetize Your API
sidebar_label: Quickstart
---

:::note{title="Beta"}

API Monetization is in beta and free to try. The APIs are stable but should be
evaluated in non-production environments first. To go to production, contact
[sales@zuplo.com](mailto:sales@zuplo.com). Production pricing has not yet been
announced.

:::

This guide walks you through setting up API monetization from scratch. By the
end, your customers can browse plans, subscribe via Stripe Checkout, get API
keys scoped to their plan, and hit real quota limits.

## Prerequisites

- A Zuplo account
- A [Stripe account](https://stripe.com) (sandbox mode is fine for setup)

## Step 1: Create a new project

:::caution

Use a fresh project for this guide. Since monetization is still in preview, this
keeps your existing work safe from any breaking changes.

:::

1. Go to [portal.zuplo.com](https://portal.zuplo.com) and sign in.
2. Click **New Project** in the top right corner.
3. Select **API Management (+ MCP Server)**.
4. Select **Starter Project (Recommended)** — it comes with endpoints ready to
   monetize.
5. Connect your project to source control by following the
   [GitHub setup guide](../source-control-setup-github.md).

## Step 2: Enable the monetization plugin

Add the monetization plugin to your Developer Portal configuration.

1. In your project, navigate to the **Code** tab.
2. In the file tree, open `docs/zudoku.config.tsx`.
3. Add the monetization plugin import at the top of the file:

   ```tsx
   import { zuploMonetizationPlugin } from "@zuplo/zudoku-plugin-monetization";
   ```

4. Add the plugin to the `plugins` array in your config:

   ```tsx
   const config: ZudokuConfig = {
     // ... your existing config
     plugins: [
       zuploMonetizationPlugin(),
       // ... any other plugins
     ],
   };
   ```

5. Save the file and wait for the environment to deploy.

## Step 3: Configure the Monetization Service

1. Navigate to the **Services** tab in your project.
2. Select the environment you want to configure (e.g., **Working Copy**).
3. Click **Configure** on the **Monetization Service** card.

## Step 4: Create a meter

Meters track what you want to measure — API calls, tokens processed, data
transferred, etc.

1. In the Monetization Service, click the **Meters** tab.
2. Click **Add Meter** and select **Blank Meter**.
3. Fill in the meter details:
   - **Name**: `API`
   - **Event**: `api`
   - **Description**: `API Calls`
   - **Aggregation**: `SUM`
   - **Value Property**: `$.total`
4. Click **Add Meter** to save.

A few things to note:

- **Event** — The type of event the meter listens for.
- **Aggregation** — How values are combined (`SUM`, `COUNT`, `MAX`, etc.).
- **Value Property** — A JSONPath expression to extract the value from events.

## Step 5: Create features

Features define what your customers get access to. They can be tied to meters
(for usage-based features) or standalone (for boolean features like "Metadata
Support").

In the Monetization Service, click the **Features** tab, then click **Add
Feature** for each of the following:

**1. API Feature** (linked to the meter):

- **Name**: `api`
- **Key**: `api`
- **Linked Meter**: `API`

**2. Monthly Fee Feature** (for flat-rate billing):

- **Name**: `Monthly Fee`
- **Key**: `monthly_fee`
- **Linked Meter**: leave empty

**3. Metadata Support Feature** (a boolean feature):

- **Name**: `Metadata Support`
- **Key**: `metadata_support`
- **Linked Meter**: leave empty

## Step 6: Create plans

Plans bring together your features with pricing and entitlements. Create three
plans to give your customers options:

| Plan      | Monthly Fee | Included Requests | Overage Rate | Metadata Support |
| --------- | ----------- | ----------------- | ------------ | ---------------- |
| Developer | $9.99       | 1,000             | $0.10/req    | No               |
| Pro       | $19.99      | 5,000             | $0.05/req    | Yes              |
| Business  | $29.99      | 10,000            | $0.01/req    | Yes              |

### Developer plan

1. In the **Plans** tab, click **Add Plan**.
2. Fill in the plan details:
   - **Plan Name**: `Developer`
   - **Key**: `developer`
3. Click **Create Draft**.
4. Configure the rate cards by selecting features from the **Add feature**
   dropdown in the **Features & Rate Cards** section:

   **Monthly Fee** rate card:
   - **Pricing Model**: Flat fee
   - **Billing Cadence**: Monthly
   - **Payment Term**: In advance
   - **Price**: $9.99
   - **Entitlement**: No entitlement

   **api** rate card:
   - **Pricing Model**: Tiered
   - **Billing Cadence**: Monthly
   - **Price Mode**: Graduated
   - **Tier 1**: First Unit `0`, Last Unit `1000`, Unit Price $0, Flat Price $0
   - **Tier 2**: First Unit `1001`, to infinity, Unit Price $0.10, Flat Price $0
   - **Entitlement**: Metered (track usage)
   - **Usage Limit**: `1000`
   - **Soft limit**: enabled

5. Click **Save**.

### Pro plan

1. Click **Create Plan**.
2. Fill in:
   - **Plan Name**: `Pro`
   - **Key**: `pro`
3. Click **Create Draft**.
4. Configure the rate cards:

   **Monthly Fee** rate card:
   - **Pricing Model**: Flat fee
   - **Billing Cadence**: Monthly
   - **Payment Term**: In advance
   - **Price**: $19.99
   - **Entitlement**: No entitlement

   **api** rate card:
   - **Pricing Model**: Tiered
   - **Billing Cadence**: Monthly
   - **Price Mode**: Graduated
   - **Tier 1**: First Unit `0`, Last Unit `5000`, Unit Price $0, Flat Price $0
   - **Tier 2**: First Unit `5001`, to infinity, Unit Price $0.05, Flat Price $0
   - **Entitlement**: Metered (track usage)
   - **Usage Limit**: `5000`
   - **Soft limit**: enabled

   **Metadata Support** rate card:
   - **Pricing Model**: Free
   - **Entitlement**: Boolean (on/off)

5. Click **Save**.

### Business plan

1. Click **Create Plan**.
2. Fill in:
   - **Plan Name**: `Business`
   - **Key**: `business`
3. Click **Create Draft**.
4. Configure the rate cards:

   **Monthly Fee** rate card:
   - **Pricing Model**: Flat fee
   - **Billing Cadence**: Monthly
   - **Payment Term**: In advance
   - **Price**: $29.99
   - **Entitlement**: No entitlement

   **api** rate card:
   - **Pricing Model**: Tiered
   - **Billing Cadence**: Monthly
   - **Price Mode**: Graduated
   - **Tier 1**: First Unit `0`, Last Unit `10000`, Unit Price $0, Flat Price $0
   - **Tier 2**: First Unit `10001`, to infinity, Unit Price $0.01, Flat Price
     $0
   - **Entitlement**: Metered (track usage)
   - **Usage Limit**: `10000`
   - **Soft limit**: enabled

   **Metadata Support** rate card:
   - **Pricing Model**: Free
   - **Entitlement**: Boolean (on/off)

5. Click **Save**.

### Reorder your plans

The order of plans on the Plans tab determines how they appear on the pricing
page. Drag and drop the plans using the handle on the top-left corner of each
card to reorder them as **Developer**, **Pro**, **Business**.

### Publish your plans

Each plan starts as a draft. Publish each one before customers can subscribe.

1. On each plan card, click the **...** context menu.
2. Select **Publish Plan**.
3. Repeat for all three plans.

For more plan configurations (including trial periods and multiple tiers), see
[Plan Examples](./plan-examples.mdx).

## Step 7: Connect Stripe

For testing, use Stripe's sandbox mode so you can simulate payments without real
charges.

1. Go to your [Stripe Dashboard](https://dashboard.stripe.com) and make sure
   you're in **sandbox mode** (toggle in the top-right corner).
2. Go to **Developers > API keys** and copy your **Secret key** (starts with
   `sk_test_`).
3. In the Monetization Service, click **Payment Provider** in the left sidebar.
4. Click **Configure** on the Stripe card.
5. Enter a **Name** and paste your **Stripe API Key**, then click **Save**.

:::warning

Always use your Stripe **test** key (`sk_test_...`) while following this guide.
This creates a sandbox environment where you can safely test subscriptions and
payments without processing real transactions. When you're ready for production,
update to your live key (`sk_live_...`).

:::

## Step 8: Add the monetization policy

The monetization policy checks entitlements and tracks usage on every request.

### Define the policy

Open `config/policies.json` and add:

```json
{
  "policies": [
    {
      "name": "monetization-v3",
      "policyType": "monetization-inbound",
      "handler": {
        "module": "$import(@zuplo/runtime)",
        "export": "MonetizationInboundPolicy",
        "options": {
          "meters": {
            "api": 1
          }
        }
      }
    }
  ]
}
```

The `meters` field maps the meter slug (created in Step 4) to the number of
units each request consumes. In the case of this guide, it's `api`.

### Apply the policy to routes

Open `config/routes.oas.json` and add the policy to the routes you want to
monetize:

```json
{
  "paths": {
    "/todos": {
      "get": {
        "summary": "Get all todos",
        "x-zuplo-route": {
          "handler": {
            "export": "urlForwardHandler",
            "module": "$import(@zuplo/runtime)",
            "options": {
              "baseUrl": "https://todo.zuplo.io"
            }
          },
          "policies": {
            "inbound": ["monetization-v3"]
          }
        }
      }
    }
  }
}
```

:::note

The `MonetizationInboundPolicy` handles API key authentication internally. You
do not need a separate `api-key-auth` policy on monetized routes.

:::

## Step 9: Deploy and test

1. Commit and push your changes.
2. Wait for the deployment to complete in the Zuplo Portal.
3. Navigate to your Developer Portal.

### Subscribe to a plan

1. Open the **Pricing** tab in your Developer Portal.
2. Click **Subscribe** on one of the available plans.
3. Enter payment information. Since you're using Stripe sandbox, use
   [test card numbers](https://docs.stripe.com/testing) — no real charges are
   made.
4. After the subscription is confirmed, you can see your usage dashboard and API
   keys.

### Make API calls

Copy the API key from your subscription and make requests:

```bash
curl --request GET \
  --url https://<your-gateway-url>/todos \
  --header 'Authorization: Bearer <your-api-key>'
```

Head back to the Developer Portal to see your `api` meter decrement with each
call.

## Next steps

- [Billing Models](./billing-models.md) — Choose the right pricing strategy
- [Private Plans](./private-plans.md) — Invite-only plans for specific users
- [Tax Collection](./tax-collection.md) — Enable VAT, sales tax, or GST on
  invoices
- [Monetization Policy Reference](./monetization-policy.md) — Advanced policy
  configuration
- [Subscription Lifecycle](./subscription-lifecycle.md) — Manage trials,
  upgrades, and cancellations
