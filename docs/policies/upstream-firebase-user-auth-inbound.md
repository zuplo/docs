---
title: Upstream Firebase User Auth Policy
sidebar_label: Upstream Firebase User Auth
---

<!-- WARNING: This document is generated. DO NOT EDIT BY HAND -->

# Upstream Firebase User Auth






<!-- start: intro.md -->
This policy adds a Firebase Admin token to the outgoing `Authentication` header allowing requests to Firebase using Service Account admin permissions. This can be useful for calling Firebase services such as Firestore through a Zuplo endpoint that is secured with other means of Authentication such as API keys. Additionally, this policy can be useful for service content to all API users (for example serving a specific Firestore document containing configuration data)

We recommend reading the `serviceAccountJson` from environment variables (so it is not checked in to source control) using the `$env(ENV_VAR)` syntax.

<!-- end: intro.md -->

<PolicyStatus isBeta={false} isPaidAddOn={false} />



## Configuration 

The configuration shows how to configure the policy in the 'policies.json' document.

```json title="config/policies.json"
{
  "name": "my-upstream-firebase-user-auth-inbound-policy",
  "policyType": "upstream-firebase-user-auth-inbound",
  "handler": {
    "export": "UpstreamFirebaseUserAuthInboundPolicy",
    "module": "$import(@zuplo/runtime)",
    "options": {
      "developerClaims": {
        "premium": true
      },
      "expirationOffsetSeconds": 300,
      "serviceAccountJson": "$env(SERVICE_ACCOUNT_JSON)",
      "tokenRetries": 3,
      "userId": "1234",
      "webApiKey": "$env(WEB_API_KEY)"
    }
  }
}
```

<div className="policy-options">
<div><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-configuration">Policy Configuration<a href="#policy-configuration" class="hash-link" aria-label="Direct link to Policy Configuration" title="Direct link to Policy Configuration">​</a></h3><ul><li><code>name</code> <span class="type-option">&lt;string&gt;</span> - The name of your policy instance. This is used as a reference in your routes.</li><li><code>policyType</code> <span class="type-option">&lt;string&gt;</span> - The identifier of the policy. This is used by the Zuplo UI. Value should be <code>upstream-firebase-user-auth-inbound</code>.</li><li><code>handler.export</code> <span class="type-option">&lt;string&gt;</span> - The name of the exported type. Value should be <code>UpstreamFirebaseUserAuthInboundPolicy</code>.</li><li><code>handler.module</code> <span class="type-option">&lt;string&gt;</span> - The module containing the policy. Value should be <code>$import(@zuplo/runtime)</code>.</li><li><code>handler.options</code> <span class="type-option">&lt;object&gt;</span> - The options for this policy. <a href="#policy-options">See Policy Options</a> below.</li></ul><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-options">Policy Options<a href="#policy-options" class="hash-link" aria-label="Direct link to Policy Options" title="Direct link to Policy Options">​</a></h3><p>The options for this policy are specified below. All properties are optional unless specifically marked as required.</p><ul><li><code>serviceAccountJson</code><span class="type-option"> &lt;string&gt;</span><span class="required-option"> (Required)</span> - <div><p>The Google Service Account key in JSON format. Note you can load this from environment variables using the $env(ENV_VAR) syntax.</p></div></li><li><code>userId</code><span class="type-option"> &lt;string&gt;</span> - <div><p>The userId to use as the custom token's subject.</p></div></li><li><code>userIdPropertyPath</code><span class="type-option"> &lt;string&gt;</span> - <div><p>The property on the incoming request.user object to retrieve the value of the userId.</p></div></li><li><code>developerClaims</code><span class="type-option"> &lt;object&gt;</span> - <div><p>Additional claims to include in the custom token's payload.</p></div></li><li><code>webApiKey</code><span class="type-option"> &lt;string&gt;</span><span class="required-option"> (Required)</span> - <div><p>The Firebase Web API Key (found in project settings)</p></div></li><li><code>tokenRetries</code><span class="type-option"> &lt;number&gt;</span> - <div><p>The number of times to retry fetching the token in the event of a failure.</p></div><span class="default-value"> Defaults to <code>3</code>.</span></li><li><code>expirationOffsetSeconds</code><span class="type-option"> &lt;number&gt;</span> - <div><p>The number of seconds less than the token expiration to cache the token.</p></div><span class="default-value"> Defaults to <code>300</code>.</span></li></ul></div>
</div>

## Using the Policy
<!-- start: doc.md -->

<!-- end: doc.md -->

Read more about [how policies work](/docs/articles/policies)
