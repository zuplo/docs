---
title: Setting up Auth0 as an Authentication Server for MCP OAuth Authentication
---

In this guide, you'll learn how to configure Auth0 as an Authorization Server
for use with the MCP Server handler. See the
[MCP Server Handler docs](../handlers/mcp-server.md#oauth-authentication) for
instructions on how to configure your Zuplo gateway to support OAuth
authentication for your MCP Server.

This guide will assume that you already have a working Auth0 account and tenant.

### Create an Auth0 API

First, you will need to create an Auth0 API. This API will be used to represent
your MCP Server.

1. In the Auth0 dashboard, navigate to the APIs section and click **Create
   API**.
2. Set the **Name** to something like "MCP Server" and the **Identifier** to the
   canonical URL of your MCP Server. For example, if your MCP Server is hosted
   at `https://my-gateway.zuplo.dev/mcp`, then the identifier would be
   `https://my-gateway.zuplo.dev/mcp`. **The trailing slash is not required.**
3. Leave the **Signing Algorithm** as `RS256` and click **Create**.

### Enable Dynamic Client Registration

Next, you will need to enable Dynamic Client Registration for the API you just
created.

1. In the Auth0 dashboard, navigate to the tenant settings in **Settings** on
   the left hand sidebar.
2. Navigate to the **Advanced** tab.
3. Scroll down to the **Settings** section and check the toggle for **OIDC
   Dynamic Application Registration**. Also ensure that the **Enable Application
   Connections** toggle is checked.

### Configure the Connection

Next, you will need to configure an Auth0 Connection for your API.

1. Click the **Authentication** tab in the left hand sidebar.

2. Click the type of Authentication connection you would like to use. For this
   tutorial, we will use the default database
   **Username-Password-Authentication** connection. If you are not using the
   default database connection, then create a new connection of the type you
   want to use and configure it with your desired settings. Click the **Try
   Connection** button to make sure that it is working. Note the Identifier of
   the connection. You will need this in one of the next steps.

3. Promote the connection that you would like to use for your MCP Client
   authentication to be a domain level connection. To do this, you will need to
   use the Auth0 management API. You will need to create an Auth0 Management API
   token with the `update:connections` scope. You can obtain one by following
   this
   [Auth0 doc](https://auth0.com/docs/secure/tokens/access-tokens/management-api-access-tokens/get-management-api-access-tokens-for-testing).

4. Follow the
   [Promote Connections to Domain Level](https://auth0.com/docs/authenticate/identity-providers/promote-connections-to-domain-level)
   Auth0 doc to promote your connection to a domain level connection. You will
   need the connection ID from step 2, as well as the Auth0 Management API token
   from step 3.

   For example using curl:

   ```sh
   curl --request PATCH \
   --url 'https://your-auth0-domain.us.auth0.com/api/v2/connections/CONNECTION_ID' \
   --header 'authorization: Bearer MGMT_API_ACCESS_TOKEN' \
   --header 'cache-control: no-cache' \
   --header 'content-type: application/json' \
   --data '{ "is_domain_connection": true }'
   ```

5. Configure a default domain audience. See the Auth0 doc on
   [API Authorization Settings](https://auth0.com/docs/get-started/tenant-settings#api-authorization-settings)
   to configure a default audience. The audience should be the identifier of the
   API you created in [Create an Auth0 API](#create-an-auth0-api).

### Configure OAuth on Zuplo

To set up your gateway to support OAuth authentication for your MCP Server, you
will need to do the following:

1. Create an OAuth policy on your MCP Server route. This policy will need to
   have the option `"oAuthResourceMetadataEnabled": true`, for example:
   ```json
   {
     "name": "mcp-oauth-inbound",
     "policyType": "oauth-inbound",
     "handler": {
       "export": "Auth0JwtInboundPolicy",
       "module": "$import(@zuplo/runtime)",
       "options": {
         "auth0Domain": "my-auth0-domain.us.auth0.com",
         "audience": "https://my-mcp-audience",
         "oAuthResourceMetadataEnabled": true
       }
     }
   }
   ```
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
         authorizationServers: ["https://your-auth0-domain.us.auth0.com"],
         resourceName: "My MCP OAuth Resource",
       }),
     );
   }
   ```

   See the
   [OAuth Protected Resource Plugin docs](../programmable-api/oauth-protected-resource-plugin)
   for more details.

See the
[MCP Server Handler docs](../handlers/mcp-server.md#oauth-authentication) for
more details.

### Testing

Use the [MCP Inspector](https://github.com/modelcontextprotocol/inspector), a
developer focused tool for building MCP servers, to quickly and easily test out
your MCP server:

```sh
npx @modelcontextprotocol/inspector
```

For debugging your OAuth configuration, hit the **Open Auth Settings** button in
the Inspector UI to start the OAuth flow. When first setting up the OAuth flow,
it is recommmended to use the **Guided OAuth Flow** which you will see when you
open the OAuth settings. This will allow you to debug the flow step by step.

You should be able to hit the **Continue** button in the Inspector UI at each
step of the flow successfully. If you need more help debugging, see
[Testing OAuth on Zuplo](../handlers/mcp-server.md#oauth-testing).
