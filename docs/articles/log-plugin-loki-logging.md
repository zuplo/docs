---
title: Loki Logging Plugin
sidebar_label: Loki Logging
---

<EnterpriseFeature name="Custom logging" />

## Setup

The Loki Log plugin enables pushing logs to your Loki server.

To add the Loki logging plugin to your Zuplo project, add the following code to
your `zuplo.runtime.ts` file. Replace `my-username` with your Grafana username
and `my-password` with your Grafana password. Set the `url` option to the value
of your Loki host.

Optionally, you can set the `job` value to set the name of your log stream job.
This defaults to `zuplo` if not set.

Setting the `version` option to `2` changes the log stream to not include the
`requestId` value in the stream, but rather include it as a log value.

```ts title="modules/zuplo.runtime.ts"
import {
  RuntimeExtensions,
  LokiLoggingPlugin,
  environment,
} from "@zuplo/runtime";

export function runtimeInit(runtime: RuntimeExtensions) {
  runtime.addPlugin(
    new LokiLoggingPlugin({
      url: "https://logs-prod-us-central1.grafana.net/loki/api/v1/push",
      username: "my-username",
      job: "my-api",
      password: environment.LOKI_PASSWORD,
      version: 2,
    }),
  );
}
```

## Standard Fields

Every log entry will have a `timestamp` and a `jsonPayload` object. The value of
the `jsonPayload` contains the text or objects passed into the log.

Steam fields are:

- `job` - The name of the log stream job. Defaults to `zuplo`.
- `level` - The level of the log, i.e. `ERROR`, `INFO`, etc.
- `environmentType` - Where the Zuplo API is running. Values are `edge`,
  `working-copy`, or `local`
- `environmentStage` - If the environment is `working-copy`, `preview`, or
  `production`

Log trace fields are:

- `requestId` - The UUID of the request (the value of the `zp-rid` header)
- `atomicCounter` - An atomic number that is used to order logs that have the
  same timestamp
- `rayId` - The Cloudflare RayID of the request

Note, log trace fields are only included if the `version` option is set to `2`
or later.

## Log Format

The shape of the logs sent from Zuplo will be in the following format. If using
version 2, tracing info (`requestId`, etc.) will be included in the log values.

```json
{
  "streams": [
    {
      "stream": {
        "job": "zuplo",
        "level": "debug",
        "environmentType": "local",
        "environmentStage": "local"
      },
      "values": [
        [
          "1712254635666000000",
          "Request received '/hello-world'",
          {
            "requestId": "9b9cd3fd-b0fa-455f-b894-4a5c2c9d131b",
            "rayId": "1235567",
            "atomicCounter": 123435346
          }
        ],
        [
          "1712254635666000000",
          "{\"method\":\"GET\",\"url\":\"/hello-world\",\"hostname\":\"localhost\",\"route\":\"/hello-world\"}",
          {
            "requestId": "9b9cd3fd-b0fa-455f-b894-4a5c2c9d131b",
            "rayId": "1235567",
            "atomicCounter": 123435347
          }
        ]
      ]
    }
  ]
}
```
