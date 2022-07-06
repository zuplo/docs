
---
title: Introducing API Key Leak Prevention
authors: josh
tags: [code, version, api gateway, API keys]
description: Zuplo offers API Key Scanning on Github for API keys generated in Zuplo. API Key Leak Prevention is part of our Business and Enterprise subscriptions.
image:
---

Today we’re announcing that Zuplo offers API Key Scanning on Github for API keys generated in Zuplo. 

According to the most recent GitGuardian report, in 2021 over 6 million secrets were leaked, which was 2x 2020’s total and 3 in every 1,000 commits exposed at least one secret. The massive Heroku security incident in April 2022 [was caused by API Keys checked into source](https://blog.heroku.com/april-2022-incident-review) control. It’s no surprise then that since we opened Zuplo up publicly we’ve seen a lot of excitement about our API Key Management capabilities. We’ve written why we think API Keys are the best way to secure your API [here](https://zuplo.com/blog/2022/05/03/you-should-be-using-api-keys/) and now we make it effortless to secure both you and your customers with API Key Scanning.

<aside>
⛔ “[Heroku] determined that the unidentified threat actor gained access to the machine account from an archived private GitHub repository containing Heroku source code.”

</aside>

Respecting the developer workflow is one of our central tenets at Zuplo, which is why we designed it with GitOps in mind. Starting today, if one of the API keys for one of your APIs in Zuplo shows up in a public repo on Github you’ll receive an alert from Zuplo notifying you of the token and the URL where the match was found. You can also choose to have Zuplo notify your customer on your behalf.

Zuplo API Key management includes:

- secure storage and management of keys and metadata - with an admin UI and API to manage consumers.
- integrated developer portal with self-serve key management for your customers.

If you've already built your own API Key solution we can easily integrate Zuplo authentication with custom policies or even help you API key to Zuplo for even greater protection. It's never too late to make hosting your API much easier.

API Key Leak Prevention is part of our Business and Enterprise subscriptions.