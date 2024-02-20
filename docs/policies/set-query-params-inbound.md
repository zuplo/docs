---
title: Add or Set Query Parameters Policy
sidebar_label: Add or Set Query Parameters
---

<!-- WARNING: This document is generated. DO NOT EDIT BY HAND -->

# Add or Set Query Parameters






<!-- start: intro.md -->
Adds or sets query parameters on the incoming request.
<!-- end: intro.md -->

<PolicyStatus isBeta={false} isPaidAddOn={false} />



## Configuration 

The configuration shows how to configure the policy in the 'policies.json' document.

```json title="config/policies.json"
{
  "name": "my-set-query-params-inbound-policy",
  "policyType": "set-query-params-inbound",
  "handler": {
    "export": "SetQueryParamsInboundPolicy",
    "module": "$import(@zuplo/runtime)",
    "options": {
      "params": [
        {
          "name": "my-key",
          "value": "my-value"
        }
      ]
    }
  }
}
```

<div className="policy-options">
<div><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-configuration">Policy Configuration<a href="#policy-configuration" class="hash-link" aria-label="Direct link to Policy Configuration" title="Direct link to Policy Configuration">​</a></h3><ul><li><code>name</code> <span class="type-option">&lt;string&gt;</span> - The name of your policy instance. This is used as a reference in your routes.</li><li><code>policyType</code> <span class="type-option">&lt;string&gt;</span> - The identifier of the policy. This is used by the Zuplo UI. Value should be <code>set-query-params-inbound</code>.</li><li><code>handler.export</code> <span class="type-option">&lt;string&gt;</span> - The name of the exported type. Value should be <code>SetQueryParamsInboundPolicy</code>.</li><li><code>handler.module</code> <span class="type-option">&lt;string&gt;</span> - The module containing the policy. Value should be <code>$import(@zuplo/runtime)</code>.</li><li><code>handler.options</code> <span class="type-option">&lt;object&gt;</span> - The options for this policy. <a href="#policy-options">See Policy Options</a> below.</li></ul><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-options">Policy Options<a href="#policy-options" class="hash-link" aria-label="Direct link to Policy Options" title="Direct link to Policy Options">​</a></h3><p>The options for this policy are specified below. All properties are optional unless specifically marked as required.</p><ul><li><code>params</code><span class="type-option"> &lt;object[]&gt;</span><span class="required-option"> (Required)</span> - <div><p>An array of query params to set in the request. By default, query parameters will be overwritten if they already exist in the request, specify the overwrite property to change this behavior.</p></div><ul><li><code>name</code><span class="type-option"> &lt;string&gt;</span><span class="required-option"> (Required)</span> - <div>The name of the param.</div></li><li><code>value</code><span class="type-option"> &lt;string&gt;</span><span class="required-option"> (Required)</span> - <div>The value of the param.</div></li><li><code>overwrite</code><span class="type-option"> &lt;boolean&gt;</span> - <div>Overwrite the value if the param is already present in the request.</div><span class="default-value"> Defaults to <code>true</code>.</span></li></ul></li></ul></div>
</div>

## Using the Policy
<!-- start: doc.md -->

<!-- end: doc.md -->

Read more about [how policies work](/docs/articles/policies)
