---
title: OAuth Client Management Setup
---

In order to configure OAuth client management for your Developer Portal, you will need to create an OAuth Client in your identity provider that will be used for federated authentication. This OAuth Client is what Zuplo will use to authenticate with your Identity Provider to determine that your users are who they say they are.

You can find instructions on creating an OAuth client for your provider in the documents below.

- [Auth0](https://auth0.com/docs/get-started/auth0-overview/create-applications/regular-web-apps)
- [Okta](https://developer.okta.com/docs/guides/implement-grant-type/authcode/main/#set-up-your-app)

You will need to set the `redirect_uri` (often called Callback URL) and the allowed logout URL when you create your application. Use the values below.

- **Callback URL**: https://partner-auth.zuplo.app/login/callback
- **Logout URL**: https://partner-auth.zuplo.app/v2/logout

After you create your OAuth client, you will need to provide your Zuplo Account Manager with the following information in order for them to complete the setup.

:::warning

Do not email or otherwise insecurely share the Client Secret. Use something like 1Password or other means of securely sharing this value.

:::

- **Client ID**: The client id of the client
- **Client Secret**: The client secret of the client
- **Authorization URL**: The URL where the transaction begins. Typically, this is in the format `https://auth.example.com/oauth2/authorize`
- **Token URL**: The URL will use to exchange the code for an access_token. Typically, this is in the format `https://auth.example.com/oauth2/token`
- **Scopes**: The scope parameters that you want to request consent for. Include any custom claims (i.e. customer_id, etc.)
- **Profile URL**: The API endpoint where the user's profile can be retrieved using the returned access_token. Typically, this is in the format `https://auth.example.com/userinfo`

## Custom Claims

When you include custom claims in the above **Scopes** list, you can provide values when a user authenticates that will be included in the access_token in your Zuplo application. For example, if you request the scope `customer_id` your identity provider should provide that claim as part of the auth flow.

In your application, you can access the claim as part of the user object on the response.

```ts
async function (request: ZuploRequest, context: ZuploContext) {
  if (request.user.data["customer_id"] === "12345") {
    // do something
  }
}
```
