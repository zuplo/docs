---
title: API Key Authentication Policy
sidebar_label: API Key Authentication
---

<!-- WARNING: This document is generated. DO NOT EDIT BY HAND -->

# API Key Authentication




:::danger Deprecated

This policy is deprecated. Please use the new [API Key Authentication](https://zuplo.com/docs/policies/api-key-inbound) policy instead. This policy will continue to work but will be removed in a future version of Zuplo.

:::

<!-- start: intro.md -->
This policy uses the managed API key storage provided by Zuplo. `allowUnauthenticatedRequests` defaults to false and rejects any request without a valid API key (returning a `401 - Unauthorized` response). You can override (set `"allowUnauthenticatedRequests" : true`) this to support multiple authentication methods or support both authenticated and anonymous requests.

<!-- end: intro.md -->

<PolicyStatus isBeta={false} isPaidAddOn={false} />



## Configuration 

The configuration shows how to configure the policy in the 'policies.json' document.

```json title="config/policies.json"
{
  "name": "my-api-key-auth-inbound-policy",
  "policyType": "api-key-auth-inbound",
  "handler": {
    "export": "ApiAuthKeyInboundPolicy",
    "module": "$import(@zuplo/runtime)",
    "options": {
      "allowUnauthenticatedRequests": false
    }
  }
}
```

<div className="policy-options">
<div><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-configuration">Policy Configuration<a href="#policy-configuration" class="hash-link" aria-label="Direct link to Policy Configuration" title="Direct link to Policy Configuration">​</a></h3><ul><li><code>name</code> <span class="type-option">&lt;string&gt;</span> - The name of your policy instance. This is used as a reference in your routes.</li><li><code>policyType</code> <span class="type-option">&lt;string&gt;</span> - The identifier of the policy. This is used by the Zuplo UI. Value should be <code>api-key-auth-inbound</code>.</li><li><code>handler.export</code> <span class="type-option">&lt;string&gt;</span> - The name of the exported type. Value should be <code>ApiAuthKeyInboundPolicy</code>.</li><li><code>handler.module</code> <span class="type-option">&lt;string&gt;</span> - The module containing the policy. Value should be <code>$import(@zuplo/runtime)</code>.</li><li><code>handler.options</code> <span class="type-option">&lt;object&gt;</span> - The options for this policy. <a href="#policy-options">See Policy Options</a> below.</li></ul><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-options">Policy Options<a href="#policy-options" class="hash-link" aria-label="Direct link to Policy Options" title="Direct link to Policy Options">​</a></h3><p>The options for this policy are specified below. All properties are optional unless specifically marked as required.</p><ul><li><code>allowUnauthenticatedRequests</code><span class="type-option"> &lt;boolean&gt;</span> - <div><p>If 'true' allows the request to continue even if authenticated. When 'false' (the default) any unauthenticated request is automatically rejected with a 401.</p></div></li></ul></div>
</div>

## Using the Policy
<!-- start: doc.md -->

<!-- end: doc.md -->

Read more about [how policies work](/docs/articles/policies)
