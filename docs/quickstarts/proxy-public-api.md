---
title: API Gateway Quickstart
---

Let's put a gateway over this sample e-commerce API at
`https://ecommerce-api.zuplo.io` with a Zuplo gateway and add rate limiting.
Quickly take a look at the API by opening this URL in your browser:
[https://ecommerce-api.zuplo.io/products/10000](https://ecommerce-api.zuplo.io/products/10000)

## 1/ Routes Setup

Open the **Routes** file and add a new route. Set the **version** to be `v1` and the **path** of the new route to be
`/products/:productId`.

![Untitled](/media/getting-started/path.png)

## 2/ Rewrite Handler

Set the mode of the Request Handler to be **URL Rewrite** and the rewrite path
to be `https://ecommerce-api.zuplo.io/products/${params.productId}`. Notice that
this appends the productId token to the outbound URL.

![Untitled](/media/getting-started/rewrite.png)

## 3/ Rate Limiting

Expand the Policies section and click the Add Policy button under request. Search for and click the **Rate Limiting** policy.

![Rate Limiting](/media/getting-started/rate-limit.png)

Accept the default configuration. Note how it's set to allow only 2 requests
every 20s for a given IP address.

## 4/ Test Rate Limiting

Invoke your API using the Test Console. Click on the lightning tab and select
the first file. Change the path to `/v1/products/10000` and hit **Test**.

![Untitled](/media/getting-started/test-client.png)

Try quickly testing it a few more time to see the rate limiter kick in - you'll
get a `429` response, "Too many requests".

## Congratulations, you set up a gateway!

**Related Docs**

- [URL Rewrite Handler](/docs/handlers/url-rewrite)
- [Rate Limit Policy](/docs/policies/rate-limit-inbound)

**Next Steps**

- [Add API Key Auth to and API](/docs/quickstarts/add-api-key-auth.md)
- [Dynamic Rate Limiting](/docs/quickstarts/per-customer-rate-limits.md)
