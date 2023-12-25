This policy requires a Google Service Account and key that will be used to
identify the Zuplo API Gateway. Once this policy is configured you will need to
configure your GCP backend to only accept authenticated requests.

### Create the GCP Service Account

The first thing you will need to do to use this policy is
[create a service account](https://cloud.google.com/iam/docs/service-accounts-create).
You should create a unique service account for your Zuplo Gateway (i.e.
`zuplo-gateway`).

Give the account permission to call any services you want to proxy with Zuplo.

Next, you will need to
[create the Service Account key](https://cloud.google.com/iam/docs/keys-create-delete)
(using the JSON format). The json file will download.

Next, in your Zuplo project, set the `SERVICE_ACCOUNT_JSON` environment variable
as a secret with the value of the downloaded JSON document.

:::caution

The value of the private key is a JSON file. **Before you save the file to
Zuplo's environment variables**, you must remove all line breaks and all
instances of the `\n` escape character. The JSON file should be a single line.

:::

### Configure the Policy

When using this policy, you need to set the `audience` to the appropriate value
depending on the service you are using.

For backend's secured with Identity Aware Proxy, the value for `audience` should
be the Client ID of your OAuth application.

For backend's using Cloud Run IAM , the value for `audience` should be the full
URL of the Cloud Run instance.
