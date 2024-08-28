---
title: OpenAPI Specifications
---

Zuplo natively uses the OpenAPI specification to power both the gateway routing
and Developer Portal documentation. Your OpenAPI file (contained within your
project's `config` folder and ending in `.oas.json`) is used to automatically
generate stripe-quality API Reference documentation. By enriching your OpenAPI
file with additional properties, you directly enable more content show up in the
Developer Portal.

Read more about OpenAPI and all the possibilities
[here](https://github.com/OAI/OpenAPI-Specification).

## Supported OpenAPI Versions

Zuplo has full support for features within OpenAPI 3.1. If you are still on
OpenAPI 3.0, then most features will still be supported within the Developer
Portal. OpenAPI 2.x / Swagger or earlier is not supported at this time. There
are multiple solutions to convert your OpenAPI 2.x document - including
[CLI, and API](https://stackoverflow.com/questions/59749513/how-to-convert-openapi-2-0-to-openapi-3-0).

## Handling Multiple OpenAPI Files

Your project may utilize multiple OpenAPI files to power your gateway. The
Developer Portal is equipped to handle this - allowing users to navigate between
documentation for each OpenAPI spec. You can even
[customize the content](./dev-portal-configuring-sidebar#customizing-individual-openapi-specs)
displayed on each OpenAPI spec.

## JSON Schemas

You can embed your JSON Schemas directly into your OpenAPI document on each
endpoint, or if you want to share them within, you can put them in the
`components` section and use a reference, example:

```json
"responses": {
   "200": {
      "description": "A list of todos",
         "content": {
            "application/json": {
               "schema": {
               "$ref": "#/components/schemas/TodoListObject"
            }
         }
      }
   }
},
```

You can also reference an external schema (you might store this in the `schemas`
folder of your project, e.g.

```json
"400": {
   "description": "Schema validation error",
      "content": {
         "application/json": {
            "schema": {
            "$ref": "../schemas/schema-validation-error.json"
         }
      }
   }
}

```

## Providing Examples

The Developer Portal allows you to configure the displayed examples for
properties like parameters, request bodies, and responses. There are several
different ways to specify an example in OpenAPI, so here's the order of
precedence we use:

1. The `example` property, found on
   [Media Type Object](https://spec.openapis.org/oas/v3.1.0#media-type-object)(ex.
   request and response bodies) and
   [Parameter Object](https://spec.openapis.org/oas/v3.1.0#parameter-object)(ex.
   Params and response headers).
2. The first `examples` entry, found on the Media Type Object and Parameters
   Object.
3. If a schema is specified, the first entry in the schema's `examples`.
4. The `example` property on the schema.
5. The `default` property on the schema.
6. If none of the above are present, and `generateExamples` is `true` in
   `dev-portal.json`, then we will generate an example using the provided schema
