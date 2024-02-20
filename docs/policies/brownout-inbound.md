---
title: Brown Out Policy
sidebar_label: Brown Out
---

<!-- WARNING: This document is generated. DO NOT EDIT BY HAND -->

# Brown Out






<!-- start: intro.md -->
The brownout policy allows performing scheduled downtime on your API. This can be useful for helping notify clients of an impending deprecation or for scheduling maintenance.

This policy uses [cron schedules](https://crontab.guru) to check if a request should experience a brownout or not. When a request falls into a scheduled brownout an error response will be return. The error response can be customized by setting the `problem` properties.

For more information using brownouts to alert clients on impending API changes/deprecations see our blog post [How to version an API](https://zuplo.com/blog/2022/05/17/how-to-version-an-api)

<!-- end: intro.md -->

<PolicyStatus isBeta={false} isPaidAddOn={true} />



## Configuration 

The configuration shows how to configure the policy in the 'policies.json' document.

```json title="config/policies.json"
{
  "name": "my-brownout-inbound-policy",
  "policyType": "brownout-inbound",
  "handler": {
    "export": "BrownOutInboundPolicy",
    "module": "$import(@zuplo/runtime)",
    "options": {
      "problem": {
        "detail": "This is a temporary brownout to alert of an upcoming deprecation.",
        "status": "400",
        "title": "Deprecation Test",
        "type": "https://example.com/problems/deprecation-announcement"
      }
    }
  }
}
```

<div className="policy-options">
<div><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-configuration">Policy Configuration<a href="#policy-configuration" class="hash-link" aria-label="Direct link to Policy Configuration" title="Direct link to Policy Configuration">​</a></h3><ul><li><code>name</code> <span class="type-option">&lt;string&gt;</span> - The name of your policy instance. This is used as a reference in your routes.</li><li><code>policyType</code> <span class="type-option">&lt;string&gt;</span> - The identifier of the policy. This is used by the Zuplo UI. Value should be <code>brownout-inbound</code>.</li><li><code>handler.export</code> <span class="type-option">&lt;string&gt;</span> - The name of the exported type. Value should be <code>BrownOutInboundPolicy</code>.</li><li><code>handler.module</code> <span class="type-option">&lt;string&gt;</span> - The module containing the policy. Value should be <code>$import(@zuplo/runtime)</code>.</li><li><code>handler.options</code> <span class="type-option">&lt;object&gt;</span> - The options for this policy. <a href="#policy-options">See Policy Options</a> below.</li></ul><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-options">Policy Options<a href="#policy-options" class="hash-link" aria-label="Direct link to Policy Options" title="Direct link to Policy Options">​</a></h3><p>The options for this policy are specified below. All properties are optional unless specifically marked as required.</p><ul><li><code>cronSchedule</code><span class="type-option"> &lt;string | array&gt;</span><span class="required-option"> (Required)</span> - <div><p>The cron schedule for when this policy is enabled. This can be a single cron string or an array of multiple cron strings.</p></div></li><li><code>problem</code><span class="type-option"> &lt;object&gt;</span> - <div><p>The problem that is returned in the response body when this policy is enabled.</p></div><ul><li><code>type</code><span class="type-option"> &lt;string&gt;</span> - <div><p>The type of problem.</p></div></li><li><code>title</code><span class="type-option"> &lt;string&gt;</span> - <div><p>The title of problem.</p></div></li><li><code>detail</code><span class="type-option"> &lt;string&gt;</span> - <div><p>The detail of problem.</p></div></li><li><code>status</code><span class="type-option"> &lt;number&gt;</span> - <div><p>Http status code of the problem.</p></div></li></ul></li></ul></div>
</div>

## Using the Policy
<!-- start: doc.md -->

<!-- end: doc.md -->

Read more about [how policies work](/docs/articles/policies)
