---
title: Basic Auth Policy
sidebar_label: Basic Auth
---

<!-- WARNING: This document is generated. DO NOT EDIT BY HAND -->

# Basic Auth






<!-- start: intro.md -->
The Basic Authentication policy allows you to authenticate incoming requests using the Basic authentication standard. You can configure multiple accounts with different passwords and a different bucket of user 'data'.

The API will expect a Basic Auth header (you can generate samples [here](https://www.debugbear.com/basic-auth-header-generator)). Requests with invalid credentials (or no header) will not be authenticated. Authenticated requests will populate the `user` property of the `ZuploRequest` parameter on your RequestHandler.

<!-- end: intro.md -->

<PolicyStatus isBeta={false} isPaidAddOn={false} />



## Configuration 

The configuration shows how to configure the policy in the 'policies.json' document.

```json title="config/policies.json"
{
  "name": "my-basic-auth-inbound-policy",
  "policyType": "basic-auth-inbound",
  "handler": {
    "export": "BasicAuthInboundPolicy",
    "module": "$import(@zuplo/runtime)",
    "options": {
      "accounts": [
        {
          "data": {
            "name": "John Doe",
            "email": "john.doe@gmail.com"
          },
          "password": "$env(ACCOUNT_JOHN_PASSWORD)",
          "username": "$env(ACCOUNT_JOHN_USERNAME)"
        }
      ],
      "allowUnauthenticatedRequests": false
    }
  }
}
```

<div className="policy-options">
<div><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-configuration">Policy Configuration<a href="#policy-configuration" class="hash-link" aria-label="Direct link to Policy Configuration" title="Direct link to Policy Configuration">​</a></h3><ul><li><code>name</code> <span class="type-option">&lt;string&gt;</span> - The name of your policy instance. This is used as a reference in your routes.</li><li><code>policyType</code> <span class="type-option">&lt;string&gt;</span> - The identifier of the policy. This is used by the Zuplo UI. Value should be <code>basic-auth-inbound</code>.</li><li><code>handler.export</code> <span class="type-option">&lt;string&gt;</span> - The name of the exported type. Value should be <code>BasicAuthInboundPolicy</code>.</li><li><code>handler.module</code> <span class="type-option">&lt;string&gt;</span> - The module containing the policy. Value should be <code>$import(@zuplo/runtime)</code>.</li><li><code>handler.options</code> <span class="type-option">&lt;object&gt;</span> - The options for this policy. <a href="#policy-options">See Policy Options</a> below.</li></ul><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-options">Policy Options<a href="#policy-options" class="hash-link" aria-label="Direct link to Policy Options" title="Direct link to Policy Options">​</a></h3><p>The options for this policy are specified below. All properties are optional unless specifically marked as required.</p><ul><li><code>accounts</code><span class="type-option"> &lt;object[]&gt;</span><span class="required-option"> (Required)</span> - <div><p>An array of account objects (username, password and data properties).</p></div><ul><li><code>username</code><span class="type-option"> &lt;string&gt;</span><span class="required-option"> (Required)</span> - <div>The username for the account (this will be the `sub` property on `request.user`.</div></li><li><code>password</code><span class="type-option"> &lt;string&gt;</span><span class="required-option"> (Required)</span> - <div>The password for the account - note we recommend storing this in environment variables.</div></li><li><code>data</code><span class="type-option"> &lt;object&gt;</span> - <div>The data payload you want associated with this account (this will be the `data` property on `request.user`).</div></li></ul></li><li><code>allowUnauthenticatedRequests</code><span class="type-option"> &lt;boolean&gt;</span> - <div><p>If 'true' allows the request to continue even if authenticated. When 'false' (the default) any unauthenticated request is automatically rejected with a 401.</p></div></li></ul></div>
</div>

## Using the Policy
<!-- start: doc.md -->

<!-- end: doc.md -->

Read more about [how policies work](/docs/articles/policies)
