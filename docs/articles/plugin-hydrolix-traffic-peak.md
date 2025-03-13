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

- deploymentName: string;
- timestamp: string;
- requestId: string;
- routePath: string;
- operationId: string / undefined;
- url: string / undefined;
- statusCode: number / undefined;
- durationMs: number / undefined;
- method: string;
- userSub: string / undefined;
- instanceId: string / undefined;
- colo: string / undefined;
- city: string / undefined;
- country: string / undefined;
- continent: string / undefined;
- latitude: string / undefined;
- longitude: string / undefined;
- postalCode: string / undefined;
- metroCode: string / undefined;
- region: string / undefined;
- regionCode: string / undefined;
- timezone: string / undefined;
- asn: string / undefined;
- asOrganization: string / undefined;
- clientIP: string / undefined;
- zuploUserAgent: string / undefined;

To use this default setup add the following code to your `zuplo.runtime.ts`
file:

```ts
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

```ts
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
