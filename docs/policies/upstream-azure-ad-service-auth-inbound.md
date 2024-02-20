---
title: Upstream Azure AD Service Auth Policy
sidebar_label: Upstream Azure AD Service Auth
---

<!-- WARNING: This document is generated. DO NOT EDIT BY HAND -->

# Upstream Azure AD Service Auth






<!-- start: intro.md -->
This policy adds a `Authorization` header to the upstream request that allows using Azure AD to authenticate requests to your origin server. This is a useful means of securing your origin server so that only your Zuplo gateway can make requests against it.

Using this policy allows you to delegate authentication and authorization to your gateway without writing any code on your origin service. For instructions on how to configure Azure AD authentication see [Configure your App Service or Azure Functions app to use Azure AD login](https://learn.microsoft.com/en-us/azure/app-service/configure-authentication-provider-aad).

<!-- end: intro.md -->

<PolicyStatus isBeta={false} isPaidAddOn={false} />



## Configuration 

The configuration shows how to configure the policy in the 'policies.json' document.

```json title="config/policies.json"
{
  "name": "my-upstream-azure-ad-service-auth-inbound-policy",
  "policyType": "upstream-azure-ad-service-auth-inbound",
  "handler": {
    "export": "UpstreamAzureAdServiceAuthInboundPolicy",
    "module": "$import(@zuplo/runtime)",
    "options": {
      "activeDirectoryClientId": "20edbb34-13e9-42d0-a63c-1b6a0a20d02d",
      "activeDirectoryClientSecret": "$env(ACTIVE_DIRECTORY_CLIENT_SECRET)",
      "activeDirectoryTenantId": "b8e4141e-31f4-43e3-9a96-f97f3eba1eea",
      "expirationOffsetSeconds": 300,
      "tokenRetries": 3
    }
  }
}
```

<div className="policy-options">
<div><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-configuration">Policy Configuration<a href="#policy-configuration" class="hash-link" aria-label="Direct link to Policy Configuration" title="Direct link to Policy Configuration">​</a></h3><ul><li><code>name</code> <span class="type-option">&lt;string&gt;</span> - The name of your policy instance. This is used as a reference in your routes.</li><li><code>policyType</code> <span class="type-option">&lt;string&gt;</span> - The identifier of the policy. This is used by the Zuplo UI. Value should be <code>upstream-azure-ad-service-auth-inbound</code>.</li><li><code>handler.export</code> <span class="type-option">&lt;string&gt;</span> - The name of the exported type. Value should be <code>UpstreamAzureAdServiceAuthInboundPolicy</code>.</li><li><code>handler.module</code> <span class="type-option">&lt;string&gt;</span> - The module containing the policy. Value should be <code>$import(@zuplo/runtime)</code>.</li><li><code>handler.options</code> <span class="type-option">&lt;object&gt;</span> - The options for this policy. <a href="#policy-options">See Policy Options</a> below.</li></ul><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-options">Policy Options<a href="#policy-options" class="hash-link" aria-label="Direct link to Policy Options" title="Direct link to Policy Options">​</a></h3><p>The options for this policy are specified below. All properties are optional unless specifically marked as required.</p><ul><li><code>activeDirectoryTenantId</code><span class="type-option"> &lt;string&gt;</span><span class="required-option"> (Required)</span> - <div><p>Azure Active Directory Tenant ID.</p></div></li><li><code>activeDirectoryClientId</code><span class="type-option"> &lt;string&gt;</span><span class="required-option"> (Required)</span> - <div><p>The Application (client) ID of the Azure AD App Registration.</p></div></li><li><code>activeDirectoryClientSecret</code><span class="type-option"> &lt;string&gt;</span><span class="required-option"> (Required)</span> - <div><p>The client secret of the Azure AD App Registration.</p></div></li><li><code>tokenRetries</code><span class="type-option"> &lt;number&gt;</span> - <div><p>The number of times to retry fetching the token in the event of a failure..</p></div><span class="default-value"> Defaults to <code>3</code>.</span></li><li><code>expirationOffsetSeconds</code><span class="type-option"> &lt;number&gt;</span> - <div><p>The number of seconds less than the token expiration to cache the token.</p></div><span class="default-value"> Defaults to <code>300</code>.</span></li></ul></div>
</div>

## Using the Policy
<!-- start: doc.md -->

<!-- end: doc.md -->

Read more about [how policies work](/docs/articles/policies)
