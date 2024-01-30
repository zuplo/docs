---
title: Log Plugins
---

Zuplo provides live logging for development environments out of the box as well
as limited error logging in production. If you would like your logs to be sent
to your own logging service, you can enable one of Zuplo's logging plugins.
Currently, Zuplo supports logging to the following sources:

- AWS CloudWatch
- Datadog
- Dynatrace
- Google Cloud Logging
- Loki
- Sumo Logic
- VMWare Log Insight

If you would like to log to a different source, reach out to support@zuplo.com
and we'd be happy to work with you to add a new logging plugin.

To configure you logging, you need to create a `zuplo.runtime.ts` file in the
`modules`. The examples below show the content of the file with each of the
different logging plugins.

:::caution Paid Feature

Custom logging is limited to Enterprise plans. If you want to test custom
logging, contact [sales@zuplo.com](mailto:sales@zuplo.com) to have an enterprise
trial enabled.

:::

## Plugins

Below you will find details on each logger.

### AWS CloudWatch

```ts
import {
  RuntimeExtensions,
  AWSLoggingPlugin,
  environment,
} from "@zuplo/runtime";

export function runtimeInit(runtime: RuntimeExtensions) {
  runtime.addPlugin(
    new AWSLoggingPlugin({
      region: environment.AWS_REGION,
      accessKeyId: environment.AWS_ACCESS_KEY_ID,
      secretAccessKey: environment.AWS_SECRET_ACCESS_KEY,
      logGroupName: "zuplo",
      logStreamName: "my-stream",
    }),
  );
}
```

### Datadog

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
      apiKey: environment.DATADOG_API_KEY,
    }),
  );
}
```

### Dynatrace

To setup Dynatrace logging, you'll need to set the URL to your Dynatrace
instance's
[ingest API endpoint](https://www.dynatrace.com/support/help/dynatrace-api/environment-api/events-v2/post-event).

You'll need to create an API Token with `events.ingest` scope.

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
    }),
  );
}
```

### Google Cloud Logging

```ts
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

### Loki

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
    }),
  );
}
```

### Sumo Logic

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
    }),
  );
}
```

### VMWare Log Insight

The VMWare Log Insight plugin enables pushing logs to your VMWare Log Insights
via the REST API. See [the document](./log-plugin-vmware-log-insight.md) on this
plugin for more information.

## Log Fields

Below is a list of the default fields that are sent with log messages. Do note,
that the names of these fields may differ depending on your logger as we follow
the conventions of each log service. So `environmentType` may be
`environmentType`, `environment_type`, or `environment-type`. See the specific
log plugin for details.

- `severity`: The log level of the message. Values are `debug`, `info`, `warn`,
  `error`
- `requestId`: The value of the `zp-rid` header. This is used for tracing issues
  across Zuplo systems.
- `atomicCounter`: This is a counter that indicates log ordering. Because of the
  shared nature of the edge environments the clock does not incriment unless an
  I/O operation is performed. As such, you may notice that you have several
  messages with the same timestamp. You can use the value of this counter to
  determine order. This value will be an integer between 0 and the max integer
  value. It will cycle back to 0 when the maximum is reached. This number is not
  persistent across restarts or shared across environments.
- `environment`: This is the name of your Zuplo environment. This will be the
  same as your Zuplo subdomain. i.e. if your Zuplo URL is
  `https://silver-lemming-main-b0cef33.zuplo.app`, the environment is
  `silver-lemming-main-b0cef33`
- `environmentType`: This indicates where your environment is running. Possible
  values are:
  - `edge`: Environments deployed to our 300+ edge locations
  - `working-copy`: Environments deployed to your single-instance dev server
  - `local`: When running with Zuplo local development
- `environmentStage`: This indicates the deployment stage of your environment.
  Possible values are:
  - `production`: Environments deployed from your default git branch
  - `preview`: Environments deployed from any other git branch
  - `working-copy`: Environments deployed to your single-instance dev server
  - `local`: When running with Zuplo local development
- `loggingId`: This string is a unique identifier that combines your environment
  name, branch name, and project name into one string. We advise against using
  this value and instead recommend using the `environment` and
  `environmentStage` values for filtering. This value will likely be deprecated
  in future releases.
- `buildId`: A UUID representing the unique build of your API. This value
  changes every time a new version of your API is built and deployed.
- `logSource`: Whether the log originated from Zuplo system code (`system`) or
  from customer code (`user`)
- `requestRayId`: The value of the Cloudflare Ray ID. This value is used
  internally to coordinate log event in Zuplo to log events in Cloudflare. It is
  provided in your logs for potential troubleshooting. Normally, it is
  recommended to rely on the `requestId` for tracing.
