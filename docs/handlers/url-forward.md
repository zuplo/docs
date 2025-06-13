---
title: URL Forward Handler
sidebar_label: URL Forward
---

The URL Forward handler proxies requests to a different API without writing any
code. It appends the incoming path section of the URL onto the specified
`baseUrl` property, making it ideal for creating API gateways and backend
proxying.

:::tip Type-Safe Configuration Use TypeScript for enhanced development
experience with full type checking and IntelliSense support when configuring
handlers. :::

## How It Works

If you have an incoming request with URL:
`https://my-gateway.com/pizza/cheese/size/large`

And a URL forward handler with `baseUrl` of `https://my-backend.com/folder`, the
gateway makes a request to:
`https://my-backend.com/folder/pizza/cheese/size/large`

By default, query parameters are forwarded automatically.

## Setup via Portal

The Forward Handler can be added to any route using the Route Designer. Open the
**Route Designer** by navigating to the **Files** tab then click
**routes.oas.json**. Inside any route, select **URL Forward** from the **Request
Handlers** drop-down.

In the text box enter the URL to rewrite the request. Values can be mixed into
the URL string using JavaScript string interpolation syntax. For example:

```txt
https://${env.BASE_HOST_NAME}/${method}/${params.productId}
```

The following objects are available for substitution:

- `env` - the environment object, to access
  [Environment Variables](../articles/environment-variables.md)
- `request: ZuploRequest` - the full
  [`ZuploRequest`](../programmable-api/zuplo-request.md) object
- `context: ZuploContext` - the
  [`ZuploContext`](../programmable-api/zuplo-context.md) object without
  functions.
- `params: Record<string, string>` - The parameters of the route. For example,
  `params.productId` would be the value of `:productId` in a route.
- `query: Record<string, string>` - The query parameters of the route. For
  example, `query.filterBy` would be the value of `?filterBy=VALUE`.
- `headers: Headers` - the incoming request's
  [headers object](https://developer.mozilla.org/en-US/docs/Web/API/Headers)
- `url: string` - The full incoming request as a string
- `host: string` - The
  [`host`](https://developer.mozilla.org/en-US/docs/Web/API/URL/host) portion of
  the incoming URL
- `hostname: string` - The
  [`hostname`](https://developer.mozilla.org/en-US/docs/Web/API/URL/hostname)
  portion of the incoming URL
- `pathname: string` - The
  [`pathname`](https://developer.mozilla.org/en-US/docs/Web/API/URL/pathname)
  portion of the incoming URL
- `port: string` - The
  [`port`](https://developer.mozilla.org/en-US/docs/Web/API/URL/port) portion of
  the incoming URL
- `search` - The
  [`search`](https://developer.mozilla.org/en-US/docs/Web/API/URL/search)
  portion of the incoming URL

Use the following methods to encode portions of the URL:

- `encodeURIComponent`: The
  [`encodeURIComponent()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)
  function encodes a URI by replacing each instance of certain characters with
  escape sequences.
- `e`: An alias to `encodeURIComponent` to help keep URLs more readable. Can be
  used like `${e(params.productId)}`

### Example Values

A few examples of the values of various substitutions.

- `${headers.get("content-type")}` - `"application/json"`
- `${host}` - `"example.com:8080"`
- `${hostname}` - `"example.com"`
- `${method}` - `"GET"`
- `${origin}` - `"https://example.com"`
- `${params.productId}` - `":productId"`
- `${pathname}` - `"/v1/products/:productId"`
- `${port}` - `"8080"`
- `${protocol}` - `"https:"`
- `${query.category}` - `"cars"`
- `${search}` - `"?category=cars"`
- `${url}` - `"https://example.com:8080/v1/products/:productId?category=cars"`
- `${env.BASE_URL}` - `"https://example.com"`

## Setup via routes.oas.json

The URL Forward handler can also be added manually to the **routes.oas.json**
file with the following route configuration.

```json
"paths": {
  "/forward-test": {
    "x-zuplo-path": {
      "pathMode": "open-api"
    },
    "get": {
      "summary": "Testing forward handler",
      "x-zuplo-route": {
        "corsPolicy": "none",
        "handler": {
          "export": "urlForwardHandler",
          "module": "$import(@zuplo/runtime)",
          "options": {
            "baseUrl": "${env.BASE_URL}"
          }
        },
        "policies": {
          "inbound": []
        }
      }
    }
  }
}
```

## Options

The URL Forward handler accepts the following options:

- **`baseUrl`** (required): The base URL where the incoming pathname will be
  appended

  - Type: `string`
  - Supports template interpolation with environment variables and request
    properties
  - Example: `"https://api.example.com"` or `"${env.BACKEND_URL}"`

- **`forwardSearch`** (optional): Controls whether query parameters are
  forwarded

  - Type: `boolean`
  - Default: `true`
  - When `true`, query string is automatically included in forwarded URL

- **`followRedirects`** (optional): Controls redirect handling behavior
  - Type: `boolean`
  - Default: `false`
  - When `false`, redirects aren't followed - status and `location` header are
    returned as received
  - When `true`, redirects are automatically followed

### Complete Example

```json
// routes.oas.json handler configuration
{
  "handler": {
    "export": "urlForwardHandler",
    "module": "$import(@zuplo/runtime)",
    "options": {
      "baseUrl": "${env.BACKEND_URL}",
      "forwardSearch": true,
      "followRedirects": false
    }
  }
}
```

## Different Backends per Environment

It's common to want a different backend for your production, staging and preview
environments. This can be achieved by using
[environment variables](../articles/environment-variables.md) to specify the
origin of the backend.

For example,

```js
${env.BASE_PATH}
```

A URL rewrite like this will combine the `BASE_PATH` environment variable, say
`https://example.com`

```txt
https://example.com/foo/bar
```

## Related Documentation

- [URL Rewrite Handler](./url-rewrite.md) - For more complex URL transformations
- [Custom Handler](./custom-handler.md) - Building custom request handlers
- [Environment Variables](../articles/environment-variables.md) - Configuration
  management
- [ZuploRequest](../programmable-api/zuplo-request.md) - Request object
  reference
- [ZuploContext](../programmable-api/zuplo-context.md) - Context object
  reference
