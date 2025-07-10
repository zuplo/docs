---
title: JWT Service Plugin
---

<EnterpriseFeature name="JWT Service Plugin" />

The JWT Service Plugin allows you to create and issue short-lived JSON Web
Tokens (JWTs) within your Zuplo API. This plugin is useful for scenarios where
you need to issue tokens for authentication, authorization, or other purposes.

The plugin essentially turns your Zuplo API into it's own identity provider that
can issue JWTs. Your Zuplo API will also serve the standard
`/.well-known/openid-configuration` endpoint and associated JWKs endpoint which
can be used by clients to discover the public keys used to verify the JWTs
issued by your API.

:::note{title="Beta Feature"}

This plugin is in Beta - please use with care and provide feedback to the team
if you encounter any issues.

:::

## JWT Token

This service currently issues JWTs using the EdDSA algorithm. This is the
recommended algorithm for new applications due to its strong security properties
and performance characteristics. However, it is important to note that not every
library supports EdDSA, so you should ensure that your
[client library](https://jwt.io/libraries) can handle this algorithm.

## Use Cases

Some of the common use cases for the JWT service plugin include:

- Securing downstream APIs by issuing JWTs that can be used to verify that the
  request is coming from your Zuplo API
- Securing requests to other Zuplo API gateways (for example, when using the
  [Federated Gateway](../dedicated/federated-gateways.md) capability on Zuplo
  managed dedicated deployments.)
- Calling third-party APIs that can be configured with federated identity such
  as AWS, Azure, or Google Cloud.
- Issuing short lived tokens for client side applications

## Setup

To set up the JWT Service Plugin, you need to register it in your
`zuplo.runtime.ts` file.

```ts title="modules/zuplo.runtime.ts"
import {
  RuntimeExtensions,
  DataDogLoggingPlugin,
  JwtServicePlugin,
} from "@zuplo/runtime";

export function runtimeInit(runtime: RuntimeExtensions) {
  // Default configuration (no options)
  const jwtService = new JwtServicePlugin();
  runtime.addPlugin(jwtService);
}
```

### Configuration Options

The JWT Service Plugin accepts optional configuration to customize its behavior.
You can pass a configuration object to the constructor:

```ts title="modules/zuplo.runtime.ts"
import {
  RuntimeExtensions,
  JwtServicePlugin,
  JwtServicePluginOptions,
} from "@zuplo/runtime";

export function runtimeInit(runtime: RuntimeExtensions) {
  // Example 1: Custom configuration with both options
  const options: JwtServicePluginOptions = {
    // Custom base path for the issuer endpoint (default: "/__zuplo/issuer")
    basePath: "/custom",

    // Token expiration time (default: 300 seconds)
    // Can be a number (seconds) or a time span string
    tokenExpiration: "5m", // or 300 for seconds
  };

  const jwtService = new JwtServicePlugin(options);
  runtime.addPlugin(jwtService);
}
```

#### Available Options

- **`basePath`** (optional): The base path for the JWT issuer endpoint. Default
  is `"/__zuplo/issuer"`. This affects the issuer URL and OIDC configuration
  endpoints.

- **`tokenExpiration`** (optional): Sets the default expiration time for JWTs.
  Can be either:

  - A **number**: Direct value in seconds (e.g., `300` for 5 minutes)
  - A **string**: Time span format (e.g., `"5 minutes"`, `"1 hour"`, `"7 days"`)

  Valid time units include:

  - Seconds: `"sec"`, `"secs"`, `"second"`, `"seconds"`, `"s"`
  - Minutes: `"minute"`, `"minutes"`, `"min"`, `"mins"`, `"m"`
  - Hours: `"hour"`, `"hours"`, `"hr"`, `"hrs"`, `"h"`
  - Days: `"day"`, `"days"`, `"d"`
  - Weeks: `"week"`, `"weeks"`, `"w"`
  - Years: `"year"`, `"years"`, `"yr"`, `"yrs"`, `"y"` (365.25 days)

  Examples:

  ```ts
  tokenExpiration: 300; // 300 seconds
  tokenExpiration: "5 minutes"; // 5 minutes
  tokenExpiration: "2 hours"; // 2 hours
  tokenExpiration: "7 days"; // 7 days
  tokenExpiration: "30 mins"; // 30 minutes
  ```

  Note: Individual JWT creation can override this default by specifying
  `expiresIn` in the `signJwt` method.

## Usage

Once the plugin is registered, you can use it to issue JWTs in custom handlers
or policies.

```ts title="modules/handlers/jwt-issue.ts"
import { ZuploRequest, ZuploContext, JwtServicePlugin } from "@zuplo/runtime";

export async function getJwt(request: ZuploRequest, context: ZuploContext) {
  const jwt = await JwtServicePlugin.signJwt({
    subject: "test-subject",
  });
  return new Response(jwt, {
    headers: { "content-type": "text/plain" },
  });
}
```

### JWT Issuer and OIDC Configuration

When the JWT Service Plugin is enabled, your Zuplo API acts as an identity
provider with the following endpoints:

- **Issuer URL**: `https://{deploymentName}.zuplo.com/__zuplo/issuer` (or your
  custom domain if configured)
- **OIDC Configuration**:
  `https://{deploymentName}.zuplo.com/__zuplo/issuer/.well-known/openid-configuration`
- **JWKS Endpoint**:
  `https://{deploymentName}.zuplo.com/__zuplo/issuer/.well-known/jwks.json`

The OIDC configuration endpoint returns a standard OpenID Connect discovery
document that includes the JWKS URI for retrieving the public keys used to
verify JWTs.

### Creating a JWT Authorization Policy

A common pattern is to create a custom policy that automatically adds JWT tokens
to outbound requests. This is useful when calling downstream APIs that require
authentication.

Here's an example of a [custom policy](/docs/policies/custom-code-inbound) that
adds a JWT to the Authorization header of outbound requests:

```ts title="modules/policies/jwt-auth-upstream.ts"
import {
  ZuploRequest,
  ZuploContext,
  RequestHandlerPlugin,
  JwtServicePlugin,
} from "@zuplo/runtime";

export default async function (request: ZuploRequest, context: ZuploContext) {
  // Generate a JWT with the configured options
  const jwt = await JwtServicePlugin.signJwt({
    subject: request.user?.sub || "api-gateway",
    audience: request.url,
  });

  // Add the JWT to the Authorization header of the request
  const headers = new Headers(request.headers);
  headers.set("Authorization", `Bearer ${jwt}`);

  return new ZuploRequest(request, { headers });
}
```

## Validating JWTs in Upstream Services

Upstream services can validate the JWTs issued by your Zuplo API by verifying
the signature and claims. Here's an example of how to validate JWTs in different
environments:

### Node.js/Express Example

```js title="validate-jwt.js"
const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");

// Replace with your actual Zuplo deployment name or custom domain
const ISSUER = "https://my-api.zuplo.com/__zuplo/issuer";

// Create a JWKS client to fetch public keys
const client = jwksClient({
  jwksUri: `${ISSUER}/.well-known/jwks.json`,
  cache: true,
  cacheMaxAge: 600000, // 10 minutes
});

// Function to get the signing key
function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err) {
      return callback(err);
    }
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

// Middleware to validate JWT
function validateJwt(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(
    token,
    getKey,
    {
      issuer: ISSUER,
      algorithms: ["RS256"],
    },
    (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ error: "Invalid token", details: err.message });
      }
      req.user = decoded;
      next();
    },
  );
}

// Example usage
app.get("/protected", validateJwt, (req, res) => {
  res.json({
    message: "Access granted",
    user: req.user,
  });
});
```

### Python/FastAPI Example

```python title="validate_jwt.py"
from fastapi import FastAPI, Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from jwt import PyJWKClient
import requests

app = FastAPI()
security = HTTPBearer()

# Replace with your actual Zuplo deployment name or custom domain
ISSUER = "https://my-api.zuplo.com/__zuplo/issuer"
JWKS_URL = f"{ISSUER}/.well-known/jwks.json"

# Initialize JWKS client
jwks_client = PyJWKClient(JWKS_URL)

async def validate_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials

    try:
        # Get the signing key from JWKS
        signing_key = jwks_client.get_signing_key_from_jwt(token)

        # Verify and decode the token
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            issuer=ISSUER,
            options={"verify_exp": True}
        )

        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")

@app.get("/protected")
async def protected_route(token_data: dict = Depends(validate_token)):
    return {
        "message": "Access granted",
        "user": token_data
    }
```

### Dynamic OIDC Discovery

For more flexible JWT validation, you can use a library to dynamically discover
the OIDC configuration based on the issuer claim in the JWT. This example uses
the [`oauth4webapi`](https://github.com/panva/oauth4webapi) library.

:::warning{title="Security Warning"}

This approach is particularly useful when you have multiple Zuplo APIs with
different issuers or when the issuer URL might change (e.g., between
environments). It is CRITICAL that you validate the issuer claim in the JWT to
ensure you are only allowing tokens from trusted issuers.

:::

```js title="validate-jwt-dynamic.js"
import * as oauth from "oauth4webapi";

const ALLOWED_ISSUERS = [
  "https://my-api.zuplo.com/__zuplo/issuer",
  "https://another-api.zuplo.com/__zuplo/issuer",
  // Add more allowed issuers as needed
];

async function validateJwtDynamic(token) {
  try {
    // Decode the JWT header and payload without verification first
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid JWT format");
    }

    const payload = JSON.parse(
      atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")),
    );

    // Extract the issuer from the token
    const issuer = payload.iss;
    if (!issuer) {
      throw new Error("No issuer claim in token");
    }

    // Validate the issuer against allowed issuers
    if (!ALLOWED_ISSUERS.includes(issuer)) {
      throw new Error(`Issuer ${issuer} is not allowed`);
    }

    // Discover the OIDC configuration
    const issuerUrl = new URL(issuer);
    const as = await oauth
      .discoveryRequest(issuerUrl)
      .then((response) => oauth.processDiscoveryResponse(issuerUrl, response));

    // Get the JWKS
    const jwks = await oauth
      .jwksRequest(as)
      .then((response) => oauth.processJwksResponse(response));

    // Import the JWT and validate it
    const { payload: verifiedPayload, protectedHeader } =
      await oauth.validateJwt(token, jwks, {
        issuer: issuer,
        audience: payload.aud, // Optional: validate audience
      });

    return verifiedPayload;
  } catch (error) {
    throw new Error(`JWT validation failed: ${error.message}`);
  }
}

// Express middleware example
function validateJwtMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  validateJwtDynamic(token)
    .then((payload) => {
      req.user = payload;
      next();
    })
    .catch((error) => {
      res.status(401).json({ error: error.message });
    });
}

// Usage
app.get("/protected", validateJwtMiddleware, (req, res) => {
  res.json({
    message: "Access granted",
    user: req.user,
  });
});
```

This approach is particularly useful when:

- You need to validate JWTs from multiple Zuplo APIs with different issuers
- The issuer URL might change (e.g., between environments)
- You want to leverage automatic OIDC discovery for configuration updates

### Important Validation Steps

When validating JWTs from Zuplo:

1. **Verify the signature** using the public keys from the JWKS endpoint
2. **Check the issuer** matches your Zuplo API's issuer URL
3. **Validate expiration** to ensure the token hasn't expired
4. **Verify audience** if your tokens include audience claims
5. **Check any custom claims** required by your application

The JWT Service Plugin handles key rotation automatically, so always fetch the
current public keys from the JWKS endpoint rather than hardcoding them.
