---
title: Announcing rapid API mocking via OpenAPI
authors: josh
tags: [customers, developers, api, graphql]
description:
  Announcing our new Mock API policy that allows you to develop a mock API in
  record time using examples in your OpenAPI document
image: https://og-image.zuplo.com/?text=Announcing%20rapid%20API%20mocking%20via%20OpenAPI
---

Today we're excited to announce one of the first cool features resulting from
Zuplo's bet on the OpenAPI standard: rapid mocking of APIs using examples inside
an OpenAPI document - it's just what every

Sometimes it's better to show than tell, so in that spirit, check out the 2
minute video below that shows you the end-to-end experience.

<YouTubeVideo url="https://www.youtube-nocookie.com/embed/aS4BwleV_GY" />

With this powerful new capability, developers can effortlessly generate mock
endpoints that mimic the behavior of real APIs, speeding up development cycles
and enabling more efficient testing. Combined with our `sleep` policy you can
even mix in some latency for added realism - just what every mockstar frontend
developer needs!

## Walkthrough

To get started, create a new project in Zuplo at
[portal.zuplo.com](https://portal.zuplo.com) (or use an existing project if you
have one). Hopefully you have an OpenAPI document (or
[you can get ChatGPT to generate one for you](https://youtu.be/8zAuE2OUQLE))
with some juicy examples in it - I'm going to use the
[Postman OpenAPI](https://api.apis.guru/v2/specs/getpostman.com/1.20.0/openapi.json)
doc from [apis.guru](https://apis.guru).

Let's import your OpenAPI doc.

![Import OpenAPI](./import-open-api.png)

Don't forget to save your changes. Save your changes (CMD+S).
