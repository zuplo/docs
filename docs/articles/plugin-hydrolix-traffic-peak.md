---
title: Hydrolix / Akamai Traffic Peak Plugin
sidebar_label: Hydrolix / Traffic Peak
---

This plugin pushes request/response logs to Hydrolix AKA Akamai Traffic Peak.

<EnterpriseFeature name="Custom logging" />

## Setup

You can define the fields created in the JSON object by creating a custom type
in TypeScript and a function to extract the field data from the `Response`,
`ZuploRequest`, and `ZuploContext`.

The plugin is configured in the [Runtime Extensions](./runtime-extensions.md)
file `zuplo.runtime.ts`:

This logger includes a default type and function that logs the following fields:

- **deploymentName** <code className="text-green-600">&lt;string&gt;</code> -
  The name of the deployment.
- **timestamp** <code className="text-green-600">&lt;string&gt;</code> - The
  time the log was created.
- **requestId** <code className="text-green-600">&lt;string&gt;</code> - The
  UUID of the request (the value of the `zp-rid` header).
- **routePath** <code className="text-green-600">&lt;string&gt;</code> - The
  path of the route.
- **operationId** <code className="text-green-600">&lt;string |
  undefined&gt;</code> - The operation ID.
- **url** <code className="text-green-600">&lt;string | undefined&gt;</code> -
  The URL of the request.
- **statusCode** <code className="text-green-600">&lt;number |
  undefined&gt;</code> - The status code of the response.
- **durationMs** <code className="text-green-600">&lt;number |
  undefined&gt;</code> - The duration of the request in milliseconds.
- **method** <code className="text-green-600">&lt;string&gt;</code> - The HTTP
  method of the request.
- **userSub** <code className="text-green-600">&lt;string |
  undefined&gt;</code> - The user sub.
- **instanceId** <code className="text-green-600">&lt;string |
  undefined&gt;</code> - The instance ID.
- **colo** <code className="text-green-600">&lt;string | undefined&gt;</code> -
  The colo (datacenter) of the request.
- **city** <code className="text-green-600">&lt;string | undefined&gt;</code> -
  The city the request origin.
- **country** <code className="text-green-600">&lt;string |
  undefined&gt;</code> - The country the request origin.
- **continent** <code className="text-green-600">&lt;string |
  undefined&gt;</code> - The continent the request origin.
- **latitude** <code className="text-green-600">&lt;string |
  undefined&gt;</code> - The latitude of the request origin.
- **longitude** <code className="text-green-600">&lt;string |
  undefined&gt;</code> - The longitude of the request origin.
- **postalCode** <code className="text-green-600">&lt;string |
  undefined&gt;</code> - The postal code of the request origin.
- **metroCode** <code className="text-green-600">&lt;string |
  undefined&gt;</code> - The metro code of the request origin.
- **region** <code className="text-green-600">&lt;string |
  undefined&gt;</code> - The region of the request origin.
- **regionCode** <code className="text-green-600">&lt;string |
  undefined&gt;</code> - The region code of the request origin.
- **timezone** <code className="text-green-600">&lt;string |
  undefined&gt;</code> - The timezone of the request origin.
- **asn** <code className="text-green-600">&lt;string | undefined&gt;</code> -
  The ASN of the request origin.
- **asOrganization** <code className="text-green-600">&lt;string |
  undefined&gt;</code> - The AS organization of the request origin.
- **clientIP** <code className="text-green-600">&lt;string |
  undefined&gt;</code> - The client IP of the requestor.
- **zuploUserAgent** <code className="text-green-600">&lt;string |
  undefined&gt;</code> - The Zuplo user agent.

To use this default setup add the following code to your `zuplo.runtime.ts`
file:

```ts title="modules/zuplo.runtime.ts"
import {
  environment,
  HydrolixRequestLoggerPlugin,
  HydrolixDefaultEntry,
  defaultGenerateHydrolixEntry,
} from "@zuplo/runtime";

runtime.addPlugin(
  new HydrolixRequestLoggerPlugin<HydrolixDefaultEntry>({
    hostname: "your-hydrolix-hostname.com",
    username: "your-hydrolix-username",
    password: environment.HYDROLIX_PASSWORD,
    token: environment.HYDROLIX_TOKEN,
    table: "your-table.name",
    transform: "your-transform-name",
    generateLogEntry: defaultGenerateHydrolixEntry,
  }),
);
```

If you want to customize the data written to Hydrolix, you can define the fields
and entry generation function yourself as follows:

```ts title="modules/zuplo.runtime.ts"
// The interface that describes the rows
// in the output
interface LogEntry {
  timestamp: string;
  method: string;
  url: string;
  status: number;
  statusText: string;
  sub: string | null;
  contentLength: string | null;
}

runtime.addPlugin(
  new HydrolixRequestLoggerPlugin<LogEntry>({
    hostname: "your-hydrolix-hostname.com",
    username: "your-hydrolix-username",
    password: environment.HYDROLIX_PASSWORD,
    token: environment.HYDROLIX_TOKEN,
    table: "your-table.name",
    transform: "your-transform-name",
    batchPeriodSeconds: 0.1,
    generateLogEntry: (response: Response, request: ZuploRequest) => ({
      // You can customize the log entry here by adding new fields
      timestamp: new Date().toISOString(),
      url: request.url,
      method: request.method,
      status: response.status,
      statusText: response.statusText,
      sub: request.user?.sub ?? null,
      contentLength: request.headers.get("content-length"),
    }),
  }),
);
```

Entries will be batched and sent as an array, they will be sent every
`batchPeriodSeconds`. If not specified the will be dispatched very frequently
(~every 10ms) to avoid data loss. Note that `batchPeriodSeconds` can be
specified as a fraction, e.g. `0.1` for every 100ms.
