---
title: Google Cloud Logging Plugin
sidebar_label: Google Cloud Logging
---

The Google Cloud Log plugin enables pushing logs to your Google Cloud project.

<EnterpriseFeature name="Custom logging" />

## Setup

Before you can use this plugin, you will need to create a GCP Service account
that grants your Zuplo API to write logs. Create a new GCP Service account and
give it the **Logs Writer (roles/logging.logWriter)** permission. Create a key
for the service account in JSON format.

After you have downloaded the JSON formatted service account, save it as a
secret environment variable in your Zuplo project.

Any custom fields you want to include in the log entry can be added to the
`fields` property. These values will be appended to every log entry.

```ts title="modules/zuplo.runtime.ts"
import {
  RuntimeExtensions,
  GoogleCloudLoggingPlugin,
  environment,
} from "@zuplo/runtime";

export function runtimeInit(runtime: RuntimeExtensions) {
  runtime.addPlugin(
    new GoogleCloudLoggingPlugin({
      logName: "projects/my-project/logs/my-api",
      serviceAccountJson: environment.GCP_SERVICE_ACCOUNT,
      fields: {
        field1: "value1",
        field2: "value2",
      },
    }),
  );
}
```

## Standard Fields

Every log entry will have a `timestamp` and a `jsonPayload` object. The value of
the `jsonPayload` contains the text or objects passed into the log.

Default fields are:

- `severity` - The level of the log, for example `ERROR`, `INFO`, etc.
- `requestId` - The UUID of the request (the value of the `zp-rid` header)
- `environmentType` - Where the Zuplo API is running. Values are `edge`,
  `working-copy`, or `local`
- `environmentStage` - If the environment is `working-copy`, `preview`, or
  `production`
- `atomic_counter` - An atomic number that's used to order logs that have the
  same timestamp
- `environment` - The environment name of the Zuplo API
- `rayId` - The network provider identifier (i.e. Cloudflare RayID) of the
  request
