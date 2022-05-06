---
title: OpenId JWT Auth Policy
sidebar_label: OpenId JWT
---

The Open ID JWT Authentication policy allows you to authenticate incoming
requests using an Open ID compliant bearer token. It works with common
authentication services like Auth0 (sample here) but should also work with any valid Open ID JWT token.

When configured, you can have Zuplo check incoming requests for a JWT token and automatically populate the `ZuploRequest` 's `user` property with a user object. This `user` object will have a `sub` property - taking the `sub` id from the JWT token. It will also have a `data` property populated by other data returned in the JWT token (including any claims).

## Configuration

:::tip

Be sure to read about [policies](/docs/policies)

:::

Here is an example configuration (this would go in the `policies` section of the routes.json file).

```ts
{
  "name": "your-jwt-policy-name",
  "policyType": "open-id-jwt-inbound",
  "handler": {
    "export": "OpenIdJwtInboundPolicy",
    "module": "$import(@zuplo/runtime)",
    "options": {
      "issuer": "$env(AUTH_ISSUER)",
      "audience": "$env(AUTH_AUDIENCE)",
      "jwkUrl": "https://zuplo-demo.us.auth0.com/.well-known/jwks.json",
      "allowUnauthenticatedRequests": false
    }
  }
}
```

- `name` the name of your policy instance. This is used as a reference in your routes.
- `policyType` the identifier of the policy. This is used by the Zuplo UI. Value should be `open-id-jwt-inbound`.
- `handler/export` The name of the exported type. Value should be
  `OpenIdJwtInboundPolicy`.
- `handler/module` the module containing the policy. Value should be
  `$import(@zuplo/runtime)`.
- `handler/options` The options for this policy:
  - `issuer` the issuer claim of the JWT token.
  - `audience` the audience claim for the JWT token.
  - `jwkUrl` the url of the JSON Web Key Set (JWKS) - this is used to validate
    the JWT token signature.
  - `allowUnauthenticatedRequests` indicates whether the request should continue if authentication fails. Defaults is `false` which means unauthenticated users will automatically receive a 401 response.

Note that sometimes the `issuer` and `audience` will vary between your
environments (e.g. dev, staging and prod). We recommend storing these values in your environment variables and using `$env(VARIABLE_NAME)` to include them in your policy configuration.

:::note

Note you can have multiple instances of the same policy with different `name`s if you want to have slightly different rules (such as settings for the `allowUnauthenticatedRequests` setting.

:::

```json
{
  "path": "/products/:123",
  "methods": ["POST"],
  "handler": {
    "module": "$import(./modules/products)",
    "export": "postProducts"
  },
  "corsPolicy": "None",
  "version": "none",
  "policies": {
    "inbound": ["your-jwt-policy-name"]
  }
}
```

## Using the user property in code

For an example of using the user object in a [RequestHandler](../handlers/custom-handler.md), see [Setting up JWT auth with Auth0](../policies/auth0-jwt-auth-inbound.md).
