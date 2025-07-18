---
title: Zuplo Identity Token
---

<EnterpriseFeature name="Zuplo Identity Token" />

Each deployment of Zuplo is issued a unique OAuth client identity. This identity
can be used to create ID Tokens that can be used to securely identify requests
from your Zuplo API that are made to outside services. This is token can also be
used for purposes such as Identity Federation to securely call APIs in other
Cloud Services like GCP or AWS.

To create a Zuplo Identity Token simply run the following code from withing a
policy, handler, or module in your Zuplo API.

```ts
import { ZuploServices, ZuploContext, ZuploRequest } from "@zuplo/runtime";

export default async function handler(
  request: ZuploRequeset,
  context: ZuploContext,
) {
  const idToken = await ZuploServices.getIDToken(context, {
    audience: "https://my-api.example.com",
  });
}
```

The `audience` argument is optional, but typically this is set to a value
identifying the service you are calling.

The issued JWT token contains the following claims.

| Claim              | Example Value                                                        | Description                                                                                                                                             |
| ------------------ | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `alg`              | `RS256`                                                              | The signing algorithm. Always `RS256`                                                                                                                   |
| `kid`              | `atky_8gLGDfmHkNEZNvy7PDnmr2gF`                                      | The signing key used to generate the JWT                                                                                                                |
| `account`          | `my-account`                                                         | The name of your Zuplo account                                                                                                                          |
| `project`          | `my-project`                                                         | The name of your Zuplo project                                                                                                                          |
| `deployment`       | `copper-bedbug-main-53c4947`                                         | The name of your Zuplo deployment. Each environment will have its own name (for exampleproduction, preview branch `test`, etc. will all be different.). |
| `environment_type` | `production`                                                         | The type of environment this deployment is. Values can be `production`, `preview`, or `development`                                                     |
| `iss`              | `https://dev.zuplo.com/v1/client-auth/auth_o8PUdhKxSTOiB794GWPwLQCD` | This is the issuer URL of the Zuplo identity provider. This value will always be the same.                                                              |
| `sub`              | `atcl_8GLgIDYRw38Jqg0tHR8tiZfh`                                      | The unique identity of the OAuth Client. This can be used to uniquely identify your deployment.                                                         |
| `iat`              | `1720470928`                                                         | The epoch time the token was issued.                                                                                                                    |
| `exp`              | `1720506928`                                                         | The epoch time the token expires. The default expiration for Zuplo Identity Tokens is 10 hours.                                                         |

## Securing Your Backend

The Zuplo ID Token can be used as a means of securing your backend API so that
only Zuplo can call the API. This can be done by restricting the incoming
requests using a standard OAuth middleware on your API. For example, if you were
using Fastify on your backend, you could use the
[Fastify JWT Middleware](https://github.com/fastify/fastify-jwt) using the
[JWKS verification method](https://github.com/fastify/fastify-jwt?tab=readme-ov-file#verifying-with-jwks)
and checking the `account`, `project`, or other claims.

## Verifying the Token Using a Library

To verify the JWT token on your own service, you can use any standard JWT
library. The verification method will use the JWKS hosted at
`https://dev.zuplo.com/v1/client-auth/auth_o8PUdhKxSTOiB794GWPwLQCD/.well-known/jwks.json`.
You can also use OAuth tools that handle automatic discovery.

Below is an example of how to verify the token using the
[jose](https://www.npmjs.com/package/jose) JavaScript library.

```ts
import jose from "jose";

// Create the Remote JWK set
const JWKS = jose.createRemoteJWKSet(
  new URL(
    "https://dev.zuplo.com/v1/client-auth/auth_o8PUdhKxSTOiB794GWPwLQCD/.well-known/jwks.json",
  ),
);

// Verify the token
const { payload, protectedHeader } = await jose.jwtVerify(jwt, JWKS, {
  issuer: "https://dev.zuplo.com/v1/client-auth/auth_o8PUdhKxSTOiB794GWPwLQCD",
  audience: "https://my-api.example.com",
});

// Verify the token is from your account/project/etc.
if (
  payload["account"] !== "my-account" ||
  payload["project"] !== "my-project"
) {
  throw new Error("Not my account or project");
}
```
