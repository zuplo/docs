---
title: API Key Leak Detection
sidebar_label: Leak Detection
---

## API Key Format

Zuplo uses a specially formatted API Key structure that allows us to
[partner with GitHub's secret scanning](https://github.blog/changelog/2022-07-13-zuplo-is-now-a-github-secret-scanning-partner/)
to protect your users from accidentally leaked keys.

We think the safety of your API key consumers is paramount, so this feature is
available to all Zuplo customers, including free.

## API Key Leak Detection

API keys should never be stored in source control. Accidentally committing API
keys to source control is a common attack vector that leads to compromises of
organizations both large and small.

Zuplo participates in
[GitHub's Secret Scanning](https://docs.github.com/en/code-security/secret-scanning/about-secret-scanning)
program to detect if your or your customer's API Keys are checked into source
control on GitHub.

If an API Key for your Zuplo API Gateway is compromised by checking it into a
public or private GitHub repository, Zuplo will be notified and can take action
immediately.

## Leak Notifications

Customers on paid plans can be automatically notified by Zuplo when one of their
API Keys is found to have leaked. Zuplo supports email, Slack, and webhook
notifications.

:::note

For security reasons we don't include the full API Key in the notifications we
send. If you need the full API Key please contact support.

:::

### Slack

In order for Zuplo to notify you via Slack of an API Key leak, create a new
[Incoming Webhook](https://api.slack.com/messaging/webhooks) to the slack
channel of your choice and contact support@zuplo.com to enable notifications.

When an API Key leak is detected you will receive a slack message with details
about the leaked key, the project, etc.

### Email

Zuplo can email you in the event of an API Key leak. We recommend setting up an
alias email that's then sent to the relevant people. Contact support@zuplo.com
to enable email notifications.

The notification emails will come from `support@zuplo.com` and contain details
about the leaked key, the project, etc.

### Webhook

Zuplo can send a webhook to the public endpoint of your choice (like your own
Zuplo Gateway!) to notify you of leaked API Keys. Simply contact
support@zuplo.com with your webhook URL.

The payload is sent as a POST in the following format:

```json
{
  "account": "nate-totten",
  "project": "peach-constrictor",
  "bucket": "my-bucket",
  "consumer": "my-consumer",
  "reportedBy": "Github",
  "foundAt": "https://github.com/ntotten/yellow-boar/blob/28597f1720fb8f5eafd7e5e68aceab2f3754e970/README.md",
  "apiKey": {
    "value": "zpka***************************0537e219",
    "hash": "f159159a7c4335e39f314c42e902bbefeba12b181ef3f013724fd61177616a08",
    "createdOn": "2023-07-14T17:51:29.999Z",
    "expiresOn": "no expiration"
  }
}
```

## Recommended Actions

If you receive an alert that an API Key has been leaked, we recommend taking one
of the following actions immediately.

### Notify Your Customer

Notify your customer and ask them to login to your Zuplo powered developer
portal and instruct them to roll the API Key. This way the old key is revoked
and they get a new key.

### Roll the API Key

You can use the
[Zuplo API to roll the API Key](https://dev.zuplo.com/docs/routes#roll-consumer-keys)
for the consumer. This will create a new key and revoke the old key.

```bash
export ACCOUNT_NAME="your-account-name"
export BUCKET_NAME="your-bucket-name"
export CONSUMER_NAME="your-consumer-name"
export ZUPLO_API_KEY="your-zuplo-api-key"

curl --request POST \
  --url https://dev.zuplo.com/v1/accounts/$ACCOUNT_NAME/key-buckets/$BUCKET_NAME/consumers/$CONSUMER_NAME/roll-key \
  --header 'Authorization: Bearer $ZUPLO_API_KEY' \
  --header 'Content-Type: application/json' \
  --data '
{
  "expiresOn": "2024-01-01T00:00:00.000Z"
}
'
```
