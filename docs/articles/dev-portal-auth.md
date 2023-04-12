---
title: Authentication
---

Out of the box, authentication to your developer portal uses Zuplo's test Auth0 account. **The test Auth0 account cannot be used in production**. The test account is limited to a small number of users per month per project so you will want to change this to use your own identity provider. The developer portal supports authenticating with any standard-compliant OpenID Connect identity provider such as [Auth0](https://auth0.com), [Okta](https://okta.com), [AWS Cognito](https://aws.amazon.com/cognito/), etc.

## Auth0 Setup

If you don't have an Auth0 account, you can sign up for a [free Auth0 account](https://auth0.com/signup) that will provide you will 7,000 monthly active users.

### 1. Create Auth0 Application

[Create a new Auth0 application](https://auth0.com/docs/get-started/auth0-overview/create-applications) in the Auth0 dashboard. When creating the application select type "Single Page Web Applications"

<SizedImage src="https://cdn.zuplo.com/assets/0aaa56b6-37c4-4c87-ac62-d86bc52047e3.png" maxWidth="70%" />

### 2. Configure Auth0 Application

You must set the following fields in the Auth0 application:

** Application URIs**

- **Allowed Callback URLs**: Add your docs site url (i.e. `https://my-app.zuplo.app/docs/`)
- **Allowed Logout URLs**: Add your docs site url (i.e. `https://my-app.zuplo.app/docs/`)
- **Allowed Web Origins**: Add your docs site url without the path (i.e. `https://my-app.zuplo.app`)

** Refresh Token Rotation**

- **Rotation**: Enabled
- **Reuse Interval**: Leave at `0`

<SizedImage src="https://cdn.zuplo.com/assets/359f4a6c-4dd9-48c9-b8a3-27e70aa459c0.png" maxWidth="70%" />

** Refresh Token Expiration**

- **Absolute Expiration**: Enabled
- **Absolute Lifetime**: Can be whatever time you want, default is `2592000`
- **Inactivity Expiration**: Enabled
- **Inactivity Lifetime**: Can be whatever you want, default is `1296000`

### 3. Create an Auth0 API

[Create an API](https://auth0.com/docs/get-started/auth0-overview/set-up-apis) in the Auth0 portal. Set the **Identifier** to something like `https://api.my-domain.com/`.

:::note

The identifier is commonly a URI, but it doesn't have to be, nor does the URI have to match where your API is hosted. It is common practice to use the same identifier for all different environments of your API even if they are on different URLs.

:::

<SizedImage src="https://cdn.zuplo.com/assets/d91471bd-5897-463e-805c-35abba294616.png" maxWidth="70%" />

### 4. Configure the Developer Portal

Inside of the Zuplo Developer portal navigate to the <CodeEditorTabIcon /> **Code Editor** tab and open the `dev-portal.json` file. You can [edit the JSON manually](./dev-portal-json.md), but in this tutorial we will use the UI editor.

Set the following settings:

- **Enable Authentication**: Checked
- **Provider**: `auth0`
- **Authority**: This is your Auth0 domain (i.e. `my-company.us.auth0.com`) in URL format like `https://my-company.us.auth0.com/`. _The trailing slash is required._
- **Client ID**: The client ID of the Auth0 application that was created in the earlier steps. This is a string of letters an numbers. _The Client ID is not a secret value._
- **Audience**: This is the value for `audience` that you set when creating the Auth0 API earlier.

<SizedImage src="https://cdn.zuplo.com/assets/16c9b4a0-db9b-4b8c-a16f-00ce5e08071e.png" maxWidth="70%" />
