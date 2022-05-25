---
title: The three pillars of an API program
authors: josh
tags: [code, api-keys]
---

The day comes for most startups, even those that aren’t API-first SaaS businesses. When a large partner or customer — who can’t use your UI at the scale they need — requests an API. This is a high-quality problem - a customer that integrates with your API has higher switching costs and is more likely to be retained.

Sharing an API is a non-trivial exercise that can eat a surprising amount of your eng team’s time and there are three pillars that you need as a minimum bar:

![authentication, documentation, protection](./three-legged-stool.png)

## 1/ Authentication

_How will the partner authenticate securely with your API?_

Most startups go with API-key authentication because it’s secure and the easiest to use for developers (more on this [here](https://www.zuplo.com/blog/2022/05/03/you-should-be-using-api-keys)) - this is the right choice in my experience. There’s a lot to consider when building a secure API-key solution:

- Where do I store the keys and do so securely?
- How do I let partners self-serve?
- Can partners easily roll keys to ensure best practice security?
- How do I implement _read-once_ key infrastructure for best-practice security?

This can take even the best engineering teams multiple weeks to ship, and be an ongoing burden to maintain and scale that will reduce your team's agility.

## 2/ Documentation

_How will the developer learn how to use your API?_

Your partner’s developers will need documentation to learn how to use your API. Maybe a shared google doc is enough? But, your engineering team will spend much less time helping partner eng folks if they have real API docs - generated using open standards like Open API - that have integrated test clients and API keys. This will save your team time and your partner’s eng team - they’ll thank you for it!

## 3/ Protection

_How do you stop a rogue for-loop in your partners’ code from taking down your whole business?_

A partner hitting your API with a Denial of Service attack is rarely a deliberate, malicious act. Rather, it’s probably a simple coding error that results in an infinite loop that - without protection - can take down your API, or your whole business. That’s why rate-limiting is an essential part of any shared API.

## Wait... there are more than three pillars?

Those three pillars are just the **basics** - Ideally, you have a strategy around versioning, analytics, composition, routing, caching, and have the right abstraction to deal with unexpected needs from new partners.

Any API program eventually runs into a customer that needs JWT or mTLS security - will your solution easily allow the layering of different security options? Can you easily maintain both versions of your API? Can you quickly implement a brown-out to push partners onto v2?
