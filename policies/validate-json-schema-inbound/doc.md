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

<ZupIt repoUrl="https://github.com/zuplo/samples-basic-auth" />

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

## Errors

### Missing fields

If the request body is missing a required field, an error similar to the following will be returned.

```json
{
  "code": "SCHEMA_VALIDATION_FAILED",
  "help_url": "https://zup.fail/SCHEMA_VALIDATION_FAILED",
  "message": "Incoming body did not pass schema validation",
  "errors": ["Body must have required property 'price'"]
}
```

### Invalid Field Type

If the request body contains a field that is not of the correct type, an error similar to the following will be returned.

```json
{
  "code": "SCHEMA_VALIDATION_FAILED",
  "help_url": "https://zup.fail/SCHEMA_VALIDATION_FAILED",
  "message": "Incoming body did not pass schema validation",
  "errors": ["price must be number"]
}
```
