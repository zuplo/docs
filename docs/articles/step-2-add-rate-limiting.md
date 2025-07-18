---
title: Step 2 - Add Rate Limiting
sidebar_label: "Step 2 - Rate Limiting"
---

In this guide we'll add Rate Limiting to a route. You can do this for any Zuplo
project but will need a route, consider completing
[Step 1](./step-1-setup-basic-gateway.md) first.

Rate Limiting is one of our most popular **policies** - you should never ship an
API without rate limiting because your customers or internal developers **will**
accidentally DDoS your API. Usually with a rogue `useEffect` call in React code.

:::info{title="What's a Policy?"}

[Policies](./policies.md) are modules that can intercept and transform an
incoming request or outgoing response. Zuplo offers a wide range of policies
built-in (including rate limiting) to save you time. You can check out
[the full list](../policies.md).

:::

Zuplo offers a programmable approach to rate limiting that allows you to vary
how rate limiting is applied for each customer, or request.

Implementing truly distributed, high performance Rate Limiting is difficult, our
promise is that using Zuplo is cheaper and faster than doing this yourself.

## 1/ Add the rate-limiting Policy

Navigate to your route in the **Route Designer** (**Code** > `routes.oas.json`),
click the **Policies** dropdown, then click **Add Policy** on the request
pipeline.

![Add policy](../../public/media/step-2-add-rate-limiting/image.png)

Search for the rate limiting policy (not the "Complex" one) and click it.

![Add rate-limiting policy](../../public/media/step-2-add-rate-limiting/choose-rate-limiter.png)

By default, the policy will rate limit based on the caller's IP address (as
indicated by the `rateLimitBy` field). It will allow 2 requests
(`requestsAllowed`) every 1 minute (`timeWindowMinutes`). You can explore the
rest of the policy's documentation and configuration in the right panel.

![Rate limiting policy](../../public/media/step-2-add-rate-limiting/create-policy.png)

To apply the policy, click **OK**. Then, save your changes to redeploy.

## 2/ Testing your Policy

Now try firing some requests against your API. You should receive a **429 Too
many requests** on your 3rd request.

![429 response](../../public/media/step-2-add-rate-limiting/test-api.png)

Your rate limiting policy is now intercepting excess requests, protecting the
`getting-started` API.

## 3/ View your API Documentation

Whenever you deploy a new endpoint on Zuplo, it will automatically be added to
your
[auto generated developer documentation portal](../dev-portal/introduction.md).

To access your API's developer portal, click the **Gateway deployed** button in
your toolbar and click the link under Developer Portal.
![Developer portal menu](../../public/media/step-2-add-rate-limiting/image-5.png)
You can also find this link in the Getting Started section of the portal, every
time you navigate to your project.

![Developer Portal Endpoint](../../public/media/step-2-add-rate-limiting/image-7.png)

When you use certain policies like rate limiting, Zuplo will document the
responses and headers associated with that policy. As you can see on the right,
the rate limiting policy's 429 response has been documented for you.

Another common method of protecting APIs is through authentication, let's add
that next.

**NEXT** Try [Step 3 - Add API Key Authentication](./step-3-add-api-key-auth).
