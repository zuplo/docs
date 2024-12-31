## Using the Policy

In order to use this policy, you'll need to setup Google Cloud Storage, create
an IAM Service Account, and configure the
[Upstream GCP Service Auth Policy](/docs/policies/upstream-gcp-service-auth-inbound).
You'll find instructions on how to do that below.

### Setup a Google Service Account

In order to authorize your Zuplo API to upload files to Google Storage, you will
need to create a Service Account. Instructions for doing so can be found here:
https://cloud.google.com/iam/docs/service-accounts-create

The service account you create will also need permissions to write objects to
the storage bucket you will use. The easiest way to do that's to assign the
account the **Storage Object Creator (roles/storage.objectCreator)** role.
However, you can also scope the permissions to a single bucket if you like.

Download the service account JSON and create an environment variable secret with
the contents. In this example, the variable is named `SERVICE_ACCOUNT_JSON`

### Setup Google Cloud Storage

In order to use Google Cloud Storage you will need to have a bucket created. If
you don't have one you can do so by following this guide:
https://cloud.google.com/storage/docs/creating-buckets

### Upstream GCP Service Auth Policy

In order to authorize your Zuplo API to upload to the GCP bucket, you will
configured the
[Upstream GCP Service Auth Policy](/docs/policies/upstream-gcp-service-auth-inbound).
It's important that the auth policy runs **before** this custom policy.

The service auth policy will set the `Authorization` header of the request to a
JWT token with the requested permissions. In order to generate the correct JWT,
you must set the `scopes` to
`https://www.googleapis.com/auth/devstorage.read_write` as shown below.

```json
{
  "export": "UpstreamGcpServiceAuthInboundPolicy",
  "module": "$import(@zuplo/runtime)",
  "options": {
    "expirationOffsetSeconds": 300,
    "scopes": ["https://www.googleapis.com/auth/devstorage.read_write"],
    "serviceAccountJson": "$env(SERVICE_ACCOUNT_JSON)",
    "tokenRetries": 3
  }
}
```

:::tip

You can have multiple Upstream GCP Service Auth Policies on the same request. So
for example, you might generate a JWT token that first has permission to upload
to GCP storage, then you might have a second policy that runs after this policy
that authorizes your Zuplo API to all downstream Cloud Run service.

Each auth policy will cache the JWT tokens for an hour by default so having
multiple policies will have virtually no impact on your APIs latency.

:::
