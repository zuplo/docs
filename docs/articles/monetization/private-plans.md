---
title: Private Plans — Invite-Only Subscriptions
sidebar_label: Private Plans
---

Private plans are hidden from the public pricing table and can only be accessed
by users you explicitly invite. Use private plans for custom enterprise pricing,
partner deals, or beta testing with specific users.

## Prerequisites

Before creating private plans, complete the [Quickstart](./quickstart.md) guide
to set up meters, features, and at least one public plan.

## Create a private plan

A plan becomes private when you set `"zuplo_private_plan": "true"` in the plan's
`metadata` field. You can create private plans through the API.

This example creates an invite-only Developer plan with 1,000 included requests
and $0.10/request overage:

```bash
curl -X POST "https://dev.zuplo.com/v3/metering/${ZUPLO_BUCKET_ID}/plans" \
  -H "Authorization: Bearer ${ZUPLO_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "billingCadence": "P1M",
    "currency": "USD",
    "description": "1000 requests per month with overages",
    "key": "private_developer",
    "metadata": {
      "zuplo_private_plan": "true"
    },
    "name": "Private Developer",
    "proRatingConfig": {
      "enabled": true,
      "mode": "max_consumption_based"
    },
    "phases": [
      {
        "duration": null,
        "key": "default",
        "name": "Default",
        "rateCards": [
          {
            "billingCadence": "P1M",
            "featureKey": "monthly_fee",
            "key": "monthly_fee",
            "name": "Monthly Fee",
            "price": {
              "amount": "9.99",
              "paymentTerm": "in_advance",
              "type": "flat"
            },
            "type": "flat_fee"
          },
          {
            "billingCadence": "P1M",
            "entitlementTemplate": {
              "isSoftLimit": true,
              "issueAfterReset": 1000,
              "preserveOverageAtReset": false,
              "type": "metered",
              "usagePeriod": "P1M"
            },
            "featureKey": "api",
            "key": "api",
            "name": "api",
            "price": {
              "mode": "graduated",
              "tiers": [
                {
                  "flatPrice": {
                    "amount": "0",
                    "type": "flat"
                  },
                  "unitPrice": null,
                  "upToAmount": "155000"
                },
                {
                  "flatPrice": null,
                  "unitPrice": {
                    "amount": "0.10",
                    "type": "unit"
                  }
                }
              ],
              "type": "tiered"
            },
            "type": "usage_based"
          }
        ]
      }
    ]
  }'
```

Save the returned `id` — you need it to publish and invite users.

The key difference from a public plan is `metadata.zuplo_private_plan` set to
`"true"`. Everything else (rate cards, entitlements, pricing) works the same as
public plans.

## Publish the plan

Like standard plans, private plans are created as drafts. Publish before users
can subscribe:

```bash
curl -X POST "https://dev.zuplo.com/v3/metering/${ZUPLO_BUCKET_ID}/plans/${PLAN_ID}/publish" \
  -H "Authorization: Bearer ${ZUPLO_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{}'
```

## Invite a user

After publishing, create an invite tied to the user's email address. The user
does not need to exist in Zuplo yet, but they must sign in with the invited
email to see the private plan.

```bash
curl -X POST "https://dev.zuplo.com/v3/metering/${ZUPLO_BUCKET_ID}/plan-invites" \
  -H "Authorization: Bearer ${ZUPLO_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "planId": "${PLAN_ID}"
  }'
```

Once the invite is created, the invited user sees this plan on the Developer
Portal pricing page after logging in. Users who have not been invited do not see
the plan.

## How it works

- Private plans do not appear on the public pricing table.
- Only users with a matching invite (by email) see the plan after signing in.
- A user can be invited to multiple private plans.
- Private plans support the same rate cards, entitlements, and billing features
  as public plans.
- Subscriptions to private plans work identically to public plan subscriptions
  (Stripe Checkout, API key provisioning, usage tracking).
