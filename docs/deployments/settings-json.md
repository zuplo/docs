---
title: Settings File
---

The `settings.json` file is the code that drives most of the configuration of your Zuplo Gateway. The primary uses of the `settings.json` file are:

- Enabling or disabling features of the Gateway
- Setting custom values to various configuration
- Mapping environment variables to settings

:::caution

The `settings.json` file is a beta feature. At this time, it is edited directly as raw JSON. Soon this will be replaced by a more rich experience in the <SettingsTabIcon /> **Settings** tab.

:::

Below is an example of a `settings.json` file that is used to configure custom authentication to the [Developer Portal](../developer-portal/index.md).

```json
{
  "authentication": {
    "authority": "https://dev-123566.okta.com/oauth2/ausXXXXXXXXXXXX",
    "jwksUrl": "https://dev-123566.okta.com/oauth2/ausXXXXXXXXXXXX/v1/keys",
    "provider": "okta",
    "devPortalClient": {
      "clientId": "XXXXXXXXXXXX",
      "audience": "api://my-api"
    },
    "managementClient": {
      "apiKey": "$env(OKTA_API_KEY)"
    }
  }
}
```

## Properties

- **authentication** - Authentication settings
  - **authority** - The URL to your identity provider's OAuth endpoint
  - **jwksUrl** - The url to the identity provider's [JSON Web Key Set](https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-key-sets) url.
  - **provider** - The identity provider being used. Either `auth0` or `okta`
  - **devPortalClient**
    - **clientId** - The OAuth Client ID used by the Developer Portal for the [Authorization Code OAuth flow](https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow-with-proof-key-for-code-exchange-pkce)
    - **audience** - The [audience](https://auth0.com/docs/glossary#A:~:text=multi%2Dfactor%20authentication.-,Audience,-The%20unique%20identifier) of you Zuplo API
  - **managementClient**
    - **apiKey** - The API key used by Zuplo to manage OAuth clients on your identity provider.
- **developerPortal** - Developer Portal Settings
  - **logoUrl** - The URL to the logo used by the developer portal
  - **faviconUrl** The URL to the favicon used by the developer portal
  - **pageTitle** The value of the `<title>` element used by the developer portal

## Mapping environment variables to settings

[Environment variables](./environment-variables.md) can be used instead of hard-coded settings inside of the `settings.json` file. This is the best practice when setting secret values like `apiKey`. Using environment variables is also useful when settings change by environment. For example, if you use different OAuth Clients depending on environment.

Any **whole** value in the `settings.json` file can be substituted for an environment variable. Substitution is done by setting the string value to `$env(MY_VARIABLE_NAME)` where `MY_VARIABLE_NAME` is the name of your config or secret environment variable.

Below is an example `settings.json` file with several value substituted by environment variable.

```json
{
  "authentication": {
    "authority": "$env(OKTA_DEV_PORTAL_AUTHORITY)",
    "jwksUrl": "$env(OKTA_DEV_PORTAL_JWKS_URL)",
    "provider": "okta",
    "devPortalClient": {
      "clientId": "$env(OKTA_DEV_PORTAL_CLIENT_ID",
      "audience": "api://my-api"
    },
    "managementClient": {
      "apiKey": "$env(OKTA_API_KEY)"
    }
  }
}
```
