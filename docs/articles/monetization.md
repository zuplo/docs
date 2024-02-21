---
title: Introduction
---

Zuplo enables you to monetize your APIs in a way that has powerful defaults
while keeping a flexible implementation to fit your needs.

Your customers can have monthly subscriptions to your API, and you can create
different limits and features for each plan.

A pricing page is automatically generated for you with your Zuplo
[Developer Portal](/docs/articles/developer-portal.md) so that your customers
can easily see the different plans and sign up for them directly on your API
documentation.

![](https://cdn.zuplo.com/assets/ed61dd91-a28e-4460-a97c-dc7f87599887.png)

You can also see all your API analytics to understand how your customers are
using your API.

![](https://cdn.zuplo.com/assets/353fb3d5-f019-443b-92d6-a4127814b1f0.png)

## About This Guide

At the end of this guide, you will have a fully monetized API with Zuplo. The
API will have multiple plans with different limits in terms of requests per
month.

The guide is divided into the following sections:

- [Step 1 - Setup Developer Portal Monetization](/docs/articles/monetization-dev-portal-setup.md)
- [Step 2 - Connect Stripe Webhook](/docs/articles/monetization-webhook-setup.md)
- [Step 3 - Monetization Policy](/docs/articles/monetization-policy-setup.md)

## Payment Processor & Pricing Model

Zuplo uses [Stripe](https://stripe.com) as the billing and payments processor.
You will need to create a Stripe account to use Zuplo's monetization features.

We exclusively support monthly subscription plans. We believe this is the most
common use case for API monetization as it allows for predictable billing.

<Callout type="caution" title="Countries and currencies support" >If Stripe does
not support your country or currency, please
[let us know](https://discord.zuplo.com) and we will work with you to find a
solution. </Callout>
