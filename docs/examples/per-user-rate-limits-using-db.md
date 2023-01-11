---
title: Per user rate-limiting using a database and the ZoneCache
---

In this example we show a more advanced implementation of [dynamic rate limiting](../quickstarts/per-customer-rate-limits.md). It uses a database lookup to get the customer details and combines that with the ZoneCache to improve performance, reduce latency and lower the load on the database.

In this example we use [supabase](https://supabase.com) as the database but you could use your own API, [Xata](xata.io), [Firebase](firebase.com) etc. The implementation will be similar for all.

If you haven't already, check out the [rate-limiting policy](../policies/rate-limit-inbound.md) and the [dynamic rate limiting quickstart](../quickstarts/per-customer-rate-limits.md). Then you should be oriented to how dynamic rate limiting works.

Below is a full implementation of a custom rate limiting function. In our example this is a module called `per-user-rate-limiting.ts`.

```ts
import {
  CustomRateLimitPolicyOptions,
  ZoneCache,
  ZuploContext,
  ZuploRequest,
  environment,
} from "@zuplo/runtime";
import { createClient } from "@supabase/supabase-js";

const CACHE_NAME = "rate-limit-requests-allowed-cache";
const SB_URL = "https://rxoqdfbalrhwpvjugcio.supabase.co";
const SB_SERVICE_ROLE_KEY = environment.SB_SERVICE_ROLE_KEY;
const FALLBACK_REQUESTS_ALLOWED = 100;

export async function rateLimitKey(
  request: ZuploRequest,
  context: ZuploContext,
  policyName: string
): Promise<CustomRateLimitPolicyOptions> {
  // We'll get the customer ID from the user data.
  // This might be from a JWT or API Key metadata
  const customerId = request.user.data.customerId;

  // We don't want to hit the database on every request
  // So we'll use the fast zone cache to cache this data
  const cache = new ZoneCache(CACHE_NAME, context);
  let requestsAllowed = await cache.get(customerId);

  // If we didn't get a value, we'll need to go to the database
  // In this example we're using supabase, but you could use your
  // own API, Xata, etc.
  if (requestsAllowed === undefined) {
    // create the supabase client and read the customer's
    const supabase = createClient(SB_URL, SB_SERVICE_ROLE_KEY);
    let { data, error } = await supabase
      .from("customer_rate_limits")
      .select("requestsAllowed")
      .eq("customerId", customerId);

    // If something goes wrong, we probably want to log an
    // error and assume a default, vs go down
    if (error) {
      context.log.error(error);
      requestsAllowed = FALLBACK_REQUESTS_ALLOWED;
    } else {
      context.log.info(data);
      requestsAllowed = data[0].requestsAllowed;
    }
    // store the read value in the ZoneCache
    // do this asynchronously to improve performance
    cache
      .put(customerId, requestsAllowed, 60)
      .catch((err) => context.log.error(err));
  }

  return {
    key: customerId,
    requestsAllowed: requestsAllowed,
    timeWindowMinutes: 1,
  };
}
```

The above function can be applied to a rate limiter with the following configuration in policies

```json
{
  "export": "BasicRateLimitInboundPolicy",
  "module": "$import(@zuplo/runtime)",
  "options": {
    "rateLimitBy": "function",
    "requestsAllowed": 2,
    "timeWindowMinutes": 1,
    "identifier": {
      "export": "rateLimitKey",
      "module": "$import(./modules/per-user-rate-limiting)"
    }
  }
}
```
