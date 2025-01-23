---
title: Zuplo API Monetization
---

<EnterpriseFeature name="Monetization" />

Zuplo enables you, as an _API provider_, to effortlessly monetize your APIs. It
provides a compelling set of defaults, while also allowing customizations to
suit your company's unique business needs. You can create separate plans for
different customer segments, and set up pricing and usage limits for each.

With Zuplo, your customers can sign up for a plan, all within the
[Zuplo Developer Portal](/docs/articles/developer-portal.md). When your
customers visit the Developer Portal, they're presented with a list of plans
that you have created. They can sign up for a plan and start using your API
instantly.

![Pricing Table](/media/monetization-dev-portal-setup/image.png)

Zuplo also provides powerful analytics for you as an API Provider. You can track
the overall usage of your API, or drill down to see the usage of a particular
customer.

![Analytics](https://cdn.zuplo.com/assets/353fb3d5-f019-443b-92d6-a4127814b1f0.png)

## About This Guide

The guide is divided into the following sections:

- [Step 1 - Set Up Developer Portal](/docs/articles/monetization-dev-portal-setup.md)
- [Step 2 - Configure Subscription Events](/docs/articles/monetization-webhook-setup.md)
- [Step 3 - Configure Monetization Policy](/docs/articles/monetization-policy-setup.md)

At the end of this guide, you will have a fully monetized API with Zuplo. The
API will have multiple plans with different limits.

## Payments

Zuplo uses [Stripe](https://stripe.com) as the billing and payments processor.
You will need to create a Stripe account to use Zuplo's monetization features.
If Stripe doesn't support your country or currency, please
[contact us](https://discord.zuplo.com) and we will work with you to find a
solution.

## Limitations

We're actively developing new features for our monetization product. If a
feature or configuration you need isn't currently documented, please check out
[our limitations list](./monetization-limitations.md).
