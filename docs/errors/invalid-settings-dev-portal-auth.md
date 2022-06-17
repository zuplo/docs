---
title: Invalid Settings - Dev Portal Auth (INVALID_SETTINGS_DEV_PORTAL_AUTH)
---

We were unable to generate documentation because your 'devPortalClient' do not contain a valid auth configuration for 'audience'.

Ensure that the property `authentication.devPortalClient.audience` is set correctly in your `settings.json` file. See the example below.

```json
{
  "authentication": {
    "authority": "https://dev-123566.okta.com/oauth2/ausXXXXXXXXXXXX",
    "jwksUrl": "https://dev-123566.okta.com/oauth2/ausXXXXXXXXXXXX/v1/keys",
    "provider": "Okta",
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
