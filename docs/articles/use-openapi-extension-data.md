---
title: Using the OpenAPI Extension Data in Code
---

The OpenAPI specification allows for the use of vendor-specific extensions to
add custom configuration to the API definition. An example of this is the
`x-internal` extension, which can be used to mark an API as internal and not
intended for public use.

This same type of extensibility can be used to add custom data to the OpenAPI
file which can then be used inside of your Zuplo API Gateway. This data can be
used to configure the behavior of the API Gateway, such as setting up rate
limiting, authentication, or other custom behavior.

In this article, we will show you how to use the OpenAPI extension data in your
code.

## Custom Data in the OpenAPI File

To add custom data to your OpenAPI file, you can use the `x-` prefix followed by
the name of the extension. Add this extension to the operation (i.e. the `get`,
`post`, etc. section). For example, to add a custom field called
`my-custom-config` to the OpenAPI file, you would use the following syntax:

```json title="config/routes.oas.json"
{
  "paths": {
    "/hello": {
      "x-zuplo-path": {
        "pathMode": "open-api"
      },

      "get": {
        "summary": "Hello World",
        "x-my-custom-config": 10,
        "x-zuplo-route": {
          "corsPolicy": "none",
          "handler": {
            "export": "default",
            "module": "$import(./modules/route-data)",
            "options": {}
          },
          "policies": {
            "inbound": []
          }
        },
        "operationId": "8914135b-d7b5-49fc-9e41-a8256a0dcf93"
      }
    }
  }
}
```

## Using the Custom Data in Code

To use the custom data in your code, you can access it through the
`ZuploContext` object via the `route.raw` method. The `route.raw` method returns
an object that contains all of the values in the operation.

```ts title="modules/route-data.ts"
import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

export default async function (request: ZuploRequest, context: ZuploContext) {
  const routeData = context.route.raw<{ "x-my-custom-config": number }>();
  const myCustomConfig = routeData["x-my-custom-config"];

  // Logs "Customer config, 10"
  context.log.debug("Custom config", myCustomConfig);

  return "Hello";
}
```

This example uses the Typescript generic `{ "x-my-custom-config": number }` to
add code completion and type safety, but you can also just use
`context.route.raw<any>()` to simplify thing.
