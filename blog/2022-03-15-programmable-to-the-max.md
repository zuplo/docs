---
title: Programmable to the max - making an API with Zuplo
authors: josh
tags: [video, code]
---

import YouTubeVideo from "@site/src/components/YouTubeVideo";

<YouTubeVideo url="https://www.youtube-nocookie.com/embed/pVMssyy9vUw" />

Length: 3 minutes

In this video we see just how programmable the Zuplo gateway is by going _full tilt_ and building a simple API using **Function Handlers** 🤯

We also look at wildcard routes like so `/(.*)`.

Here's the code from the echo API we create

```
import  { ZuploContext, ZuploRequest } from "@zuplo/runtime";

export default async function (request: ZuploRequest, context: ZuploContext) {
 const { url, query } = request;

 const body = await request.text();

 return { url, query, body };
}
```
