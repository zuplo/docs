---
title: URL Forward Handler
sidebar_label: URL Forward
---

The URL Forward handler can be used to proxy requests to a different API without writing any code. It simply appends the incoming `path` section of the URL onto the specified `baseUrl` property. For example:

If you have an incoming request with url

`https://my-gateway.com/pizza/cheese/size/large`

And you have a URL forward handler with a baseUrl of `https://my-backend.com/folder` - the gateway will make a request to

`https://my-backend.com/folder/pizza/cheese/size/large`. By default it will forward any search parameters.

## Setup via Portal

The Forward Handler can be added to any route using the Route Designer. Open the **Route Designer** by navigating to the <CodeEditorTabIcon /> **Code Editor** tab then click **Route Designer**. Inside any route, select **URL Forward** from the **Request Handlers** drop-down.

In the text box enter the URL to rewrite the request. Values can be mixed into the URL string using Javascript string interpolation syntax. For example:

```
https://${env.BASE_HOST_NAME}/${method}/${params.productId}
```

The following objects are available for substitution:

- `env` - the environment object, to access [Environment Variables](../articles/environment-variables.md)
- `request: ZuploRequest` - the full [`ZuploRequest`](../articles/zuplo-request.md) object
- `params: Record<string, string>` - The parameters of the route. For example, `params.productId` would be the value of `:productId` in a route.
- `query: Record<string, string>` - The query parameters of the route. For example, `query.filterBy` would be the value of `?filterBy=VALUE`.
- `headers: Headers` - the incoming request's [headers object](https://developer.mozilla.org/en-US/docs/Web/API/Headers)
- `url: string` - The full incoming request as a string
- `host: string` - The [`host`](https://developer.mozilla.org/en-US/docs/Web/API/URL/host) portion of the incoming URL
- `hostname: string` - The [`hostname`](https://developer.mozilla.org/en-US/docs/Web/API/URL/hostname) portion of the incoming URL
- `pathname: string` - The [`pathname`](https://developer.mozilla.org/en-US/docs/Web/API/URL/pathname) portion of the incoming URL
- `port: string` - The [`port`](https://developer.mozilla.org/en-US/docs/Web/API/URL/port) portion of the incoming URL
- `search` - The [`search`](https://developer.mozilla.org/en-US/docs/Web/API/URL/search) portion of the incoming URL

Use the following methods to encode portions of the URL:

- `encodeURIComponent`: The [`encodeURIComponent()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent) function encodes a URI by replacing each instance of certain characters with escape sequences.
- `e`: An alias to `encodeURIComponent` to help keep URLs more readable. Can be used like `${e(params.productId)}`

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

## Setup via Routes.json

The URL Forward handler can also be added manually to the **routes.json** file with the following route configuration.

```json
{
  "label": "Welcome",
  "path": "/",
  "methods": ["GET"],
  "handler": {
    "module": "$import(@zuplo/runtime)",
    "export": "urlForwardHandler",
    "options": {
      "baseUrl": "${env.BASE_URL}"
    }
  },
  "corsPolicy": "anything-goes",
  "version": "none",
  "summary": "Proxy Welcome API",
  "description": "This Route will proxy the welcome.zuplo.io api"
}
```

## Options

The URL Rewrite handler can be configured via `options` to support common use-cases.

- `baseUrl` - the base URL the incoming pathname will be appended to.
- `forwardSearch` - The query string will be automatically included in the rewritten url.
- `followRedirects` - Determines if redirects should be followed when fetching the rewrite url . When set to `false` or not specified, redirects will not be followed - the status and `location` header will be returned as received.

## Different Backends per Environment

It's common to want a different backend for your production, staging and preview environments. This can be easily achieved by using [environment variables](../articles/environment-variables.md) to specify the origin of the backend.

For example,

```
${env.BASE_PATH}
```

A url rewrite like this will combine the `BASE_PATH` environment variable, say `https://example.com`

```
https://example.com/foo/bar
```
