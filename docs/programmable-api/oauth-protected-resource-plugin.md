---
title: OAuth Protected Resource Plugin
---

The `OAuthProtectedResourcePlugin` allows you to configure your Zuplo gateway to
support OAuth protected resources through the
`.well-known/oauth-protected-resource` endpoint. See
[RFC9728](https://datatracker.ietf.org/doc/rfc9728/) for more details.

This is particularly useful when building an MCP Server on Zuplo. See the
[MCP Server Handler docs](../handlers/mcp-server.md#oauth-authentication) for
more details.

## Usage

This runtime plugin will register the `.well-known/oauth-protected-resource`
route on your behalf. If you configure an
[OAuth Policy](../articles/oauth-authentication.md) on a route with the
`oAuthResourceMetadataEnabled` option set to `true`, then the OAuth policy will
automatically add the necessary `WWW-Authenticate` header to 401 responses, with
the `resource_metadata` parameter set to the URL of the
`.well-known/oauth-protected-resource` endpoint.

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

As per the MCP OAuth specification, you _must_ use the canonical URL of your
authorization server as the `authorizationServers` value. The `resourceName` is
a human readable name for the resource.

Note that the `.well-known/oauth-protected-resource` endpoint explicitly has a
CORS policy of `anything-goes` since this is a public endpoint that should be
accessible to anyone to check the server's OAuth configuration.
