---
title: Monetization Subscriptions
sidebar_label: Monetization Subscriptions
---

You can programmatically access details of your users subscription when using Zuplo monetization. Here's an example inbound policy that logs the subscription details.

```ts

import {MonetizationInboundPolicy, ZuploContext, ZuploRequest} from "@zuplo/runtime";

export default async function policy(
  request: ZuploRequest,
  context: ZuploContext,
  options: never,
  policyName: string
) {

  const subscription = MonetizationInboundPolicy.getSubscription(context);
  context.log.info(subscription);

  return request;
}
```

This would log the following structure

```json

{
	"id": "sbsc_n8y6RkUYmAthRGt4tUM8EePt",
	"planIds": [
		"plan_1GkE37DZRQs29J2PpXC0sTjB"
	],
	"planExternalIds": [
		"prod_PbcDg7ohd8QzCj"
	],
	"createdOn": "2024-02-23T21:16:59Z",
	"updatedOn": "2024-02-23T21:16:59Z",
	"quotaResetAnchor": "2024-02-23T21:16:59Z",
	"status": "active",
	"type": "periodic",
	"renewalStrategy": "monthly",
	"region": "us-central1",
	"customerKey": "0bcdec7c-ee20-439f-914a-a38f5d8256b3",
	"subscriptionExternalId": "sub_1On673I1Q9RiM35BdA28auPZ",
	"customerExternalId": "cus_PcKmSeuE3fiVAY",
	"metadata": {
		"subscriber": {
			"email": "example@example.com",
			"sub": "auth0|65d9dab23c1p7e25f84b8b09"
		}
	},
	"nextBillingCycle": "2024-03-23T00:00:00Z",
	"meters": {
		"requests": {
			"max": 10,
			"available": 10
		}
	}
}

```

If no subscription is available, `getSubscription` will return `undefined`.

Note how you can see details about the subscriber (e-mail and JWT 'sub' from the dev-portal sign-in) and the current consumption level of the meters specified on their plan. 

This information is only available in the pipeline _after_ the `MonetizationInboundPolicy` has executed (this loads the subscription data).