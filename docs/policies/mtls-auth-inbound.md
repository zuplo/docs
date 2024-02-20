---
title: mTLS Auth Policy
sidebar_label: mTLS Auth
---

<!-- WARNING: This document is generated. DO NOT EDIT BY HAND -->

# mTLS Auth






<!-- start: intro.md -->
This policy will authenticate users based on mTLS certificates that are configured for your project. This policy is available only to enterprise customers (contact sales@zuplo.com to request info). When a requests is authenticated with an mTLS certificate, the certificate data will be set as the user object of the request. The `user.sub` property will be the value of the certificates DN.

<!-- end: intro.md -->

<PolicyStatus isBeta={false} isPaidAddOn={true} />



## Configuration 

The configuration shows how to configure the policy in the 'policies.json' document.

```json title="config/policies.json"
{
  "name": "my-mtls-auth-inbound-policy",
  "policyType": "mtls-auth-inbound",
  "handler": {
    "export": "MTLSAuthInboundPolicy",
    "module": "$import(@zuplo/runtime)",
    "options": {
      "allowExpiredCertificates": false,
      "allowRevokedCertificates": false,
      "allowUnauthenticatedRequests": false
    }
  }
}
```

<div className="policy-options">
<div><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-configuration">Policy Configuration<a href="#policy-configuration" class="hash-link" aria-label="Direct link to Policy Configuration" title="Direct link to Policy Configuration">​</a></h3><ul><li><code>name</code> <span class="type-option">&lt;string&gt;</span> - The name of your policy instance. This is used as a reference in your routes.</li><li><code>policyType</code> <span class="type-option">&lt;string&gt;</span> - The identifier of the policy. This is used by the Zuplo UI. Value should be <code>mtls-auth-inbound</code>.</li><li><code>handler.export</code> <span class="type-option">&lt;string&gt;</span> - The name of the exported type. Value should be <code>MTLSAuthInboundPolicy</code>.</li><li><code>handler.module</code> <span class="type-option">&lt;string&gt;</span> - The module containing the policy. Value should be <code>$import(@zuplo/runtime)</code>.</li><li><code>handler.options</code> <span class="type-option">&lt;object&gt;</span> - The options for this policy. <a href="#policy-options">See Policy Options</a> below.</li></ul><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-options">Policy Options<a href="#policy-options" class="hash-link" aria-label="Direct link to Policy Options" title="Direct link to Policy Options">​</a></h3><p>The options for this policy are specified below. All properties are optional unless specifically marked as required.</p><ul><li><code>allowUnauthenticatedRequests</code><span class="type-option"> &lt;boolean&gt;</span> - <div><p>Indicates whether the request should continue if authentication fails. Default is <code>false</code> which means unauthenticated users will automatically receive a 401 response.</p></div></li><li><code>allowExpiredCertificates</code><span class="type-option"> &lt;boolean&gt;</span> - <div><p>Indicates whether the request should continue if the certificate is expired.</p></div></li><li><code>allowRevokedCertificates</code><span class="type-option"> &lt;boolean&gt;</span> - <div><p>Indicates whether the request should continue if the certificate is revoked.</p></div></li></ul></div>
</div>

## Using the Policy
<!-- start: doc.md -->

<!-- end: doc.md -->

Read more about [how policies work](/docs/articles/policies)
