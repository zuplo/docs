---
title: Audit Logs Policy
sidebar_label: Audit Logs
---

<!-- WARNING: This document is generated. DO NOT EDIT BY HAND -->

# Audit Logs






<!-- start: intro.md -->
Audit logging is an important part of API security that plays a critical role in detecting and correcting issues such as unauthorized access or permission elevations within your system. Audit logging is also a requirement for many compliance certifications as well as part of the buying criteria for larger enterprises.

Adding Audit Logging to your APIs that are secured with Zuplo is as easy as adding a policy. Typically you want to add audit logs to any API that modifies data, however depending on the API you may want it on read operations as well (i.e. retrieve a secret key, etc.)

<!-- end: intro.md -->

<PolicyStatus isBeta={false} isPaidAddOn={true} />



## Configuration 

The configuration shows how to configure the policy in the 'policies.json' document.

```json title="config/policies.json"
{
  "name": "my-audit-log-inbound-policy",
  "policyType": "audit-log-inbound",
  "handler": {
    "export": "AuditLogsInboundPolicy",
    "module": "$import(@zuplo/runtime)",
    "options": {
      "logGeolocation": true,
      "logIpAddress": true,
      "logQueryParameters": true,
      "logRouteParameters": true,
      "logUser": true
    }
  }
}
```

<div className="policy-options">
<div><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-configuration">Policy Configuration<a href="#policy-configuration" class="hash-link" aria-label="Direct link to Policy Configuration" title="Direct link to Policy Configuration">​</a></h3><ul><li><code>name</code> <span class="type-option">&lt;string&gt;</span> - The name of your policy instance. This is used as a reference in your routes.</li><li><code>policyType</code> <span class="type-option">&lt;string&gt;</span> - The identifier of the policy. This is used by the Zuplo UI. Value should be <code>audit-log-inbound</code>.</li><li><code>handler.export</code> <span class="type-option">&lt;string&gt;</span> - The name of the exported type. Value should be <code>AuditLogsInboundPolicy</code>.</li><li><code>handler.module</code> <span class="type-option">&lt;string&gt;</span> - The module containing the policy. Value should be <code>$import(@zuplo/runtime)</code>.</li><li><code>handler.options</code> <span class="type-option">&lt;object&gt;</span> - The options for this policy. <a href="#policy-options">See Policy Options</a> below.</li></ul><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-options">Policy Options<a href="#policy-options" class="hash-link" aria-label="Direct link to Policy Options" title="Direct link to Policy Options">​</a></h3><p>The options for this policy are specified below. All properties are optional unless specifically marked as required.</p><ul><li><code>logIpAddress</code> - <div><p>if the IP address should be logged.</p></div><span class="default-value"> Defaults to <code>true</code>.</span></li><li><code>logUser</code> - <div><p>if the user's <code>sub</code> should be logged.</p></div><span class="default-value"> Defaults to <code>true</code>.</span></li><li><code>logGeolocation</code> - <div><p>if the geolocation information should be logged (i.e. state, country, longitude, latitude, etc.).</p></div><span class="default-value"> Defaults to <code>true</code>.</span></li><li><code>logQueryParameters</code> - <div><p>log the values of query parameters.</p></div><span class="default-value"> Defaults to <code>true</code>.</span></li><li><code>logRouteParameters</code> - <div><p>The parameters in the route to log.</p></div><span class="default-value"> Defaults to <code>true</code>.</span></li><li><code>tenant</code> - <div><p>if the route parameters should be logged (i.e. the value of <code>customerId</code> in the route <code>/customers/:customerId</code>).</p></div></li><li><code>metadata</code> - <div><p>A function to add additional data to the audit logs.</p></div></li></ul></div>
</div>

## Using the Policy
<!-- start: doc.md -->
## Adding Custom Metadata

You can add any additional data to the audit logs with a custom function.

:::note

Custom metadata functions cannot be asynchronous. Due to the frequency of their
calls, asynchronous functions will add significant latency to your API.

:::

```ts
//module - ./modules/audit-logs.ts

import { ZuploRequest } from "@zuplo/runtime";

export function auditLogMetadata(request: ZuploRequest): any {
  const metadata = {
    accountId: request.user.data.account,
    customTraceId: request.headers.get("custom-trace-id"),
  };
  return metadata;
}
```

## Log Data

The structure of an audit log is shown below.

```json
{
  "route": "/customers/:customerId",
  "method": "GET",
  "query": {
    "a": 1,
    "b": 2
  },
  "params": {
    "customerId": "12345"
  },
  "headers": {
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.41 Safari/537.36"
  },
  "user": {
    "sub": "user|12356"
  },
  "geolocation": {
    "country": "US",
    "city": "Seattle",
    "continent": "NA",
    "latitude": "1.123",
    "longitude": "4.567",
    "postalCode": "29700",
    "metroCode": "100",
    "region": "Washington",
    "timezone": "America/LosAngeles"
  },
  "metadata": {
    // Custom data
  }
}
```

## Audit Logs in the Portal

Audit logs are not currently surfaced in the Zuplo portal, but the feature is
planned soon.

## Audit Log API

Audit logs can be retrieved using the Zuplo Management API. Logs can be
retrieved by time span and can be filtered by `tenant`.

```http
GET /deployments/:deploymentId/auditlogs?tenant=TENANT
content-type: application/json
authorization: Bearer YOUR_TOKEN
```

<!-- end: doc.md -->

Read more about [how policies work](/docs/articles/policies)
