---
title: Log Plugins
---

Zuplo provides live logging for development environments out of the box as well
as limited error logging in production. If you would like your logs to be sent
to your own logging service, you can enable one of Zuplo's logging plugins.
Currently, Zuplo supports logging to the following sources:

- DataDog
- Dynatrace
- Google Cloud Logging
- Loki
- Sumo Logic

If you would like to log to a different source, reach out to support@zuplo.com
and we'd be happy to work with you to add a new logging plugin.

To configure you logging, you need to create a `zuplo.runtime.ts` file in the
`modules`. The examples below show the content of the file with each of the
different logging plugins.

:::caution Paid Feature

Custom logging is limited to Enterprise plans. If you test custom logging,
contact [sales@zuplo.com](mailto:sales@zuplo.com) to have an enterprise trial
enabled.

:::

## Data Dog

```ts
import {
  RuntimeExtensions,
  DataDogLoggingPlugin,
  environment,
} from "@zuplo/runtime";

export function runtimeInit(runtime: RuntimeExtensions) {
  runtime.addPlugin(
    new DataDogLoggingPlugin({
      url: "https://http-intake.logs.datadoghq.com/api/v2/logs",
      apiKey: environment.DATA_DOG_API_KEY,
    })
  );
}
```

## Dynatrace

```ts
import {
  RuntimeExtensions,
  DynaTraceLoggingPlugin,
  environment,
} from "@zuplo/runtime";

export function runtimeInit(runtime: RuntimeExtensions) {
  runtime.addPlugin(
    new DynaTraceLoggingPlugin({
      url: "https://xxxxxxx.live.dynatrace.com/api/v2/logs/ingest",
      apiToken: environment.DYNATRACE_API_TOKEN,
    })
  );
}
```

## Google Cloud Logging

```ts
import {
  RuntimeExtensions,
  GoogleCloudLoggingPlugin,
  environment,
} from "@zuplo/runtime";

export function runtimeInit(runtime: RuntimeExtensions) {
  runtime.addPlugin(
    new GoogleCloudLoggingPlugin({
      logName: "my-api-gateway",
      serviceAccountJson: environment.GCP_SERVICE_ACCOUNT,
    })
  );
}
```

## Loki

```ts
import {
  RuntimeExtensions,
  GoogleCloudLoggingPlugin,
  environment,
} from "@zuplo/runtime";

export function runtimeInit(runtime: RuntimeExtensions) {
  runtime.addPlugin(
    new LokiLoggingPlugin({
      url: "https://logs-prod-us-central1.grafana.net/loki/api/v1/push",
      username: "my-username",
      password: environment.LOKI_PASSWORD,
    })
  );
}
```

## Sumo Logic

The Sumo Logic logger uses the
[HTTP Source](https://help.sumologic.com/docs/send-data/hosted-collectors/http-source/logs-metrics/)
to send logs. Create a hosted HTTP Collector and Set the HTTP Source Address
valud to the url property on the plugin.

When creating the HTTP Collector, leave the default settings for parsing the
logs.

```ts
import {
  RuntimeExtensions,
  GoogleCloudLoggingPlugin,
  environment,
} from "@zuplo/runtime";

export function runtimeInit(runtime: RuntimeExtensions) {
  runtime.addPlugin(
    new SumoLogicLoggingPlugin({
      url: "https://endpoint4.collection.sumologic.com/receiver/v1/http/XXXXXX",
    })
  );
}
```
