---
title: Quickstart — Monetize Your API
sidebar_label: Quickstart
---

:::note{title="Beta"}

API Monetization is in beta and free to try. The APIs are stable but should be
evaluated in non-production environments first. To go to production, contact
[sales@zuplo.com](mailto:sales@zuplo.com).

:::

This guide walks you through setting up API monetization from scratch.

## Outcomes

By the end of this quickstart, you have:

- **A pricing page** in your Developer Portal where customers can browse and
  compare plans
- **Stripe-powered checkout** so customers can subscribe and pay directly
- **Plan-scoped API keys** that are automatically issued when a customer
  subscribes
- **Usage metering** that tracks API calls per subscription in real time
- **Quota enforcement** that limits or bills for overages based on each
  customer's plan

![The final pricing table that this quickstart creates](../../../public/media/monetization/pricing-table.png)

You'll set up two example plans (Developer and Pro) with tiered pricing,
included request quotas, and per-request overage billing.

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
3. Enter a **Project name** or use the randomly chosen name Zuplo provides.
4. Select **Starter Project (Recommended)** — it comes with endpoints ready to
   monetize.
5. (Optional) Connect your project to source control by clicking the **Connect
   to GitHub** button on the project page, or by following the
   [GitHub setup guide](../source-control-setup-github.md). This isn't required
   for monetization, but is recommended for managing your project long-term.

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
   - **Name**: `Requests`
   - **Event**: `requests` — the type of event this meter listens for.
   - **Description**: `API Requests`
   - **Aggregation**: `SUM` — how values are combined (other options include
     `COUNT`, `MAX`, etc.).
   - **Value Property**: `$.total` — a JSONPath expression that extracts the
     value from each event.
4. Click **Add Meter** to save.

## Step 5: Create features

