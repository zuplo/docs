---
title: Okta JWT Auth Policy
sidebar_label: Okta JWT Auth
---

<!-- WARNING: This document is generated. DO NOT EDIT BY HAND -->

# Okta JWT Auth






<!-- start: intro.md -->
Authenticate requests with JWT tokens issued by Okta. This is a customized version of the [OpenId JWT Policy](https://zuplo.com/docs/policies/open-id-jwt-auth-inbound) specifically for Okta.

See [this document](https://zuplo.com/docs/articles/oauth-authentication) for more information about OAuth authorization in Zuplo.

<!-- end: intro.md -->

<PolicyStatus isBeta={false} isPaidAddOn={false} />



## Configuration 

The configuration shows how to configure the policy in the 'policies.json' document.

```json title="config/policies.json"
{
  "name": "my-okta-jwt-auth-inbound-policy",
  "policyType": "okta-jwt-auth-inbound",
  "handler": {
    "export": "OktaJwtInboundPolicy",
    "module": "$import(@zuplo/runtime)",
    "options": {
      "allowUnauthenticatedRequests": false,
      "audience": "api://my-api",
      "issuerUrl": "https://dev-12345.okta.com/oauth2/abc"
    }
  }
}
```

<div className="policy-options">
<div><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-configuration">Policy Configuration<a href="#policy-configuration" class="hash-link" aria-label="Direct link to Policy Configuration" title="Direct link to Policy Configuration">​</a></h3><ul><li><code>name</code> <span class="type-option">&lt;string&gt;</span> - The name of your policy instance. This is used as a reference in your routes.</li><li><code>policyType</code> <span class="type-option">&lt;string&gt;</span> - The identifier of the policy. This is used by the Zuplo UI. Value should be <code>okta-jwt-auth-inbound</code>.</li><li><code>handler.export</code> <span class="type-option">&lt;string&gt;</span> - The name of the exported type. Value should be <code>OktaJwtInboundPolicy</code>.</li><li><code>handler.module</code> <span class="type-option">&lt;string&gt;</span> - The module containing the policy. Value should be <code>$import(@zuplo/runtime)</code>.</li><li><code>handler.options</code> <span class="type-option">&lt;object&gt;</span> - The options for this policy. <a href="#policy-options">See Policy Options</a> below.</li></ul><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-options">Policy Options<a href="#policy-options" class="hash-link" aria-label="Direct link to Policy Options" title="Direct link to Policy Options">​</a></h3><p>The options for this policy are specified below. All properties are optional unless specifically marked as required.</p><ul><li><code>allowUnauthenticatedRequests</code><span class="type-option"> &lt;boolean&gt;</span> - <div><p>Allow unauthenticated requests to proceed. This is use useful if you want to use multiple authentication policies or if you want to allow both authenticated and non-authenticated traffic.</p></div></li><li><code>issuerUrl</code><span class="type-option"> &lt;string&gt;</span><span class="required-option"> (Required)</span> - <div><p>Your Okta authorization server's issuer URL. For example, <code>https://dev-12345.okta.com/oauth2/abc</code>.</p></div></li><li><code>audience</code><span class="type-option"> &lt;string&gt;</span> - <div><p>The Okta audience of your API, for example <code>api://my-api</code>.</p></div></li></ul></div>
</div>

## Using the Policy
<!-- start: doc.md -->

<!-- end: doc.md -->

Read more about [how policies work](/docs/articles/policies)
