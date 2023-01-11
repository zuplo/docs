---
title: URL Rewrite Handler
sidebar_label: URL Rewrite
---

The URL Rewrite handler can be used to proxy and rewrite requests to a different API without writing any code. The handler allows mapping request data and parameters to a URL on another host. You can also combine the URL rewrite handler with policies such as the [Change Method Inbound](../policies/change-method-inbound.md) policy to modify virtually any aspect of your request.

## Setup via Portal

The Rewrite Handler can be added to any route using the Route Designer. Open the **Route Designer** by navigating to the <CodeEditorTabIcon /> **Code Editor** tab then click **routes.json**. Inside any route, select **URL Rewrite** from the **Request Handlers** drop-down.

![Url Rewrite Handler selection](../../static/media/url-rewrite-handler-selection.png)

In the text box enter the URL to rewrite the request. Values can be mixed into the URL string using Javascript string interpolation syntax. For example:

```
https://echo.zuplo.io/${method}/${params.productId}
```

The following objects are available for substitution:

- `env` - the environment object, to access [Environment Variables](../deployments/environment-variables.md)
- `request: ZuploRequest` - the full [`ZuploRequest`](../reference/zuplo-request.md) object
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

The URL Rewrite handler can also be added manually to the **routes.json** file with the following route configuration.

```json
{
  "label": "Welcome",
  "path": "/",
  "methods": ["GET"],
  "handler": {
    "module": "$import(@zuplo/runtime)",
    "export": "urlRewriteHandler",
    "options": {
      "rewritePattern": "https://welcome.zuplo.io"
    }
  },
  "corsPolicy": "anything-goes",
  "version": "none",
  "summary": "Proxy Welcome API",
  "description": "This Route will proxy the welcome.zuplo.io api"
}
```

## Different Backends per Environment

It's common to want a different backend for your production, staging and preview environments. This can be easily achieved by using [environment variables](../deployments/environment-variables.md) to specify the origin of the backend.

For example,

```json
${env.BASE_PATH}${pathname}
```

A url rewrite like this will combine the `BASE_PATH` environment variable, say `https://example.com` with the incoming path, e.g. `/foo/bar` to create a re-written URL:

```json
https://example.com/foo/bar
```
