---
title: Request Size Limit Policy
sidebar_label: Request Size Limit
---

<!-- WARNING: This document is generated. DO NOT EDIT BY HAND -->

# Request Size Limit






<!-- start: intro.md -->
Enforces a maximum size in bytes of the incoming request.
<!-- end: intro.md -->

<PolicyStatus isBeta={false} isPaidAddOn={false} />



## Configuration 

The configuration shows how to configure the policy in the 'policies.json' document.

```json title="config/policies.json"
{
  "name": "my-request-size-limit-inbound-policy",
  "policyType": "request-size-limit-inbound",
  "handler": {
    "export": "RequestSizeLimitInboundPolicy",
    "module": "$import(@zuplo/runtime)",
    "options": {
      "maxSizeInBytes": 10000
    }
  }
}
```

<div className="policy-options">
<div><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-configuration">Policy Configuration<a href="#policy-configuration" class="hash-link" aria-label="Direct link to Policy Configuration" title="Direct link to Policy Configuration">​</a></h3><ul><li><code>name</code> <span class="type-option">&lt;string&gt;</span> - The name of your policy instance. This is used as a reference in your routes.</li><li><code>policyType</code> <span class="type-option">&lt;string&gt;</span> - The identifier of the policy. This is used by the Zuplo UI. Value should be <code>request-size-limit-inbound</code>.</li><li><code>handler.export</code> <span class="type-option">&lt;string&gt;</span> - The name of the exported type. Value should be <code>RequestSizeLimitInboundPolicy</code>.</li><li><code>handler.module</code> <span class="type-option">&lt;string&gt;</span> - The module containing the policy. Value should be <code>$import(@zuplo/runtime)</code>.</li><li><code>handler.options</code> <span class="type-option">&lt;object&gt;</span> - The options for this policy. <a href="#policy-options">See Policy Options</a> below.</li></ul><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-options">Policy Options<a href="#policy-options" class="hash-link" aria-label="Direct link to Policy Options" title="Direct link to Policy Options">​</a></h3><p>The options for this policy are specified below. All properties are optional unless specifically marked as required.</p><ul><li><code>maxSizeInBytes</code><span class="type-option"> &lt;number&gt;</span><span class="required-option"> (Required)</span> - <div><p>The maximum size of the request in bytes.</p></div></li><li><code>trustContentLengthHeader</code><span class="type-option"> &lt;boolean&gt;</span> - <div><p>If true, the policy will reject any request with a <code>content-length</code> header in excess of <code>maxSizeInBytes</code> bytes value, but will not verify the actual size of the request. This is more efficient and offers slightly better memory usage but should only be used if you trust/control the clients calling the gateway to send an accurate content-length. If false, the gateway will actually verify the request size and reject any request with a size in excess of the stated maximum.</p></div></li></ul></div>
</div>

## Using the Policy
<!-- start: doc.md -->

<!-- end: doc.md -->

Read more about [how policies work](/docs/articles/policies)
