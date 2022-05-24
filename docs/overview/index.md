---
title: Getting Started
---

The goal of this article is to help you quickly evaluate Zuplo, a gateway that makes it easy to compose your microservices, or protect and share an API. It’s different because it’s programmable, which means it’s easy to add custom code to your gateway.

In this tutorial we’ll create a new gateway that proxies an example API and adds rate-limiting, API key authentication, and customize a developer portal.

There are two ways to evaluate Zuplo:

- **Online, cloud-hosted experience** - sign in for free at [portal.zuplo.com](http://portal.zuplo.com) and have a gateway live in 20s using our web editor.

  <CtaButton text="Sign in →" url="https://zuplo.link/38QeWy5" />

- **Download Zuplo locally** - install Zuplo on your local machine and edit the source using your preferred IDE.

   <CtaButton text="Download" url="https://zuplo.link/38I8HfY" />

For the rest of tutorial, we’ll assume you’re using our web experience (it’s the fastest way to evaluate Zuplo).

## 1. Sign up at [portal.zuplo.com](http://portal.zuplo.com) and create a project.

Sign up for your free trial at [portal.zuplo.com](http://portal.zuplo.com). Once signed in enter a name for your project (or accept the suggestion) and click Create Project. You can connect your project to GitHub if you wish.

We've designed Zuplo to be easy to get started, our goal is you go from zero to live API gateway in under 2 minutes. [Let us know if we fail on this and why](https://discord.gg/CEZrnZN897)!

Before you know it you'll have a Stripe-quality API experience you'll be proud of.

## 2. Setup your first route

Open the routes.json file in the file editor on the left. Change the first route's **path** to `/products/:productId` and the **URL Rewrite** to `https://ecommerce-api.zuplo.io/products/${params.productId}`.

You now have a route on your gateway that matches an incoming request like `/products/10000` and forwards it to `https://ecommerce-api.zuplo.io/products/10000`.

![Route](../../static/media/embed/getting-started/route.png)

## 3. Add authentication and protection

Next, we’ll add two policies to this route:

- API-Key Authentication
- Rate-limiting

Click the **Add Policy** button on the request pipeline and add each of these policies.

![Auth Policy](../../static/media/embed/getting-started/auth-policy.png)

## 4. Setup an API Consumer

Now that your API is protected with API-Key authentication you need to create an API consumer that can generate a key. Head to the <image width="15" height="15" src="../../static/media/embed/getting-started/settings.png" alt="settings" /> **Settings** section and choose **API Key Consumers**.

![API Key Consumers](../../static/media/embed/getting-started/api-key-consumers.png)

Click Add new consumer [3] and enter a name for your API key, and enter your own e-mail address as the manager (so that you can create a key to complete the demo), then click Save - you can leave the metadata blank.

## 5. Visit your developer portal to create a key

Click on the **Your Dev Portal** link near the top left of the portal.

![Open Portal](../../static/media/embed/getting-started/open-portal.png)

You’ll see the documentation that has been automatically generated for your API 🎉. Click the sign-in button at the top right and sign in with your e-mail address. Click the API Key tab - you should see the name of the key you set up in step 3. Click Create key to generate your API key and copy it to your clipboard... you’re ready to go.

## Now test your API 🚀

Open the integrated <image width="15" height="15" src="../../static/media/embed/getting-started/test-console.png" alt="settings" /> **API Test Console** [1] and set the path to `/products/10000` [2]. Hit **Test** [3] to fire an unauthenticated request to your API - you should get a **401 Unauthorized** response.

![Test API](../../static/media/embed/getting-started/test-api.png)

Now add an `authorization` header with the format `Bearer <apikey>` [4], using the API key you copied from the developer portal - you should get a **200** 🎊 .

Finally, hit **Test** [3] a few more times to test that rate limiting ✋.
