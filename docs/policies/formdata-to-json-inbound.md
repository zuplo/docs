---
title: Form Data to JSON Policy
sidebar_label: Form Data to JSON
---

<!-- WARNING: This document is generated. DO NOT EDIT BY HAND -->

# Form Data to JSON






<!-- start: intro.md -->
Converts form data in the incoming request to JSON.
<!-- end: intro.md -->

<PolicyStatus isBeta={false} isPaidAddOn={false} />



## Configuration 

The configuration shows how to configure the policy in the 'policies.json' document.

```json title="config/policies.json"
{
  "name": "my-formdata-to-json-inbound-policy",
  "policyType": "formdata-to-json-inbound",
  "handler": {
    "export": "FormDataToJsonInboundPolicy",
    "module": "$import(@zuplo/runtime)",
    "options": {
      "badRequestIfNotFormData": true
    }
  }
}
```

<div className="policy-options">
<div><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-configuration">Policy Configuration<a href="#policy-configuration" class="hash-link" aria-label="Direct link to Policy Configuration" title="Direct link to Policy Configuration">​</a></h3><ul><li><code>name</code> <span class="type-option">&lt;string&gt;</span> - The name of your policy instance. This is used as a reference in your routes.</li><li><code>policyType</code> <span class="type-option">&lt;string&gt;</span> - The identifier of the policy. This is used by the Zuplo UI. Value should be <code>formdata-to-json-inbound</code>.</li><li><code>handler.export</code> <span class="type-option">&lt;string&gt;</span> - The name of the exported type. Value should be <code>FormDataToJsonInboundPolicy</code>.</li><li><code>handler.module</code> <span class="type-option">&lt;string&gt;</span> - The module containing the policy. Value should be <code>$import(@zuplo/runtime)</code>.</li><li><code>handler.options</code> <span class="type-option">&lt;object&gt;</span> - The options for this policy. <a href="#policy-options">See Policy Options</a> below.</li></ul><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-options">Policy Options<a href="#policy-options" class="hash-link" aria-label="Direct link to Policy Options" title="Direct link to Policy Options">​</a></h3><p>The options for this policy are specified below. All properties are optional unless specifically marked as required.</p><ul><li><code>badRequestIfNotFormData</code><span class="type-option"> &lt;boolean&gt;</span> - <div><p>Should the policy return an error if the request is not of the type form data.</p></div><span class="default-value"> Defaults to <code>true</code>.</span></li><li><code>optionalHoneypotName</code><span class="type-option"> &lt;string&gt;</span> - <div><p>The name of the honeypot field. Used to provide basic spam filtering.</p></div></li></ul></div>
</div>

## Using the Policy
<!-- start: doc.md -->

<!-- end: doc.md -->

Read more about [how policies work](/docs/articles/policies)
