---
sidebar_position: 3
title: vs AWS API Gateway
---

## Why should I choose Zuplo over AWS API Gateway?

Most customers we speak with are building on AWS and have an obvious question... why would I choose Zuplo over AWS API Gateway?

Here’s a rundown of why Zuplo will get you to market faster, with the right features with lower on-going maintenance burden:

| Feature                                       | AWS API Gateway                 | Zuplo                                                                                                                             |
| --------------------------------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| API Key Authentication                        | ❌ [1]                          | ✅ Unlimited keys                                                                                                                 |
| API Key Portal                                | ❌                              | ✅                                                                                                                                |
| Rate Limiting                                 | Per API Key only                | Dynamic - can write code to set rate limits on each request ([demo](https://www.zuplo.com/blog/2022/04/28/dynamic-rate-limiting)) |
| Edge deployment                               | ❌                              | ✅ (100s of datacenters WW)                                                                                                       |
| Multi-cloud                                   | ❌                              | ✅ [2]                                                                                                                            |
| Open API support                              | ❌                              | ✅                                                                                                                                |
| Policy Library                                | ❌                              | ✅ 32 built-in (more coming)                                                                                                      |
| Max response time                             | 29s                             | 120s+                                                                                                                             |
| Custom Policies                               | ❌                              | ✅ ([demo](https://www.zuplo.com/blog/2022/03/22/custom-policies-in-code-archiving-requests-to-s3))                               |
| Dynamic Routing                               | ❌                              | ✅ ([demo](https://www.zuplo.com/blog/2022/03/17/smart-api-routing-by-auth0-jwt-contents))                                        |
| Hosted Developer Portal                       | ❌                              | ✅                                                                                                                                |
| Programmability                               | via call to Lambda - slow       | ✅ Runs inside the gateway - fast! ([demo](https://www.zuplo.com/blog/2022/03/24/an-api-gateway-over-saas))                       |
| Cognito JWT Auth                              | ✅                              | ✅                                                                                                                                |
| Open ID JWT Auth                              | ❌ requires a custom authorizer | ✅ built-in policy                                                                                                                |
| Lifecycle Management (versioning)             | ✅                              | ✅                                                                                                                                |
| SDK Generation                                | ✅                              | ❌ [3]                                                                                                                            |
| VPC Connectivity                              | ✅                              | ✅ via secure tunnel provided by CloudFlare                                                                                       |
| Reliability                                   | ✅                              | ✅ Serving Billions of requests every month, with zero downtime to date                                                           |
| Offers stripe quality developer experience 🙌 | ❌                              | ✅                                                                                                                                |

### **What about Performance?**

In our performance testing, we’ve actually shown the Zuplo gateway to out-perform AWS API Gateway calling AWS, even when calling Lambda. Median latency is approximately the same - but Zuplo’s 0ms cold-start platform means less spikes, more consistency.

### **Notes**

**[1] I thought AWS API Gateway had API Keys?**

Yes, but these are not recommended for authentication. See best practices in their [docs](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-usage-plans.html). AWS API Gateway Keys are primarily for use with usage plans. Also, you are limited to 500 API Keys by default. Also, we think API Keys are the **best** choice for public APIs - [read more](https://www.zuplo.com/blog/2022/05/03/you-should-be-using-api-keys).

**[2] Multi-cloud**

By default, we deploy your production Zuplo gateway to the edge in 100s of datacenters worldwide, it works well with any cloud (btw - you can contact us if you’re interested in a private deployment of Zuplo).

**[3] Why no SDK Generation?**

We believe software developers are craftspeople who feel pride in what they create; they’re passionate about sharing great developer experiences with others. We haven’t seen an approach to SDK generation that meets that pride. Generally, the feedback on SDKs generated by tools is that they are ‘meh’ at best. We don’t want to tackle this problem until we’re sure we can deliver something our customers would be proud to share with their developers.

Some keywords to add (for indexing on google):

zuplo vs. AWS API Gateway

AWS API Gateway competitors.
