---
title: Google Cloud Logging Plugin
sidebar_label: Google Cloud Logging
---

<EnterpriseFeature name="Custom logging" />

## Setup

The GCP Log plugin enables pushing logs to your GCP project.

Before you can use this plugin, you will need to create a GCP Service account
that grants your Zuplo API to write logs. Create a new GCP Service account and
give it the **Logs Writer (roles/logging.logWriter)** permission. Create a key
for the service account in JSON format.

After you have downloaded the JSON formatted service account, save it as a
secret environment variable in your Zuplo project.

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
- `rayId` - The Cloudflare RayID of the request

## Log Format

The shape of the logs sent from Zuplo will be in the following format. The
messages passed into the log function will be sent as an array on `allMessages`.
The first string message will be set as the `jsonPayload.message` field - this
makes it easier to read the logs in Google's Log Explorer.

```json
{
  "insertId": "1sxlp0rg113cy7s",
  "jsonPayload": {
    "message": "Request received '/hello'",
    "allMessages": [
      "Request received '/hello'",
      {
        "route": "/hello",
        "method": "GET",
        "hostname": "my-project-main-db51244.zuplo.app",
        "url": "/hello"
      }
    ]
  },
  "resource": {
    "type": "global",
    "labels": {
      "project_id": "my-project"
    }
  },
  "timestamp": "2024-02-27T22:18:48.885Z",
  "severity": "DEBUG",
  "labels": {
    "environmentStage": "production",
    "logOwner": "user",
    "rayId": "85c3ce476cfc399a",
    "environmentType": "edge",
    "buildId": "365cd2da-6156-48c8-b142-4e5aa4a7e6d7",
    "requestId": "1482d01b-9d74-4cff-a0e3-e1adda46354f",
    "loggingId": "nate-test::my-project::main::main::db51244",
    "source": "request",
    "environment": "my-project-main-db51244"
  },
  "logName": "projects/my-project/logs/my-project",
  "trace": "projects/my-project/traces/1482d01b-9d74-4cff-a0e3-e1adda46354f",
  "receiveTimestamp": "2024-02-27T22:18:48.921958689Z"
}
```
