---
title: Rate Limiting
---

Rate limiting controls how many requests a client can make to your API within a
given time window. It protects your backend from traffic spikes, enforces fair
usage across consumers, and enables tiered access for different customer plans.

Zuplo's rate limiter uses a **sliding window algorithm** enforced globally
across all edge locations. Unlike a fixed window algorithm (which resets
counters at fixed intervals and can allow bursts at window boundaries), the
sliding window continuously tracks requests over a rolling time period. This
produces smoother, more predictable throttling behavior.

When a client exceeds the limit, they receive a `429 Too Many Requests` response
with a `Retry-After` header indicating when they can retry.

## Key terms

A few terms show up repeatedly in the rate limiting docs. They are related but
not interchangeable.

- **Counter (or bucket)** — The running tally Zuplo keeps for a single caller
  and a single policy. Each unique combination of policy `name` and caller
  identifier gets its own counter. Two different policies tracking the same
  caller do _not_ share a counter; two different callers under the same policy
  do not share a counter either.
- **Rate limit key** — The string value that identifies a caller for bucketing.
  For `rateLimitBy: "ip"` the key is the client's IP address; for `"user"` it is
  `request.user.sub`; for `"function"` it is whatever your custom function
  returns as `CustomRateLimitDetails.key`; for `"all"` there is a single
  implicit key shared by every request to the route.
- **`identifier` option** — A field in the policy's configuration that points
  Zuplo at your custom TypeScript function when `rateLimitBy` is `"function"`.
  Zuplo calls that function on each request, and the function returns a
  `CustomRateLimitDetails` object whose `key` property becomes the rate limit
  key. In short: `identifier` is _where the function lives_; `key` is _what the
  function returns_.

## Rate limiting policies

Zuplo provides two rate limiting policies, each suited to different levels of
complexity.

### Rate Limiting policy

The [Rate Limiting policy](../policies/rate-limit-inbound.mdx) enforces a single
request counter per time window. Configure a maximum number of requests, a time
window, and how to identify callers.

```json
{
  "name": "my-rate-limit-policy",
  "policyType": "rate-limit-inbound",
  "handler": {
    "export": "RateLimitInboundPolicy",
    "module": "$import(@zuplo/runtime)",
    "options": {
      "rateLimitBy": "user",
      "requestsAllowed": 100,
      "timeWindowMinutes": 1
    }
  }
}
```

Use this policy when you need a straightforward "X requests per Y minutes"
limit.

### Complex Rate Limiting policy

The [Complex Rate Limiting policy](../policies/complex-rate-limit-inbound.mdx)
supports **multiple named counters** in a single policy. Each counter tracks a
different resource or unit of work.

```json
{
  "name": "my-complex-rate-limit-policy",
  "policyType": "complex-rate-limit-inbound",
  "handler": {
    "export": "ComplexRateLimitInboundPolicy",
    "module": "$import(@zuplo/runtime)",
    "options": {
      "rateLimitBy": "user",
      "timeWindowMinutes": 1,
      "limits": {
        "requests": 100,
        "compute": 500
      }
    }
  }
}
```

You can override counter increments programmatically per request using
`ComplexRateLimitInboundPolicy.setIncrements()`. This is useful for usage-based
pricing where different endpoints consume different amounts of a resource (for
example, counting compute units or tokens instead of raw requests).

## Choosing a policy

| Scenario                                               | Policy                                                     |
| ------------------------------------------------------ | ---------------------------------------------------------- |
| Fixed requests-per-minute limit for all callers        | Rate Limiting                                              |
| Different limits per customer tier (free vs. paid)     | Rate Limiting with a custom function                       |
| Counting multiple resources (requests + compute units) | Complex Rate Limiting (enterprise)                         |
| Usage-based billing with variable cost per request     | Complex Rate Limiting with dynamic increments (enterprise) |

## How `rateLimitBy` works

The `rateLimitBy` option determines how the rate limiter groups requests into
buckets. Both policies support the same four modes.

### `ip`

Groups requests by the client's IP address. No authentication is required. This
is the simplest option and works well for public APIs or as a first layer of
protection.

:::caution

Be aware that multiple clients behind the same corporate proxy, cloud NAT, or
shared Wi-Fi network can share a single IP address. In these cases, IP-based
rate limiting can unfairly throttle unrelated users. For authenticated APIs,
prefer `rateLimitBy: "user"` instead.

:::

### `user`

Groups requests by the authenticated user's identity (`request.user.sub`). When
using [API key authentication](../articles/api-key-authentication.mdx), the
`sub` value is the consumer name you assigned when creating the API key. When
using JWT authentication, it comes from the token's `sub` claim.

This is the recommended mode for authenticated APIs because it ties limits to
the actual consumer rather than a shared IP address.

:::note

The `user` mode requires an authentication policy (such as API Key
Authentication or JWT authentication) earlier in the policy pipeline. If no
authenticated user is present on the request, the policy returns an error.

:::

### `function`

Groups requests using a custom TypeScript function that you provide. The
function returns a `CustomRateLimitDetails` object containing a grouping key
and, optionally, overridden values for `requestsAllowed` and
`timeWindowMinutes`.

