---
title: Getting Started
---

# A stripe quality API in 4 steps

There are three pillars to sharing an API: authentication, protection, and documentation. Let’s add all of these features to this sample e-commerce API at `[https://ecommerce-api.zuplo.io](https://ecommerce-api.zuplo.io)` in just 4 steps.

## 1. Setup your first route

Open routes.json in the file editor on the left. Change the first route **path** to `/products/:productId` and the **URL Rewrite** to `[https://ecommerce-api.zuplo.io/${params.productId}](https://ecommerce-api.zuplo.io/${params.productId})`.

![Route](../static/media/embed/getting-started/route.png)

## 2. Add authentication and protection

Next, we’ll add two policies to this route to enforce API-key authentication and rate-limiting. Expand the **Policies** section and click **Add policy** on the request pipeline. Search for **API-Key Authentication** and add that policy.

![Auth Policy](../static/media/embed/getting-started/auth-policy.png)

Next search for **Rate** **Limiting** and choose that policy. Change the `rateLimitBy` property from IP to `user`. That will rate-limit requests based on the API consumer.

:::tip

Many API owners don’t think they need rate limiting protection because they won’t be attacked. However, 99% of the time it’s your customer that attacks you with an accidental for-loop in their code. Don’t ship your API program without protection!

:::

## 3. Setup an API Consumer

Now that your API is protected with API-Key authentication you need to create an API consumer that can generate a key. Head to the **Settings** [1] section and choose **API Key Consumers** [2]**.**

![API Key Consumers](../static/media/embed/getting-started/api-key-consumers.png)

Click Add new consumer [3] and enter a name for your API key, and enter your own e-mail address as the manager (so that you can create a key to complete the demo), then click Save - you can leave the metadata blank.

## 4. Visit your developer portal to create a key

Click on the Your Dev Portal link near the top left of the portal.

![Open Portal](../static/media/embed/getting-started/open-portal.png)

You’ll see the documentation that has been automatically generated for your API 🎉. Click the sign-in button at the top right and sign in with your e-mail address. Click the API Key tab - you should see the name of the key you set up in step 3. Click Create key to generate your API key and copy it to your clipboard... you’re ready to go.

## Now test your API 🚀

Open the integrated **API Test Console** [1] and set the path to `/products/10000` [2]. Hit **Test** [3] to fire an unauthenticated request to your API - you should get a **401 Unauthorized** response.

![Test API](../static/media/embed/getting-started/test-api.png)

Now add an `authorization` header with the format `Bearer <apikey>` [4], using the API key you copied from the developer portal - you should get a **200** 🎊 .

Finally, hit **Test** [3] a few more times to test that rate limiting ✋.
