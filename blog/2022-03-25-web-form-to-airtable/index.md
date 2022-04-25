---
title: Web Form to AirTable
authors: josh
tags: [videos, code]
---

import YouTubeVideo from "@site/src/components/YouTubeVideo";

<YouTubeVideo url="https://www.youtube-nocookie.com/embed/USFEI0nbEF4" />

Length: 2 minutes

In this post we pickup where left off in this post [Gateway over SaaS?](2022-03-24-an-api-gateway-over-saas/index.md) and take our AirTable API and make it work directly with a form POST from a website.

It even has a honeypot field to filter out simple bots 👏

Here's the form post code from JSFiddle

```html
<form method="POST" action="<YOUR ZUPLO API URL HERE>">
  <input type="text" name="name" value="" />
  <input type="text" name="email" value="" />
  <input type="text" style="display:hidden" name="hp" value="" />
  <button>submit</button>
</form>
```