Features define what your customers get access to. They can be tied to meters
(for usage-based features) or standalone (for boolean features like "Metadata
Support").

In the Monetization Service, click the **Features** tab, then click **Add
Feature** for each of the following:

| Name             | Key                | Linked Meter | Purpose                       |
| ---------------- | ------------------ | ------------ | ----------------------------- |
| API Requests     | `requests`         | Requests     | Usage-based (linked to meter) |
| Monthly Fee      | `monthly_fee`      | —            | Flat-rate billing             |
| Metadata Support | `metadata_support` | —            | Boolean on/off feature        |

## Step 6: Create plans

Plans bring together your features with pricing and entitlements. Create two
plans to give your customers options.

### Create the Developer plan

1. In the **Plans** tab, click **Add Plan**.
2. Fill in the plan details:
   - **Plan Name**: `Developer`
   - **Key**: `developer`
3. Click **Create Draft**.
4. Configure the rate cards by selecting features from the **Add feature**
   dropdown in the **Features & Rate Cards**:

   ![The add feature dropdown showing the location of the Monthly Fee feature](/media/monetization/add-feature-dropdown.png)

   Click on the **Monthly Fee** feature and set it up as shown below:

   **Monthly Fee**:

   | Setting         | Value          |
   | --------------- | -------------- |
   | Pricing Model   | Flat fee       |
   | Billing Cadence | Monthly        |
   | Payment Term    | In advance     |
   | Price           | $9.99          |
   | Entitlement     | No entitlement |

   Next, click **Add feature** again and choose the **API Requests** feature and
   set it up as shown below:

   **API Requests**:

   | Setting         | Value                                                                                             |
   | --------------- | ------------------------------------------------------------------------------------------------- |
   | Pricing Model   | Tiered                                                                                            |
   | Billing Cadence | Monthly                                                                                           |
   | Price Mode      | Graduated                                                                                         |
   | Tier 1          | Click `+ add another tier` and set First Unit `0`, Last Unit `1000`, Unit Price $0, Flat Price $0 |
   | Tier 2          | First Unit `1001`, to infinity, Unit Price $0.10, Flat Price $0                                   |
   | Entitlement     | Metered (track usage)                                                                             |
   | Usage Limit     | `1000`                                                                                            |
   | Soft limit      | Enabled                                                                                           |

   Your **Features & Rate Cards** section should now look like this:

   ![A completed features and rate cards section](/media/monetization/features-rate-cards-complete.png)

5. Click **Save**.

### Create additional plans

You don't have to complete all the above steps again to create the next plan.
You can duplicate a plan you already created.

Click the **Pricing** tab in the left sidebar, then on the **...** context menu
on the right of the Developer Plan.

![The duplicate plan feature is a huge time saver](/media/monetization/duplicate-plan.png)

This will create a copy of the Developer plan that you can rename.

Using the values in the table below, set up a new plan named **Pro**.

The only structural differences are the pricing, request amounts, and the
addition of a **Metadata Support** rate card (set **Pricing Model** to `Free`
and **Entitlement** to `Boolean (on/off)`).

| Plan      | Key         | Monthly Fee | Included Requests | Overage Rate | Metadata Support |
| --------- | ----------- | ----------- | ----------------- | ------------ | ---------------- |
| Developer | `developer` | $9.99       | 1,000             | $0.10/req    | No               |
| Pro       | `pro`       | $19.99      | 5,000             | $0.05/req    | Yes              |

For the **API Requests** rate card on each plan, set **Tier 1** Last Unit to the
"Included Requests" value and **Tier 2** Unit Price to the "Overage Rate" value.
The **Usage Limit** should match the "Included Requests" value. Enable **Soft
limit** on all plans.

![Tiered units setup](../../../public/media/monetization/tiered-units.png)

### Reorder your plans

The **Pricing Table** in the left sidebar determines how plans appear on the
pricing page. **Drag and drop** the plans using the handle on the top-left
corner of each card to reorder them as **Developer** and **Pro**.

![Reordering plans in the Pricing Table tab](/media/monetization/reorder-plans.png)

### Publish your plans

Each plan starts as a draft. Publish each one before customers can subscribe.

1. On the **Pricing** tab, click the **...** context menu on the plan you want
   to publish.
2. Select **Publish Plan**.
3. Repeat for all plans.

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

### Add the policy to your routes

Click on the **Code** tab and select **policies.json** from the **config**
directory.

1. Click on **Create Policy > Create Inbound Policy**.
2. Select the **Monetization** policy from the list of policies, and click
   **Continue**.

![Monetization policy in the policy picker list](../../../public/media/monetization/monetization-policy.png)

3. In the **Meters** configuration field, you can keep the default value of
   `requests` set `1` to match the meter you created in _Step 4_. This field
   maps the meter slug to the number of units each request consumes.

```json
{
  "export": "MonetizationInboundPolicy",
  "module": "$import(@zuplo/runtime)",
  "options": {
    "cacheTtlSeconds": 60,
    "meters": {
      "requests": 1
    }
  }
}
```

4. Click on **Create Policy**.

### Apply the policy to routes

Next, you need to apply the Monetization policy to some or all of your routes.

1. Click on the three-dot menu on the **monetization-inbound** policy.
2. Select **Apply Policy**.
3. Choose individual routes that you want to count towards the metered requests,
   or click **Select All** to add the policy to every route in the project.

![Adding the policy to add routes](../../../public/media/monetization/policy-add-routes.png)

4. Click on **Apply**.
5. Click on **Save** in your project to publish the changes

:::note

The `MonetizationInboundPolicy` handles API key authentication internally. You
do not need a separate `api-key-auth` policy on monetized routes.

:::

## Step 9: Deploy and test

With the Monetization policy live on your API routes, you can now test the
end-to-end flow.

### Subscribe to a plan

1. Open the **Pricing** tab in your Developer Portal (you can get the URL for
   this from the **Deployment URLs** dropdown in your project).
2. Click **Subscribe** on one of the available plans.
3. Enter payment information. Since you're using Stripe sandbox, use
   [test card numbers](https://docs.stripe.com/testing) — no real charges are
   made.
4. After the subscription is confirmed, you can see your usage dashboard and API
   key.

![The subscription page in the Developer Portal](../../../public/media/monetization/subscribed-state.png)

### Test: Make API calls

Copy the API key from your subscription and make requests:

```bash
curl --request GET \
  --url https://<your-gateway-url>/todos \
  --header 'Authorization: Bearer <your-api-key>'
```

Head back to the Developer Portal to see your usage dashboard update with each
call. You should see the `API Requests` meter count increase toward your plan's
limit.

![Usage of requests in the Developer Portal](/media/monetization/usage.png)

## Next steps

Now you have run through the process of setting up Monetization on an example
project, familiarize yourself with these other aspects and start integrating it
into your own project.

- [Billing Models](./billing-models.md) — Choose the right pricing strategy
- [Private Plans](./private-plans.md) — Invite-only plans for specific users
- [Tax Collection](./tax-collection.md) — Enable VAT, sales tax, or GST on
  invoices
- [Monetization Policy Reference](./monetization-policy.md) — Advanced policy
  configuration
- [Subscription Lifecycle](./subscription-lifecycle.md) — Manage trials,
  upgrades, and cancellations
