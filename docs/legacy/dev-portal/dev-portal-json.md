---
title: Config (dev-portal.json)
---

:::warning

This documentation is for the legacy version of the Dev Portal. If you are
looking for the new preview developer portal, please refer to the
[docs](/docs/dev-portal).

:::

The `dev-portal.json` file is the code that drives most of the configuration of
your Zuplo Gateway. The primary uses of the `dev-portal.json` file are:

- Enabling or disabling features of the Developer Portal
- Setting custom values to various configuration
- Mapping environment variables to settings

:::tip

The `dev-portal.json` file can be edited through a more rich experience in the
Zuplo Portal.

:::

Below is an example of a `dev-portal.json` file that's used to configure custom
authentication to the [Developer Portal](./developer-portal.md).

```json
{
  "enableAuthentication": true,
  "requireAuthentication": false,
  "generateExamples": true,
  "authentication": {
    "issuer": "https://dev-123566.okta.com/oauth2/ausXXXXXXXXXXXX",
    "provider": "okta",
    "clientId": "XXXXXXXXXXXX",
    "audience": "api://my-api"
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
  Portal is accessed. By default it's '/docs' but you can customize this to be
  anything nested in the root folder. Note, it must start with a / but can't be
  / alone.
- **generateExamples** - Use the schema property on your route's `requestBody`
  and `responses` entries to generate example request and response bodies in the
  Developer Portal.
- **enableAuthentication** - Do you want to enable sign-in to your Developer
  Portal? This is required to enable self-serve of API keys. You must select an
  Auth Provider if this is enabled - by default we give you a demo Auth0
  configuration (you shouldn't use this in production).
- **requireAuthentication** - If set to true, all users are required to
  authenticate to your Developer Portal. Users who navigate to your Developer
  Portal will immediately be directed to the login page. The developer portal
  won't be accessible to anonymous users (including bots such as Google's
  crawler).
- **authentication** - Authentication settings. Checkout the
  [setup guide](./dev-portal-auth.md) to get started.
  - **provider** - Choose your preferred identity provider (Auth0, Okta, etc.).
    Note, we provide you with a demonstration identity provider - this is fine
    for learning how Zuplo works but shouldn't be used in production or on real
    APIs.
  - **issuer** - The full URL of the authorization server (e.g.
    https://customer-auth.zuplo.dev/). This must be a https URL.
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
    "issuer": "$env(ZUPLO_PUBLIC_OKTA_ISSUER)",
    "provider": "okta",
    "clientId": "$env(ZUPLO_PUBLIC_OKTA_CLIENT_ID)",
    "audience": "api://my-api"
  }
}
```
