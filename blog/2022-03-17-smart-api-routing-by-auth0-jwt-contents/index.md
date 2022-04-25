---
title: Smart API routing by Auth0 JWT Contents
authors: josh
tags: [videos, code]
---

import YouTubeVideo from "@site/src/components/YouTubeVideo";

<YouTubeVideo url="https://www.youtube-nocookie.com/embed/XS-BMeGQPn8" />

Length: 2 minutes

We continue with the example from this [post](2022-03-16-jwt-authentication-with-auth0/index.md) and add smart routing based on claims in the token.

Here's the function handler we create to do the smart routing

```ts
import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

export default async function (request: ZuploRequest, context: ZuploContext) {
    const data = request.user.data;
    if (data["https://example.com/claim1/"] === "this-is-a-claim"){
        return fetch("https://example.com");
    }
    else {
        return fetch(`https://ecommerce-legacy.zuplo.io/objects?type=products&id=${request.params.productId});
    }
}
```
