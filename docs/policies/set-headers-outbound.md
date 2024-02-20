---
title: Set Headers Policy
sidebar_label: Set Headers
---

<!-- WARNING: This document is generated. DO NOT EDIT BY HAND -->

# Set Headers






<!-- start: intro.md -->
Adds or sets headers on the on the outgoing response.
<!-- end: intro.md -->

<PolicyStatus isBeta={false} isPaidAddOn={false} />



## Configuration 

The configuration shows how to configure the policy in the 'policies.json' document.

```json title="config/policies.json"
{
  "name": "my-set-headers-outbound-policy",
  "policyType": "set-headers-outbound",
  "handler": {
    "export": "SetHeadersOutboundPolicy",
    "module": "$import(@zuplo/runtime)",
    "options": {
      "headers": [
        {
          "name": "my-header",
          "value": "my-value"
        }
      ]
    }
  }
}
```

<div className="policy-options">
<div><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-configuration">Policy Configuration<a href="#policy-configuration" class="hash-link" aria-label="Direct link to Policy Configuration" title="Direct link to Policy Configuration">​</a></h3><ul><li><code>name</code> <span class="type-option">&lt;string&gt;</span> - The name of your policy instance. This is used as a reference in your routes.</li><li><code>policyType</code> <span class="type-option">&lt;string&gt;</span> - The identifier of the policy. This is used by the Zuplo UI. Value should be <code>set-headers-outbound</code>.</li><li><code>handler.export</code> <span class="type-option">&lt;string&gt;</span> - The name of the exported type. Value should be <code>SetHeadersOutboundPolicy</code>.</li><li><code>handler.module</code> <span class="type-option">&lt;string&gt;</span> - The module containing the policy. Value should be <code>$import(@zuplo/runtime)</code>.</li><li><code>handler.options</code> <span class="type-option">&lt;object&gt;</span> - The options for this policy. <a href="#policy-options">See Policy Options</a> below.</li></ul><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-options">Policy Options<a href="#policy-options" class="hash-link" aria-label="Direct link to Policy Options" title="Direct link to Policy Options">​</a></h3><p>The options for this policy are specified below. All properties are optional unless specifically marked as required.</p><ul><li><code>headers</code><span class="type-option"> &lt;object[]&gt;</span><span class="required-option"> (Required)</span> - <div><p>An array of headers to set on the response. By default, headers will be overwritten if they already exists in the response, specify the overwrite property to change this behavior.</p></div><ul><li><code>name</code><span class="type-option"> &lt;string&gt;</span><span class="required-option"> (Required)</span> - <div>The name of the header.</div></li><li><code>value</code><span class="type-option"> &lt;string&gt;</span><span class="required-option"> (Required)</span> - <div>The value of the header.</div></li><li><code>overwrite</code><span class="type-option"> &lt;boolean&gt;</span> - <div>Overwrite the value if the header is already present in the response.</div><span class="default-value"> Defaults to <code>true</code>.</span></li></ul></li></ul></div>
</div>

## Using the Policy
<!-- start: doc.md -->

<!-- end: doc.md -->

Read more about [how policies work](/docs/articles/policies)
