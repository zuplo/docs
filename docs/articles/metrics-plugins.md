---
title: Metrics Plugins
---

An essential part of any application is the ability to continuously monitor its
performance in production to detect any issues. Zuplo provides support for
sending metrics to a variety of services. If you want your logs to be sent to
your metrics service, you can enable one of Zuplo's logging plugins. Currently,
Zuplo supports logging to the following sources:

- Datadog (Beta)
- Dynatrace (Beta)

If you would like to log to a different source, reach out to support@zuplo.com
and we'd be happy to work with you to add a new logging plugin.

To configure your logging, you must create a `zuplo.runtime.ts` file in the
`modules`. The examples below show the content of the file with each of the
different logging plugins.

:::caution Paid Feature

Custom metrics is limited to Enterprise plans. If you wish to test drive this,
contact [sales@zuplo.com](mailto:sales@zuplo.com) to have an enterprise trial
enabled.

:::

## Plugins

Below, you will find details on each metrics plugin.

### Datadog (Beta)

Zuplo supports the following metrics:

- request latency
- request content length
- response content length

By default, we send all three to Datadog. However, you have the option below to
configure which metrics you want to send.

Due to the pricing model of Datadog, we aim to be thrifty with what we send.
Refer to
[counting custom metrics](https://docs.datadoghq.com/account_management/billing/custom_metrics/?tab=countrate#counting-custom-metrics)
for more information. In general, try to avoid high-dimensionality/cardinality
tags since those are counted as separate metrics. This
[article](https://www.datadoghq.com/blog/the-power-of-tagged-metrics/) by
Datadog has some good guidelines.

As of October 2023, we are in the process of becoming an official integration
with Datadog, which would reduce the way some of our metrics are counted.

```ts
import {
  RuntimeExtensions,
  DataDogMetricsPlugin,
  environment,
} from "@zuplo/runtime";

export function runtimeInit(runtime: RuntimeExtensions) {
  runtime.addPlugin(
    new DataDogMetricsPlugin({
      apiKey: environment.DATADOG_API_KEY,
      // You can add what tags you want.
      // See https://docs.datadoghq.com/tagging/#defining-tags for more information
      tags: [
        "app:my-service-name",
        `environment:${environment.ENVIRONMENT ?? "DEVELOPMENT"}`,
      ],
      metrics: {
        latency: true,
        requestContentLength: true,
        responseContentLength: true,
      },
      // You can also choose to add additional tags to include in the metrics.
      // Be mindful of what other information you wish to include since it will incur costs on your cardinality
      include: {
        country: false,
        method: false,
        statusCode: false,
      },
    })
  );
}
```

The above configuration applies globally for all metrics send to Datadog. If you
wish to dynamically configure information for a particular ZuploContext, you can
use the `DataDogMetricsPlugin` in your code. Currently, the only configuration
you can set is the tags. The values you set here will be appended to those set
globally in the `zuplo.runtime.ts` file.

```ts
import {
  ZuploContext,
  ZuploRequest,
  DataDogMetricsPlugin,
} from "@zuplo/runtime";

export default async function (request: ZuploRequest, context: ZuploContext) {
  const someValue = "hello";
  DataDogMetricsPlugin.setContext(context, {
    tags: [`my-custom-tag:${someValue}`],
  });

  return "What zup?";
}
```

### Dynatrace (Beta)

Zuplo supports the following metrics:

- request latency
- request content length
- response content length

By default, we send all three to Dynatrace. However, you have the option below
to configure which metrics you want to send.

:::warning Strict format

Dynatrace has a strict format for its payload, which has some _surprising_
requirements.

From
https://docs.dynatrace.com/docs/extend-dynatrace/extend-metrics/reference/metric-ingestion-protocol#dimension

> Allowed characters for the key are lowercase letters, numbers, hyphens (-),
> periods (.), and underscores (\_). Special letters (like ö) are not allowed.

The _surprising_ part is that uppercase characters are **not** allowed.

Do be mindful when you are crafting your own dimensions since an invalid
property will cause the entire payload to be rejected.

:::

```ts
import {
  RuntimeExtensions,
  DynatraceMetricsPlugin,
  environment,
} from "@zuplo/runtime";

export function runtimeInit(runtime: RuntimeExtensions) {
  runtime.addPlugin(
    new DynatraceMetricsPlugin({
      // You can find the documentation on how to get your URL at
      // https://www.dynatrace.com/support/help/dynatrace-api/environment-api/metric-v2/post-ingest-metrics#example
      url: "https://demo.live.dynatrace.com/api/v2/metrics/ingest",
      apiToken: environment.DYNATRACE_API_TOKEN,
      // Dimensions should conform to Dynatrace ingest protocol
      // See https://www.dynatrace.com/support/help/extend-dynatrace/extend-metrics/reference/metric-ingestion-protocol
      dimensions: [
        'app="my-service-name"',
        `environment="${environment.ENVIRONMENT ?? "DEVELOPMENT"}"`,
      ],
      metrics: {
        latency: true,
        requestContentLength: true,
        responseContentLength: true,
      },
      // You can also choose to add additional tags to include in the metrics.
      include: {
        country: false,
        method: false,
        statusCode: false,
      },
    })
  );
}
```

The above configuration applies globally for all metrics send to Dynatrace. If
you wish to dynamically configure information for a particular ZuploContext, you
can use the `DynatraceMetricsPlugin` in your code. Currently, the only
configuration you can set is the dimensions. The values you set here will be
appended to those set globally in the `zuplo.runtime.ts` file.

```ts
import {
  ZuploContext,
  ZuploRequest,
  DynatraceMetricsPlugin,
} from "@zuplo/runtime";

export default async function (request: ZuploRequest, context: ZuploContext) {
  const someValue = "hello";
  DynatraceMetricsPlugin.setContext(context, {
    dimentions: [`my-custom-dimension="${someValue}"`],
  });

  return "What zup?";
}
```
