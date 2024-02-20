---
title: Require Origin Policy
sidebar_label: Require Origin
---

<!-- WARNING: This document is generated. DO NOT EDIT BY HAND -->

# Require Origin






<!-- start: intro.md -->
The Require Origin policy is used to enforce that the client is sending an `origin` header that matches your allow-list specified in the policy options.

This is useful if you want to stop any browser traffic from different domains.

However, it is important to note that it does not guarantee that traffic is only coming from a browser. Somebody could simulate a browser request from a backend server and set any origin they like.

If the incoming origin is missing, or not allowed - a 400 Forbidden Problem Response will be sent to the client. You can customize the `detail` property in the policy options.

<!-- end: intro.md -->

<PolicyStatus isBeta={false} isPaidAddOn={false} />



## Configuration 

The configuration shows how to configure the policy in the 'policies.json' document.

```json title="config/policies.json"
{
  "name": "my-require-origin-inbound-policy",
  "policyType": "require-origin-inbound",
  "handler": {
    "export": "RequireOriginInboundPolicy",
    "module": "$import(@zuplo/runtime)",
    "options": {
      "failureDetail": "Your origin is not authorized to make this request.",
      "origins": "https://example.com, https://example.org"
    }
  }
}
```

<div className="policy-options">
<div><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-configuration">Policy Configuration<a href="#policy-configuration" class="hash-link" aria-label="Direct link to Policy Configuration" title="Direct link to Policy Configuration">​</a></h3><ul><li><code>name</code> <span class="type-option">&lt;string&gt;</span> - The name of your policy instance. This is used as a reference in your routes.</li><li><code>policyType</code> <span class="type-option">&lt;string&gt;</span> - The identifier of the policy. This is used by the Zuplo UI. Value should be <code>require-origin-inbound</code>.</li><li><code>handler.export</code> <span class="type-option">&lt;string&gt;</span> - The name of the exported type. Value should be <code>RequireOriginInboundPolicy</code>.</li><li><code>handler.module</code> <span class="type-option">&lt;string&gt;</span> - The module containing the policy. Value should be <code>$import(@zuplo/runtime)</code>.</li><li><code>handler.options</code> <span class="type-option">&lt;object&gt;</span> - The options for this policy. <a href="#policy-options">See Policy Options</a> below.</li></ul><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-options">Policy Options<a href="#policy-options" class="hash-link" aria-label="Direct link to Policy Options" title="Direct link to Policy Options">​</a></h3><p>The options for this policy are specified below. All properties are optional unless specifically marked as required.</p><ul><li><code>origins</code><span class="type-option"> &lt;string&gt;</span><span class="required-option"> (Required)</span> - <div><p>A comma separated string containing valid origins.</p></div></li><li><code>failureDetail</code><span class="type-option"> &lt;string&gt;</span> - <div><p>The <code>detail</code> of the HTTP Problem response, if the origin is missing or disallowed.</p></div><span class="default-value"> Defaults to <code>Forbidden</code>.</span></li></ul></div>
</div>

## Using the Policy
<!-- start: doc.md -->

<!-- end: doc.md -->

Read more about [how policies work](/docs/articles/policies)
