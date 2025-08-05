---
title: Custom CORS policies
---

There are two built-in CORS policies called `none` and `anything-goes`. The
former disallows any cross-origin access while the latter allows any
cross-origin access (and is discouraged for production use cases). To correctly
support CORS we recommend creating and using a custom CORS policy.

## CORS Policy

Custom CORS policies are created in the policies.json file alongside regular
policies:

```json
{
  "policies": [], //...
  "corsPolicies": [] // custom CORS policies go here
}
```

A CORS policy consists of a name and set of CORS headers to be returned for
cross-origin requests (both the simple type and pre-flight request).

:::warning

Make sure to not have a trailing `/` on your `allowedOrigins`. e.g.
`https://example.com` is valid, `https://example.com/` won't work.

:::

```json
{
  //... rest of policies.json file
  "corsPolicies": [
    {
      "name": "custom-cors",
      "allowedOrigins": "https://*.domain1.com, https://domain2.com",
      "allowedHeaders": "origin, my-special-incoming-header",
      "allowedMethods": ["GET", "POST"],
      "exposeHeaders": "my-special-response-header",
      "maxAge": 600,
      "allowCredentials": true
    }
  ]
}
```

:::note

You can specify a list of supported domains. Zuplo will ensure the pre-flight
request is compatible with browsers by filtering the list to match the incoming
origin, provided it's in your list of origins.

You can also use wildcards to match subdomains, for example `*.example.com` will
match any subdomain of example.com.

:::

You can then reference your custom CORS policy in your route by specifying the
name of your CORS policy on your route, (or choosing it in the route designer
UI).

```json
"paths": {
  "/redirect-test": {
    "get": {
      "x-zuplo-route": {
        "corsPolicy": "custom-cors",
        "handler": {
          "module": "$import(@zuplo/runtime)",
          "export": "redirectHandler",
          "options": {
            "location": "/docs"
          }
        }
      },
      ...
    }
  }
}
```

For more information on CORS, check out the MDN documentation:
[Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

## Using environment variables

If you need to support different origins, headers, etc. in different
environments, you can use environment variables

```json
{
  //... rest of policies.json file
  "corsPolicies": [
    {
      "name": "custom-cors",
      "allowedOrigins": "$env(ALLOWED_ORIGINS)", // "https://domain1.com, https://domain2.com",
      "allowedHeaders": "$env(ALLOWED_HEADERS)", // "origin, my-special-incoming-header",
      "allowedMethods": ["GET", "POST"],
      "exposeHeaders": "my-special-response-header",
      "maxAge": 600,
      "allowCredentials": true
    }
  ]
}
```
