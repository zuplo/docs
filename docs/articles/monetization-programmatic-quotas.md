---
title: Monetization Programmatic Quotas
sidebar_label: Programmatic Quotas
---

:::warning

The monetization feature is currently in beta and is subject to change. There
may be bugs and issues that are not yet resolved. Use with caution and please
report any issues to support.

:::

When adding monetization to your API, you would usually set the number of meters
a request will consume in the settings of the
[Monetization Policy](https://zuplo.com/docs/policies/monetization-inbound). For
example, the policy below specifies that each request will consume 1 `requests`
meter and 5 `computeUnits` meters.

```json
{
  "export": "MonetizationInboundPolicy",
  "module": "$import(@zuplo/runtime)",
  "options": {
    "allowRequestsOverQuota": false,
    "allowedSubscriptionStatuses": ["active", "incomplete"],
    "meterOnStatusCodes": "200-399",
    "meters": {
      "requests": 1,
      "computeUnits": 5
    }
  }
}
```

However, in some cases, you may not know up front how many units of a particular
meter will be consumed until after the response is sent. For example, maybe your
backend is responsible for computing the `computeUnits` on a request and send
the result in the response in the `compute-units` header.

In Zuplo, you can support these dynamic meters by writing a little code. To make
the `computeUnits` meter dynamic, first update the policy by setting the
`computeUnits` meter to `0` as shown below.

```json
{
  "export": "MonetizationInboundPolicy",
  "module": "$import(@zuplo/runtime)",
  "options": {
    "allowRequestsOverQuota": false,
    "allowedSubscriptionStatuses": ["active", "incomplete"],
    "meterOnStatusCodes": "200-399",
    "meters": {
      "requests": 1,
      "computeUnits": 0
    }
  }
}
```

Next you can create a
[custom code outbound policy](/docs/policies/custom-code-outbound) that reads
data from the Response (in this case the `compute-units` header) and sets the
meter programmatically.

```ts title="/modules/set-compute-units-outbound.ts"
import {
  MonetizationInboundPolicy,
  ZuploRequest,
  ZuploContext,
} from "@zuplo/runtime";

export default async function (
  response: Response,
  request: ZuploRequest,
  context: ZuploContext,
  options: any,
  policyName: string,
) {
  const headerValue = response.headers.get("compute-units");
  let computeUnitsValue;
  if (headerValue && typeof headerValue === "string") {
    computeUnitsValue = parseInt(headerValue);
  }

  // Throw an error if the server doesn't send compute units
  // Alternatively, you could have a default value
  if (!computeUnitsValue) {
    throw new Error("Invalid response, no compute units sent.");
  }

  // Set the compute units for the request
  MonetizationInboundPolicy.setMeters(context, {
    computeUnits: computeUnitsValue,
  });

  return response;
}
```
