---
title: Step 1 - Stripe + Zuplo
---

To accept payments from your customers, Zuplo uses [Stripe](https://stripe.com)
as the billing and payments processor. You will need to create a Stripe account
to use Zuplo's monetization features.

Stripe, you allow you to easily define your pricing plans, create payment
checkouts and manage your customers subscription. Zuplo will handle the API
access control based on the customer's subscription status and limits.

In Zuplo, the different API plans are called _**Plans**_. In Stripe, the pricing
plans are called _**Products**_. Each API plan in Zuplo is connected to a
product in Stripe as follows:

![Zuplo Plans and Stripe Products](https://cdn.zuplo.com/assets/3dd78386-2b93-41f4-b81f-a841e5314a4f.png)

In the next section, we will walk you through the process of setting up your
Stripe account and integrating it with your Zuplo project.

::: note

Currently, Stripe has limited support for countries and currencies. If you are
in a country that Stripe does not support, please
[let us know](https://discord.zuplo.com) and we will work with you to find a
solution: https://discord.zuplo.com

:::
