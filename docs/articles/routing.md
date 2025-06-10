---
title: Zuplo Routing
sidebar_label: Routing
---

Zuplo's routing system is designed to be simple and powerful, allowing you to
define how requests are handled and processed. The routing system is based on
the OpenAPI 3.1 specification, which provides a standard way to describe your
API endpoints.

## Routing Basics

Zuplo uses the OpenAPI document to define the routes for your API. Each route is
defined by a path and an HTTP method (GET, POST, PUT, DELETE, etc.). The OpenAPI
document can be edited directly in Zuplo or imported from an external source.

## Path Modes

Zuplo supports two path modes:

- **OpenAPI Mode**: This mode is the default and allows you to define routes
  using OpenAPI paths and
  [path parameters](https://swagger.io/docs/specification/v3_0/describing-parameters/#path-parameters).
  For example, `/users/{userId}` would match any URL that starts with `/users/`
  and has a user ID at the end. This is the recommended mode for most use cases,
  as it provides a clear and standardized way to define your API routes. This is
  the default mode in both the Zuplo UI and when a mode is not explicitly set in
  an OpenAPI document.
- **URL Pattern Mode**: This mode allows you to define routes using the
  web-standard
  [URLPattern](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern). For
  example, `/users/:userId` would match any URL that starts with `/users/` and
  has a user ID at the end. This mode is more powerful and flexible, allowing
  you to use regular expressions and other advanced matching techniques. You can
  switch to URL Pattern mode by setting the `x-zuplo-path` property in your
  OpenAPI document.

## Path Matching & Order

Zuplo uses the OpenAPI document to determine how to match incoming requests to
the defined routes. The matching process is based on the HTTP method and the
path of the request. Zuplo will look for a matching route in the OpenAPI
document and will use the corresponding request handler to process the request.

Routes are matched in the order they are defined in the OpenAPI document and the
alphabetical order the OpenAPI documents are defined in your project. For
example, if you have two OpenAPI files, `file1.json` and `file2.json`
`file1.json` will be matched first. This is particularlly important when using
advanced matching like RegEx or URL Pattern matching, as the order of the routes
can affect which route is matched for a given request. If you have two routes
that could match the same request, the first one defined in the OpenAPI document
will be used.

## Path Parameters

Path parameters are variables in the URL path that can be used to capture
dynamic values. For example, in the path `/users/{userId}`, `{userId}` is a path
parameter that can be replaced with an actual user ID. Zuplo supports path
parameters in both OpenAPI and URL Pattern modes. Path parameters are defined in
the OpenAPI document using curly braces `{}`. For example, the path
`/users/{userId}` defines a path parameter called `userId`. You can use path
parameters in your request handlers to access the values captured by the
parameters. For example, in a request handler for the path `/users/{userId}`,
you can access the `userId` parameter using the `request.params` object:

```ts
import { ZuploRequest, ZuploContext } from "@zuplo/runtime";
import { getUserById } from "./userService";

export default async function (request: ZuploRequest, context: ZuploContext) {
  const userId = request.params.userId;
  const user = await getUserById(userId);
  return context.json(user);
}
```

In this example, the `userId` parameter is extracted from the request and used
to fetch the user from an external data source or API in the `getUserById`
function.

URLPattern mode also supports path parameters, but they are defined using a
colon `:` instead of curly braces `{}`. For example, the path `/users/:userId`
defines a path parameter called `userId`. You can use path parameters in your
request handlers in the same way as in OpenAPI mode.

## Path Matching Examples

### OpenAPI Mode

The example below shows how to define a route in OpenAPI mode with a simple path
and `userId` parameter.

```json
{
  "paths": {
    "/users/{userId}": {
      "get": {
        "operationId": "get-user"
      }
    }
  }
}
```

Parameters can be defined anywhere in a path, for example, you could have a path
like `/users/{userId}/posts/{postId}`. This would match any URL that starts with
`/users/` and has a user ID and post ID at the end.

Paths don't need to be defined using common REST principles. You are free to
structure your paths however you prefer. For example, `/users/get({userId})` is
a valid OpenAPI path and would still match the `userId` parameter.

:::caution{title="Special Characters"}

The handling of special characters in the path has changed with
[Compatibility Date 2025-02-06](../programmable-api/compatibility-dates.md#special-characters-in-openapi-format-urls)

:::

### URL Pattern Mode

The example below shows how to define a route in OpenAPI mode with a simple path
and `userId` parameter.

```json
{
  "paths": {
    "/users/:userId": {
      "get": {
        "operationId": "get-user"
      }
    }
  }
}
```

In addition to the simple parameter patterns, you can also use RegEx patterns. A
common use of this is to create wildcard routes. For example, the path
`/users/(.*)` would match any URL that starts with `/users/` and has any value
after it. This is useful for creating catch-all routes or wildcard routes that
can handle multiple paths.

```json
{
  "paths": {
    "/users/(.*)": {
      "get": {
        "operationId": "get-user"
      }
    }
  }
}
```
