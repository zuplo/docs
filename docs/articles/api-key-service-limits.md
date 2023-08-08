---
title: Service Limits
---

Zuplo's API Key Service can handle billions of requests and tokens. The service
can accommodate even virtually any scale required. However, by default the
service is set with limits to ensure that each Zuplo customer has a performant
and reliable experience.

For customers who need limits beyond what is set in this document, react out to
our sales team and we'll be happy to design a plan that fits your needs. Email
[sales@zuplo.com](mailto:sales@zuplo.com).

### Consumers

- Consumer `metadata` - The JSON encoded object cannot be larger than 1kb.
- Consumer `tags` - Each consumer is limited to 5 key value pair tags.

### API Key Management Operations

Requests to API Key Management operations on the Zuplo Developer API
(dev.zuplo.com) are limited to 100 requests per second.

### API Key Authorizations

API Key authorizations are not limited directly. The limit is equal to one
authorization per request allowed in your plan.
