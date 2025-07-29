---
title: API Keys Overview
sidebar_label: Overview
---

Zuplo allows developers to rapidly add API key based authentication to an API in
minutes. There are several benefits to using Zuplo's API Key solution including

- adheres to
  [best practices of API Key implementation](https://zuplo.com/blog/2022/12/01/api-key-authentication)
- includes [API Key Leak Detection & Notification](./api-key-leak-detection.md)
- offers [out of the box and customizable solutions](./api-key-end-users.md) for
  sharing API Keys

:::tip

To start using Zuplo API Keys in only a few minutes
[see the quickstart](../articles/step-3-add-api-key-auth.mdx).

:::

## Fully Managed API Key Solution

Zuplo builds and manages a global API Key solution that can handle millions (or
billions) of API Keys and a virtually unlimited throughput to scale to the most
demanding services.

The service handles global replication of API Keys allowing your end users to be
authenticated to your API key with minimal latency. Keys are replicated around
the world in only a few seconds. Similarly, when keys are revoked or deleted,
the change replicates in seconds so that your API isn't open to unauthorized
access.

## API Key Authentication at the Edge

Using Zuplo's API Key Authentication policy, your API is secured from
unauthorized access. Authorization checks happen at the edge in 300+ data
centers around the world. This keeps load off your backend and keeps your API
fast for your end-users.

Zuplo manages all the complexity of replication, caching, and verifying your API
keys so you don't have to.

Adding API Key authentication using Zuplo takes only a few minutes.
[See the quickstart to get started](../articles/step-3-add-api-key-auth.mdx).

## Key Concepts

### Consumers

An API Key Consumer is the identity that can invoke your API - typically people,
customers, partners or services. A consumer can have multiple API Keys
associated with it - but each key authorizes the same consumer (for example
identity)

### Consumer Metadata

Each consumer can be assigned metadata. This information (a
[small JSON object](./api-key-service-limits.md)) is made available to the
runtime when a user access your API using that key.

For example, a Consumer might have metadata that specifies the company they're a
member of and the plan for the account.

```json
{
  "companyId": 123,
  "plan": "gold"
}
```

### Consumer Tags

Consumers can also have tags associated with them. Tags are simple key value
pairs. Tags are used for management purposes only (for example querying
consumers through the Zuplo API). Tags don't get sent to the runtime as part of
authorization.

For example, a Consumer might be tagged in order to track the customer
associated with the consumer.

```txt
customer=1234
```

You can see more on how to use tags in the document on
[managing consumers and keys using the API](./api-key-api.md)

### API Keys

API Keys are the actual string value used to authenticate with an API. Unlike
some other forms of bearer tokens, API Keys don't contain any actual data within
the key itself.

Zuplo API Keys are prefixed with the string `zpka_` followed by
cryptographically random characters and a signature. While Zuplo's API Key
management service supports custom key formats (enterprise plan required), the
structured format our the key enables us to offer
[key leak detection services](./api-key-leak-detection.md) to keep your API
secure.
