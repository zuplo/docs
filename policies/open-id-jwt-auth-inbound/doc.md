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
