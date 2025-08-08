---
title: New Relic Plugin
sidebar_label: New Relic Logging
---

The New Relic Log plugin enables pushing logs to New Relic.

<EnterpriseFeature name="Custom logging" />

## Setup

To add the New Relic logging plugin to your Zuplo project, add the following
code to your `zuplo.runtime.ts` file.

```ts title="modules/zuplo.runtime.ts"
import {
  RuntimeExtensions,
  NewRelicLoggingPlugin,
  environment,
} from "@zuplo/runtime";

export function runtimeInit(runtime: RuntimeExtensions) {
  runtime.addPlugin(
    new NewRelicLoggingPlugin({
      // Optional, defaults to "https://log-api.newrelic.com/log/v1"
      url: "https://log-api.newrelic.com/log/v1",
      apiKey: environment.NEW_RELIC_API_KEY,
      service: "MyAPI", // Optional, defaults to "Zuplo"
      fields: {
        field1: "value1",
        field2: "value2",
      },
    }),
  );
}
```

## Configuration Options

The `NewRelicLoggingPlugin` constructor accepts an options object with the
following properties:

- `apiKey` - (required) Your New Relic API key for authentication
- `url` - (optional) The New Relic logs API endpoint. Defaults to
  "https://log-api.newrelic.com/log/v1"
- `service` - (optional) Service name to identify the source of the logs.
  Defaults to "Zuplo"
- `fields` - (optional) Custom fields to include in each log entry. Can contain
  string, number, or boolean values

### Custom Fields

Any custom fields you want to include in the log entry can be added to the
`fields` property. These values will be appended to every log entry.

## Default Fields

Every log entry will include the following fields (in snake_case format for New
Relic):

- `message` - The complete log message and data
- `level` - The log level in lowercase (e.g., `error`, `info`, `debug`, `warn`)
- `timestamp` - The time the log was created (in milliseconds since epoch)
- `service` - The name of the service (defaults to "Zuplo" or custom value
  provided)
- `environment` - The deployment name of the Zuplo API
- `environment_type` - Where the Zuplo API is running. Values are `edge`,
  `working-copy`, or `local`
- `environment_stage` - The deployment stage: `working-copy`, `preview`, or
  `production`
- `request_id` - The UUID of the request (the value of the `zp-rid` header)
- `atomic_counter` - An atomic counter used to order logs with identical
  timestamps
- `ray_id` - The network provider identifier (e.g., Cloudflare Ray ID) of the
  request
- `log_source` - The source of the log entry

:::note

New Relic uses snake_case naming convention for field names and lowercase log
levels.

:::
