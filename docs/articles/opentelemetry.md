---
title: Zuplo OpenTelemetry
sidebar_label: OpenTelemetry
---

Zuplo ships with an OpenTelemetry plugin that allows you to collect and export
telemetry data from your Zuplo API. Currently, the OpenTelemetry plugin
implements tracing. Metrics and logging support are planned for future releases.

<EnterpriseFeature name="OpenTelemetry" />

## Tracing

Tracing enables you to monitor performance, identify bottlenecks, and
troubleshoot issues in your Zuplo API. The OpenTelemetry plugin automatically
instruments your API to collect trace data. You can send trace data any
OpenTelemetry service such as [Honeycomb](https://honeycomb.io),
[Dynatrace](https://dynatrace.com), [Jaeger](https://www.jaegertracing.io/), and
[many more](https://opentelemetry.io/ecosystem/).

With tracing enabled on your Zuplo API you will see timings for each request as
well as spans for plugins, handlers, and policies. The OpenTelemetry plugin
supports trace propagation (W3C headers by default) so you can trace requests
all the way from the client to your backend.

![Trace visualization](../../public/media/opentelemetry/image-1.png)

### What's Traced?

By default, when the OpenTelemetry plugin is enabled, the following is traced:

- Request: The entire request lifecycle is traced, including the time taken to
  process the request and send the response.
- Inbound Policies: The time taken to execute all inbound policies as well as
  each policy is traced.
- Handler: The request handler is traced
- Outbound Policies: The time taken to execute all outbound policies as well as
  each policy is traced.
- Subrequests: Any use of `fetch` within your custom policies or handlers will
  be traced.

### Limitations

One important limitation to keep in mind is that the clock will only increment
when performing I/O operations (for example when calling `fetch`, using the
Cache APIs, etc.). This is a limitation imposed as a security measure due
Zuplo's serverless, multi-tenant architecture. In practice this shouldn't impact
your ability to trace as virtually any code that isn't I/O bound is fast.

### Custom Tracing

You can add custom tracing to your Zuplo API by using the OpenTelemetry API. The
example below shows how to implement tracing in a custom policy.

```ts
import { ZuploContext, ZuploRequest } from "@zuplo/runtime";
import { trace } from "@opentelemetry/api";

export default async function policy(
  request: ZuploRequest,
  context: ZuploContext,
) {
  const tracer = trace.getTracer("my-tracer");
  return tracer.startActiveSpan("my-span", async (span) => {
    span.setAttribute("key", "value");

    try {
      const results = await Promise.all([
        fetch("https://api.example.com/hello"),
        fetch("https://api.example.com/world"),
      ]);
      // ...

      return request;
    } finally {
      span.end();
    }
  });
}
```

This will result in a span that has the following spans:

```txt
|--- my-policy
|    |
|    |--- my-span
|    |    |
|    |    |--- GET https://api.example.com/hello
|    |    |
|    |    |--- GET https://api.example.com/world
```

## Setup

Adding OpenTelemetry tracing to your Zuplo API is done by adding the
`OpenTelemetryPlugin` in the `zuplo.runtime.ts` file as shown below.

For most providers you will set values for `exporter.url` and
`exporter.headers`. It's common for providers to use a header for authorization.

:::warning{title="OpenTelemetry Protocol"}

The Zuplo OpenTelemetry plugin only supports sending data in JSON format. Not
all OpenTelemetry services support the JSON format. If you are using a service
that does not support JSON, you will need to use a tool like the
[OpenTelemetry Collector](https://opentelemetry.io/docs/collector/) that can
convert the JSON format to the format required by your service.

:::

```ts title="zuplo.runtime.ts"
import { OpenTelemetryPlugin } from "@zuplo/otel";
import { RuntimeExtensions, environment } from "@zuplo/runtime";
export function runtimeInit(runtime: RuntimeExtensions) {
  runtime.addPlugin(
    new OpenTelemetryPlugin({
      exporter: {
        url: "https://otlp.example.com",
        headers: {
          Authorization: `Bearer ${environment.OTEL_API_KEY}`,
        },
      },
      service: {
        name: "my-api",
      },
    }),
  );
}
```
