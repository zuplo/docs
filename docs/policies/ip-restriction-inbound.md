---
title: IP Restriction Policy
sidebar_label: IP Restriction
---

<!-- WARNING: This document is generated. DO NOT EDIT BY HAND -->

# IP Restriction

<CustomPolicyNotice name="IP Restriction" id="ip-restriction-inbound" />




<!-- start: intro.md -->
This custom policy allows you to specify a set of IP addresses that are allowed
or blocked from making requests on your API. This can be useful for adding
light-weight security to your API in non-critical scenarios. For example, if you
want to ensure only employees on your corporate VPN cannot access development
environments.

Generally, this policy should not be relied upon as the only security for
protecting sensitive workloads.

<!-- end: intro.md -->

<PolicyStatus isBeta={false} isPaidAddOn={false} />


## Example Custom Policy

The code below is an example of how this custom policy module could be implemented.

```ts title="modules/ip-restriction-inbound.ts"
import { HttpProblems, ZuploContext, ZuploRequest } from "@zuplo/runtime";
import ipRangeCheck from "ip-range-check";

interface PolicyOptions {
  allowedIpAddresses?: string[];
  blockedIpAddresses?: string[];
}

export default async function (
  request: ZuploRequest,
  context: ZuploContext,
  options: PolicyOptions,
  policyName: string,
) {
  // TODO: Validate the policy options. Skipping in the example for brevity

  // Get the incoming IP address
  const ip = request.headers.get("true-client-ip");

  // If the allowed IP addresses are set, then the incoming IP
  // must be in that list
  if (options.allowedIpAddresses) {
    const allowed = ipRangeCheck(ip, options.allowedIpAddresses);
    if (!allowed) {
      return HttpProblems.unauthorized(request, context);
    }
  }

  // If the blocked IP addresses are set, then the incoming IP
  // cannot be in that list
  if (options.blockedIpAddresses) {
    const blocked = ipRangeCheck(ip, options.allowedIpAddresses);
    if (blocked) {
      return HttpProblems.unauthorized(request, context);
    }
  }

  // If we made it this far, the IP address is allowed, continue
  return request;
}

```

## Configuration 

The example below shows how to configure a custom code policy in the 'policies.json' document that utilizes the above example policy code.

```json title="config/policies.json"
{
  "name": "my-ip-restriction-inbound-policy",
  "policyType": "ip-restriction-inbound",
  "handler": {
    "export": "default",
    "module": "$import(./modules/YOUR_MODULE)",
    "options": {
      "allowedIpAddresses": [
        "184.42.1.4",
        "102.1.5.2/24"
      ]
    }
  }
}
```

<div className="policy-options">
<div><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-configuration">Policy Configuration<a href="#policy-configuration" class="hash-link" aria-label="Direct link to Policy Configuration" title="Direct link to Policy Configuration">​</a></h3><ul><li><code>name</code> <span class="type-option">&lt;string&gt;</span> - The name of your policy instance. This is used as a reference in your routes.</li><li><code>policyType</code> <span class="type-option">&lt;string&gt;</span> - The identifier of the policy. This is used by the Zuplo UI. Value should be <code>ip-restriction-inbound</code>.</li><li><code>handler.export</code> <span class="type-option">&lt;string&gt;</span> - The name of the exported type. Value should be <code>default</code>.</li><li><code>handler.module</code> <span class="type-option">&lt;string&gt;</span> - The module containing the policy. Value should be <code>$import(./modules/YOUR_MODULE)</code>.</li><li><code>handler.options</code> <span class="type-option">&lt;object&gt;</span> - The options for this policy. <a href="#policy-options">See Policy Options</a> below.</li></ul><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-options">Policy Options<a href="#policy-options" class="hash-link" aria-label="Direct link to Policy Options" title="Direct link to Policy Options">​</a></h3><p>The options for this policy are specified below. All properties are optional unless specifically marked as required.</p><ul><li><code>allowedIpAddresses</code><span class="type-option"> &lt;string[]&gt;</span> - <div><p>The IP addresses or CIDR ranges to allow</p></div></li><li><code>blockedIpAddresses</code><span class="type-option"> &lt;string[]&gt;</span> - <div><p>The IP addresses or CIDR ranges to allow</p></div></li></ul></div>
</div>

## Using the Policy
<!-- start: doc.md -->

<!-- end: doc.md -->

Read more about [how policies work](/docs/articles/policies)
