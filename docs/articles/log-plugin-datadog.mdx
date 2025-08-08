---
title: DataDog Plugin
sidebar_label: DataDog Logging
---

The DataDog Log plugin enables pushing logs to DataDog.

<EnterpriseFeature name="Custom logging" />

## Setup

To add the DataDog logging plugin to your Zuplo project, add the following code
to your `zuplo.runtime.ts` file.

```ts title="modules/zuplo.runtime.ts"
import {
  RuntimeExtensions,
  DataDogLoggingPlugin,
  environment,
} from "@zuplo/runtime";

export function runtimeInit(runtime: RuntimeExtensions) {
  runtime.addPlugin(
    new DataDogLoggingPlugin({
      // Optional, defaults to the DataDog logs API endpoint
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

## Configuration Options

The `DataDogLoggingPlugin` constructor accepts an options object with the
following properties:

- `apiKey` - (required) Your DataDog API key for authentication
- `url` - (optional) The DataDog logs intake URL. Defaults to the DataDog logs
  API endpoint
- `source` - (optional) The source of the logs, typically the name of the
  application or service. Defaults to "Zuplo"
- `fields` - (optional) Custom fields to include in each log entry. Can contain
  string, number, or boolean values
- `tags` - (optional) Custom
  [tags](https://docs.datadoghq.com/getting_started/tagging/) to include in each
  log entry as key-value pairs

### Custom Fields

Any custom fields you want to include in the log entry can be added to the
`fields` property. These values will be appended to every log entry.

### Tags

Any custom tags you want to include in the log entry can be added to the `tags`
property. These values will be appended to every log entry.

## Default Fields

Every log entry will include the following fields (in snake_case format for
DataDog):

- `timestamp` - The time the log was created (ISO 8601 format)
- `severity` - The log level (e.g., `ERROR`, `INFO`, `DEBUG`, `WARN`)
- `message` - The complete log message and data
- `msg` - The first string message extracted from the log entry
- `environment_type` - Where the Zuplo API is running. Values are `edge`,
  `working-copy`, or `local`
- `environment_stage` - The deployment stage: `working-copy`, `preview`, or
  `production`
- `request_id` - The UUID of the request (the value of the `zp-rid` header)
- `atomic_counter` - An atomic counter used to order logs with identical
  timestamps
- `ray_id` - The network provider identifier (e.g., Cloudflare Ray ID) of the
  request
