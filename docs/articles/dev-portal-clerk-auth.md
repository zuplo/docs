---
title: Dev Portal Clerk Setup
sidebar_label: Clerk Setup
---

## Clerk Setup

If you don't have an Clerk account, you can sign up for a
[free Clerk account](https://clerk.com/) that will provide you will 10,000
monthly active users.

### 1/ Create OAuth Application

Create a
[new OAuth application](https://clerk.com/docs/advanced-usage/clerk-idp) using
the Clerk API.

The API request can be called using the curl command below. You will need to
retrieve the Clerk secret key from the Dashboard.

The `callback_url` value must be set to the url of your Zuplo Dev Portal with
the base path (this defaults to `/docs/`). Make sure you have the trailing slash
set.

```bash
curl
 -X POST https://api.clerk.com/v1/oauth_applications \
 -H "Authorization: Bearer <CLERK_SECRET_KEY>"  \
 -H "Content-Type: application/json" \
 -d {"callback_url":"https://my-dev-portal.zuplo.app/docs/", "name": "zuplo_dev_portal", "scopes": "profile email"}
```

The response of this request will return a JSON object that will contain the
values for `client_id` and `client_secret`. Inside of the Zuplo Portal create
two environment variables:

Create a new environment variable named `ZUPLO_PUBLIC_CLERK_CLIENT_ID` and set
the value to the `client_id` value in the API response. Create a new environment
variable, this one needs to be a secret, named `CLERK_CLIENT_SECRET` and set it
to the value of the `client_secret` value in the API response.

### 2/ Configure the Developer Portal

Inside of the Zuplo Developer portal navigate to the **Code Editor** tab and
open the `dev-portal.json` file. Open the JSON tab and edit the file to look
like the following.

```json
{
  "$schema": "https://cdn.zuplo.com/schemas/dev-portal.json",
  "enabled": true,
  "enableAuthentication": true,
  "requireAuthentication": false,
  "authentication": {
    "provider": "clerk",
    "issuer": "https://your-url.clerk.accounts.dev",
    "clientId": "$env(ZUPLO_PUBLIC_CLERK_CLIENT_ID)",
    "clientSecret": "$env(CLERK_CLIENT_SECRET)",
    "scope": "openid profile email"
  }
}
```
