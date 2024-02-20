---
title: Mock API Response Policy
sidebar_label: Mock API Response
---

<!-- WARNING: This document is generated. DO NOT EDIT BY HAND -->

# Mock API Response






<!-- start: intro.md -->
Returns example responses from the OpenAPI document associated with this route.
<!-- end: intro.md -->

<PolicyStatus isBeta={false} isPaidAddOn={false} />



## Configuration 

The configuration shows how to configure the policy in the 'policies.json' document.

```json title="config/policies.json"
{
  "name": "my-mock-api-inbound-policy",
  "policyType": "mock-api-inbound",
  "handler": {
    "export": "MockApiInboundPolicy",
    "module": "$import(@zuplo/runtime)",
    "options": {
      "contentType": "application/json",
      "exampleName": "example1",
      "random": false
    }
  }
}
```

<div className="policy-options">
<div><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-configuration">Policy Configuration<a href="#policy-configuration" class="hash-link" aria-label="Direct link to Policy Configuration" title="Direct link to Policy Configuration">​</a></h3><ul><li><code>name</code> <span class="type-option">&lt;string&gt;</span> - The name of your policy instance. This is used as a reference in your routes.</li><li><code>policyType</code> <span class="type-option">&lt;string&gt;</span> - The identifier of the policy. This is used by the Zuplo UI. Value should be <code>mock-api-inbound</code>.</li><li><code>handler.export</code> <span class="type-option">&lt;string&gt;</span> - The name of the exported type. Value should be <code>MockApiInboundPolicy</code>.</li><li><code>handler.module</code> <span class="type-option">&lt;string&gt;</span> - The module containing the policy. Value should be <code>$import(@zuplo/runtime)</code>.</li><li><code>handler.options</code> <span class="type-option">&lt;object&gt;</span> - The options for this policy. <a href="#policy-options">See Policy Options</a> below.</li></ul><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-options">Policy Options<a href="#policy-options" class="hash-link" aria-label="Direct link to Policy Options" title="Direct link to Policy Options">​</a></h3><p>The options for this policy are specified below. All properties are optional unless specifically marked as required.</p><ul><li><code>random</code><span class="type-option"> &lt;boolean&gt;</span> - <div><p>Indicates whether the response should be selected randomly, from the available examples (that match any filter criteria). If <code>false</code> the first matching example is used.</p></div></li><li><code>responsePrefixFilter</code><span class="type-option"> &lt;string&gt;</span> - <div><p>Specifies a prefix to match the responses to select from. Typically this is a status code like "200" or "2XX". If you want the policy to select randomly from all 2XX codes, set this property to "2" and random to <code>true</code>.</p></div></li><li><code>contentType</code><span class="type-option"> &lt;string&gt;</span> - <div><p>Specify the content-type of the response to select from. If not specified, the first matching response is used (or random).</p></div></li><li><code>exampleName</code><span class="type-option"> &lt;string&gt;</span> - <div><p>Specify the name of the example to select. If not specified, the first matching response is used (or random).</p></div></li></ul></div>
</div>

## Using the Policy
<!-- start: doc.md -->

<!-- end: doc.md -->

Read more about [how policies work](/docs/articles/policies)
