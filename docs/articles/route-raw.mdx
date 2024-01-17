---
title: Route Custom Data
---

Each route in your OpenAPI file allows for specifying custom properties on your
route that can be referenced in code. Because the OpenAPI document allows
extensibility by adding `x-` properties, you can add custom data as needed to
your operations and then read that data in code.

## Custom Data in OpenAPI File

The example below shows how to add custom data and operation with a property
`x-custom`.

```json title="/config/routes.oas.json"
{
  "/my-route": {
    "get": {
      // highlight-start
      "x-custom": {
        "hello": "world"
      },
      // highlight-end
      "operationId": "c18da63b-bd4d-433f-a634-1da9913958c0",
      "x-zuplo-route": {
        "handler": {
          "module": "$import(@zuplo/runtime)",
          "export": "urlForwardHandler",
          "options": {
            "baseUrl": "https://echo.zuplo.io",
            "forwardSearch": true
          }
        }
      }
    }
  }
}
```

## Custom Data in Code

Custom data can be accessed through the `context.route.raw()` function. This
gives you full access to the underlying data of the OpenAPI operation. By
default this function returns `unknown`, but you can pass it a custom object or
for the full OpenAPI operation, use `OpenAPIV3_1.OperationObject` exported from
`openapi-types`

```ts
import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

export async function echo(request: ZuploRequest, context: ZuploContext) {
  const data = context.route.raw<{ "x-custom": { hello: string } }>();
  context.log.info(`My custom data: ${data["x-custom"].hello}`);
}
```
