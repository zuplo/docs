---
title: Moesif Analytics & Billing Policy
sidebar_label: Moesif Analytics & Billing
---

<!-- WARNING: This document is generated. DO NOT EDIT BY HAND -->

# Moesif Analytics & Billing






<!-- start: intro.md -->
Moesif [moesif.com](https://moesif.com) is an API analytics and monetization platform. This policy allows you to measure (and meter) API calls flowing through your Zuplo gateway.

Add the policy to each route you want to meter. Note you can specify the Meter API Name and Meter Value (meter increment) at the policy level.

<!-- end: intro.md -->

<PolicyStatus isBeta={false} isPaidAddOn={false} />



## Configuration 

The configuration shows how to configure the policy in the 'policies.json' document.

```json title="config/policies.json"
{
  "name": "my-moesif-inbound-policy",
  "policyType": "moesif-inbound",
  "handler": {
    "export": "MoesifInboundPolicy",
    "module": "$import(@zuplo/runtime)",
    "options": {
      "applicationId": "$env(MOESIF_APPLICATION_ID)",
      "logRequestBody": true,
      "logResponseBody": true
    }
  }
}
```

<div className="policy-options">
<div><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-configuration">Policy Configuration<a href="#policy-configuration" class="hash-link" aria-label="Direct link to Policy Configuration" title="Direct link to Policy Configuration">​</a></h3><ul><li><code>name</code> <span class="type-option">&lt;string&gt;</span> - The name of your policy instance. This is used as a reference in your routes.</li><li><code>policyType</code> <span class="type-option">&lt;string&gt;</span> - The identifier of the policy. This is used by the Zuplo UI. Value should be <code>moesif-inbound</code>.</li><li><code>handler.export</code> <span class="type-option">&lt;string&gt;</span> - The name of the exported type. Value should be <code>MoesifInboundPolicy</code>.</li><li><code>handler.module</code> <span class="type-option">&lt;string&gt;</span> - The module containing the policy. Value should be <code>$import(@zuplo/runtime)</code>.</li><li><code>handler.options</code> <span class="type-option">&lt;object&gt;</span> - The options for this policy. <a href="#policy-options">See Policy Options</a> below.</li></ul><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-options">Policy Options<a href="#policy-options" class="hash-link" aria-label="Direct link to Policy Options" title="Direct link to Policy Options">​</a></h3><p>The options for this policy are specified below. All properties are optional unless specifically marked as required.</p><ul><li><code>applicationId</code><span class="type-option"> &lt;string&gt;</span><span class="required-option"> (Required)</span> - <div><p>Your Moesif application ID.</p></div></li><li><code>logRequestBody</code><span class="type-option"> &lt;boolean&gt;</span> - <div><p>Set to false to disable sending the request body to Moesif.</p></div><span class="default-value"> Defaults to <code>true</code>.</span></li><li><code>logResponseBody</code><span class="type-option"> &lt;boolean&gt;</span> - <div><p>Set to false to disable sending the response body to Moesif.</p></div><span class="default-value"> Defaults to <code>true</code>.</span></li></ul></div>
</div>

## Using the Policy
<!-- start: doc.md -->
By default, Zuplo will read the `request.user.sub` property and assign this as
the moesif `user_id` attribute when sending to Moesif. However, this and the
following attributes can be overriden in a
[custom code policy](/docs/policies/custom-code-inbound).

- `api_version`
- `company_id`
- `session_token`
- `user_id`
- `metadata`

Here is some example code that shows how to override two of these attributes

```ts
setMoesifContext(context, {
  userId: "user-1234",
  metadata: {
    some: "arbitrary",
    meta: "data",
  },
});
```

## Execute on every route

If you want to execute this policy on every route, you can add a hook in your
[runtime extensions](/docs/articles/runtime-extensions) file `zuplo.runtime.ts`:

```ts
import { RuntimeExtensions } from "@zuplo/runtime";

export function runtimeInit(runtime: RuntimeExtensions) {
  runtime.addRequestHook((request, context) => {
    return context.invokeInboundPolicy("moesif-inbound", request);
  });
}
```

Note you can add a guard clause around the context.invokeInboundPolicy if you
want to exclude a few routes.

<!-- end: doc.md -->

Read more about [how policies work](/docs/articles/policies)
