---
title: Amberflo Metering / Billing Policy
sidebar_label: Amberflo Metering / Billing
---

<!-- WARNING: This document is generated. DO NOT EDIT BY HAND -->

# Amberflo Metering / Billing






<!-- start: intro.md -->
Amberflo [amberflo.com](https://www.amberflo.io) is a usage metering and billing service. This policy allows you to meter API calls going through Zuplo and send them to your Amberflo account using your Amberflo API key.

Add the policy to each route you want to meter. Note you can specify the Meter API Name and Meter Value (meter increment) at the policy level.

<!-- end: intro.md -->

<PolicyStatus isBeta={false} isPaidAddOn={false} />



## Configuration 

The configuration shows how to configure the policy in the 'policies.json' document.

```json title="config/policies.json"
{
  "name": "my-amberflo-metering-inbound-policy",
  "policyType": "amberflo-metering-inbound",
  "handler": {
    "export": "AmberfloMeteringInboundPolicy",
    "module": "$import(@zuplo/runtime)",
    "options": {
      "apiKey": "$env(AMBERFLO_API_KEY)",
      "customerIdPropertyPath": ".sub",
      "meterApiName": "$env(AMBERFLO_METER_API_NAME)",
      "meterValue": "$env(AMBERFLO_METER_VALUE)",
      "statusCodes": "200-299",
      "url": " https://app.amberflo.io/ingest"
    }
  }
}
```

<div className="policy-options">
<div><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-configuration">Policy Configuration<a href="#policy-configuration" class="hash-link" aria-label="Direct link to Policy Configuration" title="Direct link to Policy Configuration">​</a></h3><ul><li><code>name</code> <span class="type-option">&lt;string&gt;</span> - The name of your policy instance. This is used as a reference in your routes.</li><li><code>policyType</code> <span class="type-option">&lt;string&gt;</span> - The identifier of the policy. This is used by the Zuplo UI. Value should be <code>amberflo-metering-inbound</code>.</li><li><code>handler.export</code> <span class="type-option">&lt;string&gt;</span> - The name of the exported type. Value should be <code>AmberfloMeteringInboundPolicy</code>.</li><li><code>handler.module</code> <span class="type-option">&lt;string&gt;</span> - The module containing the policy. Value should be <code>$import(@zuplo/runtime)</code>.</li><li><code>handler.options</code> <span class="type-option">&lt;object&gt;</span> - The options for this policy. <a href="#policy-options">See Policy Options</a> below.</li></ul><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-options">Policy Options<a href="#policy-options" class="hash-link" aria-label="Direct link to Policy Options" title="Direct link to Policy Options">​</a></h3><p>The options for this policy are specified below. All properties are optional unless specifically marked as required.</p><ul><li><code>apiKey</code><span class="type-option"> &lt;string&gt;</span><span class="required-option"> (Required)</span> - <div><p>The API key to use when sending metering calls to Amberflo.</p></div></li><li><code>meterApiName</code><span class="type-option"> &lt;string&gt;</span> - <div><p>The name of the meter to use when sending metering calls to Amberflo (overridable in code).</p></div></li><li><code>meterValue</code><span class="type-option"> &lt;number&gt;</span> - <div><p>The value to use when sending metering calls to Amberflo (overridable in code).</p></div></li><li><code>customerIdPropertyPath</code><span class="type-option"> &lt;string&gt;</span> - <div><p>The path to the property on <code>request.user</code> contains the customer ID. For example <code>.data.accountNumber</code> would read the <code>request.user.data.accountNumber</code> property.</p></div><span class="default-value"> Defaults to <code>.sub</code>.</span></li><li><code>customerId</code><span class="type-option"> &lt;string&gt;</span> - <div><p>The default customerId for all metering calls - overridable in code and by <code>customerIdPropertyPath</code>.</p></div></li><li><code>dimensions</code><span class="type-option"> &lt;object&gt;</span> - <div><p>A dictionary of dimensions to be sent to Amberflo (extensible in code).</p></div></li><li><code>statusCodes</code><span class="type-option"> &lt;string | number[]&gt;</span> - <div><p>A list of successful status codes and ranges "200-299, 304" that should trigger a metering call to Amberflo.</p></div><span class="default-value"> Defaults to <code>200-299</code>.</span></li><li><code>url</code><span class="type-option"> &lt;string&gt;</span> - <div><p>The URL to send metering events. This is useful for testing purposes.</p></div><span class="default-value"> Defaults to <code> https://app.amberflo.io/ingest</code>.</span></li></ul></div>
</div>

## Using the Policy
<!-- start: doc.md -->
You can set the customerId globally (not recommended) by setting it at the
policy level or use the `customerIdPropertyPath` to read the customerId from the
user object on each request. For example, if you're using API Key auth or JWT
auth and want to use the `sub` property as the customerId, you would set the
value as follows

`"customerIdPropertyPath" : ".sub"`

You can also dive into the properties of the metadata. Imagine the
`request.user` property is as follows (either based on contents of a JWT token
or API Key metadata)

```json
{
  "sub": "bobby-tables",
  "data": {
    "email": "bob@example.com",
    "name": "Bobby Tables",
    "accountNumber": 1233423,
    "roles": ["admin"]
  }
}
```

You could access the `accountNumber` property as follows. Note the required
preceding `'.'`.

`"customerIdPropertyPath" : ".data.accountNumber"`

You can also set many of the properties of the meter payload programmatically,
either in a custom policy or handler. Here is some example code in a custom
inbound policy:

```ts
import {
  AmberfloMeteringPolicy,
  ZuploContext,
  ZuploRequest,
} from "@zuplo/runtime";

export default async function (
  request: ZuploRequest,
  context: ZuploContext,
  options: MyPolicyOptionsType,
  policyName: string
) {
  AmberfloMeteringPolicy.setRequestProperties(context, {
    customerId: request.user.sub,
    meterApiName: request.params.color,
  });

  return request;
}
```

<!-- end: doc.md -->

Read more about [how policies work](/docs/articles/policies)
