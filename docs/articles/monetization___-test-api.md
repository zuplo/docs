---
title: Step 7 - Test your API
---

In this step, we will test the API we created in the previous steps. Because
we're using Stripe in Test mode, we can use a fake credit card to subscribe to
the API and test the access control.

## 1/ Subscribe to the API

Go to your Developer Portal and open the pricing page from the top menu. You
will see the list of plans you created in the previous steps.

Click on the **Subscribe** button of the "Basic" plan.

![](https://cdn.zuplo.com/assets/93c2f954-a411-4c72-a88a-54ef600a124e.png)

Fill in the checkout form with the following details:

- **Card number**: `4242 4242 4242 4242`
- **Expiration date**: any future date
- **CVC**: any 3 digits

Click on the **Subscribe** button. You should now be redirected back to the API
documentation as configured in
[Step 5](/docs/articles/monetization-pricing-page.md).

## 2/ Use the generated API key to access the API

You will now see your API key in the **API Key** and subscription details in the
Developer Portal.

![](https://cdn.zuplo.com/assets/9ab53b05-6e78-4998-b233-9da38c8759b0.png)

Navigate to the API reference and select the endpoint you want to test. Your API
key will be prefilled in the **API Key** field. Click on **Test**.

![](https://cdn.zuplo.com/assets/7e56f669-ba99-4a89-91c3-6f979a798f73.png)

## 3/ Hit the limits of your plan

The Basic plan has a limit of 10 requests per month. You can test this by making
10 requests to the `/v1/todos` endpoint. Just click on **Test** a few more times
😉. Once you hit the limit, you should see error `429 - Quota Exceeded`.

You've now successfully monetized your API! 🥳
