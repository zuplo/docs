---
title: WebSocket Handler
sidebar_label: WebSocket Handler
---

::: note
This is an Enterprise only policy at this time. Please contact us to trial this or sign up for an Enterprise account. 
:::

The WebSocket Handler enables you to manage WebSocket connections to your
backend WebSocket APIs. It can be configured alongside other existing policies
like [Rate Limiting](../policies/rate-limit-inbound.md),
[API Keys](../policies/api-key-inbound.md), etc. and is available for use on all
environments.

This handler is currently in beta and only configurable via the JSON View on a
project's Route Designer or directly in your project's `*.oas.json` file.

## Setup in routes.oas.json

Configuration of the WebSocket Handler is similar to other available handlers.
Set the name of the path that your WebSocket API route will use, set the use of
the `webSocketHandler` export from `@zuplo/runtime` module in the handler
configuration and use the `rewritePattern` property inside of `options` to point
to your service's WebSocket API endpoint.

Your configuration will look like below:

```json
"/my-websocket": {
  "x-zuplo-path": {
  "pathMode": "open-api"
  },
  "get": {
  "summary": "Zuplo websocket route to internal API",
  "description": "Zuplo websocket route to internal API",
  "x-zuplo-route": {
    "corsPolicy": "none",
    "handler": {
      "export": "webSocketHandler",
      "module": "$import(@zuplo/runtime)",
      "options": {
        "rewritePattern": "https://myservice.com/websocket",
      }
    },
    "policies": {
      "inbound": []
    }
  },
  "operationId": "8115f88e-b561-4248-b317-0e256e9d6b6a"
  }
},
```

## Handler Options

The WebSocket Handler can be configured via `options` property. It has the
following configuration properties

- `rewritePattern` - the URL the incoming pathname will be appended to.

Similar to other handlers using `rewritePattern`, it supports Javascript string
interpolation syntax and can be used to shape the URL based on data from the
incoming request and environment variables defined in the project.

```
https://${env.BASE_HOST_NAME}/${method}/${params.productId}
```

The following objects are available for substitution:

- `env` - the environment object, to access
  [Environment Variables](../articles/environment-variables.md)
- `request: ZuploRequest` - the full
  [`ZuploRequest`](../articles/zuplo-request.md) object
- `context: ZuploContext` - the [`ZuploContext`](../articles/zuplo-context.md)
  object without functions.
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

## Different Backends per Environment

It's common to want to use different backends for your production, staging and
preview environments. This can be easily achieved by using
[environment variables](../articles/environment-variables.md) to specify the
origin of the backend.

For example,

```
${env.BASE_PATH}
```

Using the `rewritePattern` in `options` you can combine the `BASE_PATH`
environment variable, say `https://example.com` to achieve this.

```
https://${env.BASE_PATH}/foo/bar

// Runtime value is
https://example.com/foo/bar
```
