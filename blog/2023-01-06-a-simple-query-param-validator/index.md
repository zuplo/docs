---
title: Simple Query Parameter Validator using Custom Policies
authors: josh
tags: [query, custom-policy, code]
description: How to implement a simple Query Parameter validation approach using Custom Policies
image: https://og-image.zuplo.com?text=Simple%20Query%20Parameter%20Validator%20using%20Custom%20Policies
---

One of the most powerful aspects of Zuplo is the programmable extensibility. Recently somebody on our [Discord channel](https://discord.gg/8QbEjr2MgZ) asked if we supported query parameter validation as we do [JSON Body validation](https://zuplo.com/docs/policies/validate-json-schema-inbound).

We plan to add this soon as a built-in policy (which will use your OpenAPI specification). However, I spent 20 minutes building a custom policy to demonstrate how easy it would be to build a custom policy to support this while you wait.

Here's how you would configure the policy

```json
{
  "export": "default",
  "module": "$import(./modules/query-param-validator)",
  "options": {
    "allowAdditionalParameters": false,
    "params": [
      {
        "name": "foo",
        "required": true,
        "type": "int"
      },
      {
        "name": "bar",
        "required": true,
        "type": "number"
      },
      {
        "name": "wib",
        "required": false,
        "type": "string"
      },
      {
        "name": "ble",
        "required": true,
        "type": "boolean"
      }
    ]
  }
}
```

This defines a policy for a route (which can be reused on other routes) that states there are four supported query parameters: `foo`, `bar`, `wib` and `ble`. No additional query parameters are allowed.

Note that `foo`, `bar` and `ble` are required, whereas `wib` is optional.

Each has a different type specified, and the request will be rejected if the data cannot be parsed as that type from the options `int`, `number`, `string`, and `boolean`.

Here are some hits on that URL and associated error responses (status code 400):

Path: `/query`

```
Bad Request

Required query parameter 'foo' missing
Required query parameter 'bar' missing
Required query parameter 'ble' missing
```

Path: `/query?foo=&bar=hey&wib=nope&ble=23`

```
Bad Request

Required query parameter 'foo' missing
Invalid value for query parameter 'bar': 'hey' is not a valid number
Invalid value for query parameter 'ble': '23' not a valid boolean value (expect 'true' or false')
```

Easy peasy - here's the code for that custom policy

```ts
import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

type SupportedTyped = "int" | "number" | "string" | "boolean";

type ParameterValidationRule = {
  name: string;
  required?: boolean;
  type?: SupportedTyped;
};

type QueryParamValidatorOptions = {
  params: ParameterValidationRule[];
  allowAdditionalParameters?: boolean;
};

const typeValidators: Record<
  SupportedTyped,
  (value: string) => string | undefined
> = {
  int: (value: string) => {
    const int = parseFloat(value);
    if (!Number.isInteger(int)) {
      return `'${value}' is not a valid integer`;
    }
  },
  number: (value: string) => {
    const float = parseFloat(value);
    if (Number.isNaN(float)) {
      return `'${value}' is not a valid number`;
    }
  },
  string: (value: string) => {
    if (value.length === 0) {
      return `empty string provided`;
    }
  },
  boolean: (value: string) => {
    if (!["true", "false"].includes(value)) {
      return `'${value}' not a valid boolean value (expect 'true' or false')`;
    }
  },
};

export default async function (
  request: ZuploRequest,
  context: ZuploContext,
  options: QueryParamValidatorOptions,
  policyName: string
) {
  const allowAdditionalParameters = options.allowAdditionalParameters ?? false;
  const q = request.query;
  const errors: string[] = [];

  // 1. check no additional parameters
  if (!allowAdditionalParameters) {
    const allowedNames = options.params.map((p) => p.name);

    for (const queryName of Object.keys(q)) {
      if (!allowedNames.includes(queryName)) {
        errors.push(`Additional query parameter '${queryName}' not allowed`);
      }
    }
  }

  // 2. check required and value types
  for (const param of options.params) {
    const value = q[param.name];
    const required = param.required ?? true;
    if (!value) {
      if (!required) {
        continue;
      }
      // required parameter not provided.
      errors.push(`Required query parameter '${param.name}' missing`);
    }

    if (param.type && value) {
      const validatorResult = typeValidators[param.type](value);
      if (validatorResult) {
        errors.push(
          `Invalid value for query parameter '${param.name}': ${validatorResult}`
        );
      }
    }
  }

  if (errors.length > 0) {
    return new Response(`Bad Request\n\n${errors.join("\n")}`, { status: 400 });
  }

  return request;
}
```

Have fun!
