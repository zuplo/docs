---
title: Step 6 - Configure the Stripe Webhooks
---

In this step, we will configure the Stripe Webhooks to receive events from
Stripe to keep your Zuplo project in sync with your Stripe account.

This is important to keep your customers' subscriptions in sync with your API
and to keep your API access control up to date.

## 1/ Create a Stripe Webhook

In the Stripe Dashboard, go to the **Developers > Webhooks** page and click on
**Add an endpoint**.

Configure the endpoint to point to your Gateway API URL with the path
`/__plugins/stripe/webhooks`.

::: tip

You can find your Gateway API URL in the Zuplo Dashboard by going to **Code >
Getting Started** and copying the **Gateway API URL**.

:::

![](https://cdn.zuplo.com/assets/8341ed15-b603-40fa-b213-328d8767d99d.png)

Finally, click on **Add endpoint**.

## 2/ Add the Stripe Webhook secret to your Zuplo project

Copy the **Signing secret** from the Stripe Dashboard and add it to Zuplo as an
environment variable.

![](https://cdn.zuplo.com/assets/be7b94aa-f7bd-44b2-92fd-3d74ce84a4ab.png)

In Zuplo, go to **Settings > Environment Variables** and add the following
environment variable:

- `STRIPE_WEBHOOK_SIGNING_SECRET`: your signing secret.

Finally, we're done! Your Zuplo project is now connected to your Stripe account
and ready to accept payments and manage your customers' subscriptions.

Next, test your API by subscribing to it with a fake credit card and check if
the API access control is working as expected.
