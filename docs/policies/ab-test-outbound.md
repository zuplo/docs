---
title: A/B Test Outbound Policy
sidebar_label: A/B Test Outbound
---

<!-- WARNING: This document is generated. DO NOT EDIT BY HAND -->

# A/B Test Outbound

<CustomPolicyNotice name="A/B Test Outbound" id="ab-test-outbound" />




<!-- start: intro.md -->
This example shows how to perform an action on incoming requests based on the
result of a randomly generated number. A/B tests could also be performed on
properties such as the `request.user`.

A/B tests can also be combined with other policies by passing data to downstream
policies. For example, you could save a value in `ContextData` based on the
results of the A/B test and use that value in a later policy to modify the
request.

<!-- end: intro.md -->

<PolicyStatus isBeta={false} isPaidAddOn={false} />


## Example Custom Policy

The code below is an example of how this custom policy module could be implemented.

```ts title="modules/ab-test-outbound.ts"
import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

export default async function (
  response: Response,
  request: ZuploRequest,
  context: ZuploContext,
) {
  // Generate a random number to segment the test groups
  const score = Math.random();

  // Get the outgoing response body
  const data = await response.json();

  // Modify the body based on the random value
  if (score < 0.5) {
    data.testEnabled = true;
  } else {
    data.testEnabled = false;
  }

  // Stringify the data object
  const body = JSON.stringify(data);

  // Return a new response with the updated body
  return new Response(body, response);
}

```

## Configuration 

The example below shows how to configure a custom code policy in the 'policies.json' document that utilizes the above example policy code.

```json title="config/policies.json"
{
  "name": "ab-test-outbound",
  "policyType": "custom-code-outbound",
  "handler": {
    "export": "default",
    "module": "$import(./modules/ab-test-outbound)"
  }
}
```

<div className="policy-options">
<div><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-configuration">Policy Configuration<a href="#policy-configuration" class="hash-link" aria-label="Direct link to Policy Configuration" title="Direct link to Policy Configuration">​</a></h3><ul><li><code>name</code> <span class="type-option">&lt;string&gt;</span> - The name of your policy instance. This is used as a reference in your routes.</li><li><code>policyType</code> <span class="type-option">&lt;string&gt;</span> - The identifier of the policy. This is used by the Zuplo UI. Value should be <code>ab-test-outbound</code>.</li><li><code>handler.export</code> <span class="type-option">&lt;string&gt;</span> - The name of the exported type. Value should be <code>default</code>.</li><li><code>handler.module</code> <span class="type-option">&lt;string&gt;</span> - The module containing the policy. Value should be <code>$import(./modules/YOUR_MODULE)</code>.</li></ul></div>
</div>

## Using the Policy
<!-- start: doc.md -->

<!-- end: doc.md -->

Read more about [how policies work](/docs/articles/policies)
