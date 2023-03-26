---
title: Fastest way to ship a ChatGPT plugin
authors: josh
tags: [chat-gpt, plugin, rate-limiting, api-key, ai, auth, openapi]
description: Ship your ChatGPT plugin safely and quickly with Zuplo
image: https://og-image.zuplo.com/?text=Fastest%20way%20to%20ship%20a%20Chat-GPT%20plugin
---

[OpenAI](https://openai.com/) recently announced [Chat Plugins](https://platform.openai.com/docs/plugins/introduction) for Chat GPT.

To make a plugin you just need an API with an accompanying OpenAPI definition that the Chat GPT. The plugin engine is especially impressive - don't take my word for it; here's [Mitchell Hashimoto](https://twitter.com/mitchellh), Founder of HashiCorp:

![Tweet from Mitchell Hashimoto](https://cdn.zuplo.com/assets/15b1b3d7-357c-47d3-9f0c-ece35558766f.png)

[See tweet here](https://twitter.com/mitchellh/status/1638967450510458882?s=20)

If you already have an API and are excited to make it into a Chat GPT plugin there's a few things you'll need to do

- Authentication - support auth with an API Key or OAuth2 client-id and secret.
- OpenAPI - offer an OpenAPI definition so GPT can understand your API
- Rate-limiting - add rate-limiting to your API (with retry-after) so OpenAI don't over-consume your resources

Fortunately, Zuplo is here to help. Zuplo is an API Gateway that [natively supports OpenAPI](https://youtu.be/YRDm_tKcS68) (you can generate it using our route designer or import your own). What's more we make it easy to support [API key authentication](https://zuplo.com/docs/articles/step-2-add-api-key-auth) and [rate-limiting](https://zuplo.com/docs/articles/step-2-add-api-key-auth), making it the fastest and easiest way for you to surface your plugin to OpenAI.

Get started for free, sign-up at [https://portal.zuplo.com](https://portal.zuplo.com).
