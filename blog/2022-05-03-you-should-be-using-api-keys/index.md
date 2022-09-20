---
title: Wait, you're not using API keys?
authors: josh
tags: [videos, code, api-keys]
---

Have you noticed something the best API companies have in common?

![Stripe, SendGrid, Twilio and Airtable logos](./api-first-companies.png)

Folks like Stripe, Twilio, Airtable, SendGrid, and many more?

Yep, they all use **API Keys** as the primary authentication method for their APIs. Why is this?

There are two primary reasons

## 1/ Security

While there is no formal protocol for API Keys and most implementations have some level of variability - at least compared to standards like OAuth and OpenID Connect - they offer a good level of security, arguably greater than using JWT tokens for a few reasons.

- **Revocability** - API Keys can be quickly revoked for any reason, whereas JWT tokens are hard to revoke and often require the reset of an entire certificate or tenant.
- **Opaqueness** - unlike JWT tokens, which can be easily decoded using services like [jwt.io](http://jwt.io), API keys are completely opaque and don’t reveal any hint of your internal authorization mechanism.
- **Self-management** - a good API program with API keys allows consumers to manage API keys themselves and, in the event of a leak (or accidental push to a GitHub repo), the consumer can quickly revoke and roll their keys. If the same mishap occurs with a JWT token, it is typically harder for the consumer to self-serve and revoke the validity of the JWT token.

## 2/ Optimizing Time to First Call (TTFC)

Great API companies focus on developer experience and obsess about metrics like [time-to-first-call](https://medium.com/better-practices/the-most-important-api-metric-is-time-to-first-call-62ac3959de44). That is, how long does it take for a developer to find your documentation and get everything set up, and successfully invoke your API.

If you choose an authentication option that has some complexity (token acquisition, token refresh, etc) you are automatically increasing that Time to First Call and thus reducing the conversion rate of developers that get to know and adopt your platform.

## Summary

Of course, there are valid reasons to use a more complex authentication method for your API, particularly if the consumer is doing work on behalf of another identity (e.g. accessing the GitHub API on behalf of a GitHub user) then OAuth makes the most sense.

However, if you’re primarily identifying the B2B business partners, API keys are a secure choice that is easy to use and will optimize the conversion funnel for winning new developers.
