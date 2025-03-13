---
title: DynaTrace Plugin
sidebar_label: DynaTrace Logging
---

The DynaTrace Log plugin enables pushing logs to DynaTrace.

<EnterpriseFeature name="Custom logging" />

## Setup

To add the DynaTrace logging plugin to your Zuplo project, add the following
code to your `zuplo.runtime.ts` file. Set the `url` parameter to the value of
your DynaTrace host and the `DYNATRACE_API_TOKEN` environment variable to your
DynaTrace API token. The API Token requires the `events.ingest` scope.

Any custom fields you want to include in the log entry can be added to the
`fields` property. These values will be appended to every log entry.

```ts title="modules/zuplo.runtime.ts"
import {
  RuntimeExtensions,
  DynaTraceLoggingPlugin,
  environment,
} from "@zuplo/runtime";

export function runtimeInit(runtime: RuntimeExtensions) {
  runtime.addPlugin(
    new DynaTraceLoggingPlugin({
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

## Standard Fields

Every log entry will include the following fields:

- `timestamp` - The time the log was created
- `severity` - The level of the log, for example `ERROR`, `INFO`, etc.
- `custom.environmentType` - Where the Zuplo API is running. Values are `edge`,
  `working-copy`, or `local`
- `custom.environmentStage` - If the environment is `working-copy`, `preview`,
  or `production`
- `requestId` - The UUID of the request (the value of the `zp-rid` header)
- `custom.atomicCounter` - An atomic number that's used to order logs that have
  the same timestamp
- `custom.rayId` - The network provider identifier (i.e. Cloudflare RayID) of
  the request
