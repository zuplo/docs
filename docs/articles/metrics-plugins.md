---
title: Metrics Plugins
---

An essential part of any application is the ability to continuously monitor its
performance in production to detect any issues. Zuplo provides support for
sending metrics to a variety of services. If you want your logs to be sent to
your metrics service, you can enable one of Zuplo's logging plugins. Currently,
Zuplo supports logging to the following sources:

- DataDog (Beta)

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

### Data Dog (Beta)

Zuplo supports the following metrics:

- request latency
- request content length
- response content length

By default, we send all three to DataDog. However, you have the option below to
configure which metrics you want to send.

Due to the pricing model of DataDog, we aim to be thrifty with what we send.
Refer to
[counting custom metrics](https://docs.datadoghq.com/account_management/billing/custom_metrics/?tab=countrate#counting-custom-metrics)
for more information. As of October 2023, we are in the process of becoming an
official integration with DataDog, which would reduce the way our metrics are
counted.

```ts
import {
  RuntimeExtensions,
  DataDogMetricsPlugin,
  environment,
} from "@zuplo/runtime";

export function runtimeInit(runtime: RuntimeExtensions) {
  runtime.addPlugin(
    new DataDogMetricsPlugin({
      apiKey: environment.DATA_DOG_API_KEY,
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
    })
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
