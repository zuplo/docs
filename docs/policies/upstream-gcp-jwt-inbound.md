---
title: Upstream GCP Self-Signed JWT Policy
sidebar_label: Upstream GCP Self-Signed JWT
---

<!-- WARNING: This document is generated. DO NOT EDIT BY HAND -->

# Upstream GCP Self-Signed JWT






<!-- start: intro.md -->
This policy adds a JWT token to the headers, ready for us in an outgoing request when calling a GCP service (e.g. Cloud Endpoints / ESPv2). We recommend reading the `serviceAccountJson` from environment variables (so it is not checked in to source control) using the `$env(ENV_VAR)` syntax.

CAUTION: This policy only works with [certain Google APIs](https://developers.google.com/identity/protocols/oauth2/service-account#jwt-auth). In most cases, the [Upstream GCP Service Auth](https://zuplo.com/docs/policies/upstream-gcp-service-auth-inbound) should be used.

<!-- end: intro.md -->

<PolicyStatus isBeta={false} isPaidAddOn={false} />



## Configuration 

The configuration shows how to configure the policy in the 'policies.json' document.

```json title="config/policies.json"
{
  "name": "my-upstream-gcp-jwt-inbound-policy",
  "policyType": "upstream-gcp-jwt-inbound",
  "handler": {
    "export": "UpstreamGcpJwtInboundPolicy",
    "module": "$import(@zuplo/runtime)",
    "options": {
      "audience": "your_gcp_service.endpoint.com",
      "serviceAccountJson": "$env(SERVICE_ACCOUNT_JSON)"
    }
  }
}
```

<div className="policy-options">
<div><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-configuration">Policy Configuration<a href="#policy-configuration" class="hash-link" aria-label="Direct link to Policy Configuration" title="Direct link to Policy Configuration">​</a></h3><ul><li><code>name</code> <span class="type-option">&lt;string&gt;</span> - The name of your policy instance. This is used as a reference in your routes.</li><li><code>policyType</code> <span class="type-option">&lt;string&gt;</span> - The identifier of the policy. This is used by the Zuplo UI. Value should be <code>upstream-gcp-jwt-inbound</code>.</li><li><code>handler.export</code> <span class="type-option">&lt;string&gt;</span> - The name of the exported type. Value should be <code>UpstreamGcpJwtInboundPolicy</code>.</li><li><code>handler.module</code> <span class="type-option">&lt;string&gt;</span> - The module containing the policy. Value should be <code>$import(@zuplo/runtime)</code>.</li><li><code>handler.options</code> <span class="type-option">&lt;object&gt;</span> - The options for this policy. <a href="#policy-options">See Policy Options</a> below.</li></ul><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-options">Policy Options<a href="#policy-options" class="hash-link" aria-label="Direct link to Policy Options" title="Direct link to Policy Options">​</a></h3><p>The options for this policy are specified below. All properties are optional unless specifically marked as required.</p><ul><li><code>audience</code><span class="type-option"> &lt;string&gt;</span><span class="required-option"> (Required)</span> - <div><p>The audience for the minted JWT. See the document <a href="https://cloud.google.com/endpoints/docs/grpc-service-config/reference/rpc/google.api#google.api.AuthRequirement">AuthRequirement</a> for details.</p></div></li><li><code>serviceAccountJson</code><span class="type-option"> &lt;string&gt;</span><span class="required-option"> (Required)</span> - <div><p>The Google Service Account key in JSON format. Note you can load this from environment variables using the $env(ENV_VAR) syntax.</p></div></li></ul></div>
</div>

## Using the Policy
<!-- start: doc.md -->

<!-- end: doc.md -->

Read more about [how policies work](/docs/articles/policies)
