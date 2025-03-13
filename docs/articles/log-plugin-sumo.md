---
title: SumoLogic Plugin
sidebar_label: SumoLogic Logging
---

The SumoLogic Log plugin enables pushing logs to SumoLogic.

<EnterpriseFeature name="Custom logging" />

## Setup

To add the SumoLogic logging plugin to your Zuplo project, add the following
code to your `zuplo.runtime.ts` file. Set the `url` parameter to the value of
your SumoLogic host.

Any custom fields you want to include in the log entry can be added to the
`fields` property. These values will be appended to every log sent to
Cloudwatch.

```ts title="modules/zuplo.runtime.ts"
import {
  RuntimeExtensions,
  SumoLogicLoggingPlugin,
  environment,
} from "@zuplo/runtime";

export function runtimeInit(runtime: RuntimeExtensions) {
  runtime.addPlugin(
    new SumoLogicLoggingPlugin({
      url: "https://endpoint4.collection.sumologic.com/receiver/v1/http/XXXXXX",
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
- `environmentType` - Where the Zuplo API is running. Values are `edge`,
  `working-copy`, or `local`
- `environmentStage` - If the environment is `working-copy`, `preview`, or
  `production`
- `requestId` - The UUID of the request (the value of the `zp-rid` header)
- `atomicCounter` - An atomic number that's used to order logs that have the
  same timestamp
- `rayId` - The network provider identifier (i.e. Cloudflare RayID) of the
  request
