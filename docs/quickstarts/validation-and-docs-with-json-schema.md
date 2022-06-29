---
title: API Request Validation with JSON Schema
sidebar_label: API Request Validation
---

Zuplo is an API gateway that helps any business offer a Stripe-quality experience to developers. You can quickly set up a gateway for your any API, and add validation and documentation in minutes using JSON Schema.

Before we start, create a new project in [portal.zuplo.com](https://portal.zuplo.com)

## 1/ Create a route

:::tip

You can also import an OpenAPI specification to setup your gateway and `routes.json` quickly. This feature is in private beta - e-mail us at [whatzup@zuplo.com](mailto:whatzup@zuplo.com) to request access.

:::

Your project will open on the **Route Designer** which helps you edit the `routes.json` file. Let's add a route with the following properties:

- Method: `POST`
- Path: `/products`
- URL Rewrite: `https://ecommerce-api.zuplo.io/products`

This route will create a proxy where the gateway will forward traffic to our demo API at `https://ecommerce-api.zuplo.io/`.

## 2/ Add a JSON Schema

Go to [JSONSchema.net](https://jsonschema.net) and sign in (or **continue as guest**) and paste the following example JSON (a product) in the left window:

```
{
    "name" : "Intelligent Metal Salad",
    "description" : "A slim & simple Metal Gaming Keyboard",
    "material" : "Metal",
    "price" : 894.26
}
```

Click **submit** button to generate your JSON Schema specification in the right window. Click the copy button at the top right to copy the generated JSON Schema specification.

Now, in the [Zuplo portal](https://portal.zuplo.com) make sure you're on the Files tab and click the **[+]** button next to the schemas folder. Choose **New Empty Schema** and enter the file name `product.json`. Paste your JSON Schema definition into the empty file and save your changes.

## 3/ Add JSON Schema validation to specify a request body

Zuplo can automatically validate the body of incoming requests using your new JSON Schema. To add this to your route, open **routes.json** again and expand the **Policies** section of your route. Click **Add Policy** to the request pipeline. Choose the JSON Body Validation schema and change the policy configuration as follows (note that it specifies your new file):

```
{
  "export": "ValidateJsonSchemaInbound",
  "module": "$import(@zuplo/runtime)",
  "options": {
    "validator": "$import(./schemas/product.json)"
  }
}
```

Save your changes - your API is now live with validation. Test it out using the **API Test Console** tab. Also, check out your developer portal by clicking the **Open your Developer Portal** link at the top left of the screen. Note that the documentation contains information about the request body (and you can add much more metadata in the `routes.json` file too to enhance your docs).

## Congratulations - you validated requests with JSON Schema

**Related Docs**

- [JSON Schema Validation Policy](../policies/validate-json-schema-inbound.md)
- [API Gateway Quickstart](../quickstarts/proxy-public-api.md)

**Next Steps**

- [Add API Key Auth to and API](../quickstarts/add-api-key-auth.md)
- [Dynamic Rate Limiting](../quickstarts/per-customer-rate-limits.md)
