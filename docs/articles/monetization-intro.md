---
title: Introduction
---

Zuplo enables you to monetize your APIs in a way that has powerful defaults but
keeps a flexible implementation to fit your needs.

Your customers can have monthly subscriptions to your API, and you can create
different limits and features for each plan.

A pricing page is automatically generated for you with your Zuplo
[Developer Portal](/docs/articles/developer-portal.md) so that your customers
can easily see the different plans and sign up for them directly on your API
documentation.

![](https://cdn.zuplo.com/assets/d3b39d6e-2d20-4337-a839-700c1ce1a0c3.png)

You can also see all your API analytics with Zuplo to understand how your
customers are using your API.

![](https://cdn.zuplo.com/assets/353fb3d5-f019-443b-92d6-a4127814b1f0.png)

## About This Guide

At the end of this guide, you will have a fully monetized API with Zuplo. The
API will have a Basic and a Pro plan, both with different limits in terms of
requests per month and custom limit that we'll call `computeUnits` which can
represent any custom credit system you want to use for your API.

The guide is divided into the following sections:

- [Step 1 - Understanding Zuplo + Stripe](/docs/articles/monetization-understanding-stripe.md)
- [Step 2 - Creating your Stripe Products](/docs/articles/monetization-create-stripe-product.md)
- [Step 3 - Creating a simple API with Zuplo](/docs/articles/monetization-create-zuplo-api.md)
- [Step 4 - Creating your API Plans](/docs/articles/monetization-creating-api-plan.md)
- [Step 5 - Creating a Pricing Page](/docs/articles/monetization-pricing-page.md)

## Supported Pricing Models

At the moment, the only supported pricing model is monthly subscription plans.
We believe this is the most common use case for API monetization as it allows
for predictable billing (e.g. OpenAI has
[changed](https://fozzels.com/en/changes-with-openai-billing-from-post-pay-to-pre-pay/)
recently its billing model to subscription-based).

We recognize that every company has a different use-case and will be adding more
pricing models in the very near future.

## Supported Payment Processors

Zuplo uses [Stripe](https://stripe.com) as the billing and payments processor.
You will need to create a Stripe account to use Zuplo's monetization features.
