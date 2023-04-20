---
title: Rewiring America deploys Zuplo to accelerate their API program
authors: josh
tags: [zuplo, api-key, rate-limiting, developer-portal, api, customer]
description: A discussion with Tom Carden of Rewiring America about how they
image: https://og-image.zuplo.com/?text=Rewiring%20America%20Accelerates%20API%20Program%20with%20Zuplo
draft: true
---

I recently got to interview Tom Carden, Head of Engineering at Rewiring America, where he spoke about how they deployed Zuplo’s API Management platform to accelerate their API program.

[Rewiring America](https://www.rewiringamerica.org/), a nonprofit focused on electrifying homes, businesses, and communities in the US, required a solution for their IRA [Savings Calculator API](https://www.rewiringamerica.org/api). “The IRA is the Inflation Reduction Act here in the US” explained Tom, “that puts a bunch of tax credits and rebates in the hands of everyday consumers to help them make a choice for cleaner, safer, and just plain better electric appliances in their home. Forty-two percent of US energy-related emissions come from our homes and we can dramatically reduce that by upgrading the machines we use daily.”

The initial calculator was built as a client-side app but then started receiving requests for an API so that folks could host the functionality on their own website.

Being an experienced Engineering Manager, Tom knew that there was a lot of potential “wheel reinvention” ahead to start a new API program — requiring API authentication, rate-limiting to prevent noisy neighbor problems and abuse, and developer documentation with integrated key management; we call these the [three pillars of an API program](https://zuplo.com/blog/2022/05/11/the-three-pillars-of-an-API-program/).

Tom spent some time evaluating different off-the-shelf options before selecting Zuplo to help them get their API to market quicker. “I think I was originally evaluating Zuplo as a documentation host. But once I understood that it was a gateway that could deal with API key management, validation, rate limiting, and also had a long tail of programmable plugins; I was pretty much sold at that point but went off to do my due diligence on alternatives nonetheless.”

Zuplo helped Tom and his team move faster than the alternatives thanks to the focus on developer experience with real-time feedback (press save, and your changes are live to test) and offered a gitops integration with GitHub, meaning they could deploy multiple environments to the edge in seconds.

Tom also described the value of using Zuplo versus building a solution in-house, **saving weeks of engineering time and avoiding ongoing maintenance costs**. “We could bring this stuff in-house and get something good enough. But I look at that as opportunity costs, we're not solving the problems that are unique to our organization. We're spending time reinventing the wheel. So I'd rather buy.”

With Zuplo's help, Rewiring America can focus on its mission to help Americans upgrade the machines they depend on and avoid reinventing the wheel when it comes to offering a great developer experience to users of their API.

[Check out the recorded interview here](https://youtu.be/wUKLrNIRC_8).
