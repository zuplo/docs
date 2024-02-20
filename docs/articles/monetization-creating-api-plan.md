---
title: Step 4 - Create your API Plans
---

In this step, we will create the plans for your API using Zuplo. An API plan
contains the metering limits of a plan, which your customers will be assigned to
when they subscribe to your API.

A plan can have multiple meters, and each meter can have a different limit. Each
plan will be connected to a product in Stripe.

![Zuplo Plans and Stripe Products](https://cdn.zuplo.com/assets/3dd78386-2b93-41f4-b81f-a841e5314a4f.png)

## 1/ Open the Metering Service

Go to **Services** page using the top menu. You will see the list of services
that your project has including the _Metering Service_ which will contain the
plans for your API.

There are three instances of the Metering Service: one for each environment
(Development or `Working Copy`, `Preview`, and `Production`). You can read more
about your API environments [here](/docs/articles/environments.md).

For this example, we will create the plans in the Working Copy environment to
test them before deploying to Production. Click on **Configure** in the
**Working Copy** instance.

## 2/ Get your Stripe Product ID

We will use this ID to connect the plan to the product in Stripe.

Go to your Stripe Dashboard and open the "Basic" product. You will see the
Product ID at the top of the page.

![Stripe Product ID](https://cdn.zuplo.com/assets/cba6e9ec-a40f-4123-a269-52e49b972109.png)

## 3/ Create the Basic API Plan and configure the limits

Back in Zuplo, in your Working Copy Metering Service, click on the **Create
Plan**.

Fill in the details for the Basic plan as in the image below. As we defined in
[Step 1](/docs/articles/monetization-understanding-stripe.md), the Basic plan
will have the following limits:

```sh
requests: 10 # defines the max number of requests per month
computeUnits: 30 # defines the max number of custom compute units per month
```

![](https://cdn.zuplo.com/assets/4d58f9f9-0ef9-406d-837b-424b321cee97.png)

## 4/ Create the Pro Plan

Repeat the process to create the Pro plan with the details:

- **Name**: Pro
- **External ID**: Your Stripe Product ID for the "Pro" product
- **Meters**:
  - `requests`: 100
  - `computeUnits`: 300

Next, we will create a pricing page for your API so you can subscribe to this
API and get an API key to access the API.
