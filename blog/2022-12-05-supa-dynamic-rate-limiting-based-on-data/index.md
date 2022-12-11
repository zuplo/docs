---
title: Supa-dynamic rate-limiting based on data (using supabase)
authors: josh
tags: [rate-limiting, api management, supabase]
description: In this video we show how you can make rate-limiting extraordinarily dynamic by having the rate-limiter interact with external services like Supabase, Xata etc.
image: https://og-image.zuplo.com?text=Supa-dynamic%20rate%20limiting%20based%20on%20data
---

One of the best things about Zuplo is it's programmable nature. That combined with our approach to making policies composable means you can do some amazing things with them, like our rate-limiter. In this video we show how you can have the rate-limiter interact with external services and data. Here we use supabase as a data-source for the limits.

<YouTubeVideo url="https://www.youtube-nocookie.com/embed/zFpfHGB7u6g" />

Here's the key code from the sample

```ts
import {
  ZuploContext,
  ZuploRequest,
  ZoneCache,
  CustomRateLimitPolicyOptions,
} from "@zuplo/runtime";
import { createClient } from "@supabase/supabase-js";

const fallBackLimits = {
  requestsAllowed: 10000,
  timeWindowMinutes: 1,
};

const CACHE_NAME = "rate-limit-cache";
const CACHE_KEY = "rate-limit-data";

export async function getRateLimit(
  request: ZuploRequest,
  context: ZuploContext,
  policyName: string
) {
  const limitResponse: CustomRateLimitPolicyOptions = {
    key: request.user.sub,
    ...fallBackLimits,
  };

  const userGroup = request.user.data.rateLimitGroup;
  const cache = new ZoneCache(CACHE_NAME, context);

  const cached: any = await cache.get(CACHE_KEY);

  if (cached) {
    context.log.debug("cache hit");
    const item = cached.find((row) => row.userGroup === userGroup);
    limitResponse.requestsAllowed = item.reqPerMinute;
    return limitResponse;
  }

  context.log.debug("cache miss");
  const supabase = createClient(
    "https://YOUR_SUPABASE_URL.supabase.co",
    "YOUR_SUPABASE_TOKEN"
  );
  const { data, error } = await supabase.from("rate-limits").select();

  if (error) {
    context.log.error(`Error reading data from supabase`, error);
    // return fallback rate-limit - don't want API downtime
    // if this dependency is down.
    return limitResponse;
  }

  const item = data.find((row) => row.userGroup === userGroup);

  if (!item) {
    context.log.warn(`No row rateLimitId '${userGroup}' found, using fallback`);
    // return fallback
    return limitResponse;
  }

  void cache.put(CACHE_KEY, data, 10);

  limitResponse.requestsAllowed = item.reqPerMinute;
  return limitResponse;
}
```

You could make this even higher performance by having the cache have a longer expiry, but periodically reloading the data from supabase asynchronously and pushing the results back into the cache; something like an SWR (stale, while revalidate) approach.

Get started with Zuplo for free today: [Sign Up Free](https://zuplo.link/sb-blog-signup)



See also:

[Shipping a public API backed by Supabase](https://zuplo.com/blog/2022/11/18/shipping-a-public-api-backed-by-supabase)

[API Authentication using Supabase JWT tokens](https://zuplo.com/blog/2022/11/15/api-authentication-with-supabase-jwt)
