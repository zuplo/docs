---
title: DynaTrace Plugin
sidebar_label: DynaTrace Logging
---

The DynaTrace Log plugin enables pushing logs to DynaTrace.

<EnterpriseFeature name="Custom logging" />

## Setup

To add the DynaTrace logging plugin to your Zuplo project, add the following
code to your `zuplo.runtime.ts` file.

```ts title="modules/zuplo.runtime.ts"
import {
  RuntimeExtensions,
  DynaTraceLoggingPlugin,
  environment,
} from "@zuplo/runtime";

export function runtimeInit(runtime: RuntimeExtensions) {
  runtime.addPlugin(
    new DynaTraceLoggingPlugin({
      // This is the URL of your DynaTrace logs ingest API
      url: "https://xxxxxxx.live.dynatrace.com/api/v2/logs/ingest",
      apiToken: environment.DYNATRACE_API_TOKEN,
      fields: {
        field1: "value1",
        field2: "value2",
      },
    }),
  );
}
```

## Configuration Options

The `DynaTraceLoggingPlugin` constructor accepts an options object with the
following properties:

- `url` - (required) The Dynatrace logs ingest API URL (e.g.,
  `https://xxxxxxx.live.dynatrace.com/api/v2/logs/ingest`)
- `apiToken` - (required) Your Dynatrace API token. The API token requires the
  `events.ingest` scope
- `fields` - (optional) Custom fields to include in each log entry. Can contain
  string, number, or boolean values

### Custom Fields

Any custom fields you want to include in the log entry can be added to the
`fields` property. These values will be appended to every log entry.

## Default Fields

Every log entry will include the following fields:

- `timestamp` - The time the log was created (ISO 8601 format)
- `severity` - The log level (e.g., `ERROR`, `INFO`, `DEBUG`, `WARN`)
- `content` - The log message and data
- `custom.environmentType` - Where the Zuplo API is running. Values are `edge`,
  `working-copy`, or `local`
- `custom.environmentStage` - The deployment stage: `working-copy`, `preview`,
  or `production`
- `requestId` - The UUID of the request (the value of the `zp-rid` header)
- `custom.atomicCounter` - An atomic counter used to order logs with identical
  timestamps
- `custom.rayId` - The network provider identifier (e.g., Cloudflare Ray ID) of
  the request

:::note

Dynatrace places custom fields under the `custom` namespace in the log entries.

:::
