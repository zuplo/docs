---
title: Splunk Plugin (Beta)
sidebar_label: Splunk Logging
---

The Splunk Log plugin enables pushing logs to Splunk using the HTTP Event
Collector (HEC).

<EnterpriseFeature name="Custom logging" />

## Setup

To add the Splunk logging plugin to your Zuplo project, add the following code
to your `zuplo.runtime.ts` file. Set the `url` parameter to your Splunk HEC
endpoint and the `token` parameter to your Splunk HEC token.

Any custom fields you want to include in the log entry can be added to the
`fields` property. These values will be appended to every log entry.

```ts title="modules/zuplo.runtime.ts"
import {
  RuntimeExtensions,
  SplunkLoggingPlugin,
  environment,
} from "@zuplo/runtime";

export function runtimeInit(runtime: RuntimeExtensions) {
  runtime.addPlugin(
    new SplunkLoggingPlugin({
      // For Splunk Cloud
      url: "https://<your-instance>.splunkcloud.com:8088/services/collector",
      token: environment.SPLUNK_TOKEN,
      // Channel ID for Splunk HEC with indexer acknowledgment
      channel: "FE0ECFAD-13D5-401B-847D-77833BD77131",
      // Optional parameters with defaults
      index: "main",
      sourcetype: "json",
      host: "zuplo-api",
      // Skip SSL certificate validation for self-signed certificates
      skipCertValidation: true,
      fields: {
        environment: "production",
        application: "my-api",
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
- `service` - The name of the service (defaults to "Zuplo")
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
