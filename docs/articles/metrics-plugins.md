---
title: Metrics Plugins
---

An essential part of any application is the ability to continuously monitor its
performance in production to detect any issues. Zuplo provides support for
sending metrics to a variety of services. If you want your logs to be sent to
your metrics service, you can enable one of Zuplo's logging plugins. Currently,
Zuplo supports logging to the following sources:

- DataDog (Beta)
- Dynatrace (Beta)
- New Relic (Beta)

If you would like to log to a different source, reach out to support@zuplo.com
and we'd be happy to work with you to add a new logging plugin.

To configure your logging, you must create a `zuplo.runtime.ts` file in the
`modules`. The examples below show the content of the file with each of the
different logging plugins.

<EnterpriseFeature name="Custom metrics" />

## Metrics

Zuplo supports the following metrics:

- request latency
  - This measures the total time (in milliseconds) that a request takes once it
    has entered the API Gateway. It includes any outbound calls from the
    gateway.
- request content length
  - The content length of the request as reported by the content-length header.
    May be omitted if the content-length header isn't present.
- response content length.
  - The content length of the response as reported by the content-length header.
    May be omitted if the content-length header isn't present.

## Plugins

Below, you will find details on each metrics plugin.

### DataDog (Beta)

By default, we send all metrics to DataDog. However, you have the option below
to configure which metrics you want to send.

Due to the pricing model of DataDog, we recommend being thrifty with what's
being sent. Refer to
[counting custom metrics](https://docs.datadoghq.com/account_management/billing/custom_metrics/?tab=countrate#counting-custom-metrics)
for more information. In general, try to avoid high-dimensionality/cardinality
tags since those are counted as separate metrics. This
[article by DataDog](https://www.datadoghq.com/blog/the-power-of-tagged-metrics/)
has some good guidelines.

:::warning{title="Metrics Aggregation"}

Your Zuplo API can be deployed to many edge locations. Each location will send
metrics to DataDog independantly. For low volume APIs this may be okay, but
typically you will want to aggregate metrics before sending to DataDog. You can
use a tool like the
[OpenTelemetry Collector](https://opentelemetry.io/docs/collector/) for the
aggregation.

:::

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
        httpMethod: false,
        statusCode: false,
      },
    }),
  );
}
```

The above configuration applies globally for all metrics send to DataDog. If you
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

By default, we send all metrics to Dynatrace. However, you have the option below
to configure which metrics you want to send.

:::warning{title="Strict format"}

Dynatrace has a strict format for its payload, which has some _surprising_
requirements.

From
https://docs.dynatrace.com/docs/extend-dynatrace/extend-metrics/reference/metric-ingestion-protocol#dimension

> Allowed characters for the key are lowercase letters, numbers, hyphens (-),
> periods (.), and underscores (\_). Special letters (like ö) aren't allowed.

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
    }),
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

### New Relic (Beta)

By default, we send all metrics to New Relic. However, you have the option below
to configure which metrics you want to send.

New Relic's Metric API provides a powerful way to monitor your API's
performance. The metrics are sent to New Relic's Metric API endpoint
(https://metric-api.newrelic.com/metric/v1) by default, but you can customize
this if needed.

```ts
import {
  RuntimeExtensions,
  NewRelicMetricsPlugin,
  environment,
} from "@zuplo/runtime";

export function runtimeInit(runtime: RuntimeExtensions) {
  runtime.addPlugin(
    new NewRelicMetricsPlugin({
      apiKey: environment.NEW_RELIC_API_KEY,
      // Optional: customize the URL if needed
      // url: "https://metric-api.newrelic.com/metric/v1",
      // You can add custom attributes to all metrics
      attributes: {
        service: "my-service-name",
        environment: environment.ENVIRONMENT ?? "DEVELOPMENT",
      },
      metrics: {
        latency: true,
        requestContentLength: true,
        responseContentLength: true,
      },
      // You can also choose to add additional attributes to include in the metrics
      include: {
        country: false,
        httpMethod: false,
        statusCode: false,
        path: false,
      },
    }),
  );
}
```

The above configuration applies globally for all metrics sent to New Relic. If
you wish to dynamically configure information for a particular ZuploContext, you
can use the `NewRelicMetricsPlugin` in your code. Currently, the only
configuration you can set is the attributes. The values you set here will be
appended to those set globally in the `zuplo.runtime.ts` file.

```ts
import {
  ZuploContext,
  ZuploRequest,
  NewRelicMetricsPlugin,
} from "@zuplo/runtime";

export default async function (request: ZuploRequest, context: ZuploContext) {
  const someValue = "hello";
  NewRelicMetricsPlugin.setContext(context, {
    attributes: { "my-custom-attribute": someValue },
  });

  return "What zup?";
}
```

:::warning{title="Metrics Aggregation"}

Your Zuplo API can be deployed to many edge locations. Each location will send
metrics to New Relic independently. For low volume APIs this may be okay, but
typically you will want to aggregate metrics before sending to New Relic. You
can use a tool like the
[OpenTelemetry Collector](https://opentelemetry.io/docs/collector/) for the
aggregation.

:::
