---
title: Rate-Limit Policy
sidebar_label: Rate Limiting
sidebar_position: 2
---

Rate-limiting allows you to set a maximum rate of requests for your API gateway.
This is useful to enforce rate limits agreed with your clients and protect your
downstream services.

The Zuplo Rate-Limit allows you to limit based on different attributes of the
incoming request. For example, you might set a rate limit of 10 requests per
second per user, or 20 requests per second for a given IP address.

The Zuplo rate-limiter also allows you to set a custom bucket name by which to
effect a rate-limit using a function.

When a client reaches a rate limit - they will receive a `429` response code.

## Configuration

:::tip

Be sure to read about [policies](/docs/policies)

:::

Here is an example configuration (this would go in the `policies` section of the
routes.json file). This policy would enforce a rate limit of a maximum of 2
requests, every 1 minute for each unique IP address.

<PolicyExample policy="rate-limit-inbound" />

<PolicyOptions policy="rate-limit-inbound" />

:::tip

Note you can have multiple instances of rate-limiting policies to use in combination. You should apply the longest duration timeWindow first, in order to the shortest duration time window.

:::

## Using a custom function

You can create a rate-limit bucket based on any property of a request using a
custom function that returns a `CustomRateLimitPolicyOptions` object (which provides the identifier used by the limiting system).

The `CustomRateLimitPolicyOptions` object can be used to override the `timeWindowMinutes` & `requestsAllowed` options.

This example would create a unique rate-limiting function based on the `customerId` parameter in routes (note it’s important that a policy like this is applied to a route that has a `/:customerId` parameter).

```ts
//module - ./modules/rate-limiter.ts

import { CustomRateLimitPolicyOptions, ZuploRequest } from "@zuplo/runtime";

export function rateLimitKey(
  request: ZuploRequest
): CustomRateLimitPolicyOptions {
  if (request.params.customerId === "43567890") {
    // Override timeWindowMinutes & requestsAllowed
    return {
      key: request.params.customerId,
      requestsAllowed: 100,
      timeWindowMinutes: 1,
    };
  }
  return { key: request.params.customerId };
}
```

<PolicyExample policy="rate-limit-inbound" example="custom-rate-limit" />
