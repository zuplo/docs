---
title: Audit Logging Policy
sidebar_label: Audit Logging
---

Audit logging is an important part of API security that plays a critical role in detecting and correcting issues such as unauthorized access or permission elevations within your system. Audit logging is also a requirement for many compliance certifications as well part of the buying criteria for larger enterprises.

Adding Audit Logging to your APIs that are secured with Zuplo is as easy as adding a policy. Typically you want to add audit logs to any API that modifies data, however depending on the API you may want it on read operations as well (i.e. retrieve a secret key, etc.)

<PolicyIntro policy="audit-log-inbound" />

## Configuration

:::tip

Be sure to read about [policies](../overview/policies.md)

:::

Here is an example configuration (this would go in the `policies` section of the routes.json file). This policy would enforce add audit logging to any route it was present. You can configure the options to enable logging of various data related to each request.

<PolicyExample policy="audit-log-inbound" />

<PolicyOptions policy="audit-log-inbound" />

## Adding Custom Metadata

You can add any additional data to the audit logs with a custom function.

:::note

Custom metadata functions cannot be asynchronous. Due to the frequency of their calls, asynchronous functions will add significant latency to your API.

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
    "region": "Washinton",
    "timezone": "America/LosAngeles"
  },
  "metadata": {
    // Custom data
  }
}
```

## Audit Logs in the Portal

Audit logs are not currently surfaced in the Zuplo portal, but the feature is planned soon.

## Audit Log API

Audit logs can be retrieved using the Zuplo Management API. Logs can be retrieved by time span and can be filtered by `tenant`.

```http
GET /deployments/:deploymentId/auditlogs?tenant=TENANT
content-type: application/json
authorization: Bearer YOUR_TOKEN
```
