---
title: What the GitHub API Gets Wrong
authors: josh
tags: [code, version, api gateway]
description: At Zuplo, we like to look to great companies for best practices. When it comes to versioning an API, GitHub handles things differently than companies like Stripe, Airtable, Twilio, and SendGrid. We think their approach is asking for trouble and limits your options.
image: ./no_version_no_service.png
---

**UPDATE 11/28/2022** - six months after publishing this post GitHub made this announcement: [To infinity and beyond: enabling the future of GitHub’s REST API with API versioning](https://github.blog/2022-11-28-to-infinity-and-beyond-enabling-the-future-of-githubs-rest-api-with-api-versioning/).

**"If you have an integration with the REST API, you should update it now to start sending the X-GitHub-Api-Version header." **

No version 👏 No service. 👏

---

When providing recommendations we like to use examples of great companies, the decisions they made — that often go against the grain, and why they made those decisions. One of my favorite examples of this is the fact that the best [API companies tend to use API keys](https://zuplo.com/blog/2022/05/03/you-should-be-using-api-keys/).

But what about great companies getting it wrong?

We recently wrote recommendations for [versioning your API](https://zuplo.com/blog/2022/05/17/how-to-version-an-api) and had one primary piece of advice - insist that the client includes the desired version on every request.

It’s simple: **No Version? No Service.**

![](./no_version_no_service.png)

When giving examples of great APIs, I have a few ‘go-tos’:

| API      | API Keys? | Require Version? | URL-based version |
| -------- | --------- | ---------------- | ----------------- |
| Stripe   | ✅        | ✅               | ✅                |
| AirTable | ✅        | ✅               | ✅                |
| Twilio   | ✅        | ✅               | ✅                |
| SendGrid | ✅        | ✅               | ✅                |
| GitHub   | ✅        | ❌               | ❌                |

You’ll notice one anomaly here though - the GitHub API doesn’t use URL-based versioning and doesn’t require a version. Let’s quote their docs

> _When using the REST API, we encourage you to [request v3 via the `Accept` header](https://docs.github.com/en/v3/media/#request-specific-version)_

Note the use of the word ‘encourage’, there’s more

> **\*Important:** The default version of the API may change in the future. If you're building an application and care about the stability of the API, be sure to request a specific version in the `Accept`header as shown in the examples below.\*

Source: [https://docs.github.com/en/rest/overview/media-types#request-specific-version](https://docs.github.com/en/rest/overview/media-types#request-specific-version)

This approach is asking for trouble and limits your options. It’s hard to run multiple versions of your API simultaneously (without defaulting to the old one 🤮) and it’s hard to know which customers are trying to use which version of your API. Maybe you can tell because of all the support calls and errors they’re getting?

That’s why we tend to recommend URL-based versioning - it’s implicit in the address of the URL what version the client is coded to consume and it can’t be skipped, lest you’ll get a 404. It’s good enough for Stripe, AirTable, and the Twilio family so it’s probably good for you.

If you do decide to go the headers route, be sure to send back a 400 if you don’t see an explicit version requested. Your error message could be “No version, no service” - that one’s on us.
