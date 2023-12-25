Rate-limiting allows you to set a maximum rate of requests for your API gateway. This is useful to enforce rate limits agreed with your clients and protect your downstream services.

The Zuplo Rate-Limit allows you to limit based on different attributes of the incoming request. For example, you might set a rate limit of 10 requests per second per user, or 20 requests per second for a given IP address.

The Zuplo rate-limiter also allows you to set a custom bucket name by which to effect a rate-limit using a function.

When a client reaches a rate limit - they will receive a `429` response code.
