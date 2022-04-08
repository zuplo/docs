---
title: Validate JSON Schema Policy
sidebar_label: Validate JSON Schema
---

## Overview

The Validate JSON Schema policy is used to validate the body of incoming
requests. It works using JSON Schemas defined in the `Schemas` folder of your
project.

When configured, any requests that do not have a body conforming to your JSON
schema will be rejected with a `400: Bad Request` response containing a detailed
error message (in JSON) explaining why the body was not accepted.

Here's a simple, example JSON Schema

```json
{
  "title": "Car",
  "type": "object",
  "properties": {
    "make": {
      "type": "string"
    },
    "model": {
      "type": "string"
    },
    "maxSpeed": {
      "description": "Max Speed in Mile Per Hour (MPH)",
      "type": "integer",
      "minimum": 0
    },
    "color": {
      "enum": ["black", "brown", "blue", "red", "silver"],
      "type": "string"
    }
  },
  "additionalProperties": false,
  "required": ["make", "model"]
}
```

> Note - "title" is a required property of JSON schema

This defines a body that should be of type object with required string
properties `make` and `model`. It also defines two optional properties
`maxSpeed` and `color`. The former must be an integer greater than or equal to
zero and `color` can (in this silly example) can be one of "black", "brown",
"red", "silver" or "blue". No other properties can be on this object.

The schemas file should live in the `schemas` folder of your project - for the
purposes of this example let's imagine it is called `car.json`.

> **Note** - this sample is available as a Zup It on GitHub - just click ZupIt!
> to deploy to your Zuplo account:

## Configuration

Here is an example configuration (this would go in the `policies` section of the
routes.json file).

```json
{
  "name": "validate-car-policy",
  "policyType": "validate-json-schema-inbound",
  "handler": {
    "export": "ValidateJsonSchemaInbound",
    "module": "$import(@zuplo/runtime)",
    "options": {
      "validator": "$import(./schemas/car.json)"
    }
  }
}
```

- `name` the name of your policy instance, this is used to refer to your policy
  from your routes, see below.
- `policyType` the identifier of the policy. This is used by the Zuplo UI. Value
  should be `validate-json-schema-inbound`.
- `handler/export` The name of the exported type. Value should be
  `ValidateJsonSchemaInboundPolicy`.
- `handler/module` the module containing the policy. Value should be
  `@zuplo/runtime`.
- `handler/options` The options for this policy:
  - `validator` a
    '$import' reference to the schema - e.g. `$import(./schemas/car.json)`

This policy is then reference on each route where you want the policy to be
enforced, for example:

```json
{
  "path": "/products/:123",
  "methods": ["POST"],
  "handler": {
    "module": "$import(./modules/products)",
    "export": "postProducts"
  },
  "corsPolicy": "None",
  "version": "none",
  "policies": {
    "inbound": ["validate-car-policy"]
  }
}
```

You can test this in the API Test Console with the following (correct) body

```json
{
  "make": "Alfa Romeo",
  "model": "156",
  "maxSpeed": 134,
  "color": "silver"
}
```
