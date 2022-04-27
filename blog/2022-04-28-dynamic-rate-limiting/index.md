---
title: Dynamic Rate Limiting
authors: josh
tags: [videos, code, rate-limiting]
---

import YouTubeVideo from "@site/src/components/YouTubeVideo";

<YouTubeVideo url="https://www.youtube.com/watch?v=uMm01EDJ9_I" />

Length: 2 minutes

Before launching any API program you need to think about protection. Many API
developers don't think they need to worry about rate-limiting because they
aren't a target for hackers. That's probably true in the early days, but it isn't the hackers that are gonna get you. It's your customers.

The most common type of API abuse isn't malicious, it's accidental. It's a misplaced for-loop in your partners code that takes you down. This happens often.

So ideally your API has some per-user rate limits. This is super easy with Zuplo.

However, in reality this isn't enough. You should probably have different rate-limits for different customers. For example, your free customers should have a more restrictive policy while your paid, or premium customers a more lenient one.

Guess what? That's also easy with Zuplo because you can write **custom code** that tells the rate-limit policy how to work. In the video above we show how you can modify the policy limits based on customer type (in this example, stored in the API Key metadata, but could be based on JWT claim, or even a cache-able DB lookup if so required).

Here's the code from `request-limit-lookup.ts` file in the video:

```ts
import { CustomRateLimitPolicyOptions, ZuploRequest } from "@zuplo/runtime";

const requestsPerMinute = {
  premium: 3,
  free: 1,
};

export default function (request: ZuploRequest): CustomRateLimitPolicyOptions {
  const customerType = request.user.data.customerType;
  const reqsPerMinute = requestsPerMinute[customerType];

  const rateLimitConfig = {
    // The key tells the rate limiter how to correlate different requests
    key: request.user.sub,
    requestsAllowed: reqsPerMinute,
    timeWindowMinutes: 1,
  };

  return rateLimitConfig;
}
```

And the config for the rate-limit policy

```json
{
  "export": "BasicRateLimitInboundPolicy",
  "module": "$import(@zuplo/runtime)",
  "options": {
    "rateLimitBy": "function",
    "identifier": {
      "module": "$import(./modules/request-limit-lookup)",
      "export": "default"
    }
  }
}
```

Stay safe out there folks!
