---
title: Routes Configuration
---

The `routes.json` file within your project supports many properties from the [Open API 3.1.0 spec](https://spec.openapis.org/oas/v3.1.0). In order to streamline the developer experience and prevent your routes file from growing out of control, we only support select properties.

## Version Info

Please see the [version management](./version-management.md) section to learn how to provide information specific to a version of your API

## Summary & Descriptions

Each route in your `routes` array supports adding a `summary` and `description`. We support markdown for the description. You can also add summaries and descriptions to the other Open API objects that support them.

```json
"summary": "Add Friends",
"description": "This API lets you add friends"
```

## Operations

In order to customize the documentation for `operations` belonging to the same `path`, you should create another route with the same `path` but a different `method`.

```json
{
  "label": "Add Friends",
  "path": "/v1/friends/:userID",
  "methods": [
    "POST"
  ],
  // Add friends specific config
},
{
  "label": "View Friends",
  "path": "/v1/friends/:userID",
  "methods": [
    "GET"
  ],
  // View friends specific config
}
```

## Parameters

Adding parameters to a route is equivalent to adding parameters at the `Operation Object` level. We currently support `schema` over the `content` property for specifying the structure of the param. Also see [Schemas](#schemas).

```json
"parameters": [
  {
    "name": "userID",
    "in": "path",
    "required": true,
    "description": "The user's ID",
    "schema": {
      "type": "string",
      "format": "uuid"
    }
  }
],
```

## Request Bodies

Adding the `validate-json-schema-inbound` to your route will automatically generate a `Request Body`.

## Responses

Responses can be provided in the same way as Open API, not including the `links` property.

```json
"responses": {
  "200": {
    "description": "Friends",
    "headers": {},
    "content": {
      "application/json": {
        "schema": {
          "type": "array",
          "items": {
            "type": "string",
            "faker": "name.findName" // See Providing Examples section for faker usage in schemas
          }
        }
      }
    }
  },
  "404": {
    "description": "Not Found",
    "headers": {},
    "content": {}
  },
  "5XX": {
    "description": "Failure - cache miss",
    "headers": {
      "x-hosting-cache": {
        "description": "Cache state",
        "schema": {
          "type": "string",
          "examples": [
            "MISS",
            "HIT",
            "STALE"
          ]
        }
      }
    },
    "content": {
      "application/json": {
        "schema": {
          "type": "string"
        }
      }
    }
  }
}
```

## Schemas

The `schema` property is the default way Zuplo supports specifying the structure of a parameter, request, response, etc. Schemas in the `schemas` directory of your project can be referenced via `"$import(./schemas/<your-schema>.json)"`. This keeps file-bloat down and ensures consistency between production and documented schemas.

### Providing Examples

Schemas are also the only supported way to provide examples for parameters, headers, responses, etc. using the `examples` keyword. If it is difficult to generate examples for your data, Zuplo support [Faker.js](https://github.com/faker-js/faker) via the [`faker`](https://github.com/json-schema-faker/json-schema-faker/blob/master/docs/USAGE.md#faking-values) keyword. The Responses example above would generate the following names

![Faker](../../static/media/developer-portal/configuration/faker.png)

## Tags

Tags can be added to a route, however only the first value will be used for grouping together routes in the `developer portal`. You can learn how to add a description to your tag in the [version management](./version-management.md) section.

```json
"tags": [
  "Friends"
]
```

## Security

See [API Key Management](../guides/api-key-management.md).

## Excluding a Route

To exclude a route from your developer portal, set the `excludeFromOpenApi` property to `true`.
