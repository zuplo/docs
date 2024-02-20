---
title: Transform Response Body Policy
sidebar_label: Transform Response Body
---

<!-- WARNING: This document is generated. DO NOT EDIT BY HAND -->

# Transform Response Body

<CustomPolicyNotice name="Transform Response Body" id="transform-body-outbound" />




<!-- start: intro.md -->
This example policy shows how to use `response.json()` to read the outgoing
response as a JSON object. The object can then be modified as appropriate. It is
then converted back to a string and a new `Response` is returned in the policy
with the new body.

If the incoming response body is not JSON, you can use `response.text()` or
`response.blob()` to access the contents as raw text or a
[blob](https://developer.mozilla.org/en-US/docs/Web/API/Response/blob).

<!-- end: intro.md -->

<PolicyStatus isBeta={false} isPaidAddOn={false} />


## Example Custom Policy

The code below is an example of how this custom policy module could be implemented.

```ts title="modules/transform-body-outbound.ts"
import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

export default async function (
  response: Response,
  request: ZuploRequest,
  context: ZuploContext,
) {
  // Get the outgoing body as an Object
  const obj = await response.json();

  // Modify the object as required
  obj.myNewProperty = "Hello World";

  // Stringify the object
  const body = JSON.stringify(obj);

  // Return a new response with the new body
  return new Response(body, request);
}

```

## Configuration 

The example below shows how to configure a custom code policy in the 'policies.json' document that utilizes the above example policy code.

```json title="config/policies.json"
{
  "name": "transform-body-outbound",
  "policyType": "custom-code-outbound",
  "handler": {
    "export": "default",
    "module": "$import(./modules/transform-body-outbound)"
  }
}
```

<div className="policy-options">
<div><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-configuration">Policy Configuration<a href="#policy-configuration" class="hash-link" aria-label="Direct link to Policy Configuration" title="Direct link to Policy Configuration">​</a></h3><ul><li><code>name</code> <span class="type-option">&lt;string&gt;</span> - The name of your policy instance. This is used as a reference in your routes.</li><li><code>policyType</code> <span class="type-option">&lt;string&gt;</span> - The identifier of the policy. This is used by the Zuplo UI. Value should be <code>transform-body-outbound</code>.</li><li><code>handler.export</code> <span class="type-option">&lt;string&gt;</span> - The name of the exported type. Value should be <code>default</code>.</li><li><code>handler.module</code> <span class="type-option">&lt;string&gt;</span> - The module containing the policy. Value should be <code>$import(./modules/YOUR_MODULE)</code>.</li></ul></div>
</div>

## Using the Policy
<!-- start: doc.md -->

<!-- end: doc.md -->

Read more about [how policies work](/docs/articles/policies)
