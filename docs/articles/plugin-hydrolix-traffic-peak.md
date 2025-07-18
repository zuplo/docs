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

The plugin is configured in the
[Runtime Extensions](../programmable-api/runtime-extensions.md) file
`zuplo.runtime.ts`:

This logger includes a default type and function that logs the following fields:

- **deploymentName** <CodeType>string</CodeType> - The name of the deployment.
- **timestamp** <CodeType>string</CodeType> - The time the log was created.
- **requestId** <CodeType>string</CodeType> - The UUID of the request (the value
  of the `zp-rid` header).
- **routePath** <CodeType>string</CodeType> - The path of the route.
- **operationId** <CodeType>string | undefined</CodeType> - The operation ID.
- **url** <CodeType>string | undefined</CodeType> - The URL of the request.
- **statusCode** <CodeType>number | undefined</CodeType> - The status code of
  the response.
- **durationMs** <CodeType>number | undefined</CodeType> - The duration of the
  request in milliseconds.
- **method** <CodeType>string</CodeType> - The HTTP method of the request.
- **userSub** <CodeType>string | undefined</CodeType> - The user sub.
- **instanceId** <CodeType>string | undefined</CodeType> - The instance ID.
- **colo** <CodeType>string | undefined</CodeType> - The colo (datacenter) of
  the request.
- **city** <CodeType>string | undefined</CodeType> - The city the request
  origin.
- **country** <CodeType>string | undefined</CodeType> - The country the request
  origin.
- **continent** <CodeType>string | undefined</CodeType> - The continent the
  request origin.
- **latitude** <CodeType>string | undefined</CodeType> - The latitude of the
  request origin.
- **longitude** <CodeType>string | undefined</CodeType> - The longitude of the
  request origin.
- **postalCode** <CodeType>string | undefined</CodeType> - The postal code of
  the request origin.
- **metroCode** <CodeType>string | undefined</CodeType> - The metro code of the
  request origin.
- **region** <CodeType>string | undefined</CodeType> - The region of the request
  origin.
- **regionCode** <CodeType>string | undefined</CodeType> - The region code of
  the request origin.
- **timezone** <CodeType>string | undefined</CodeType> - The timezone of the
  request origin.
- **asn** <CodeType>string | undefined</CodeType> - The ASN of the request
  origin.
- **asOrganization** <CodeType>string | undefined</CodeType> - The AS
  organization of the request origin.
- **clientIP** <CodeType>string | undefined</CodeType> - The client IP of the
  requestor.
- **zuploUserAgent** <CodeType>string | undefined</CodeType> - The Zuplo user
  agent.

To use this default setup add the following code to your `zuplo.runtime.ts`
file:

```ts title="modules/zuplo.runtime.ts"
import {
  ZuploRequest,
  HydrolixRequestLoggerPlugin,
  HydrolixDefaultEntry,
  environment,
} from "@zuplo/runtime";

import {
  environment,
  HydrolixRequestLoggerPlugin,
  HydrolixDefaultEntry,
  defaultGenerateHydrolixEntry,
} from "@zuplo/runtime";

export function runtimeInit(runtime: RuntimeExtensions) {
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
}
```

Note, the `token` (HYDROLIX_TOKEN above) is a
[Streaming Auth Token](https://docs.hydrolix.io/docs/stream-authentication).

If you want to customize the data written to Hydrolix, you can define the fields
and entry generation function yourself as follows:

```ts title="modules/zuplo.runtime.ts"
import {
  ZuploRequest,
  HydrolixRequestLoggerPlugin,
  environment,
} from "@zuplo/runtime";

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

export function runtimeInit(runtime: RuntimeExtensions) {
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
}
```

Entries will be batched and sent as an array, they will be sent every
`batchPeriodSeconds`. If not specified the will be dispatched very frequently
(~every 10ms) to avoid data loss. Note that `batchPeriodSeconds` can be
specified as a fraction, e.g. `0.1` for every 100ms.
