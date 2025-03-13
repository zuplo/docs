---
title: DataDog Plugin
sidebar_label: DataDog Logging
---

The DataDog Log plugin enables pushing logs to DataDog.

<EnterpriseFeature name="Custom logging" />

## Setup

To add the DataDog logging plugin to your Zuplo project, add the following code
to your `zuplo.runtime.ts` file. Set the `url` parameter and `DATADOG_API_KEY`
environment variable to the values of your DataDog configuration.

Any custom fields you want to include in the log entry can be added to the
`fields` property. These values will be appended to every log entry.

Any custom [tags](https://docs.datadoghq.com/getting_started/tagging/) you want
to include in the log entry can be added to the `tags` property. These values
will be appended to every log entry.

```ts title="modules/zuplo.runtime.ts"
import {
  RuntimeExtensions,
  DataDogLoggingPlugin,
  environment,
} from "@zuplo/runtime";

export function runtimeInit(runtime: RuntimeExtensions) {
  runtime.addPlugin(
    new DataDogLoggingPlugin({
      url: "https://http-intake.logs.datadoghq.com/api/v2/logs",
      apiKey: environment.DATADOG_API_KEY,
      source: "MyAPI", // Optional, defaults to "Zuplo"
      tags: {
        tag: "hello",
      },
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
- `message` - The log message and data.
- `msg` - The first string message extracted from the log entry.
- `environment_type` - Where the Zuplo API is running. Values are `edge`,
  `working-copy`, or `local`
- `environment_stage` - If the environment is `working-copy`, `preview`, or
  `production`
- `request_id` - The UUID of the request (the value of the `zp-rid` header)
- `atomic_counter` - An atomic number that's used to order logs that have the
  same timestamp
- `ray_id` - The network provider identifier (i.e. Cloudflare RayID) of the
  request
