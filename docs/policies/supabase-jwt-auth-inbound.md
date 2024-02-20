---
title: Supabase JWT Auth Policy
sidebar_label: Supabase JWT Auth
---

<!-- WARNING: This document is generated. DO NOT EDIT BY HAND -->

# Supabase JWT Auth






<!-- start: intro.md -->
The Supabase JWT Authentication policy allows you to authenticate incoming requests using a token created by [supabase.com](https://supabase.com).

When configured, you can have Zuplo check incoming requests for a JWT token and automatically populate the `ZuploRequest`'s `user` property with a user object.

This `user` object will have a `sub` property - taking the `sub` id from the JWT token. It will also have a `data` property populated by other data returned in the JWT token - including all your claims, `user_metadata` and `app_metadata`.

You can also require specific claims to have specific values to allow authentication to complete, providing a layer of authorization.

<!-- end: intro.md -->

<PolicyStatus isBeta={false} isPaidAddOn={false} />



## Configuration 

The configuration shows how to configure the policy in the 'policies.json' document.

```json title="config/policies.json"
{
  "name": "my-supabase-jwt-auth-inbound-policy",
  "policyType": "supabase-jwt-auth-inbound",
  "handler": {
    "export": "SupabaseJwtInboundPolicy",
    "module": "$import(@zuplo/runtime)",
    "options": {
      "allowUnauthenticatedRequests": false,
      "requiredClaims": {
        "claim_1": [
          "valid_value_1",
          "valid_value_2"
        ]
      },
      "secret": "$env(SUPABASE_JWT_SECRET)"
    }
  }
}
```

<div className="policy-options">
<div><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-configuration">Policy Configuration<a href="#policy-configuration" class="hash-link" aria-label="Direct link to Policy Configuration" title="Direct link to Policy Configuration">​</a></h3><ul><li><code>name</code> <span class="type-option">&lt;string&gt;</span> - The name of your policy instance. This is used as a reference in your routes.</li><li><code>policyType</code> <span class="type-option">&lt;string&gt;</span> - The identifier of the policy. This is used by the Zuplo UI. Value should be <code>supabase-jwt-auth-inbound</code>.</li><li><code>handler.export</code> <span class="type-option">&lt;string&gt;</span> - The name of the exported type. Value should be <code>SupabaseJwtInboundPolicy</code>.</li><li><code>handler.module</code> <span class="type-option">&lt;string&gt;</span> - The module containing the policy. Value should be <code>$import(@zuplo/runtime)</code>.</li><li><code>handler.options</code> <span class="type-option">&lt;object&gt;</span> - The options for this policy. <a href="#policy-options">See Policy Options</a> below.</li></ul><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-options">Policy Options<a href="#policy-options" class="hash-link" aria-label="Direct link to Policy Options" title="Direct link to Policy Options">​</a></h3><p>The options for this policy are specified below. All properties are optional unless specifically marked as required.</p><ul><li><code>secret</code><span class="type-option"> &lt;string&gt;</span><span class="required-option"> (Required)</span> - <div><p>The key used to verify the signature of the JWT token.</p></div></li><li><code>allowUnauthenticatedRequests</code><span class="type-option"> &lt;boolean&gt;</span> - <div><p>Indicates whether the request should continue if authentication fails. Default is <code>false</code> which means unauthenticated users will automatically receive a 401 response.</p></div></li><li><code>requiredClaims</code><span class="type-option"> &lt;object&gt;</span> - <div><p>Any claims that must be present for authentication to succeed - multiple valid values can be specified for each claim.</p></div></li></ul></div>
</div>

## Using the Policy
<!-- start: doc.md -->
## Authorization

You can also require certain claims to be valid by specifying this in the
options. For example, if you require the claim `user_role` to be either `admin`
or `supa_user`, you would configure the policy as follows:

```json
{
  "export": "SupabaseJwtInboundPolicy",
  "module": "$import(@zuplo/runtime)",
  "options": {
    "secret": "$env(SUPABASE_JWT_SECRET)",
    "allowUnauthenticatedRequests": false,
    "requiredClaims": {
      "user_role": ["admin", "supa_user"]
    }
  }
}
```

<!-- end: doc.md -->

Read more about [how policies work](/docs/articles/policies)
