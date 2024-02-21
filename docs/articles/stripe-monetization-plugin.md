---
title: Stripe Monetization Plugin
sidebar_label: Stripe Monetization Plugin
---

The Stripe Monetization Plugin makes it easy to register a Stripe Webhook in
your Zuplo API that will handle Stripe subscription events.

The Plugin is registered in the `zuplo.runtime.ts` extension. It requires
setting the `webhooks.signingSecret` value and the `stripeSecretKey` in order to
function.

When you register the Stripe Monetization Plugin, a new route is configured on
your API at the path `/__plugins/stripe/webhook`. This route is used to receive
webhooks sent by Stripe for subscription events.

There is additional configuration if you want to customize the path, etc. In
most cases, no additional configuration is required.

```ts
import {
  RuntimeExtensions,
  StripeMonetizationPlugin,
  environment,
} from "@zuplo/runtime";

export function runtimeInit(runtime: RuntimeExtensions) {
  // Create the Stripe Plugin
  const stripe = new StripeMonetizationPlugin({
    webhooks: {
      signingSecret: environment.STRIPE_WEBHOOK_SIGNING_SECRET,
    },
    stripeSecretKey: environment.STRIPE_SECRET_KEY,
  });
  // Register the plugin
  runtime.addPlugin(stripe);
}
```

## Debugging & Troubleshooting

The Plugin emits logs that show what the Webhook is doing. For example, when a
new subscription is created, the plugin will log information about the Stripe
subscription, user, etc.

If are having trouble with the Webhooks, reviewing the logs for the Plugin is
the place to start.

Additionally, you can use the Stripe
[Webhook logs](https://dashboard.stripe.com/test/webhooks) in the Stripe
Dashboard to view the webhooks that were send and their status. You can also
resend a webhook event.

![Stripe Webhooks](../../public/media/stripe-monetization-plugin/image.png)
