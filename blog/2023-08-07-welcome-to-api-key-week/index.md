---
title: Day 1 - Introducing the ZAPI Management API
authors: josh
tags: [api, auth, gateway, security, api-keys]
description: Announcing a week of API Key related content
image: https://og-image.zuplo.com/?text=It%27s%20API%20key%20week%20at%20Zuplo!
---

We ❤️ API Keys at Zuplo. Of course, We love all the ways of authentication calls
to an API from JWTs to Basic Auth — but we have a special soft-spot for API
keys.

We have natively supported API keys, helping our customers offer this important
authentication option since the beginning. However, we've made many changes to
the service since then and have completely re-built our API key management API
which we're announcing today.

To celebrate this, and even more goodies - we'll have more announcements and
content every day this week as part of our **API Key Week**. Stay tuned on
twitter [@zuplo](https://twitter.com/zuplo) and our
[YouTube channel](https://www.youtube.com/channel/UCTH7AlnhkOTPkyaleO3C5wg).

## Why API keys?

So why API keys? Why not use a standard like OAuth and JWT tokens. One thing to
observe is that the best API companies in the world use API Keys to secure their
API - [stripe](stripe.com), [github](github.com), and [twilio](twilio.com) are a
few prominent examples.

One of the key reasons to choose API keys is create the best possible experience
for your API consumers. API Keys are just easier to work with, easier to cURL,
easier to use with `fetch` etc.

But are they secure? Yes, as long as you follow some best practices. We outlined
a detailed blog post and YouTube video on these best practices for your
enjoyment:

- Blog Post:
  [API Key Best Practices](https://zuplo.com/blog/2022/12/01/api-key-authentication)
- Video: [API Key Authentication Best Practices](https://youtu.be/ooyOmiczY1g)

## Secret scanning included at all tiers

One of the most important best practices is to support secret scanning, to catch
accidental check ins of API keys to public repos (and private repos that opt
in). We partnered with GitHub to announce this partnership:

![GitHub secret scanning](https://storage.googleapis.com/cdn.zuplo.com/uploads/github-secret-scanning.png)

- Read the post:
  [Zuplo is now a GitHub secret scanning partner](https://github.blog/changelog/2022-07-13-zuplo-is-now-a-github-secret-scanning-partner/)

## The bar for API experience has raised

Stripe still probably holds the crown of gold-standard API experience. Our goal
at Zuplo is to help every business offer a gold-standard experience to their API
consumers. Engineers are craftspeople, and want to put things out into the world
that they are proud of and other developers would respect. It's a matter of
pride.

Over the years since Stripe launched, the bar for a great developer experience
around APIs has raised, and the following items are must haves:

- Support API keys for org-org authentication
- Quality, beautiful API specification documentation
- Self-serve API key management and key rolling
- Clear and consistent error messages, using standards like Problem Details
- Developer facing analytics showing history of a consumers API calls

No surprise that Zuplo gives you all of these (yes, even developer-facing
analytics... stay tuned for more updates this week).

## Use our Developer Portal or BYO (bring your own)

We want to help businesses get a Stripe-quality API experience with minimum
effort, so we provide a full Developer Portal with self-serve key management.
However, some people want more control and want to integrate things like API key
management into their own developer console. Our customer Common Paper (see
[interview](https://www.youtube.com/watch?v=1rAxJFVXU84)) did exactly this.

To do this, you need to use our API Key management API which is part of ZAPI.
The Zuplo API. Check out our reference here:

- [dev.zuplo.com/docs](https://dev.zuplo.com/docs)

The API is easy to use. We aimed to give you the right building blocks to make
the API key experience YOU want for your customers.

We made a video to explain how the API works and how you can integrate API key
management into your own developer console. Here's the video guide:

<YouTubeVideo url="https://www.youtube-nocookie.com/embed/tzdmdbArgc4" />

Tomorrow, we'll have a new announcement that will make this whole process even
easier.

## This is Day 1 of API Key week

Come back to check out new content and announcements each day!
