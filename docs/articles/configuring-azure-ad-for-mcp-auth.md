---
title: Setting up Azure Active Directory as an Authentication Server for MCP OAuth Authentication
---

In this guide, you'll learn how to configure Microsoft Entra ID (formerly Azure
Active Directory) as an Authorization Server for use with the MCP Server
handler. See the [MCP Server Handler docs](../handlers/mcp-server.md#oauth-authentication)
for instructions on how to configure your Zuplo gateway to support OAuth
    authentication for your MCP Server.

This guide assumes that you already have a working Microsoft Azure account and
an Entra ID tenant.

### Create an App Registration

First, you will need to create an App Registration in Microsoft Entra ID. This
app registration will represent your MCP Server.

1. In the Azure portal, navigate to **Microsoft Entra ID** and click
   **App registrations**.
2. Click **New registration**.
3. Set the **Name** to something like "MCP Server" and set the
   **Supported account types** to the appropriate option for your use case
   (typically "Accounts in this organizational directory only").
4. For **Redirect URI**, select "Web" and enter a placeholder URI like
   `https://example.com/callback` (this will be updated later during dynamic
   client registration).
5. Click **Register**.
6. Record the **Application (client) ID** from the overview page.

### Configure API Permissions and App ID URI

Next, you need to configure the app registration to act as an API with
appropriate permissions.

1. In your app registration, click **Expose an API** in the left sidebar.
2. Click **Set** next to **Application ID URI** and set it to the canonical UR
   of your MCP Server. For example, if your MCP Server is hosted at
   `https://my-gateway.zuplo.dev/mcp`, then the Application ID URI would
   be `https://my-gateway.zuplo.dev/mcp`. **The trailing slash is not required.**
3. Click **Add a scope** and create a default scope:
   - **Scope name**: `access`
   - **Who can consent**: Admins and users
   - **Admin consent display name**: Access MCP Server
   - **Admin consent description**: Allows the application to access the MCP Server
   - **User consent display name**: Access MCP Server
   - **User consent description**: Allows the application to access the MCP Server
   - **State**: Enabled
4. Click **Add scope**.

### Configure Authentication Settings

Configure the authentication settings for OAuth 2.0 support:

1. Click **Authentication** in the left sidebar.
2. Under **Advanced settings**, ensure the following are configured:
   - **Allow public client flows**: Yes (to support PKCE)
   - **Supported account types**: Set appropriately for your use case
3. Under **Implicit grant and hybrid flows**, you typically don't need to enable
   these for MCP OAuth flows.

### Create a Client Secret (Optional)

If your OAuth flow requires a client secret (though MCP typically uses PKCE),
create one:

1. Click **Certificates & secrets** in the left sidebar.
2. Click **New client secret**.
3. Add a description and select an expiration period.
4. Click **Add** and record the secret value immediately (it won't be shown again).

:::tip

If you configure an expiring secret, make sure to record the expiration date;
you will need to renew the key before that day to avoid a service interruption.

:::

### Configure Token Configuration (Optional)

To customize the claims in your tokens:

1. Click **Token configuration** in the left sidebar.
2. Add any optional or additional claims your MCP Server needs.
3. For basic MCP functionality, the default claims are typically sufficient.

### Configure OAuth on Zuplo

To set up your gateway to support OAuth authentication for your MCP Server, you
will need to do the following:

1. Create an OAuth policy on your MCP Server route. This policy will need to
   have the option `"oAuthResourceMetadataEnabled": true`, for example:

   ```json
   {
     "name": "mcp-oauth-inbound",
     "policyType": "open-id-jwt-auth-inbound",
     "handler": {
       "export": "OpenIdJwtInboundPolicy",
       "module": "$import(@zuplo/runtime)",
       "options": {
         "issuer": "https://login.microsoftonline.com/YOUR_TENANT_ID/v2.0",
         "audience": "https://my-gateway.zuplo.dev/mcp",
         "oAuthResourceMetadataEnabled": true
       }
     }
   }
   ```

   Replace `YOUR_TENANT_ID` with your Microsoft Entra ID tenant ID, and set the audience to the Application ID URI you configured earlier.

2. Add the OAuth policy to the MCP Server route. For example:

   ```json
   "paths": {
     "/mcp": {
       "post": {
         "x-zuplo-route": {
           // etc. etc.
           // other properties and route handlers for MCP

           "policies": {
             "inbound": [
               "mcp-oauth-inbound"
             ]
           }
         }
       }
     }
   }
   ```

3. Add the `OAuthProtectedResourcePlugin` to your `runtimeInit` function in the
   `zuplo.runtime.ts` file:

   ```ts
   import {
     RuntimeExtensions,
     OAuthProtectedResourcePlugin,
   } from "@zuplo/runtime";

   export function runtimeInit(runtime: RuntimeExtensions) {
     runtime.addPlugin(
       new OAuthProtectedResourcePlugin({
         authorizationServers: ["https://login.microsoftonline.com/YOUR_TENANT_ID/v2.0"],
         resourceName: "My MCP OAuth Resource",
       }),
     );
   }
   ```

   Replace `YOUR_TENANT_ID` with your Microsoft Entra ID tenant ID.

   See the [OAuth Protected Resource Plugin docs](../programmable-api/oauth-protected-resource-plugin) for more details.

See the [MCP Server Handler docs](../handlers/mcp-server.md#oauth-authentication) for more details.

### Testing

Use the [MCP Inspector](https://github.com/modelcontextprotocol/inspector),
a developer focused tool for building MCP servers, to quickly and easily test
out your MCP server:

```sh
npx @modelcontextprotocol/inspector
```

To connect to your remote Zuplo MCP server in the Inspector UI:

1. Set the **Transport Type** to "Streamable HTTP"
2. Set the **URL** to your Zuplo gateway with the route used by the MCP Server
   Handler (i.e., `https://my-gateway.zuplo.dev/mcp`)
3. You will need to login using the OAuth flow using the **Open Auth Settings** button.
4. Hit **Connect**.

For debugging your OAuth configuration, hit the **Open Auth Settings** button
in the Inspector UI to start the OAuth flow. When first setting up the OAuth
flow, it is recommended to use the **Guided OAuth Flow** which you will see
when you open the OAuth settings. This will allow you to debug the flow step by step.

You should be able to hit the **Continue** button in the Inspector UI at each
step of the flow successfully. If you need more help debugging, see
[Testing OAuth on Zuplo](../handlers/mcp-server.md#oauth-testing).

### Additional Resources

For more information about Azure AD OAuth configuration, see:

- [Setup Azure Active Directory SSO](./sso-azure-ad.md) - For general Azure AD setup guidance
- [OAuth Authentication](./oauth-authentication.md) - For general OAuth concepts in Zuplo
- [Microsoft Entra ID documentation](https://learn.microsoft.com/en-us/entra/identity-platform/) - Official Microsoft documentation
