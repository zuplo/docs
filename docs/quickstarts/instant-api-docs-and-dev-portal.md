---
title: Instant API Documentation and Developer Portal
sidebar_label: Instant API Documentation
---

Import your Open API spec or set up a few routes and you’ll have an instant developer portal ready for your API consumers. Follow this guide to get it working in 2 minutes.

Check out an example developer portal [here](https://rickandmorty.zuplo.app/).

Before we start, create a new project in [portal.zuplo.com](https://portal.zuplo.com).

## 1/ Create some routes

In the **Files** tab, click on the **Routes** entry in the **Config** folder. If it’s a new project you’ll have no routes. You can click on “**Import From Open API**” if you have one, or you can add some routes manually.

![Untitled](instant-api-docs-and-dev-portal-media/Untitled.png)

To manually set up some routes, click “**Add Route**” and configure the methods and path properties of a few routes. We suggest trying the following two routes:

**Route 1**

- Method: `GET`
- Path: `/products/:productId`
- URL Rewrite: `https://ecommerce-api.zuplo.io/products/${params.productId}`

**Route 2**

- Method: `POST`
- Path: `/products`
- URL Rewrite: `https://ecommerce-api.zuplo.io/products`

Be sure to save your changes by clicking the disk icon by the **Routes** file or pressing CMD+S (mac) / CTRL+S (windows).

## 2/ View your developer portal

Yes, it’s that easy… now you just need to click the link at the top of the Getting Started guide that says “**Your Developer Portal is live at** …” - that will open a new window with your developer portal.

![Untitled](instant-api-docs-and-dev-portal-media/Untitled%201.png)

## Related docs

- [Developer Portal Overview](../developer-portal/index.md)
- [Configuring Your Portal](../developer-portal/configuration.md)

## Next steps

- [Explore the policy catalog](../policies/index.md)
- [Add API Key Authentication](../quickstarts/add-api-key-auth.md)
