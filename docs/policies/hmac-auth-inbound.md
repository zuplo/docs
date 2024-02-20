---
title: HMAC Auth Policy
sidebar_label: HMAC Auth
---

<!-- WARNING: This document is generated. DO NOT EDIT BY HAND -->

# HMAC Auth

<CustomPolicyNotice name="HMAC Auth" id="hmac-auth-inbound" />




<!-- start: intro.md -->
This example policy demonstrates how to use a shared secret to create an
[HMAC](https://en.wikipedia.org/wiki/HMAC) signature to sign a payload (in this
case the body). When the request is sent, the signature is sent in the request
header. The policy can then verify that the signature matches the payload - thus
ensuring that the sender had the same shared secret.

This policy is configured with the value of the `secret`. Normally, you would
store this as an environment variable secret. Additionally, the policy option
`headerName` is used to set the header that will be used by the client to send
the signature.

<!-- end: intro.md -->

<PolicyStatus isBeta={false} isPaidAddOn={false} />


## Example Custom Policy

The code below is an example of how this custom policy module could be implemented.

```ts title="modules/hmac-auth-inbound.ts"
import { HttpProblems, ZuploContext, ZuploRequest } from "@zuplo/runtime";

interface PolicyOptions {
  secret: string;
  headerName: string;
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
  const token = request.headers.get(options.headerName);

  // No auth header, unauthorized
  if (!token) {
    return HttpProblems.unauthorized(request, context);
  }

  // Convert the hex encoded token to an Uint8Array
  const tokenData = new Uint8Array(
    token.match(/../g)!.map((h) => parseInt(h, 16)),
  );

  // Get the data to verify
  // This could be anything (headers, query parameter, etc.)
  // For this example, we will just verify the entire body value
  const data = await request.text();

  // Create a crypto key from a secret stored as an environment variable
  const encoder = new TextEncoder();
  const encodedSecret = encoder.encode(options.secret);
  const key = await crypto.subtle.importKey(
    "raw",
    encodedSecret,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );

  // Verify that the data
  const verified = await crypto.subtle.verify(
    "HMAC",
    key,
    tokenData,
    encoder.encode(data),
  );

  // Check if the data is verified, if not return unauthorized
  if (!verified) {
    return HttpProblems.unauthorized(request, context);
  }

  // Request is authorized, continue
  return request;
}

```

## Configuration 

The example below shows how to configure a custom code policy in the 'policies.json' document that utilizes the above example policy code.

```json title="config/policies.json"
{
  "name": "my-hmac-auth-inbound-policy",
  "policyType": "hmac-auth-inbound",
  "handler": {
    "export": "default",
    "module": "$import(./modules/YOUR_MODULE)",
    "options": {
      "secret": "$env(MY_SECRET)",
      "headerName": "signed-request"
    }
  }
}
```

<div className="policy-options">
<div><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-configuration">Policy Configuration<a href="#policy-configuration" class="hash-link" aria-label="Direct link to Policy Configuration" title="Direct link to Policy Configuration">​</a></h3><ul><li><code>name</code> <span class="type-option">&lt;string&gt;</span> - The name of your policy instance. This is used as a reference in your routes.</li><li><code>policyType</code> <span class="type-option">&lt;string&gt;</span> - The identifier of the policy. This is used by the Zuplo UI. Value should be <code>hmac-auth-inbound</code>.</li><li><code>handler.export</code> <span class="type-option">&lt;string&gt;</span> - The name of the exported type. Value should be <code>default</code>.</li><li><code>handler.module</code> <span class="type-option">&lt;string&gt;</span> - The module containing the policy. Value should be <code>$import(./modules/YOUR_MODULE)</code>.</li><li><code>handler.options</code> <span class="type-option">&lt;object&gt;</span> - The options for this policy. <a href="#policy-options">See Policy Options</a> below.</li></ul><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-options">Policy Options<a href="#policy-options" class="hash-link" aria-label="Direct link to Policy Options" title="Direct link to Policy Options">​</a></h3><p>The options for this policy are specified below. All properties are optional unless specifically marked as required.</p><ul><li><code>secret</code><span class="type-option"> &lt;string&gt;</span><span class="required-option"> (Required)</span> - <div><p>The secret to use for HMAC authentication</p></div></li><li><code>headerName</code><span class="type-option"> &lt;string&gt;</span><span class="required-option"> (Required)</span> - <div><p>The header where the HMAC signature is send</p></div></li></ul></div>
</div>

## Using the Policy
<!-- start: doc.md -->
The example below demonstrates how you could sign a value in order to create an
HMAC signature for use with this policy.

```ts
const token = await sign("my data", environment.MY_SECRET);

async function sign(
  key: string | ArrayBuffer,
  val: string,
): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    typeof key === "string" ? encoder.encode(key) : key,
    { name: "HMAC", hash: { name: "SHA-256" } },
    false,
    ["sign"],
  );
  const token = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    encoder.encode(val),
  );
  return Array.prototype.map
    .call(new Uint8Array(token), function (x) {
      return ("0" + x.toString(16)).slice(-2);
    })
    .join("");
}
```

<!-- end: doc.md -->

Read more about [how policies work](/docs/articles/policies)
