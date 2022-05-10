The rate-limiting policy is used to limit the number of requests that can be
made against your API based on a key.

**Options**

- `rateLimitBy`: Used to determine the key on which to rate limit. Allowed
  values are `ip` to filter by IP address, `user` to filter by the authenticated
  user's `sub`, and `function` for custom rate limiting.
- `requestsAllowed`: the max number of requests allowed in the given time window
- `timeWindowMinutes`: the time window in which the requests are rate-limited.
  The count restarts after each window expires.

[See the documentation for more details](https://www.zuplo.com/docs/policies/rate-limit-inbound/)
