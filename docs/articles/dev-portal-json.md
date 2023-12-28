---
title: Config (dev-portal.json)
---

The `dev-portal.json` file is the code that drives most of the configuration of
your Zuplo Gateway. The primary uses of the `dev-portal.json` file are:

- Enabling or disabling features of the Developer Portal
- Setting custom values to various configuration
- Mapping environment variables to settings

:::tip

The `dev-portal.json` file can be edited through a more rich experience in the
Zuplo Portal.

:::

Below is an example of a `dev-portal.json` file that is used to configure custom
authentication to the [Developer Portal](../articles/developer-portal).

```json
{
  "enableAuthentication": true,
  "generateExamples": true,
  "authentication": {
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

## Properties

- **enabled** - Determines whether the Developer Portal is enabled or disabled.
  Default: true
- **pageTitle** - The title of the Developer Portal as seen in the tabs of most
  browsers. Default: Zuplo Dev Portal.
- **faviconUrl** - The icon or 'favicon' for your Developer Portal, as seen in
  the tabs of most browsers. This should be a full, valid https URL. Default:
  https://cdn.zuplo.com/dev-portal/v2/favicon-dev.ico
- **sitePathname** - The path on your gateway's domain at which the Developer
  Portal is accessed. By default it is '/docs' but you can customize this to be
  anything nested in the root folder. Note, it must start with a / but cannot be
  / alone.
- **generateExamples** - Use the schema property on your route's `requestBody`
  and `responses` entries to generate example request and response bodies in the
  Developer Portal.
- **enableAuthentication** - Do you want to enable sign-in to your Developer
  Portal? This is required to enable self-serve of API keys. You must select an
  Auth Provider if this is enabled - by default we give you a demo Auth0
  configuration (you should not use this in production).
- **authentication** - Authentication settings. Checkout the
  [setup guide](./dev-portal-auth.md) to get started.
  - **provider** - Choose your preferred identity provider (Auth0, Okta, etc.).
    Note, we provide you with a demonstration identity provider - this is fine
    for learning how Zuplo works but should not be used in production or on real
    APIs.
  - **authority** - The full URL of the authorization server (e.g.
    https://customer-auth.zuplo.dev/). Note it must be a fully valid https URL
    and should end with a /.
  - **jwksUrl** - The URL to the identity provider's
    [JSON Web Key Set](https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-key-sets)
    URL.
  - **devPortalClient**
    - **clientId** - The OAuth
      [Client ID](https://auth0.com/docs/glossary#A:~:text=about%20an%20entity.-,Client%20ID,-Identification%20value%20assigned)
      used by the Developer Portal for the
      [Authorization Code OAuth flow](https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow-with-proof-key-for-code-exchange-pkce)
    - **audience** - The
      [audience](https://auth0.com/docs/glossary#A:~:text=.-,Audience,-Unique%20identifier%20of)
      of you Zuplo API

## Mapping environment variables to settings

[Environment variables](./environment-variables.md) can be used instead of
hard-coded settings inside of the `dev-portal.json` file. This is the best
practice when setting secret values like `apiKey`. Using environment variables
is also useful when settings change by environment. For example, if you use
different OAuth Clients depending on environment.

Any **whole** value in the `dev-portal.json` file can be substituted for an
environment variable. Substitution is done by setting the string value to
`$env(ZUPLO_PUBLIC_MY_VARIABLE_NAME)` where `ZUPLO_PUBLIC_MY_VARIABLE_NAME` is
the name of your config or secret environment variable. Variable names must
start with `ZUPLO_PUBLIC` in order to be substituted.

Below is an example `dev-portal.json` file with several values substituted by
environment variables.

```json
{
  "enableAuthentication": true,
  "authentication": {
    "authority": "$env(ZUPLO_PUBLIC_OKTA_DEV_PORTAL_AUTHORITY)",
    "jwksUrl": "$env(ZUPLO_PUBLIC_OKTA_DEV_PORTAL_JWKS_URL)",
    "provider": "okta",
    "devPortalClient": {
      "clientId": "$env(ZUPLO_PUBLIC_OKTA_DEV_PORTAL_CLIENT_ID",
      "audience": "api://my-api"
    }
  }
}
```
