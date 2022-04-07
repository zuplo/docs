---
title: Basic Authentication Policy
---

## Overview

The Basic Authentication policy allows you to authenticate incoming requests
using the Basic authentication standard. You can configure multiple accounts
with different passwords and a different bucket of user 'data'.

The API will expect a Basic Auth header (you can generate samples
[here](https://www.debugbear.com/basic-auth-header-generator)). Requests with
invalid credentials (or no header) will not be authenticated. Authenticated
requests will populate the `user` property of the `ZuploRequest` parameter on
your RequestHandler.

> **Note** - this sample is available as a Zup It on GitHub - just click ZupIt!
> to deploy to your Zuplo account: https://github.com/zuplo/samples-basic-auth

## Configuration

Here is an example configuration (this would go in the `policies` section of the
routes.json file).

```json
{
  "routes": ["..."],
  "versions": ["..."],
  "policies": [
    {
      "name": "basic-auth-policy",
      "policyType": "basic-auth-inbound-policy",
      "handler": {
        "export": "BasicAuthInboundPolicy",
        "module": "$import(@zuplo/runtime)",
        "options": {
          "allowUnauthenticatedRequests": false,
          "accounts": [
            {
              "username": "test-username",
              "password": "my-password",
              "data": {
                "number": 1
              }
            },
            {
              "username": "test-username-2",
              "password": "my-password-2",
              "data": {
                "number": 1
              }
            }
          ]
        }
      }
    }
  ]
}
```

- `name` the name of your policy instance. This is used as a reference in your
  routes.
- `policyType` the identifier of the policy. This is used by the Zuplo UI. Value
  should be `basic-auth-inbound-policy`.
- `handler/export` The name of the exported type. Value should be
  `BasicAuthInboundPolicy`.
- `handler/module` the module containing the policy. Value should be
  `$import(@zuplo/runtime)`.
- `handler/options` The options for this policy:
  - `allowUnauthenticatedRequests` indicates whether the request should continue
    if authentication fails. Defaults is `false` which means unauthenticated
    users will automatically receive a 401 response.
  - `accounts` an array of accounts with username, password and data.
    - `username` the username for the 'account'. This will be used as the `sub`
      identifier on the user object.
    - `password` the password. ⚠️ We do not recommend storing passwords in your
      routes.json file. Instead, you can store the passwords for these accounts
      in environment variables and reference using `$env(VARIABLE_NAME)`.
    - `data` a dynamically typed data bucket passed as `data` on
      `ZuploRequest`'s `user` object. This can be used to store arbitrary data
      for each account for use in a
      [RequestHandler](/docs/reference/request-handler).

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
    "inbound": ["basic-auth-policy"]
  }
}
```

You can now test your API using the API test console, you should see a 401
response on your route. To authenticate you'll need to set an `authorization`
header with a value `Basic <token>`. The basic auth token is a digest of the
username and password. You can generate one using a generator like this:
[https://www.debugbear.com/basic-auth-header-generator](https://www.debugbear.com/basic-auth-header-generator)

## Using the user object in code

In your [RequestHandler](/docs/reference/request-handler) you can use the user
object, for example:

```ts
import { ZuploRequest, ZuploContext } from "@zuplo/runtime";

export default async function (request: ZuploRequest, context: ZuploContext) {
  if (!request.user) {
    // This request is unauthenticated
  } else {
    const subId = request.user.sub; // the username of the account
    const userData = request.user.data; // the data property of the account
  }

  return "What zup?";
}
```
