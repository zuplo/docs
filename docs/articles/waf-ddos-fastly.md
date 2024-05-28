---
title: Configuring Zuplo with Fastly Next-Gen WAF
---

Fastly Next-Gen WAF runs at Fastly edge locations. Zuplo can be configured to
run as a host behind Fastly.

Refer to Zuplo's documentation on
[how to configure Zuplo as a Fastly host](./fastly-zuplo-host-setup.md).

## Securing Zuplo from Direct Access

With any WAF product, you will want to ensure that network traffic cannot bypass
your WAF and hit your API Gateway directly. Fastly offers several ways to ensure
that your API Gateway is only accessible through the WAF.

The information below is a summary of Fastly's own recommendations for securing
your backend - regardless of whether you are using Zuplo, another API Gateway,
or Fastly origins. You can find the Fastly documentation
[here](https://www.fastly.com/documentation/guides/integrations/backends/).

### IP Address Restrictions

Fastly maintains a list of IP addresses that you can use to restrict access to
your API Gateway. This is a good way to ensure that only Fastly can access your
API Gateway. However, as Fastly is a multi-tenant service, this method is not
sufficient to protect unauthorized traffic from hitting your API Gateway.

In Zuplo, you can utilize the IP Address Restriction policy to limit traffic to
only the Fastly IP addresses. You don't need to provide the address list
manually, instead you can utilize the built-in list as shown below.

```json
{
  "name": "allow-fastly-only",
  "policyType": "ip-address-restriction-inbound",
  "handler": {
    "export": "IPAddressRestrictionInbound",
    "module": "$import(@zuplo/runtime)",
    "options": {
      "allowedIpAddresses": ["list:fastly"]
    }
  }
}
```

With this policy in place, only Fastly traffic will be allowed to hit your Zuplo
API Gateway.

### Signed Headers

Another way to ensure that traffic is coming from Fastly is to use signed
headers. Signed headers can be added using a
[VLC Snippet](https://docs.fastly.com/en/guides/about-vcl-snippets) and then
checked by your API Gateway. This provides an additional layer of security on
top of IP address restrictions and prevents any unauthorized traffic from
hitting your API Gateway - regardless of the source.

In Fastly, you will need to create a VCL snippet that adds a signed header as
shown below. This example uses the `shared_secret` value stored in an
[Edge Dictionary](https://www.fastly.com/documentation/guides/concepts/edge-state/dynamic-config/#edge-dictionaries).

```txt
declare local var.zuplo_auth_secret STRING;
set var.zuplo_auth_secret = table.lookup(Zuplo, "shared_secret");
declare local var.data STRING;
set var.data = strftime({"%s"}, now) + "," + server.datacenter;
set bereq.http.X-Signature = var.data + "," + digest.hmac_sha256(var.zuplo_auth_secret, var.data);
```

In Zuplo, you can utilize the a custom code inbound policy to limit traffic to
only those requests that include the signed header.

```json title="/config/policies.json"
{
  "name": "fastly-auth-inbound",
  "policyType": "custom-code-inbound",
  "handler": {
    "export": "default",
    "module": "$import(./modules/fastly-auth-inbound)",
    "options": {
      "secret": "$env(FASTLY_SECRET)",
      "headerName": "x-signature"
    }
  }
}
```

```ts title="/modules/fastly-auth-inbound.ts"
import { HttpProblems, ZuploContext, ZuploRequest } from "@zuplo/runtime";

interface PolicyOptions {
  secret: string;
  headerName: string;
  requestOffset?: number;
}

export default async function (
  request: ZuploRequest,
  context: ZuploContext,
  options: PolicyOptions,
  policyName: string,
) {
  // Validate the policy options
  if (typeof options.secret !== "string") {
    throw new Error(
      `The option 'secret' on policy '${policyName}' must be a string. Received ${typeof options.secret}.`,
    );
  }
  if (typeof options.headerName !== "string") {
    throw new Error(
      `The option 'headerName' on policy '${policyName}' must be a string. Received ${typeof options.headerName}.`,
    );
  }

  // Get the authorization header
  const headerValue = request.headers.get(options.headerName);

  // No auth header, unauthorized
  if (!headerValue) {
    return HttpProblems.unauthorized(request, context);
  }

  const encoder = new TextEncoder();

  // Split the header into the parts
  const [timestamp, datacenter, hash] = headerValue.split(",");

  context.log.info({ timestamp, datacenter, hash });

  // Convert the timestamp to milliseconds
  const timestampInMilliseconds = parseInt(timestamp) * 1000;
  const currentTimeInMilliseconds = new Date().getTime();
  const differenceInSeconds =
    Math.abs(currentTimeInMilliseconds - timestampInMilliseconds) / 1000;
  const offset = options.requestOffset ?? 30;
  if (differenceInSeconds > offset) {
    context.log.error("The request is old than 30 seconds.");
    return HttpProblems.unauthorized(request, context);
  }

  // Convert the hex HMAC to an ArrayBuffer
  const signature = new Uint8Array(
    hash
      .slice(2)
      .match(/.{1,2}/g)
      .map((byte) => parseInt(byte, 16)),
  );

  // Get the hash value and encode it
  const hashValue = `${timestamp},${datacenter}`;
  const hashData = encoder.encode(hashValue);

  // Create the secret from the policy options
  const encodedSecret = encoder.encode(options.secret);
  const key = await crypto.subtle.importKey(
    "raw",
    encodedSecret,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );

  // Verify that the data
  const verified = await crypto.subtle.verify("HMAC", key, signature, hashData);

  // Check if the data is verified, if not return unauthorized
  if (!verified) {
    return HttpProblems.unauthorized(request, context);
  }

  // Request is authorized, continue
  return request;
}
```

With this policy in place, only requests that include a valid sign header will
be allowed to hit your Zuplo API Gateway.

### JWT Header

Another way to ensure that traffic is coming from Fastly is to use add a JWT
header to the outgoing request. JWT headers can be added using a
[VLC Snippet](https://docs.fastly.com/en/guides/about-vcl-snippets) and then
checked by your API Gateway. This provides an additional layer of security on
top of IP address restrictions and prevents any unauthorized traffic from
hitting your API Gateway - regardless of the source.

:::tip

This demo shows using a shared secret for generating and verifying the JWT.
However, you could also use public/private keys for this purpose. Additionally,
you could use a third-party identity provider (Auth0, Cognito) to issue machine
to machine tokens.

:::

In Fastly, you will need to create a VCL snippet that adds a JWT header as shown
below. This example uses the `shared_secret` value stored in an
[Edge Dictionary](https://www.fastly.com/documentation/guides/concepts/edge-state/dynamic-config/#edge-dictionaries).

```txt
declare local var.jwt_secret STRING;
declare local var.jwt_audience STRING;
declare local var.jwt_issued STRING;
declare local var.jwt_expires STRING;
declare local var.jwt_header STRING;
declare local var.jwt_payload STRING;
declare local var.jwt_signature STRING;


set var.jwt_secret = table.lookup(Zuplo, "shared_secret");
set var.jwt_audience = "my-api.example.com";
set var.jwt_issued = now.sec;
set var.jwt_expires = strftime({"%s"}, time.add(now, 60s));

set var.jwt_header = digest.base64url_nopad({"{"alg":"HS256","typ":"JWT""}{"}"});
set var.jwt_payload = digest.base64url_nopad({"{"audience":""} var.jwt_audience {"","exp":"} var.jwt_expires {","iat":"} var.jwt_issued {","iss":"Fastly""}{"}"});
set var.jwt_signature = digest.base64url_nopad(digest.hmac_sha256(var.jwt_secret, var.jwt_header "." var.jwt_payload));

set bereq.http.X-JWT = var.jwt_header "." var.jwt_payload "." var.jwt_signature;
```

To verify the JWT header in Zuplo, you can utilize the JWT Auth Inbound policy.

```json
{
  "name": "verify-fastly-jwt",
  "policyType": "open-id-jwt-auth-inbound",
  "handler": {
    "export": "OpenIdJwtInboundPolicy",
    "module": "$import(@zuplo/runtime)",
    "options": {
      "authHeader": "x-jwt",
      "issuer": "Fastly",
      "audience": "my-api.example.com",
      "secret": "$env(FASTLY_SECRET)"
    }
  }
}
```

### mTLS Authentication

Fastly supports mTLS authentication for backend services. This is a good way to
ensure that only Fastly can access your API Gateway. For documentation on
configuring Fastly with mTLS, see the Fastly documentation
[here](https://docs.fastly.com/en/guides/working-with-hosts#advanced-tls-options).
To configure Zuplo to accept mTLS connections, see the
[Zuplo mTLS Policy documentation](/docs/policies/mtls-auth-inbound).
