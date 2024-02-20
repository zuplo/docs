---
title: Firebase JWT Auth Policy
sidebar_label: Firebase JWT Auth
---

<!-- WARNING: This document is generated. DO NOT EDIT BY HAND -->

# Firebase JWT Auth






<!-- start: intro.md -->
Authenticate requests with JWT tokens issued by Firebase. The payload of the JWT token, if successfully authenticated, with be on the `request.user.data` object accessible to the runtime.

See [this document](https://zuplo.com/docs/articles/oauth-authentication) for more information about OAuth authorization in Zuplo.

<!-- end: intro.md -->

<PolicyStatus isBeta={false} isPaidAddOn={false} />



## Configuration 

The configuration shows how to configure the policy in the 'policies.json' document.

```json title="config/policies.json"
{
  "name": "my-firebase-jwt-inbound-policy",
  "policyType": "firebase-jwt-inbound",
  "handler": {
    "export": "FirebaseJwtInboundPolicy",
    "module": "$import(@zuplo/runtime)",
    "options": {
      "allowUnauthenticatedRequests": false,
      "projectId": "my-project-id"
    }
  }
}
```

<div className="policy-options">
<div><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-configuration">Policy Configuration<a href="#policy-configuration" class="hash-link" aria-label="Direct link to Policy Configuration" title="Direct link to Policy Configuration">​</a></h3><ul><li><code>name</code> <span class="type-option">&lt;string&gt;</span> - The name of your policy instance. This is used as a reference in your routes.</li><li><code>policyType</code> <span class="type-option">&lt;string&gt;</span> - The identifier of the policy. This is used by the Zuplo UI. Value should be <code>firebase-jwt-inbound</code>.</li><li><code>handler.export</code> <span class="type-option">&lt;string&gt;</span> - The name of the exported type. Value should be <code>FirebaseJwtInboundPolicy</code>.</li><li><code>handler.module</code> <span class="type-option">&lt;string&gt;</span> - The module containing the policy. Value should be <code>$import(@zuplo/runtime)</code>.</li><li><code>handler.options</code> <span class="type-option">&lt;object&gt;</span> - The options for this policy. <a href="#policy-options">See Policy Options</a> below.</li></ul><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-options">Policy Options<a href="#policy-options" class="hash-link" aria-label="Direct link to Policy Options" title="Direct link to Policy Options">​</a></h3><p>The options for this policy are specified below. All properties are optional unless specifically marked as required.</p><ul><li><code>allowUnauthenticatedRequests</code><span class="type-option"> &lt;boolean&gt;</span> - <div><p>Allow unauthenticated requests to proceed. This is use useful if you want to use multiple authentication policies or if you want to allow both authenticated and non-authenticated traffic.</p></div></li><li><code>projectId</code><span class="type-option"> &lt;string&gt;</span><span class="required-option"> (Required)</span> - <div><p>Your Firebase Project ID.</p></div></li></ul></div>
</div>

## Using the Policy
<!-- start: doc.md -->

<!-- end: doc.md -->

Read more about [how policies work](/docs/articles/policies)
