---
title: How Rate Limiting Works
sidebar_label: How It Works
---

This page covers the mechanics behind Zuplo's rate limiter: how requests are
counted, what each `rateLimitBy` mode does in detail, and every configuration
option available. If you just want to add a rate limit to your API, start with
the [Getting Started guide](./getting-started.mdx) instead — this page is the
deep dive you can read alongside or after it.

Zuplo's rate limiter uses a **sliding window algorithm** enforced globally
across all edge locations. Unlike a fixed window algorithm (which resets
counters at fixed intervals and can allow bursts at window boundaries), the
sliding window continuously tracks requests over a rolling time period. This
produces smoother, more predictable throttling behavior.

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

## How `rateLimitBy` works

The `rateLimitBy` option determines how the rate limiter groups requests into
buckets. Both the standard
[Rate Limiting policy](../policies/rate-limit-inbound.mdx) and the
[Complex Rate Limiting policy](../policies/complex-rate-limit-inbound.mdx)
support the same four modes.

### `ip`

Groups requests by the client's IP address. No authentication is required. This
is the simplest option and works well for public APIs or as a first layer of
protection.

:::caution

Multiple clients behind the same corporate proxy, cloud NAT, or shared Wi-Fi
network can share a single IP address. In these cases, IP-based rate limiting
can unfairly throttle unrelated users. For authenticated APIs, prefer
`rateLimitBy: "user"` instead.

:::

### `user`

Groups requests by the authenticated user's identity (`request.user.sub`). When
using [API key authentication](../articles/api-key-authentication.mdx), the
`sub` value is the consumer name you assigned when creating the API key. When
using JWT authentication, it comes from the token's `sub` claim.

This is the recommended mode for authenticated APIs because it ties limits to
the actual consumer rather than a shared IP address.

:::note

The `user` mode requires an authentication policy (such as API key or JWT
authentication) earlier in the policy pipeline. If no authenticated user is
present on the request, the policy returns an error. See
[Getting Started §5](./getting-started.mdx#5-rate-limit-authenticated-users) for
a full authenticated pipeline example.

:::

### `function`

Groups requests using a custom TypeScript function that you provide. The
function returns a `CustomRateLimitDetails` object containing a grouping key
and, optionally, overridden values for `requestsAllowed` and
`timeWindowMinutes`. See
[Custom rate limit functions](#custom-rate-limit-functions) below for the
function signature and field reference.

### `all`

Applies a single shared counter across all requests to the route, regardless of
who makes them. Use this for global rate limits on endpoints that call
resource-constrained backends.

## Custom rate limit functions

When `rateLimitBy` is set to `"function"`, Zuplo calls a TypeScript function you
provide on every request. The function receives the request, context, and policy
name, and returns a `CustomRateLimitDetails` object describing how to count that
request.

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
  return {
    key: request.user.sub,
    requestsAllowed: 100,
    timeWindowMinutes: 1,
  };
}
```

### `CustomRateLimitDetails`

- `key` (required) — The string used to group requests into rate limit buckets.
- `requestsAllowed` (optional) — Overrides the policy's `requestsAllowed` value
  for this request.
- `timeWindowMinutes` (optional) — Overrides the policy's `timeWindowMinutes`
  value for this request.

Returning `undefined` skips rate limiting for the request entirely — useful for
health checks or privileged callers. The function can also be `async` if you
need to await a database lookup or external service call.

Wire the function into the policy using the `identifier` option. The policy's
configured `requestsAllowed` and `timeWindowMinutes` serve as defaults; the
function can override them per request.

For concrete walkthroughs (tier-based, route-based, method-based,
database-backed, selective bypass), see
[Dynamic Rate Limiting](./dynamic-rate-limiting.mdx). For an advanced
database-backed example with caching, see
[Per-user rate limiting with a database](./per-user-rate-limits-using-db.mdx).

## Additional options

Both rate limiting policies support the following additional options:

- `headerMode` — Set to `"retry-after"` (default) to include the `Retry-After`
  header in 429 responses, or `"none"` to omit it. The `Retry-After` value is
  returned as a number of seconds (delay-seconds format).
- `mode` — Set to `"strict"` (default) or `"async"`. In **strict** mode, the
  request is held until the rate limit check completes — the backend is never
  called if the limit is exceeded. This adds some latency to every request
  because the check hits a globally distributed rate limit service. In **async**
  mode, the request proceeds to the backend in parallel with the rate limit
  check. This minimizes added latency but means some requests may get through
  even after the limit is exceeded. Async mode is a good fit when low latency
  matters more than exact enforcement.
- `throwOnFailure` — Controls behavior when the rate limit service is
  unreachable. When set to `false` (default), requests are allowed through
  (fail-open). When set to `true`, the policy returns an error to the client.
  The fail-open default prevents a rate limit service outage from blocking all
  traffic to your API.

## Related resources

**Go deeper on configuration:**

- [Rate Limiting policy reference](../policies/rate-limit-inbound.mdx) — Every
  option for the standard policy.
- [Complex Rate Limiting policy reference](../policies/complex-rate-limit-inbound.mdx)
  — Multi-counter limits for usage-based pricing (enterprise).

**Learn by example:**

- [Dynamic Rate Limiting tutorial](../articles/step-5-dynamic-rate-limiting.mdx)
  — Tiered limits by customer type.
- [Per-user rate limiting with a database](./per-user-rate-limits-using-db.mdx)
  — Look up limits at request time using ZoneCache and a database.

**Combine with other policies:**

- [Combining Policies](./combining-policies.mdx) — Stack multiple rate limits,
  and pair rate limiting with quotas or monetization.
- [Quota policy](../policies/quota-inbound.mdx) — Monthly or billing-period
  usage caps.
- [Monetization policy](../articles/monetization/monetization-policy.md) —
  Subscription-based access control and metering.
