---
title: Replace String in Response Body Policy
sidebar_label: Replace String in Response Body
---

<!-- WARNING: This document is generated. DO NOT EDIT BY HAND -->

# Replace String in Response Body






<!-- start: intro.md -->
Replace a string in the incoming request body
<!-- end: intro.md -->

<PolicyStatus isBeta={false} isPaidAddOn={false} />



## Configuration 

The configuration shows how to configure the policy in the 'policies.json' document.

```json title="config/policies.json"
{
  "name": "my-replace-string-outbound-policy",
  "policyType": "replace-string-outbound",
  "handler": {
    "export": "ReplaceStringOutboundPolicy",
    "module": "$import(@zuplo/runtime)",
    "options": {
      "match": "/(\\d+)/g",
      "mode": "regexp",
      "replaceWith": "1234"
    }
  }
}
```

<div className="policy-options">
<div><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-configuration">Policy Configuration<a href="#policy-configuration" class="hash-link" aria-label="Direct link to Policy Configuration" title="Direct link to Policy Configuration">​</a></h3><ul><li><code>name</code> <span class="type-option">&lt;string&gt;</span> - The name of your policy instance. This is used as a reference in your routes.</li><li><code>policyType</code> <span class="type-option">&lt;string&gt;</span> - The identifier of the policy. This is used by the Zuplo UI. Value should be <code>replace-string-outbound</code>.</li><li><code>handler.export</code> <span class="type-option">&lt;string&gt;</span> - The name of the exported type. Value should be <code>ReplaceStringOutboundPolicy</code>.</li><li><code>handler.module</code> <span class="type-option">&lt;string&gt;</span> - The module containing the policy. Value should be <code>$import(@zuplo/runtime)</code>.</li><li><code>handler.options</code> <span class="type-option">&lt;object&gt;</span> - The options for this policy. <a href="#policy-options">See Policy Options</a> below.</li></ul><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-options">Policy Options<a href="#policy-options" class="hash-link" aria-label="Direct link to Policy Options" title="Direct link to Policy Options">​</a></h3><p>The options for this policy are specified below. All properties are optional unless specifically marked as required.</p><ul><li><code>mode</code><span class="type-option"> &lt;string&gt;</span><span class="required-option"> (Required)</span> - <div><p>The type of string replacement to perform.</p></div><span class="allow-values"> Allowed values are <span><code>regexp</code>, </span><span>and <code>string</code></span>.</span></li><li><code>match</code><span class="type-option"> &lt;string&gt;</span><span class="required-option"> (Required)</span> - <div><p>The pattern to match.</p></div></li><li><code>replaceWith</code><span class="type-option"> &lt;string&gt;</span><span class="required-option"> (Required)</span> - <div><p>The value to each match is replaced with.</p></div></li></ul></div>
</div>

## Using the Policy
<!-- start: doc.md -->

<!-- end: doc.md -->

Read more about [how policies work](/docs/articles/policies)
