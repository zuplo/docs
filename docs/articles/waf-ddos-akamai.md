---
title: Configuring Zuplo with Akamai App & API Protector
sidebar_label: Akamai App & API Protector
---

Akamai App & API Protector runs at Akamai edge locations. Zuplo can be
configured to run as a custom origin behind Akamai.

## Securing Zuplo from Direct Access

With any WAF product, you will want to ensure that network traffic can't bypass
your WAF and hit your API Gateway directly. Akamai offers several ways to ensure
that your API Gateway is only accessible through the WAF.

The information below is a summary of Akamai's own recommendations for securing
your backend - regardless of whether you are using Zuplo, another API Gateway,
or Akamai origins. You can reference the
[Akamai documentation](https://techdocs.akamai.com/application-security/docs/origin-server-protection).

### IP Address Restrictions

Akamai maintains a list of IP addresses that you can use to restrict access to
your API Gateway. This is a good way to ensure that only Akamai can access your
API Gateway. However, as Akamai is a multi-tenant service, this method isn't
sufficient to protect unauthorized traffic from hitting your API Gateway.

In Zuplo, you can utilize the IP Address Restriction policy to limit traffic to
only the Akamai IP addresses. You don't need to provide the address list
manually, instead you can utilize the built-in list as shown below.

```json
{
  "name": "allow-akamai-only",
  "policyType": "ip-address-restriction-inbound",
  "handler": {
    "export": "IPAddressRestrictionInbound",
    "module": "$import(@zuplo/runtime)",
    "options": {
      "allowedIpAddresses": ["list:akamai"]
    }
  }
}
```

With this policy in place, only Akamai traffic will be allowed to hit your Zuplo
API Gateway.

### Custom Headers

Another way to ensure that traffic is coming from Akamai is to use custom
headers. Custom headers can be added to your Akamai configuration and then
checked by your API Gateway. This provides an additional layer of security on
top of IP address restrictions and prevents any unauthorized traffic from
hitting your API Gateway - regardless of the source.

In Akamai, you can configure custom headers using the Property Manager or the
Akamai API. Add a custom header with a secret value that only you and Akamai
know.

In Zuplo, you can utilize the Header Restriction policy to limit traffic to only
those requests that include the custom header and secret value.

```json
{
  "name": "allow-akamai-custom-header",
  "policyType": "require-header-inbound",
  "handler": {
    "export": "RequireHeaderInboundPolicyOptions",
    "module": "$import(@zuplo/runtime)",
    "options": {
      "headerName": "x-akamai-auth",
      "allowedValues": ["$env(AKAMAI_SECRET_HEADER_VALUE)"]
    }
  }
}
```

With this policy in place, only requests that include the custom header with the
secret value will be allowed to hit your Zuplo API Gateway.

### Edge Authorization Tokens

Akamai supports Edge Authorization Tokens (Auth 2.0) which provide a more secure
way to authenticate requests from Akamai to your origin. These tokens can be
generated at the edge and verified by your API Gateway.

In Zuplo, you can create a custom code inbound policy to verify Akamai Edge
Authorization Tokens:

```json title="/config/policies.json"
{
  "name": "akamai-auth-token-inbound",
  "policyType": "custom-code-inbound",
  "handler": {
    "export": "default",
    "module": "$import(./modules/akamai-auth-token-inbound)",
    "options": {
      "authKey": "$env(AKAMAI_AUTH_KEY)",
      "tokenName": "akamai-auth-token"
    }
  }
}
```

```ts title="/modules/akamai-auth-token-inbound.ts"
import { HttpProblems, ZuploContext, ZuploRequest } from "@zuplo/runtime";

interface PolicyOptions {
  authKey: string;
  tokenName: string;
  windowSeconds?: number;
}

export default async function (
  request: ZuploRequest,
  context: ZuploContext,
  options: PolicyOptions,
  policyName: string,
) {
  // Validate the policy options
  if (typeof options.authKey !== "string") {
    throw new Error(
      `The option 'authKey' on policy '${policyName}' must be a string. Received ${typeof options.authKey}.`,
    );
  }
  if (typeof options.tokenName !== "string") {
    throw new Error(
      `The option 'tokenName' on policy '${policyName}' must be a string. Received ${typeof options.tokenName}.`,
    );
  }

  // Get the authorization token
  const authToken = request.headers.get(options.tokenName);

  // No auth token, unauthorized
  if (!authToken) {
    return HttpProblems.unauthorized(request, context);
  }

  // Parse the auth token
  const tokenParts = authToken.split("~");
  if (tokenParts.length < 4) {
    context.log.error("Invalid auth token format");
    return HttpProblems.unauthorized(request, context);
  }

  const [authPrefix, timestamp, nonce, hash, ...rest] = tokenParts;

  // Validate timestamp
  const tokenTime = parseInt(timestamp, 16);
  const currentTime = Math.floor(Date.now() / 1000);
  const windowSeconds = options.windowSeconds ?? 300; // Default 5 minutes

  if (Math.abs(currentTime - tokenTime) > windowSeconds) {
    context.log.error("Auth token expired");
    return HttpProblems.unauthorized(request, context);
  }

  // Recreate the auth string to verify
  const authString = [authPrefix, timestamp, nonce, request.url].join("~");

  // Create HMAC signature
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(options.authKey),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );

  // Verify the signature
  const signature = new Uint8Array(
    hash.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)),
  );
  const data = encoder.encode(authString);
  const verified = await crypto.subtle.verify("HMAC", key, signature, data);

  if (!verified) {
    context.log.error("Invalid auth token signature");
    return HttpProblems.unauthorized(request, context);
  }

  // Request is authorized, continue
  return request;
}
```

### Combining Security Methods

For maximum security, we recommend combining multiple authentication methods:

1. **IP Address Restrictions** - As a first layer of defense
2. **Custom Headers or Edge Authorization Tokens** - For request authentication

This layered approach ensures that even if one security method is compromised,
your API Gateway remains protected.
