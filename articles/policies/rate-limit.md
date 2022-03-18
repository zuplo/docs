---
title: Rate-Limit Policy
---

## Overview

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

> Be sure to read about policies
>
> [Policies](/policies)

Here is an example configuration (this would go in the `policies` section of the
routes.json file). This policy would enforce a rate limit of a maximum of 2
requests, every 20 seconds for each unique IP address.

```json
{
  "name": "your-rate-limit-policy",
  "policyType": "basic-rate-limit-policy-inbound",
  "handler": {
    "export": "BasicRateLimitInboundPolicy",
    "module": "$import(@zuplo/runtime)",
    "options": {
      "requestsAllowed": 2,
      "timeWindowSeconds": 20,
      "rateLimitBy": "ip"
    }
  }
}
```

- `name` the name of your policy instance. This is used as a reference in your
  routes.
- `policyType` the identifier of the policy. This is used by the Zuplo UI. Value
  should be `memory-rate-limit-policy-inbound`.
- `handler/export` The name of the exported type. Value should be
  `MemoryRateLimitInboundPolicy`.
- `handler/module` the module containing the policy. Value should be
  `$import(@zuplo/runtime)`.
- `handler/options` The options for this policy:
  - `requestsAllowed` the max number of requests allowed in the given time
    window
  - `timeWindowSeconds` the time window in which the requests are rate-limited.
    The count restarts after each window expires.
  - `rateLimitBy` the identifying element of the request that enforces distinct
    rate limits. For example, you can limit by `user`, `ip`, `function` or
    `all` - function allows you to specify a simple function to create a string
    identifier to create a rate-limit group - this should be set using the
    following two properties:
  - `identifier` - used only with `rateLimitBy=function`
    - `module` - . Specifies the module to load your custom bucket function, in
      the format `$import(./modules/my-module)`.
    - `export` - used only with `rateLimitBy=function`. Specifies the export to
      load your custom bucket function, e.g. `default`, `rateLimitIdentifier`.

> Note you can have multiple instances of rate-limiting policies to use in
> combination. You should apply the longest duration timeWindow first, in order
> to the shortest duration time window.

## Using a custom function

You can create a rate-limit bucket based on any property of a request using a
custom function that returns a string (that is the identified used by the
limiting system).

This example would create a unique rate-limiting function based on the `foo`
parameter in routes (note it’s important that a policy like this is applied to a
route that has a `/:foo` parameter).

```ts
//module - ./modules/hello-world.ts

import { ZuploRequest } from "@zuplo/runtime"

export function rateLimitKey = (request:ZuploRequest) => {
	return request.params.foo;
}
```

```json
{
  "name": "your-rate-limit-policy",
  "policyType": "basic-rate-limit-policy-inbound",
  "handler": {
    "export": "BasicRateLimitInboundPolicy",
    "module": "$import(@zuplo/runtime)",
    "options": {
      "requestsAllowed": 2,
      "timeWindowSeconds": 20,
      "rateLimitBy": "function",
      "identifier": {
        "module": "$import(./modules/hello-world)",
        "export": "rateLimitKey"
      }
    }
  }
}
```
