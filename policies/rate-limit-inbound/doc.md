:::tip

Note you can have multiple instances of rate-limiting policies to use in combination. You should apply the longest duration timeWindow first, in order to the shortest duration time window.

:::

## Using a custom function

You can create a rate-limit bucket based on any property of a request using a
custom function that returns a `CustomRateLimitDetails` object (which provides the identifier used by the limiting system).

The `CustomRateLimitDetails` object can be used to override the `timeWindowMinutes` & `requestsAllowed` options.

This example would create a unique rate-limiting function based on the `customerId` parameter in routes (note it’s important that a policy like this is applied to a route that has a `/:customerId` parameter).

```ts
//module - ./modules/rate-limiter.ts

import { CustomRateLimitDetails, ZuploRequest } from "@zuplo/runtime";

export function rateLimitKey(
  request: ZuploRequest,
  context: ZuploContext,
  policyName: string
): CustomRateLimitDetails {
  context.log.info(
    `processing customerId '${request.params.customerId}' for rate-limit policy '${policyName}'`
  );
  if (request.params.customerId === "43567890") {
    // Override timeWindowMinutes & requestsAllowed
    return {
      key: request.params.customerId,
      requestsAllowed: 100,
      timeWindowMinutes: 1,
    };
  }
}
```

```json
// config - ./config/routes.json
"export": "RateLimitInboundPolicy",
"module": "$import(@zuplo/runtime)",
"options": {
  "rateLimitBy": "function",
  "requestsAllowed": 2,
  "timeWindowMinutes": 1,
  "identifier": {
    "module": "$import(./modules/rate-limiter)",
    "export": "rateLimitKey"
  }
}
```
