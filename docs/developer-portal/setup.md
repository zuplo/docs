---
title: Developer Portal Setup
sidebar_label: Setup
---

Setup of the Developer Portal is handled using the [`settings.json` file](../deployments/settings-json.md). There are several areas of configuration that can change the style as well as things like authentication.

## Customization

Inside the `settings.json` file under the `developerPortal` section, there is configuration to customize the look of your portal.

- **developerPortal** - Developer Portal Settings
  - **logoUrl** - The URL to the logo used by the developer portal
  - **faviconUrl** The URL to the favicon used by the developer portal
  - **pageTitle** The value of the `<title>` element used by the developer portal
  - **sitePathname** The path where the Developer Portal is served on your domain. Defaults to `/docs`.

:::caution

If you change the `sitePathname` value to anything other than the default value of `/docs` you MUST configure a custom authentication provider. The test provider will only work with the default path.

:::

## Authentication

Out of the box, authentication to your developer portal uses Zuplo's test Auth0 account. **The test Auth0 account cannot be used in production.**. The test account is limited to a small number of users per month per project so you will want to change this to use your own identity provider. The developer portal supports authenticating with any standard-compliant OpenID Connect identity provider such as [Auth0](https://auth0.com), [Okta](https://okta.com), [AWS Cognito](https://aws.amazon.com/cognito/), etc.

The following settings control how your users authenticate to your developer portal.

- **authentication** - Authentication settings
  - **enabled** - Enables or disables authentication to the developer portal
  - **authority** - The URL to your identity provider's OAuth endpoint
  - **jwksUrl** - The url to the identity provider's [JSON Web Key Set](https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-key-sets) url.
  - **provider** - The identity provider being used. Either `auth0` or `okta`
  - **devPortalClient**
    - **clientId** - The OAuth Client ID used by the Developer Portal for the [Authorization Code OAuth flow](https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow-with-proof-key-for-code-exchange-pkce)
    - **audience** - The [audience](https://auth0.com/docs/glossary#A:~:text=multi%2Dfactor%20authentication.-,Audience,-The%20unique%20identifier) of you Zuplo API

To configure authentication, you will need to create both an OAuth Client (sometimes called Application) as well as an OAuth Resource (sometimes called API).

### Auth0 Setup

If you don't have an Auth0 account, you can sign up for a [free Auth0 account](https://auth0.com/signup) that will provide you will 7,000 monthly active users.

1. [Create an Application](https://auth0.com/docs/get-started/auth0-overview/create-applications). When creating the application select type "Single Page Web Applications"
2. Set the `authentication.authority` property to `https://` plus your Auth0 domain and a trailing slash, i.e. `https:://my-company.us.auth0.com/`
3. Set the `authentication.jwksUrl` property to `https://` plus your Auth0 domain plus `/.well-known/jwks.json`, i.e. `https:://my-company.us.auth0.com/.well-known/jwks.json`
4. Set the `authentication.provider` value to `auth0`
5. Set the `authentication.devPortalClient.clientId` to the Client ID of the application you created in step 1.
6. [Set up an API](https://auth0.com/docs/get-started/auth0-overview/set-up-apis). Set the **Identifier** to something like `https://api.my-domain.com/`.

:::note

The identifier is commonly a URI, but it doesn't have to be, nor does the URI have to match where your API is hosted. It is common practice to use the same identifier for all different environments of your API even if they are on different URLs.

:::

7. Set the `authentication.devPortalClient.audience` to the value you set as your API **Identifier** in the previous step

Example `settings.json` file for Auth0

```json
{
  "authentication": {
    "enabled": true,
    "authority": "https:://my-company.us.auth0.com/",
    "jwksUrl": "https:://my-company.us.auth0.com/.well-known/jwks.json",
    "provider": "auth0",
    "devPortalClient": {
      "clientId": "XXXXXXXXXXXX",
      "audience": "https://my-api.example.com/"
    }
  }
}
```

### Okta Setup

Example `settings.json` file for Okta

```json
{
  "authentication": {
    "enabled": true,
    "authority": "https://dev-123566.okta.com/oauth2/ausXXXXXXXXXXXX",
    "jwksUrl": "https://dev-123566.okta.com/oauth2/ausXXXXXXXXXXXX/v1/keys",
    "provider": "okta",
    "devPortalClient": {
      "clientId": "XXXXXXXXXXXX",
      "audience": "api://my-api"
    }
  }
}
```
