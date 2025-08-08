---
title: SumoLogic Plugin
sidebar_label: SumoLogic Logging
---

The SumoLogic Log plugin enables pushing logs to SumoLogic.

<EnterpriseFeature name="Custom logging" />

## Setup

To add the SumoLogic logging plugin to your Zuplo project, add the following
code to your `zuplo.runtime.ts` file.

```ts title="modules/zuplo.runtime.ts"
import {
  RuntimeExtensions,
  SumoLogicLoggingPlugin,
  environment,
} from "@zuplo/runtime";

export function runtimeInit(runtime: RuntimeExtensions) {
  runtime.addPlugin(
    new SumoLogicLoggingPlugin({
      // This is the Sumo Logic HTTP collector endpoint URL
      url: "https://endpoint4.collection.sumologic.com/receiver/v1/http/XXXXXX",
      fields: {
        field1: "value1",
        field2: "value2",
      },
    }),
  );
}
```

## Configuration Options

The `SumoLogicLoggingPlugin` constructor accepts an options object with the
following properties:

- `url` - (required) The Sumo Logic HTTP collector endpoint URL
- `name` - (optional) The name metadata field for Sumo Logic
- `category` - (optional) The category metadata field for Sumo Logic
- `fields` - (optional) Custom fields to include in each log entry. Can contain
  string, number, or boolean values

### Custom Fields

Any custom fields you want to include in the log entry can be added to the
`fields` property. These values will be appended to every log entry.

## Default Fields

Every log entry will include the following fields (in camelCase format):

- `timestamp` - The time the log was created (ISO 8601 format)
- `severity` - The log level (e.g., `ERROR`, `INFO`, `DEBUG`, `WARN`)
- `data` - The log message and any additional data
- `environmentType` - Where the Zuplo API is running. Values are `edge`,
  `working-copy`, or `local`
- `environmentStage` - The deployment stage: `working-copy`, `preview`, or
  `production`
- `requestId` - The UUID of the request (the value of the `zp-rid` header)
- `atomicCounter` - An atomic counter used to order logs with identical
  timestamps
- `rayId` - The network provider identifier (e.g., Cloudflare Ray ID) of the
  request

:::note

Sumo Logic uses camelCase naming convention for field names.

:::
