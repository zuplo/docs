---
title: "The JsFiddle of APIs?"
authors: josh
tags: [videos, code]
---

<YouTubeVideo url="https://www.youtube-nocookie.com/embed/xvByk_e-s0s" />

Length: 2 minutes

Zuplo is so fast and flexible, it is the easiest way to setup a mock API. Here we create a simple todo API (of course 🤦🏼‍♂️). We add our 'sleep' policy to make it slow too - so you can call this from your UI client and simulate long loading times.

Here's the code for the request handler:

```ts
import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

export default async function (request: ZuploRequest, context: ZuploContext) {
  return [
    { text: "Learn Javascript", done: false },
    { text: "Learn Typescript", done: false },
    { text: "Play around in Zuplo", done: true },
    { text: "Build something awesome", done: true },
  ];
}
```

Have fun, APIFiddling!
