---
title: Troubleshooting & FAQ
sidebar_label: Troubleshooting
---

:::note{title="Beta"}

API Monetization is in beta and free to try. The APIs are stable but should be
evaluated in non-production environments first. To go to production, contact
[sales@zuplo.com](mailto:sales@zuplo.com). Production pricing has not yet been
announced.

:::

## Common issues

### Customer gets 403 Forbidden instead of expected access

**Symptom:** Authenticated customer with an active subscription receives
`403 Forbidden` instead of a successful response.

**Causes and fixes:**

1. **Payment is overdue.** Check the subscription's payment status via the API.
   If payment has failed and the grace period (default 3 days) has passed,
   access is blocked.

   ```bash
   curl https://dev.zuplo.com/v3/metering/{bucketId}/customers/{CUSTOMER_ID}/subscriptions \
     -H "Authorization: Bearer {API_KEY}"
   ```

   Fix: Either resolve the payment issue in Stripe, or adjust the grace period
   via `zuplo_max_payment_overdue_days` metadata on the plan or customer.

2. **Customer is using the wrong API key.** Each subscription generates its own
   key. If the customer has multiple subscriptions or regenerated their key,
   they may be using an old or unrelated key.

   Fix: Have the customer check their active key in the Developer Portal →
   Subscriptions page.

3. **Customer has no subscription.** If the customer authenticated but never
   subscribed to a plan, they get 403 on monetized routes.

   Fix: Direct the customer to subscribe to a plan (even a free tier).

### Customer gets 403 Forbidden for quota exceeded

**Symptom:** Customer's requests are being blocked and the error detail mentions
exceeding a meter limit.

**Causes and fixes:**

1. **Separate rate-limiting policy is blocking them.** If you have both a
   `MonetizationInboundPolicy` (monthly quota) and a standalone rate-limiting
   policy (per-second/per-minute), the rate limiter may be triggering before the
   monetization quota is reached.

   Fix: Check if a per-second/per-minute rate limit is configured. The response
   body detail message will indicate which limit was hit.

2. **Meter counting both successes and failures.** The default
   `meterOnStatusCodes` is `"200-299"`, so only successful responses are
   metered. If you changed this to a broader range, failed requests (4xx, 5xx
   from your backend) count against the quota.

   Fix: Set `meterOnStatusCodes` to `"200-299"` to only count successful
   responses.

3. **Multiple meters consuming the same quota.** If a single request increments
   a meter by more than 1 (e.g., `"api_credits": 10`), the quota depletes faster
   than the customer expects.

   Fix: Verify the meter increment values in your policy configuration match
   what your pricing page communicates.

### Stripe Checkout redirects but subscription isn't created in Zuplo

**Symptom:** Customer completes Stripe Checkout successfully, but the Developer
Portal shows no active subscription.

**Causes and fixes:**

1. **Preview environment mismatch.** If you tested in a preview deployment but
   the checkout was configured for a different environment, the subscription may
   have been created in the wrong bucket.

   Fix: Ensure you are testing against the correct environment (working copy,
   preview, or production).

2. **Stripe test mode / live mode mismatch.** Products and subscriptions in
   Stripe test mode are invisible to live mode and vice versa.

   Fix: Verify you're looking at the correct mode in both Stripe and Zuplo.

### Usage dashboard shows zero despite active API traffic

**Symptom:** Customer is making successful API requests, but the usage dashboard
in the Developer Portal shows 0 usage.

**Causes and fixes:**

1. **Monetization policy is not applied to the route.** The
   `MonetizationInboundPolicy` must be in the inbound policy pipeline for
   metering to occur. If the route only has a different authentication policy
   (no monetization policy), requests go through but aren't metered.

   Fix: Verify the `monetization-inbound` policy is listed in the route's
   inbound policies.

2. **`meterOnStatusCodes` excludes the response status.** If set to `"200"` but
   your API returns `201 Created`, those requests won't be metered.

   Fix: Widen the status code range (e.g., `"200-299"`).

### Plan changes don't take effect

**Symptom:** Customer upgrades their plan in the Developer Portal, but their
entitlements don't change.

**Causes and fixes:**

1. **Plan was updated but not published.** Plans in `draft` status aren't
   visible to customers, and updates to active plans need to be re-published.

   Fix: Check the plan status. Publish if it's still in draft.

2. **Caching lag.** Entitlement changes propagate in near-real-time, but there
   can be a brief propagation window (typically under 60 seconds based on
   `cacheTtlSeconds`).

   Fix: Wait a minute and retry. If the issue persists, check the subscription
   via the API to verify the plan change was recorded.