This mode enables dynamic rate limiting where limits vary based on customer
tier, route parameters, or any other request property.

### `all`

Applies a single shared counter across all requests to the route, regardless of
who makes them. Use this for global rate limits on endpoints that call
resource-constrained backends.

## Dynamic rate limiting with custom functions

When `rateLimitBy` is set to `"function"`, you provide a TypeScript module that
determines the rate limit at request time. The function signature is:

```ts
import {
  CustomRateLimitDetails,
  ZuploContext,
  ZuploRequest,
} from "@zuplo/runtime";

export function rateLimit(
  request: ZuploRequest,
  context: ZuploContext,
  policyName: string,
): CustomRateLimitDetails | undefined {
  const user = request.user;

  if (user.data.customerType === "premium") {
    return {
      key: user.sub,
      requestsAllowed: 1000,
      timeWindowMinutes: 1,
    };
  }

  return {
    key: user.sub,
    requestsAllowed: 50,
    timeWindowMinutes: 1,
  };
}
```

The `CustomRateLimitDetails` object has the following properties:

- `key` - The string used to group requests into rate limit buckets
- `requestsAllowed` (optional) - Overrides the policy's `requestsAllowed` value
- `timeWindowMinutes` (optional) - Overrides the policy's `timeWindowMinutes`
  value

Returning `undefined` skips rate limiting for that request entirely.

The function can also be `async` if you need to look up limits from a database
or external service. See
[Per-user rate limiting using a database](./per-user-rate-limits-using-db.mdx)
for a complete example using the ZoneCache for performance.

Wire the function into the policy configuration using the `identifier` option:

```json
{
  "export": "RateLimitInboundPolicy",
  "module": "$import(@zuplo/runtime)",
  "options": {
    "rateLimitBy": "function",
    "requestsAllowed": 50,
    "timeWindowMinutes": 1,
    "identifier": {
      "export": "rateLimit",
      "module": "$import(./modules/rate-limit)"
    }
  }
}
```

:::note

The `requestsAllowed` and `timeWindowMinutes` values in the policy configuration
serve as defaults. The custom function can override them per request.

:::

## Combining rate limiting with authentication

Rate limiting works best when combined with authentication so that limits apply
per consumer rather than per IP. A typical policy pipeline is:

1. **Authentication** (e.g., API Key Authentication) -- validates credentials
   and populates `request.user`
2. **Rate Limiting** with `rateLimitBy: "user"` -- enforces per-consumer limits
   using `request.user.sub`

With API key authentication, the consumer's metadata (stored when creating the
key) is available at `request.user.data`. A custom rate limit function can read
fields like `customerType` or `plan` from the metadata to apply tiered limits.

## Rate limiting and monetization

If you use Zuplo's
[Monetization](../articles/monetization/monetization-policy.md) feature, the
monetization policy handles quota enforcement based on subscription plans. You
can still add a rate limiting policy after the monetization policy to provide
per-second or per-minute spike protection on top of monthly billing quotas.
These serve different purposes:

- **Monetization quotas** enforce monthly or billing-period usage limits tied to
  a subscription plan
- **Rate limiting** protects against short-duration traffic spikes that could
  overwhelm your backend

## Combining multiple rate limit policies

You can apply multiple rate limiting policies to the same route. For example,
you might enforce both a per-minute and a per-hour limit. When using multiple
policies, apply the longest time window first, followed by shorter durations.
This ordering ensures that the broadest limit is checked first — if a caller has
exhausted their hourly quota, the request is rejected immediately without
incrementing the shorter-duration counter.

## Additional options

Both rate limiting policies support the following additional options:

- `headerMode` - Set to `"retry-after"` (default) to include the `retry-after`
  header in 429 responses, or `"none"` to omit it. The `retry-after` value is
  returned as a number of seconds (delay-seconds format).
- `mode` - Set to `"strict"` (default) or `"async"`. In **strict** mode, the
  request is held until the rate limit check completes — the backend is never
  called if the limit is exceeded. This adds some latency to every request
  because the check hits a globally distributed rate limit service. In **async**
  mode, the request proceeds to the backend in parallel with the rate limit
  check. This minimizes added latency but means some requests may get through
  even after the limit is exceeded. Async mode is a good fit when low latency
  matters more than exact enforcement.
- `throwOnFailure` - Controls behavior when the rate limit service is
  unreachable. When set to `false` (default), requests are allowed through
  (fail-open). When set to `true`, the policy returns an error to the client.
  The fail-open default prevents a rate limit service outage from blocking all
  traffic to your API.

## Related resources

- [Rate Limiting policy reference](../policies/rate-limit-inbound.mdx)
- [Complex Rate Limiting policy reference](../policies/complex-rate-limit-inbound.mdx)
- [Dynamic Rate Limiting tutorial](../articles/step-5-dynamic-rate-limiting.mdx)
- [Per-user rate limiting with a database](./per-user-rate-limits-using-db.mdx)
- [Quota policy](../policies/quota-inbound.mdx)
- [Monetization policy](../articles/monetization/monetization-policy.md)
