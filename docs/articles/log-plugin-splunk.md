---
title: Splunk Plugin (Beta)
sidebar_label: Splunk Logging
---

The Splunk Log plugin enables pushing logs to Splunk using the HTTP Event
Collector (HEC).

<EnterpriseFeature name="Custom logging" />

## Setup

To add the Splunk logging plugin to your Zuplo project, add the following code
to your `zuplo.runtime.ts` file.

```ts title="modules/zuplo.runtime.ts"
import {
  RuntimeExtensions,
  SplunkLoggingPlugin,
  environment,
} from "@zuplo/runtime";

export function runtimeInit(runtime: RuntimeExtensions) {
  runtime.addPlugin(
    new SplunkLoggingPlugin({
      // This is the URL of your Splunk HTTP Event Collector (HEC) endpoint
      url: "https://<your-instance>.splunkcloud.com:8088/services/collector",
      token: environment.SPLUNK_TOKEN,
      // Channel ID for Splunk HEC with indexer acknowledgment
      channel: "FE0ECFAD-13D5-401B-847D-77833BD77131",
      // Optional parameters with defaults
      index: "main",
      sourcetype: "json",
      host: "zuplo-api",
      fields: {
        environment: "production",
        application: "my-api",
      },
    }),
  );
}
```

## Configuration Options

The `SplunkLoggingPlugin` constructor accepts an options object with the
following properties:

- `url` - (required) The URL for the Splunk HTTP Event Collector (HEC) endpoint
  - For self-hosted: `https://<splunk-host>:8088/services/collector`
  - For cloud: `https://<your-instance>.splunkcloud.com:8088/services/collector`
  - For Splunk Cloud with HTTP inputs:
    `https://http-inputs-<your-instance>.splunkcloud.com:8088/services/collector`
- `token` - (required) The Splunk HEC token for authentication
- `index` - (optional) The Splunk index to send logs to. Defaults to "main"
- `sourcetype` - (optional) The source type of the logs. Defaults to "json"
- `host` - (optional) The host identifier for the logs. Defaults to "zuplo-api"
- `channel` - (optional) Channel identifier for Splunk HEC with indexer
  acknowledgment. If not provided, the X-Splunk-Request-Channel header will not
  be sent
- `fields` - (optional) Custom fields to include in each log entry. Can contain
  string, number, or boolean values

### Custom Fields

Any custom fields you want to include in the log entry can be added to the
`fields` property. These values will be appended to every log entry.

## Default Fields

Every log entry will be sent to Splunk with the following structure:

### Event Metadata

- `time` - The timestamp in seconds since epoch
- `host` - The host identifier (configurable, defaults to "zuplo-api")
- `source` - The source identifier
- `sourcetype` - The source type (configurable, defaults to "json")
- `index` - The Splunk index (configurable, defaults to "main")

### Event Fields (in the `event` object)

- `message` - The complete log message and data
- `level` - The log level in lowercase (e.g., `error`, `info`, `debug`, `warn`)
- `timestamp` - The time the log was created (in milliseconds since epoch)
- `service` - The name of the service (defaults to "Zuplo")
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

Splunk uses snake_case naming convention for field names within the event data.

:::
