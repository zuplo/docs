---
title: Path Matching
sidebar_label: Path Matching
---

Routes in a Zuplo gateway are defined in the `routes.json` file. Each route definition specifies a list of supported HTTP methods (GET, POST etc) and the path that should be matched.

Path matching can be tokenized to specify **path parameters**. For example, if your API has the following form

`https://example.com/products/1234567`
`https://example.com/products/9876543`

You might want to define the `productId` as a parameter in your path signature. To do this in Zuplo you use the following form to identify a token: `:productId`.

So your path would look as follows

`/products/:productId`

And your routes.json definition

```json
 "routes": [
    {
      "path": "/products/:productId",
      "methods": ["GET"]
```

## Params object

All parameters captured in the path are available on a `params` object
that is presented to Zuplo [request handlers](request-handler.md) on the [request](zuplo-request.md) object.

You can also use these parameters in a URL Rewrite handler as shown below

URL Rewrite: `https://ecommerce.zuplo.io/products/${params.productId}`

## Regexp and wild-cards

The path parameterization system is based on [path-to-regexp](https://github.com/pillarjs/path-to-regexp) and supports advanced regular expressions to pattern match.

For example, you can match anything with a wildcard as follows:

`/products/(.*)`

This would match _any_ url that begins `/products/`, for example:

- `/products/123/`
- `/products/anything/at/all/can/be/here`

In this case, the params object will have a property `0` that contains the matched string, which would equal the following for the examples above

- `params[0]` === `123/`
- `params[0]` === `anything/at/all/can/be/here`

| **Note** - params do not capture values from query strings, you can use the `query` or `search` objects to access query string information.

Rather than match RegExp groups using their index (e.g. `0`) you can also name groups in your path, e.g.

`/products/:wildcard(.*)`

Will now present as follows for the examples above

- `params.wildcard` === `123/`
- `params.wildcard` === `anything/at/all/can/be/here`

## Route Testing

We know getting routes, regular expressions and URL rewrites 👌 can be tricky, so we created a built-in Route Tester in the Route Designer.

You can access the Route Tester at the top right, as shown below

![Route Tester](../../static/media/runtime/path-matching/route-tester.png)

If you open the route tester, you'll be presented with a form that allows you to specify the HTTP method and path (relative to root).

When you match a route, the tester will show you

- any matched path parameters
- querystring values

It will also highlight the matching route with a green banner and - best of all - if you're using URL rewrite it will give an example of how the URL will be re-written.

![Route Test Result](../../static/media/runtime/path-matching/route-test-result.png)

| **Note** - Don't forget to include any version prefix in your test path, like `/v1/`.