## Debugging tools

### Check subscription state via the API

```bash
# List subscriptions for a customer
curl https://dev.zuplo.com/v3/metering/{bucketId}/customers/{CUSTOMER_ID}/subscriptions \
  -H "Authorization: Bearer {API_KEY}"

# Check subscription access and entitlements
curl https://dev.zuplo.com/v3/metering/{bucketId}/subscriptions/{subscriptionId}/access \
  -H "Authorization: Bearer {API_KEY}"
```

### Check meter usage

```bash
# Query meter usage for the current month
curl -X POST https://dev.zuplo.com/v3/metering/{bucketId}/meters/{meterIdOrSlug}/query \
  -H "Authorization: Bearer {API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "filterSubscription": ["{SUBSCRIPTION_ID}"],
    "from": "2026-03-01T00:00:00Z",
    "to": "2026-03-31T23:59:59Z",
    "windowSize": "DAY"
  }'
```

### Test with cURL

Verify the full flow manually:

```bash
# Make a request to a monetized endpoint
curl -v -H "Authorization: Bearer {CUSTOMER_API_KEY}" \
  https://your-api.zuplo.dev/api/v1/resource

# Check the response status and body for error details
# 403 with detail message indicates auth, payment, or quota issues
```

## FAQ

### Can I have both free and paid plans?

Yes. Create a free plan with `price: null` and `isSoftLimit: false` on the
entitlement. Free plans that don't require a credit card skip Stripe Checkout
entirely — the customer gets access immediately after clicking "Start Free."

### Can a customer have multiple subscriptions?

Yes. Each subscription generates its own API key. The customer uses the
appropriate key for each subscription. This supports scenarios like a primary
subscription plus a credit pack, or separate subscriptions for different API
products.

### What happens if Stripe is down?

Zuplo caches subscription and quota state locally. If Stripe is temporarily
unavailable, existing customers continue to have access based on their cached
subscription state. New subscriptions and plan changes require Stripe to be
available.

### Can I use currencies other than USD?

Yes. Plans support any ISO 4217 currency code. Set the `currency` field when
creating a plan. You can offer the same plan in multiple currencies by creating
separate plan objects (e.g., `pro-usd` and `pro-eur`).

### How are overages calculated?

Overages are modeled using graduated tiered pricing. The first tier covers the
included allowance at a flat price, and subsequent tiers charge per-unit for
usage beyond the allowance. See [Pricing Models](./pricing-models.mdx) for
details.

### Can I set spending limits for pay-as-you-go customers?

You can set a hard entitlement limit that acts as a spending cap (e.g., max
100,000 requests regardless of willingness to pay). Alternatively, use a custom
policy to check current usage against a configurable limit, or set up Stripe
billing alerts to notify customers approaching a threshold.

### Do meters count retried requests?

Yes. Each request that hits the gateway is independently metered. If a client
retries a failed request, both the original and retry are metered (subject to
`meterOnStatusCodes` filtering). This is by design — your infrastructure handled
both requests.

### Can I migrate from Amberflo/Moesif/OpenMeter?

Yes. The third-party metering integrations (Amberflo, Moesif, OpenMeter
policies) are separate from the native Zuplo Monetization. You can run them in
parallel during migration:

1. Add the `MonetizationInboundPolicy` alongside your existing third-party
   policy
2. Let both meter simultaneously for a comparison period
3. Once you've verified parity, remove the third-party policy
4. Decommission the third-party metering service

### Is there an SLA on metering accuracy?

Zuplo meters in the request path — every request that gets a response is metered
synchronously. There's no batch processing, no eventual consistency window, and
no sampling. If the customer's API call succeeded (based on
`meterOnStatusCodes`), it's counted.

### Can I customize the 403 response body?

Yes. Use a custom outbound policy to transform the `403` response when it's a
quota error:

```typescript
export default async function customQuotaResponse(response, request, context) {
  if (response.status === 403) {
    const body = await response.json();
    if (body.detail?.includes("exceeded the allowed limit")) {
      return new Response(
        JSON.stringify({
          error: "quota_exceeded",
          message:
            "You've exceeded your API quota. Upgrade your plan for more requests.",
          upgrade_url: "https://developers.your-company.com/pricing",
        }),
        {
          status: 429,
          headers: response.headers,
        },
      );
    }
  }
  return response;
}
```
