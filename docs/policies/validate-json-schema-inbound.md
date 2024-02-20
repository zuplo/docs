---
title: JSON Body Validation Policy
sidebar_label: JSON Body Validation
---

<!-- WARNING: This document is generated. DO NOT EDIT BY HAND -->

# JSON Body Validation




:::danger Deprecated

This policy is deprecated. Use the new [Request Validation Policy](https://zuplo.com/docs/policies/request-validation-inbound). The new policy validates JSON bodies like this policy, but also supports validation of parameters, query strings, etc.

:::

<!-- start: intro.md -->
The Validate JSON Schema policy is used to validate the body of incoming requests. It works using JSON Schemas defined in the `Schemas` folder of your project.

When configured, any requests that do not have a body conforming to your JSON schema will be rejected with a `400: Bad Request` response containing a detailed error message (in JSON) explaining why the body was not accepted.

<!-- end: intro.md -->

<PolicyStatus isBeta={false} isPaidAddOn={false} />



## Configuration 

The configuration shows how to configure the policy in the 'policies.json' document.

```json title="config/policies.json"
{
  "name": "my-validate-json-schema-inbound-policy",
  "policyType": "validate-json-schema-inbound",
  "handler": {
    "export": "ValidateJsonSchemaInbound",
    "module": "$import(@zuplo/runtime)",
    "options": {
      "validator": "$import(./schemas/example-schema.json)"
    }
  }
}
```

<div className="policy-options">
<div><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-configuration">Policy Configuration<a href="#policy-configuration" class="hash-link" aria-label="Direct link to Policy Configuration" title="Direct link to Policy Configuration">​</a></h3><ul><li><code>name</code> <span class="type-option">&lt;string&gt;</span> - The name of your policy instance. This is used as a reference in your routes.</li><li><code>policyType</code> <span class="type-option">&lt;string&gt;</span> - The identifier of the policy. This is used by the Zuplo UI. Value should be <code>validate-json-schema-inbound</code>.</li><li><code>handler.export</code> <span class="type-option">&lt;string&gt;</span> - The name of the exported type. Value should be <code>ValidateJsonSchemaInbound</code>.</li><li><code>handler.module</code> <span class="type-option">&lt;string&gt;</span> - The module containing the policy. Value should be <code>$import(@zuplo/runtime)</code>.</li><li><code>handler.options</code> <span class="type-option">&lt;object&gt;</span> - The options for this policy. <a href="#policy-options">See Policy Options</a> below.</li></ul><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-options">Policy Options<a href="#policy-options" class="hash-link" aria-label="Direct link to Policy Options" title="Direct link to Policy Options">​</a></h3><p>The options for this policy are specified below. All properties are optional unless specifically marked as required.</p><ul><li><code>validator</code><span class="type-option"> &lt;string&gt;</span><span class="required-option"> (Required)</span> - <div><p>The JSON schema to validate against.</p></div></li></ul></div>
</div>

## Using the Policy
<!-- start: doc.md -->
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

Here is an example configuration (this would go in `policies.json`).

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

This policy is then referenced from each route where you want the policy to be
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

If the request body is missing a required field, an error similar to the
following will be returned.

```json
{
  "code": "SCHEMA_VALIDATION_FAILED",
  "help_url": "https://zup.fail/SCHEMA_VALIDATION_FAILED",
  "message": "Incoming body did not pass schema validation",
  "errors": ["Body must have required property 'price'"]
}
```

### Invalid Field Type

If the request body contains a field that is not of the correct type, an error
similar to the following will be returned.

```json
{
  "code": "SCHEMA_VALIDATION_FAILED",
  "help_url": "https://zup.fail/SCHEMA_VALIDATION_FAILED",
  "message": "Incoming body did not pass schema validation",
  "errors": ["price must be number"]
}
```

<!-- end: doc.md -->

Read more about [how policies work](/docs/articles/policies)
