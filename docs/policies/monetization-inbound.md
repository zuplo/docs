---
title: Monetization Policy
sidebar_label: Monetization
---

<!-- WARNING: This document is generated. DO NOT EDIT BY HAND -->

# Monetization






<!-- start: intro.md -->
The Monetization policy allows you to track and monetize the usage of our API resources, declaratively and programatically.

<!-- end: intro.md -->

<PolicyStatus isBeta={false} isPaidAddOn={false} />



## Configuration 

The configuration shows how to configure the policy in the 'policies.json' document.

```json title="config/policies.json"
{
  "name": "my-monetization-inbound-policy",
  "policyType": "monetization-inbound",
  "handler": {
    "export": "MonetizationInboundPolicy",
    "module": "$import(@zuplo/runtime)",
    "options": {
      "allowRequestsOverQuota": false,
      "allowedSubscriptionStatuses": [
        "active",
        "incomplete"
      ],
      "meterOnStatusCodes": "200-299",
      "meters": {
        "requests": 2,
        "computeCredits": 5
      }
    }
  }
}
```

<div className="policy-options">
<div><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-configuration">Policy Configuration<a href="#policy-configuration" class="hash-link" aria-label="Direct link to Policy Configuration" title="Direct link to Policy Configuration">​</a></h3><ul><li><code>name</code> <span class="type-option">&lt;string&gt;</span> - The name of your policy instance. This is used as a reference in your routes.</li><li><code>policyType</code> <span class="type-option">&lt;string&gt;</span> - The identifier of the policy. This is used by the Zuplo UI. Value should be <code>monetization-inbound</code>.</li><li><code>handler.export</code> <span class="type-option">&lt;string&gt;</span> - The name of the exported type. Value should be <code>MonetizationInboundPolicy</code>.</li><li><code>handler.module</code> <span class="type-option">&lt;string&gt;</span> - The module containing the policy. Value should be <code>$import(@zuplo/runtime)</code>.</li><li><code>handler.options</code> <span class="type-option">&lt;object&gt;</span> - The options for this policy. <a href="#policy-options">See Policy Options</a> below.</li></ul><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-options">Policy Options<a href="#policy-options" class="hash-link" aria-label="Direct link to Policy Options" title="Direct link to Policy Options">​</a></h3><p>The options for this policy are specified below. All properties are optional unless specifically marked as required.</p><ul><li><code>allowRequestsWithoutSubscription</code><span class="type-option"> &lt;boolean&gt;</span> - <div><p>Indicates if requests without subscription should be allowed or not.</p></div></li><li><code>allowedSubscriptionStatuses</code><span class="type-option"> &lt;string[]&gt;</span> - <div><p>Indicates which subscription statuses should be allowed.</p></div><span class="default-value"> Defaults to <code>active,incomplete,trialing</code>.</span></li><li><code>bucketId</code><span class="type-option"> &lt;string&gt;</span> - <div><p>Indicates the bucket to be used, overrides the default one.</p></div></li><li><code>allowRequestsOverQuota</code><span class="type-option"> &lt;boolean&gt;</span> - <div><p>Indicates if requests over quota should be allowed or not.</p></div></li><li><code>meters</code><span class="type-option"> &lt;object&gt;</span><span class="required-option"> (Required)</span> - <div><p>The meters to be used by the policy against the subscription quota.</p></div></li><li><code>meterOnStatusCodes</code><span class="type-option"> &lt;string | number[]&gt;</span> - <div><p>A list of successful status codes and ranges "200-299, 304" that should trigger a metering call.</p></div><span class="default-value"> Defaults to <code>200-299</code>.</span></li></ul></div>
</div>

## Using the Policy
<!-- start: doc.md -->

<!-- end: doc.md -->

Read more about [how policies work](/docs/articles/policies)
