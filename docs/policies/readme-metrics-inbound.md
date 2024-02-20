---
title: Readme Metrics Policy
sidebar_label: Readme Metrics
---

<!-- WARNING: This document is generated. DO NOT EDIT BY HAND -->

# Readme Metrics






<!-- start: intro.md -->
[Readme](https://readme.com) is a developer Documentation and metrics service. This policy pushes the request/response data to their ingestion endpoint so you can see your Zuplo API traffic in their API calls dashboard.

<!-- end: intro.md -->

<PolicyStatus isBeta={false} isPaidAddOn={false} />



## Configuration 

The configuration shows how to configure the policy in the 'policies.json' document.

```json title="config/policies.json"
{
  "name": "my-readme-metrics-inbound-policy",
  "policyType": "readme-metrics-inbound",
  "handler": {
    "export": "ReadmeMetricsInboundPolicy",
    "module": "$import(@zuplo/runtime)",
    "options": {
      "apiKey": "$env(README_API_KEY)",
      "url": "https://metrics.readme.io/request",
      "useFullRequestPath": false,
      "userEmailPropertyPath": ""
    }
  }
}
```

<div className="policy-options">
<div><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-configuration">Policy Configuration<a href="#policy-configuration" class="hash-link" aria-label="Direct link to Policy Configuration" title="Direct link to Policy Configuration">​</a></h3><ul><li><code>name</code> <span class="type-option">&lt;string&gt;</span> - The name of your policy instance. This is used as a reference in your routes.</li><li><code>policyType</code> <span class="type-option">&lt;string&gt;</span> - The identifier of the policy. This is used by the Zuplo UI. Value should be <code>readme-metrics-inbound</code>.</li><li><code>handler.export</code> <span class="type-option">&lt;string&gt;</span> - The name of the exported type. Value should be <code>ReadmeMetricsInboundPolicy</code>.</li><li><code>handler.module</code> <span class="type-option">&lt;string&gt;</span> - The module containing the policy. Value should be <code>$import(@zuplo/runtime)</code>.</li><li><code>handler.options</code> <span class="type-option">&lt;object&gt;</span> - The options for this policy. <a href="#policy-options">See Policy Options</a> below.</li></ul><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-options">Policy Options<a href="#policy-options" class="hash-link" aria-label="Direct link to Policy Options" title="Direct link to Policy Options">​</a></h3><p>The options for this policy are specified below. All properties are optional unless specifically marked as required.</p><ul><li><code>apiKey</code><span class="type-option"> &lt;string&gt;</span><span class="required-option"> (Required)</span> - <div><p>The API key to use when sending metrics calls to Readme.</p></div></li><li><code>userLabelPropertyPath</code><span class="type-option"> &lt;string&gt;</span> - <div><p>This is the path to the property on <code>request.user</code> that contains the label you want to use. For example <code>.data.accountNumber</code> would read the <code>request.user.data.accountNumber</code> property.</p></div><span class="default-value"> Defaults to <code>.sub</code>.</span></li><li><code>userEmailPropertyPath</code><span class="type-option"> &lt;string&gt;</span> - <div><p>This is the path to the property on <code>request.user</code> that contains the e-mail of the user. For example <code>.data.email</code> would read the <code>request.user.data.email</code> property.</p></div></li><li><code>development</code><span class="type-option"> &lt;boolean&gt;</span> - <div><p>Whether the data should be ingested as 'development' mode or not. Defaults to true for working-copy and false for all other environments.</p></div></li><li><code>useFullRequestPath</code><span class="type-option"> &lt;boolean&gt;</span> - <div><p>When true, Zuplo sends the full request path (which might contain sensitive information). By default, we only send the route path which should not contain sensitive information.</p></div></li><li><code>url</code><span class="type-option"> &lt;string&gt;</span> - <div><p>The URL to send metering events. This is useful for testing purposes.</p></div><span class="default-value"> Defaults to <code>https://metrics.readme.io/request</code>.</span></li></ul></div>
</div>

## Using the Policy
<!-- start: doc.md -->
![Readme API Calls Dashboard](https://cdn.zuplo.com/assets/071b2ead-7769-413b-a66a-133ae6fd755d.png)

<!-- end: doc.md -->

Read more about [how policies work](/docs/articles/policies)
