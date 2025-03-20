---
title: New Relic Plugin
sidebar_label: New Relic Logging
---

The New Relic Log plugin enables pushing logs to New Relic.

<EnterpriseFeature name="Custom logging" />

## Setup

To add the New Relic logging plugin to your Zuplo project, add the following
code to your `zuplo.runtime.ts` file. Set the `url` parameter (optional) to the
value of your New Relic log API endpoint and the `NEW_RELIC_API_KEY` environment
variable to your New Relic API key.

Any custom fields you want to include in the log entry can be added to the
`fields` property. These values will be appended to every log entry.

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

## Standard Fields

Every log entry will include the following fields:

- `message` - The log message and data
- `level` - The level of the log, for example `error`, `info`, etc.
- `timestamp` - The time the log was created (in milliseconds since epoch)
- `service` - The name of the service (defaults to "Zuplo" or custom value
  provided)
- `environment` - The deployment name of the Zuplo API
- `environment_type` - Where the Zuplo API is running. Values are `edge`,
  `working-copy`, or `local`
- `environment_stage` - If the environment is `working-copy`, `preview`, or
  `production`
- `request_id` - The UUID of the request (the value of the `zp-rid` header)
- `atomic_counter` - An atomic number that's used to order logs that have the
  same timestamp
- `ray_id` - The network provider identifier (i.e. Cloudflare RayID) of the
  request
- `log_source` - The source of the log entry
