---
title: Proxy a Public API
date: "2022-02-18"
embed: true
---

Zuplo isn't your average gateway. It's a **programmable gateway** that can be
used to protect and share your own API _and_ used as a simple orchestration
layer over SaaS APIs. Choose your getting started guide:

<QuickstartPicker />

Let's put a gateway over this sample e-commerce API at
`https://ecommerce-api.zuplo.io` with a Zuplo gateway and add rate limiting.
Quickly take a look at the API by opening this URL in your browser:
[https://ecommerce-api.zuplo.io/products/10000](https://ecommerce-api.zuplo.io/products/10000)

> You can also 'Zup It!' to create an instant copy of this project with all the
> code complete for you:
> [Zup it!](https://portal.zuplo.com/clone?sourceRepoUrl=https://github.com/zuplo/samples-gateway-over-airtable.git)

## 1

Open the **routes.json** file and add a new route.

![Untitled](/media/getting-started/add-route.png)

Set the **version** to be `v1` and the **path** of the new route to be
`/products/:productId`.

![Untitled](/media/getting-started/path.png)

## 2

Set the mode of the Request Handler to be **URL Rewrite** and the rewrite path
to be `https://ecommerce-api.zuplo.io/products/${params.productId}`. Notice that
this appends the productId token to the outbound URL.

![Untitled](/media/getting-started/rewrite.png)

## 3

Use the route tester at the top of the screen to check your re-write logic. Open
the route tester (top right) and set the path to be `/v1/products/10000`. Verify
that your route was matched and the URL re-written appropriately.

![Untitled](/media/getting-started/route-tester.png)

![Untitled](/media/getting-started/route-matched.png)

## 4

Expand the Polices section and click the Add Policy button under request. Search
for and click the **Rate Limiting** policy.

![Rate Limiting](/media/getting-started/rate-limit.png)

Accept the default configuration. Note how it's set to allow only 2 requests
every 20s for a given IP address.

## 5

Invoke your API using the Test Console. Click on the lightning tab and select
the first file. Change the path to `/v1/products/10000` and hit **Test**.

![Untitled](/media/getting-started/test-client.png)

Try quickly testing it a few more time to see the rate limiter kick in - you'll
get a `429` response, "Too many requests".

## Congratulations, you completed a quickstart

Try another quickstart (above) for more awesome.

Why not try one of the other getting started guides (above) or some of the
examples in our documentation:

- [Write your own policies](/policies)
- [Archive requests to storage](/docs/guides/archiving-requests-to-storage)
- [Setting up JWT auth with Auth0](/docs/guides/setup-jwt-auth-with-auth0)
