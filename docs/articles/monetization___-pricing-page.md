---
title: Step 5 - Creating a Pricing Page
---

In this step, we will create a pricing page for your API, from which your
customers can sign up for your plans.

This pricing page will be automatically generated for you with your Zuplo
[Developer Portal](/docs/articles//developer-portal.md).

## 1/ Create a Stripe Pricing Table

A Stripe Pricing Table is a collection of Stripe Products that you will create a
checkout session for. This checkout will be seamlessly integrated into your API
documentation.

To create one, go back to the Stripe Dashboard and in the **Product Catalog**
page, click on the **Pricing Table** tab, and then **Create pricing table**.

## 2/ Add the two Stripe Products to the Pricing Table

Your Pricing Table will contain the "Basic" and "Pro" products that we created
in [Step 2](/docs/articles/monetization-create-stripe-product.md).

![](https://cdn.zuplo.com/assets/764e6e6a-3783-4c33-b076-c6b0cdacd03d.png)

::: tip

In the image, you can see that counter **1** (in red) shows that each product
can have a feature list described in the pricing page, you can add the feature
list to your products with the **Edit product** button as show with counter
**2**.

:::

Now click on **Continue**.

To redirect your customers back to your API documentation after they complete
the payment, you should click on **Don't show confirmation page** as the image
below; and adding the URL of your API documentation in the redirect URL field.

![](https://cdn.zuplo.com/assets/b96712d6-9d4b-4621-84f9-ca7215b428c9.png)

::: tip

You can get the URL of your API documentation from Zuplo by going to **Code >
Getting Started** and copying the **Developer Portal** URL.

:::

Remember to do the same for the "Pro" product.

Click on **Continue** and finally click on **Finish**. You will now see the
Pricing Table configuration.

## 3/ Add the Stripe environment variables to your Zuplo project

You will need to copy the values of the **Pricing Table ID** and the
**Publishable Key** from the pricing table page, which you can find here.

![](https://cdn.zuplo.com/assets/ec69bb1c-91ce-48e4-b9b8-1738f3d6591d.png)

In Zuplo, go to **Settings > Environment Variables** and add the following
environment variables:

- `ZUPLO_PUBLIC_STRIPE_PRICING_TABLE_ID`: as image above
- `ZUPLO_PUBLIC_STRIPE_PUBLISHABLE_KEY`: as image above
- `STRIPE_SECRET_KEY`: in Stripe, go to **Developers > API keys** and copy the
  **Secret key**.

## 4/ Make sure your Developer Portal is configured to show the pricing page

In Zuplo, go to **Code > dev-portal.oas.json** and make sure that the
Monetization Setting is enabled and looks like the image below.

![](https://cdn.zuplo.com/assets/9454bd3e-2e1f-4b8e-9b74-ae77acd83209.png)
