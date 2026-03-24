---
title: Tax Collection — Enabling Stripe Tax
sidebar_label: Tax Collection
---

:::note{title="Beta"}

API Monetization is in beta and free to try. The APIs are stable but should be
evaluated in non-production environments first. To go to production, contact
[sales@zuplo.com](mailto:sales@zuplo.com). Production pricing has not yet been
announced.

:::

Zuplo supports automatic tax collection through Stripe Tax. When enabled, taxes
(such as VAT, sales tax, or GST) are automatically calculated and added to your
customers' invoices.

## Prerequisites

- Monetization configured with Stripe connected (see
  [Quickstart](./quickstart.md))
- A billing profile (created automatically during initial setup)
- Tax registrations added in Stripe for countries where you collect tax

## Add tax registrations in Stripe

You must add tax registrations in Stripe for every country where you are
required to collect tax. Without a registration, Stripe Tax cannot calculate
taxes for customers in that country.

1. Go to your
   [Stripe Tax registrations page](https://dashboard.stripe.com/tax/registrations).
2. Click **+ Add registration** and add each country where you have a tax
   obligation.

## Find your billing profile

Retrieve your billing profiles to get the billing profile ID:

```bash
curl -X GET "https://dev.zuplo.com/v3/metering/${ZUPLO_BUCKET_ID}/billing/profiles" \
  -H "Authorization: Bearer ${ZUPLO_API_KEY}" \
  -H "Content-Type: application/json"
```

The response contains an `items` array. Save the `id` from your billing profile
as `BILLING_PROFILE_ID`.

## Enable tax collection

Use the PUT endpoint to update the billing profile. You need to change two
things:

1. **Set the correct supplier country** in `supplier.addresses[0].country`. Tax
   calculation depends on your supplier country — it defines what taxes your
   company is required to collect. Use the
   [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)
   country code (e.g., `US`, `GB`, `DE`).

2. **Enable tax collection** by setting `workflow.tax.enabled` to `true`.

First, get the current billing profile to use as a base for the update:

```bash
curl -X GET "https://dev.zuplo.com/v3/metering/${ZUPLO_BUCKET_ID}/billing/profiles/${BILLING_PROFILE_ID}" \
  -H "Authorization: Bearer ${ZUPLO_API_KEY}" \
  -H "Content-Type: application/json"
```

Then update the profile with tax enabled. The key fields to change in the
response body are:

```json
{
  "supplier": {
    "addresses": [
      {
        "country": "GB"
      }
    ],
    "name": "Stripe Account"
  },
  "workflow": {
    "tax": {
      "enabled": true,
      "enforced": false
    }
  }
}
```

Send the full profile body back via PUT:

```bash
curl -X PUT "https://dev.zuplo.com/v3/metering/${ZUPLO_BUCKET_ID}/billing/profiles/${BILLING_PROFILE_ID}" \
  -H "Authorization: Bearer ${ZUPLO_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{ ... full billing profile body with tax enabled ... }'
```

## Tax enforcement modes

The `workflow.tax` object controls how tax collection behaves:

| `enabled` | `enforced` | Behavior                                                                                                                                                                                             |
| --------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `false`   | `false`    | **No tax calculation.** Stripe Tax is not used. Invoices are created without tax lines.                                                                                                              |
| `true`    | `false`    | **Best-effort tax calculation.** Tax is calculated when possible. If it fails (e.g., no valid customer tax location or no tax registration for their country), the invoice is finalized without tax. |
| `true`    | `true`     | **Strict tax enforcement.** Tax calculation is required. If Stripe Tax returns an error, the invoice fails and the customer cannot complete the purchase.                                            |

:::tip

Start with `enforced: false` (best-effort) to avoid blocking customers in
countries where you haven't added a tax registration. You can switch to strict
enforcement after you have registrations in place for all your target markets.

:::

## Tax behavior configuration

You can configure whether tax is **included in the price** or **added on top of
it** by adding a `defaultTaxConfig` to the `invoicing` section of your billing
profile:

```json
{
  "invoicing": {
    "autoAdvance": true,
    "draftPeriod": "P0D",
    "dueAfter": "P0D",
    "progressiveBilling": true,
    "defaultTaxConfig": {
      "behavior": "exclusive",
      "stripe": {
        "code": "txcd_10000000"
      }
    }
  }
}
```

| Setting                 | Description                                                                                                            |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `behavior: "exclusive"` | Tax is added on top of the listed price. A $9.99 plan with 20% VAT charges $11.99.                                     |
| `behavior: "inclusive"` | Tax is included in the listed price. A $9.99 plan total stays $9.99, with tax extracted from that amount.              |
| `stripe.code`           | The Stripe Tax code for your product category. `txcd_10000000` is the general "Software as a Service (SaaS)" category. |

## Troubleshooting

### Customers blocked from subscribing

When `enforced` is `true` and a customer tries to subscribe from a country where
you have not added a Stripe tax registration, they see an error and cannot
create or upgrade subscriptions.

**Fix:** Add a tax registration for the missing country in Stripe, or set
`enforced` to `false` to use best-effort mode.

### Invoices missing tax lines

If tax collection is enabled but invoices don't show tax:

- Verify you have a tax registration for the customer's country.
- Check that the customer's address includes a valid country.
- Confirm `workflow.tax.enabled` is `true` on the billing profile.
