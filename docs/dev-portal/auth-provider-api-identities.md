---
title: Custom API Identity Plugin
sidebar_label: Custom API Identities
navigation_icon: fingerprint
description:
  Learn how to create a custom API identity plugin for the Dev Portal to
  authenticate API playground requests with OAuth JWT tokens or other custom
  credentials.
---

The Dev Portal API playground allows users to make authenticated requests to
your API. By default, users can enter credentials (such as API keys) directly in
the playground's Authorize dialog. However, when your API uses OAuth or OpenID
Connect for authentication, you need a custom API identity plugin to
automatically attach the user's access token to playground requests.

:::tip

If you use Zuplo's built-in API key management, you do not need to create a
custom identity plugin. API keys work automatically in the playground without
any additional configuration.

:::

## When to use a custom identity plugin

Use a custom API identity plugin when:

- Your API requires OAuth 2.0 or OpenID Connect bearer tokens for
  authentication.
- You want to automatically attach the signed-in user's access token to
  playground requests.
- You need to apply custom authentication logic, such as using a specific token
  format or adding extra headers.

## Prerequisites

Before creating an identity plugin, configure an
[authentication provider](./zudoku/configuration/authentication.md) for the Dev
Portal. The authentication provider handles user sign-in and token management.
The identity plugin then bridges the user's session to the API playground.

For example, using OpenID Connect:

```ts title="zudoku.config.ts"
const config = {
  authentication: {
    type: "openid",
    clientId: "<your-client-id>",
    issuer: "https://your-idp.example.com",
  },
};
```

## Creating an identity plugin

Use `createApiIdentityPlugin` from `zudoku/plugins` to define how the playground
authenticates API requests. The plugin provides a `getIdentities` function that
returns one or more identities, each with an `authorizeRequest` function that
modifies outgoing requests.

### Using `signRequest`

The simplest approach uses `context.authentication.signRequest()`, which
automatically attaches the user's access token to the request:

```ts title="zudoku.config.ts"
import { createApiIdentityPlugin } from "zudoku/plugins";

const config = {
  authentication: {
    type: "openid",
    clientId: "<your-client-id>",
    issuer: "https://your-idp.example.com",
  },
  plugins: [
    createApiIdentityPlugin({
      getIdentities: async (context) => [
        {
          id: "oauth-token",
          label: "OAuth Token",
          authorizeRequest: (request) => {
            return context.authentication?.signRequest(request);
          },
        },
      ],
    }),
  ],
};
```

### Using `getAccessToken`

If you need more control over how the token is applied, use
`context.authentication.getAccessToken()` to retrieve the token directly. This
is useful when you need to set a specific header format or add the token to a
query parameter:

```ts title="zudoku.config.ts"
import { createApiIdentityPlugin } from "zudoku/plugins";

const config = {
  authentication: {
    type: "openid",
    clientId: "<your-client-id>",
    issuer: "https://your-idp.example.com",
  },
  plugins: [
    createApiIdentityPlugin({
      getIdentities: async (context) => [
        {
          id: "jwt-bearer",
          label: "JWT Bearer Token",
          authorizeRequest: async (request) => {
            const token = await context.authentication?.getAccessToken();

            if (!token) {
              throw new Error(
                "No access token available. Please sign in again.",
              );
            }

            request.headers.set("Authorization", `Bearer ${token}`);
            return request;
          },
        },
      ],
    }),
  ],
};
```

## How it works

When a user signs in to the Dev Portal and makes a request from the API
playground:

1. The Dev Portal displays the configured identities as selectable options in
   the playground.
2. When the user selects an identity and sends a request, the `authorizeRequest`
   function runs before the request is sent.
3. The function modifies the request (typically by adding an `Authorization`
   header) and returns it.
4. The playground sends the modified request to your API.

## The `ApiIdentity` interface

Each identity returned by `getIdentities` has the following properties:

| Property           | Type                                                | Description                                                        |
| ------------------ | --------------------------------------------------- | ------------------------------------------------------------------ |
| `id`               | `string`                                            | A unique identifier for the identity.                              |
| `label`            | `string`                                            | A human-readable name displayed in the playground identity picker. |
| `authorizeRequest` | `(request: Request) => Request \| Promise<Request>` | A function that adds authentication credentials to the request.    |

## Multiple identities

You can return multiple identities from `getIdentities` to give users a choice
of authentication methods:

```ts title="zudoku.config.ts"
createApiIdentityPlugin({
  getIdentities: async (context) => [
    {
      id: "oauth-token",
      label: "OAuth Token",
      authorizeRequest: (request) => {
        return context.authentication?.signRequest(request);
      },
    },
    {
      id: "custom-header",
      label: "Custom API Header",
      authorizeRequest: (request) => {
        request.headers.set("X-Custom-Auth", "my-value");
        return request;
      },
    },
  ],
});
```

## Related pages

- [Authentication](./zudoku/configuration/authentication.md) - Configure a
  sign-in provider for the Dev Portal.
- [OAuth Security Schemes](./zudoku/configuration/oauth-security-schemes.md) -
  Learn how OAuth security schemes work with the Dev Portal.
- [Custom Plugins](./zudoku/custom-plugins.md) - Build other types of custom
  plugins for the Dev Portal.
