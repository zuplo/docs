---
title: OpenAPI Spec Handler
sidebar_label: OpenAPI Spec Handler
---

The OpenAPI Spec handler can be used to serve a public version of your OpenAPI
specification file. The OpenAPI file will be stripped of Zuplo gateway
configuration (ex. `x-zuplo-*` extensions) and enriched with data based on the
implementation of the gateway. For example, if you configured your route to be
protected by the [API Key policy](../policies/api-key-inbound.md), we will
automatically document the `Authorization` header within the generated OpenAPI
spec.

## Setup via Portal

The Forward Handler can be added to any route using the Route Designer. Open the
**Route Designer** by navigating to the **Files** tab then click
**routes.oas.json**. Inside any route, select **OpenAPI Spec** from the
**Request Handlers** drop-down.

The handler should be defaulted to the OpenAPI file you currently have open, but
you can change it to serve a different OpenAPI file via the dropdown.

## Setup via routes.oas.json

The OpenAPI Spec handler can also be added manually to the **routes.oas.json**
file with the following route configuration.

```json
"paths": {
  "/open-api-spec": {
    "get": {
      "summary": "New Route",
      "x-zuplo-route": {
        "corsPolicy": "none",
        "handler": {
          "export": "openApiSpecHandler",
          "module": "$import(@zuplo/runtime)",
          "options": {
            "openApiFilePath": "./config/routes.oas.json"
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

The OpenAPI Spec handler can be configured via `options` as follows:

- `openApiFilePath` - the file path of an OpenAPI file within the `config`
  folder. The file name must end with `.oas.json`.
