---
title: Using the API Key API
sidebar_label: Using the API
---

Zuplo runs a globally distributed API Key management service that scales to
handle billions of daily key validation requests while maintaining low latency
from any region around the world.

Management of API Keys and consumers
[can be performed in the Zuplo Portal](./api-key-management.md) and for
end-users in the Zuplo Developer Portal. However, all management operations
regarding API Keys can also be performed using the
[Zuplo Developer API](https://dev.zuplo.com).

:::info

In order to obtain an API Key for the Developer API, go to your account settings
in the Zuplo Portal. [More information](https://dev.zuplo.com/docs/routes/index)

:::

## Models

The service contains three primary object: **Buckets**, **Consumers**, and **API
Keys**. For an conceptual overview of these objects see
[Key Concepts](./api-key-management#key-concepts). Below is an ER diagram
showing the relationships of the three primary objects and their most important
fields.

The Consumer is the most important object. Each consumer is in a bucket.
Consumers can contain one or more API Keys.

```mermaid
erDiagram
    Consumer ||--|{ ApiKey : has
    Consumer ||--|{ Manager : has
    Consumer }|--|| Bucket   : in

    Bucket {
        string id
        string name
        string accountName
        map(string) tags
    }
    Consumer {
        string id
        string name
        string description
        json metadata
        map(string) tags
    }
    ApiKey {
        string id
        string key
        string expiresOn
    }
    Manager {
      string email
    }
```

### Buckets

Buckets are the top level group for this service. A bucket could be used with a
single Zuplo environment or shared among multiple environments or projects. By
default a Zuplo API Gateway project will be created with several buckets that
map to production, preview, and development (working copy) environments.

Enterprise plan customers run complex configurations where buckets are shared
across gateway projects or even accounts. This can allow your end-users to
authenticate to all your APIs with a single API key with unified permissions.

### Consumers

Consumers are the core of the API Key service. The consumer is the "identity" of
any API Keys that are created. Consumers have a `name` which must be unique in
the bucket. This `name` is used as the default `user.sub` property in the API
Key Authentication policy.

### API Keys

A Consumer can have any number of API keys associated with it. Each API Key
shares the same identity (i.e. Consumer) when authenticating with this service.
Expired keys will not be permitted to authenticate after their expiration.

:::tip

In most cases, you wont manage API Keys directly. When using the API, it the
typical configuration is to create a consumer with an API key and each consumer
has only a single API key except when performing operations like rolling keys.

:::

## Usage

This section explains common scenarios for managing API keys using the API. For
other uses, see the full [Developer API reference](https://dev.zuplo.com).

All examples assume two environment variables are set (in your terminal, not
inside Zuplo)

```bash
# Your Zuplo Account Name
export ACCOUNT_NAME=my-account
# Your bucket API URL (Found in Settings > Project Information)
export BUCKET_NAME=my-bucket
# Your Zuplo API Key (Found in Settings > Zuplo API Keys)
export ZAPI_KEY=zpka_YOUR_API_KEY
```

### Creating a Consumer with a Key

// typically you would store some useful metadata // like the organizationId,
etc.

// Tags are used for querying the consumers later. // It is often useful to
store some external identifier // that links this consumer to your internal data

```shell
curl \
  https://dev.zuplo.com/v1/accounts/$ACCOUNT_NAME/key-buckets/$BUCKET_NAME/consumers?with-api-key=true \
  --request POST \
  --header "Content-type: application/json" \
  --header "Authorization: Bearer $API_KEY" \
  --data @- << EOF
{
  "name": "my-consumer",
  "description": "My Consumer",
  "metadata": {
    "orgId": 1234,
    "plan": "gold"
  },
  "tags": {
    "externalId": "acct_12345"
  }
}
EOF
```

The response will look like this:

```json
{
  "id": "csmr_sikZcE754kJu17X8yahPFO8J",
  "name": "my-consumer",
  "description": "My Consumer",
  "createdOn": "2023-02-03T21:33:17.067Z",
  "updatedOn": "2023-02-03T21:33:17.067Z",
  "tags": {
    "externalId": "acct_12345"
  },
  "metadata": {
    "orgId": 1234,
    "plan": "gold"
  },
  "apiKeys": [
    {
      "id": "key_AM7eAiR0BiaXTam951XmC9kK",
      "createdOn": "2023-06-19T17:32:17.737Z",
      "updatedOn": "2023-06-19T17:32:17.737Z",
      "expiresOn": null,
      "key": "zpka_d67b7e241bb948758f415b79aa8exxxx_2efbxxxx"
    }
  ]
}
```

You can use this API Key to call your Zuplo API Gateway that is protected by the
[API Key Authentication](/docs/policies/api-key-inbound) policy.

### Query Consumers with API Keys By Tags

```shell
export ORG_ID=1234
curl \
  https://dev.zuplo.com/v1/accounts/$ACCOUNT_NAME/key-buckets/$BUCKET_NAME/consumers/?include-api-keys=true&key-format=visible&tag.orgId=$ORG_ID \
  --header "Authorization: Bearer $API_KEY"
```

The response will look like this:

```json
{
  "data": [
    {
      "id": "csmr_sikZcE754kJu17X8yahPFO8J",
      "name": "my-consumer",
      "description": "My Consumer",
      "createdOn": "2023-02-03T21:33:17.067Z",
      "updatedOn": "2023-02-03T21:33:17.067Z",
      "tags": {
        "externalId": "acct_12345"
      },
      "metadata": {
        "orgId": 1234,
        "plan": "gold"
      },
      "apiKeys": [
        {
          "id": "key_AM7eAiR0BiaXTam951XmC9kK",
          "createdOn": "2023-06-19T17:32:17.737Z",
          "updatedOn": "2023-06-19T17:32:17.737Z",
          "expiresOn": null,
          "key": "zpka_d67b7e241bb948758f415b79aa8exxxx_2efbxxxx"
        }
      ]
    }
  ],
  "offset": 0,
  "limit": 1000
}
```

### Roll a Consumer's Keys

Sometimes you will want to create a new key and expire the current keys. Instead
of calling the API for each key and manually creating a new key, you can simply
call the roll key endpoint.

:::tip Tags for Request Authorization

One useful feature of the API Key service is that most requests can have `tags`
added to the query parameter even if they aren't get requests. This is useful
when you want to call the API and ensure some basic condition is met without
having to first do a GET to retrieve data on the object. For example, in the
roll key request below the `orgId` tag is set on the request - this ensures that
the consumer being updated is tagged with that org.

:::

The following call with set all existing keys to have the expiration date set in
the request body and will create a new key without an expiration.

```shell
export ORG_ID=1234
export CONSUMER_NAME=my-consumer
curl \
  https://dev.zuplo.com/v1/accounts/$ACCOUNT_NAME/key-buckets/$BUCKET_NAME/consumers/$CONSUMER_NAME/roll-key?tag.orgId=$ORG_ID \
  --request POST \
  --header "Authorization: Bearer $API_KEY"
  --data '{"expiresOn":"2023-04-18"}'
```

## Reference

The full API Reference for the API Service is hosted using a Zuplo developer
portal at [https://dev.zuplo.com/docs/](https://dev.zuplo.com/docs/).
