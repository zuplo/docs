---
title: An Instant Developer Portal
---

Zuplo is an API gateway that helps any business offer a stripe quality experience to developers using their API. We previously posted about the [three pillars of an API program](https://www.zuplo.com/blog/2022/05/11/the-three-pillars-of-an-API-program/) previously, one of which is **documentation**. 

You can quickly setup a gateway for your API in Zuplo, which includes a developer portal, example shown below:

![Developer Portal](../../static/media/quickstarts/instant-developer-portal/dev-portal-example.png)

Follow this guide to have an example portal up and running in minutes. 

## Overview

Zuplo uses a `routes.json` file to configure all the routes in the gateway, including any policies applied (like validation and authentication policies) and also stores the metadata that drives the content of the developer portal.

Sign in to Zuplo and get your free developer account at [portal.zuplo.com](https://portal.zuplo.com) and follow these simple steps to see the developer portal in action.

## Step 1 - Create a new Zuplo Gateway

Once you've signed into the portal you'll be prompted to create a new gateway. Enter a name and click create - in a matter of seconds you'll be able to edit the configuration of your gateway (and developer portal).

## Step 2 - Create some routes

:::tip

You can also import an Open API specification to setup your gateway and `routes.json` quickly. This feature is in private-beta - e-mail us at [whatzup@zuplo.com](mailto:whatzup@zuplo.com) to request access. 

:::

You can use the **Route Designer** to edit your `routes.json` file. Let's add some routes, so that there is something to see in your developer portal. I recommend adding 2 routes:

### Route 1
* Method: `GET`
* Path: `/products/:productId`
* URL Rewrite: `https://ecommerce-api.zuplo.io/products/${params.productId}`

### Route 2
* Method: `POST`
* Path: `/products/:productId`
* URL Rewrite: `https://ecommerce-api.zuplo.io/products/${params.productId}`

## Step 3 - Customize your documentation

You can already check out your developer portal. The link is at the top left of the portal, example shown below

![Open Your Developer Portal](../../static/media/quickstarts/instant-developer-portal/dev-portal-link.png)

You'll see lots of placeholder text "Lorem ipsum" for your documentation. You can update this by editing the `routes.json` file and saving your changes. The developer portal will update automatically and always be in-sync with your gateway. 

## Step 4 - Add JSON Schema validation to specify a request body

Zuplo can automatically validate the body of incoming JSON requests using JSON Schema. We provide an example schema (at `schemas/example-schema.json`). To add this to your second route open the **Policies** section and click **Add Policy** to the request pipeline. Choose the JSON Body Validation schema and click OK (this defaults to use the example schema).

Click save and check your developer portal again - note that now the second operation now specifies details about the body and even gives an example in code.3

## What next?

If you haven't already, why not try the [Getting Started guide](https://www.zuplo.com/docs/overview/) and setup a gateway with Rate-Limiting and API-Key authentication. It's easy!

