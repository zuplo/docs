---
title: Buckets & Environments
---

API Keys are stored in 'buckets' - you'll see these mentioned in the
[API Key API documentation](https://dev.zuplo.com/docs).

By default we generate three buckets for each project

- one for working-copy
- one for production (your default branch in git)
- one shared by all other environments

However, this behavior is overridable. You can specify the bucket that given API
Key policy should use in the options:

```json
{
  "export": "ApiKeyInboundPolicy",
  "module": "$import(@zuplo/runtime)",
  "options": {
    "bucketName": "contoso-qa-env",
    "allowUnauthenticatedRequests": false
  }
}
```

If no `bucketName` is specified, it uses the default bucket as specified above.
You can
[create buckets](https://dev.zuplo.com/docs/routes#apikeybucketsservice_create)
easily using your Zuplo API key and the
[API Key management api](https://dev.zuplo.com/docs).

For example to create a bucket for your QA Environment, you might execute the
following command

```bash
curl --request POST \
  --url https://dev.zuplo.com/v1/accounts/YOUR_ACCOUNT_NAME/key-buckets \
  --header 'Authorization: Bearer YOUR_ZAPI_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"name":"contoso-qa-bucket","description":"API Key bucket for QA Environment"}'
```
