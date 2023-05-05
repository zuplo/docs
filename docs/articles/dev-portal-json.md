---
title: Config (dev-portal.json)
---

The `dev-portal.json` file is the code that drives most of the configuration of
your Zuplo Gateway. The primary uses of the `dev-portal.json` file are:

- Enabling or disabling features of the Gateway
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

- **faviconUrl** The URL to the favicon used by the developer portal
- **pageTitle** The value of the `<title>` element used by the developer portal
- **sitePathname** The path where the Developer Portal is served on your domain.
  Defaults to `/docs`.
- **enableAuthentication** - If users can log in to the developer portal
- **authentication** - Authentication settings
  - **authority** - The URL to your identity provider's OAuth endpoint
  - **jwksUrl** - The URL to the identity provider's
    [JSON Web Key Set](https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-key-sets)
    URL.
  - **provider** - The identity provider being used. Either `auth0` or `okta`
  - **devPortalClient**
    - **clientId** - The OAuth Client ID used by the Developer Portal for the
      [Authorization Code OAuth flow](https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow-with-proof-key-for-code-exchange-pkce)
    - **audience** - The
      [audience](https://auth0.com/docs/glossary#A:~:text=multi%2Dfactor%20authentication.-,Audience,-The%20unique%20identifier)
      of you Zuplo API

## Mapping environment variables to settings

[Environment variables](./environment-variables.md) can be used instead of
hard-coded settings inside of the `dev-portal.json` file. This is the best
practice when setting secret values like `apiKey`. Using environment variables
is also useful when settings change by environment. For example, if you use
different OAuth Clients depending on environment.

Any **whole** value in the `dev-portal.json` file can be substituted for an
environment variable. Substitution is done by setting the string value to
`$env(MY_VARIABLE_NAME)` where `MY_VARIABLE_NAME` is the name of your config or
secret environment variable.

Below is an example `dev-portal.json` file with several values substituted by
environment variables.

```json
{
  "enableAuthentication": true,
  "authentication": {
    "authority": "$env(OKTA_DEV_PORTAL_AUTHORITY)",
    "jwksUrl": "$env(OKTA_DEV_PORTAL_JWKS_URL)",
    "provider": "okta",
    "devPortalClient": {
      "clientId": "$env(OKTA_DEV_PORTAL_CLIENT_ID",
      "audience": "api://my-api"
    }
  }
}
```
