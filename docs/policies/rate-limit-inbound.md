---
title: Rate Limiting Policy
sidebar_label: Rate Limiting
---

<!-- WARNING: This document is generated. DO NOT EDIT BY HAND -->

# Rate Limiting






<!-- start: intro.md -->
Rate-limiting allows you to set a maximum rate of requests for your API gateway. This is useful to enforce rate limits agreed with your clients and protect your downstream services.

The Zuplo Rate-Limit allows you to limit based on different attributes of the incoming request. For example, you might set a rate limit of 10 requests per second per user, or 20 requests per second for a given IP address.

The Zuplo rate-limiter also allows you to set a custom bucket name by which to effect a rate-limit using a function.

When a client reaches a rate limit - they will receive a `429` response code.

<!-- end: intro.md -->

<PolicyStatus isBeta={false} isPaidAddOn={false} />



## Configuration 

The configuration shows how to configure the policy in the 'policies.json' document.

```json title="config/policies.json"
{
  "name": "my-rate-limit-inbound-policy",
  "policyType": "rate-limit-inbound",
  "handler": {
    "export": "RateLimitInboundPolicy",
    "module": "$import(@zuplo/runtime)",
    "options": {
      "rateLimitBy": "ip",
      "requestsAllowed": 2,
      "timeWindowMinutes": 1
    }
  }
}
```

<div className="policy-options">
<div><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-configuration">Policy Configuration<a href="#policy-configuration" class="hash-link" aria-label="Direct link to Policy Configuration" title="Direct link to Policy Configuration">​</a></h3><ul><li><code>name</code> <span class="type-option">&lt;string&gt;</span> - The name of your policy instance. This is used as a reference in your routes.</li><li><code>policyType</code> <span class="type-option">&lt;string&gt;</span> - The identifier of the policy. This is used by the Zuplo UI. Value should be <code>rate-limit-inbound</code>.</li><li><code>handler.export</code> <span class="type-option">&lt;string&gt;</span> - The name of the exported type. Value should be <code>RateLimitInboundPolicy</code>.</li><li><code>handler.module</code> <span class="type-option">&lt;string&gt;</span> - The module containing the policy. Value should be <code>$import(@zuplo/runtime)</code>.</li><li><code>handler.options</code> <span class="type-option">&lt;object&gt;</span> - The options for this policy. <a href="#policy-options">See Policy Options</a> below.</li></ul><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-options">Policy Options<a href="#policy-options" class="hash-link" aria-label="Direct link to Policy Options" title="Direct link to Policy Options">​</a></h3><p>The options for this policy are specified below. All properties are optional unless specifically marked as required.</p><ul><li><code>rateLimitBy</code><span class="type-option"> &lt;string&gt;</span><span class="required-option"> (Required)</span> - <div><p>The identifying element of the request that enforces distinct rate limits. For example, you can limit by <code>user</code>, <code>ip</code>, <code>function</code> or <code>all</code> - function allows you to specify a simple function to create a string identifier to create a rate-limit group.</p></div><span class="allow-values"> Allowed values are <span><code>user</code>, </span><span><code>ip</code>, </span><span><code>function</code>, </span><span>and <code>all</code></span>.</span><span class="default-value"> Defaults to <code>user</code>.</span></li><li><code>requestsAllowed</code><span class="type-option"> &lt;integer&gt;</span><span class="required-option"> (Required)</span> - <div><p>The max number of requests allowed in the given time window.</p></div><span class="default-value"> Defaults to <code>1000</code>.</span></li><li><code>timeWindowMinutes</code><span class="type-option"> &lt;integer&gt;</span><span class="required-option"> (Required)</span> - <div><p>The time window in which the requests are rate-limited. The count restarts after each window expires.</p></div><span class="default-value"> Defaults to <code>60</code>.</span></li><li><code>identifier</code><span class="type-option"> &lt;object&gt;</span> - <div><p>The function that returns dynamic configuration data. Used only with <code>rateLimitBy=function</code>.</p></div><ul><li><code>export</code><span class="type-option"> &lt;string&gt;</span><span class="required-option"> (Required)</span> - <div><p>used only with rateLimitBy=function. Specifies the export to load your custom bucket function, e.g. <code>default</code>, <code>rateLimitIdentifier</code>.</p></div><span class="default-value"> Defaults to <code>$import(./modules/my-module)</code>.</span></li><li><code>module</code><span class="type-option"> &lt;string&gt;</span><span class="required-option"> (Required)</span> - <div><p>Specifies the module to load your custom bucket function, in the format <code>$import(./modules/my-module)</code>.</p></div></li></ul></li><li><code>headerMode</code><span class="type-option"> &lt;string&gt;</span> - <div><p>Adds the retry-after header.</p></div><span class="allow-values"> Allowed values are <span><code>none</code>, </span><span>and <code>retry-after</code></span>.</span><span class="default-value"> Defaults to <code>retry-after</code>.</span></li><li><code>throwOnFailure</code><span class="type-option"> &lt;boolean&gt;</span> - <div><p>If true, the policy will throw an error in the event there is a problem connecting to the rate limit service.</p></div></li><li><code>mode</code><span class="type-option"> &lt;string&gt;</span> - <div><p>The mode of the policy. If set to <code>async</code>, the policy will check if the request is over the rate limit without blocking. This can result in some requests allowed over the rate limit.</p></div><span class="allow-values"> Allowed values are <span><code>strict</code>, </span><span>and <code>async</code></span>.</span><span class="default-value"> Defaults to <code>strict</code>.</span></li></ul></div>
</div>

## Using the Policy
<!-- start: doc.md -->
:::tip

Note you can have multiple instances of rate-limiting policies to use in
combination. You should apply the longest duration timeWindow first, in order to
the shortest duration time window.

:::

## Using a custom function

You can create a rate-limit bucket based on any property of a request using a
custom function that returns a `CustomRateLimitDetails` object (which provides
the identifier used by the limiting system).

The `CustomRateLimitDetails` object can be used to override the
`timeWindowMinutes` & `requestsAllowed` options.

This example would create a unique rate-limiting function based on the
`customerId` parameter in routes (note it’s important that a policy like this is
applied to a route that has a `/:customerId` parameter).

```ts
//module - ./modules/rate-limiter.ts

import { CustomRateLimitDetails, ZuploRequest } from "@zuplo/runtime";

export function rateLimitKey(
  request: ZuploRequest,
  context: ZuploContext,
  policyName: string
): CustomRateLimitDetails {
  context.log.info(
    `processing customerId '${request.params.customerId}' for rate-limit policy '${policyName}'`
  );
  if (request.params.customerId === "43567890") {
    // Override timeWindowMinutes & requestsAllowed
    return {
      key: request.params.customerId,
      requestsAllowed: 100,
      timeWindowMinutes: 1,
    };
  }
}
```

```json
// config - ./config/policies.json
"export": "RateLimitInboundPolicy",
"module": "$import(@zuplo/runtime)",
"options": {
  "rateLimitBy": "function",
  "requestsAllowed": 2,
  "timeWindowMinutes": 1,
  "identifier": {
    "module": "$import(./modules/rate-limiter)",
    "export": "rateLimitKey"
  }
}
```

<!-- end: doc.md -->

Read more about [how policies work](/docs/articles/policies)
