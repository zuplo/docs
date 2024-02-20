---
title: A/B Test Inbound Policy
sidebar_label: A/B Test Inbound
---

<!-- WARNING: This document is generated. DO NOT EDIT BY HAND -->

# A/B Test Inbound

<CustomPolicyNotice name="A/B Test Inbound" id="ab-test-inbound" />




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

```ts title="modules/ab-test-inbound.ts"
import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

export default async function (request: ZuploRequest, context: ZuploContext) {
  // Generate a random number to segment the test groups
  const score = Math.random();

  if (score < 0.5) {
    // Do something for half the requests
  } else {
    // Do something else for the other half
  }

  return request;
}

```

## Configuration 

The example below shows how to configure a custom code policy in the 'policies.json' document that utilizes the above example policy code.

```json title="config/policies.json"
{
  "name": "ab-test-inbound",
  "policyType": "custom-code-inbound",
  "handler": {
    "export": "default",
    "module": "$import(./modules/ab-test-inbound)"
  }
}
```

<div className="policy-options">
<div><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-configuration">Policy Configuration<a href="#policy-configuration" class="hash-link" aria-label="Direct link to Policy Configuration" title="Direct link to Policy Configuration">​</a></h3><ul><li><code>name</code> <span class="type-option">&lt;string&gt;</span> - The name of your policy instance. This is used as a reference in your routes.</li><li><code>policyType</code> <span class="type-option">&lt;string&gt;</span> - The identifier of the policy. This is used by the Zuplo UI. Value should be <code>ab-test-inbound</code>.</li><li><code>handler.export</code> <span class="type-option">&lt;string&gt;</span> - The name of the exported type. Value should be <code>default</code>.</li><li><code>handler.module</code> <span class="type-option">&lt;string&gt;</span> - The module containing the policy. Value should be <code>$import(./modules/YOUR_MODULE)</code>.</li></ul></div>
</div>

## Using the Policy
<!-- start: doc.md -->

<!-- end: doc.md -->

Read more about [how policies work](/docs/articles/policies)
