---
title: Custom CORS policies
---

There are two built-in CORS policies called `none` and `anything-goes`. The former disallows any cross-origin access while the latter allows any cross-origin access (and is discouraged for production use cases). To correctly support CORS we recommend creating and using a custom CORS policy.

## CORS Policy

Custom policies are created in the routes.json file alongside the routes, policies and versions properties:

```json
{
  "routes": [], //...
  "policies": [], //...
  "versions": [], //...
  "corsPolicies": [] // custom CORS policies go here
}
```

A CORS policy consists of a name and set of CORS headers to be returned
for cross-origin requests (both the simple type and pre-flight request).

```json
{
  //... rest of routes.json file
  "corsPolicies": [
    {
      "name": "custom-cors",
      "allowedOrigins": ["https://domain1.com", "https://domain2.com"],
      "allowedHeaders": ["origin", "my-special-incoming-header"],
      "allowedMethods": ["GET", "POST"],
      "exposeHeaders": ["my-special-response-header"],
      "maxAge": 600,
      "allowCredentials": true
    }
  ]
}
```

:::note

You can specify a list of supported domains. Zuplo will ensure the pre-flight request is compatible with browsers by filtering the list to match the incoming origin, provided it is in your list of origins.

:::

You can then reference your custom CORS policy in your route by specifying the name of your CORS policy on your route, (or choosing it in the route designer UI).

```json
{
  "routes": [
    {
      "methods": [
        "GET"
      ],
      "corsPolicy": "custom-cors",
      "path": "/",
      "summary": "New Route",
      "description": "Lorem ipsum...",
      "version": "none",

      "handler": {
        "export": "urlRewriteHandler",
        "module": "$import(@zuplo/runtime)",
        "options": {
          "rewritePattern": "https://welcome.zuplo.io/",
          "forwardSearch": true
        }
      },
      "policies": {
        "inbound": []
      }
      //...

```

For more information on CORS, checkout the MDN documentation: [Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
