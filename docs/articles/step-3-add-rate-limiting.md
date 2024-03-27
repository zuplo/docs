---
title: Step 3 - Rate Limiting
---

In this guide we'll add Rate Limiting to a route. You can do this for any Zuplo
project but will need a route, consider completing
[step 1](./step-1-setup-basic-gateway.md) first.

Rate Limiting is one of our most popular policies - you should never ship an API
without rate limiting because your customers or internal developers **will**
accidentally DDoS your API. Usually with a rogue `useEffect` call in React code.

Zuplo offers a programmable approach to rate limiting that allows you to vary
how rate limiting is applied for each customer, or request.

Implementing truly distributed, high performance Rate Limiting is difficult, our
promise is that using Zuplo is cheaper and faster than doing this yourself.

## 1/ Add a rate-limiting policy

Navigate to your route in the **Route Designer** and click **Add Policy** on the
request pipeline.

![Add policy](../../public/media/step-3-add-rate-limiting/image.png)

Search for the rate limiting policy

![Add rate-limiting policy](../../public/media/step-3-add-rate-limiting/image-1.png)

Assuming you followed [step 2](./step-2-add-api-key-auth.md) and setup API Key
Authentication, set the policy to `rateLimitBy` `user` and allow 1 request every
1 minute.

```json
{
  "export": "RateLimitInboundPolicy",
  "module": "$import(@zuplo/runtime)",
  "options": {
    "rateLimitBy": "user",
    "requestsAllowed": 1,
    "timeWindowMinutes": 1
  }
}
```

Now each consumer will get a separate bucket for rate limiting. You can test
this using the API key you created in [step 2](./step-2-add-api-key-auth.md).

You should receive a **429 Too many requests** after 1 request.

Try creating another API Key Consumer (you can be the manager of multiple keys)
and switching keys.

## 2/ Try dynamic rate-limiting

This time, we will make the rate-limiting policy more dynamic, based on
properties of the customer. Update the metadata of your two API Key consumers to
have a property `customerType`. Set one to `free` and another to `premium`.

![Customer Metadata](../../public/media/step-3-add-rate-limiting/image-2.png)

Now add a new module to the files section by clicking on the `+` next to the
**Modules** folder and choose new empty module.

![New module](../../public/media/step-3-add-rate-limiting/image-3.png)

Add the following code to your module.

```ts
import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

export function rateLimit(request: ZuploRequest, context: ZuploContext) {
  const user = request.user;

  // premium customers get 1000 requests per mintue
  if (user.data.customerType === "premium") {
    return {
      key: user.sub,
      requestsAllowed: 1000,
      timeWindowMinutes: 1,
    };
  }

  // free customers get 5 requests per minute
  if (user.data.customerType === "free") {
    return {
      key: user.sub,
      requestsAllowed: 5,
      timeWindowMinutes: 1,
    };
  }

  // everybody else gets 30 requests per minute
  return {
    key: user.sub,
    requestsAllowed: 30,
    timeWindowMinutes: 1,
  };
}
```

Now we'll reconfigure the rate-limit policy to wire up our custom function. Find
the policy in the **Route Designer** and click edit.

![Edit Policy](../../public/media/step-3-add-rate-limiting/image-4.png)

Update the configuration

```json
{
  "export": "RateLimitInboundPolicy",
  "module": "$import(@zuplo/runtime)",
  "options": {
    "rateLimitBy": "function",
    "requestsAllowed": 2,
    "timeWindowMinutes": 1,
    "identifier": {
      "export": "rateLimit",
      "module": "$import(./modules/rate-limit)"
    }
  }
}
```

This identifies our `rate-limit` module and the function `rateLimit` that it
exports.

**NEXT** Try [step 4 - deploying to the edge](./step-4-deploying-to-the-edge).
