---
title: Logging
---

Zuplo provides real-time logging out of the box. If you would like your logs to
be sent to your own logging service, you can enable one of Zuplo's logging
plugins.

To configure you logging, you need to create a `zuplo.runtime.ts` file in the
`modules`. The examples below show the content of the file with each of the
different logging plugins.

## Log Integrations

Zuplo offers out-of-the box integrations with many common logging vendors. For
instructions on how to configure logging, see the documentation for each plugin:

- [AWS CloudWatch](./log-plugin-aws-cloudwatch.md)
- [DataDog](./log-plugin-datadog.md)
- [Dynatrace](./log-plugin-dynatrace.md)
- [New Relic](./log-plugin-new-relic.md)
- [Google Cloud Logging](./log-plugin-gcp.md)
- [Loki](./log-plugin-loki.md)
- [Splunk](./log-plugin-splunk.md)
- [Sumo Logic](./log-plugin-sumo.md)
- [VMWare Log Insight](./log-plugin-vmware-log-insight.md)

:::info

Not seeing the logging plugin you need? Reach out to
[support@zuplo.com](mailto:support@zuplo.com) and we'd be happy to work with you
to add a new logging plugin.

:::

## Custom Logging

In addition to the logging plugins, you can also create your own custom logging
plugin. For more information, see the
[Custom Logging Plugin](./custom-logging-example.md) documentation.

## Log Fields

Below is a list of the default fields that are sent with log messages. Note that
the names of these fields may differ depending on your logger as we follow the
conventions of each log service. So `environmentType` may be `environmentType`,
`environment_type`, or `environment-type`. See the specific log plugin for
details.

- `severity`: The log level of the message. Values are `debug`, `info`, `warn`,
  `error`
- `requestId`: The value of the `zp-rid` header. This is used for tracing issues
  across Zuplo systems.
- `atomicCounter`: This is a counter that indicates log ordering. Because of the
  shared nature of the edge environments the clock doesn't incriment unless an
  I/O operation is performed. As such, you may notice that you have several
  messages with the same timestamp. You can use the value of this counter to
  determine order. This value will be an integer between 0 and the max integer
  value. It will cycle back to 0 when the maximum is reached. This number isn't
  persistent across restarts or shared across environments.
- `environment`: This is the name of your Zuplo environment. This will be the
  same as your Zuplo subdomain. for example if your Zuplo URL is
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
- `logSource`: Whether the log originated from a request (`request`) or from
  outside of a request (`runtime`)
- `rayId`: The value of the network provider request ID (i.e. Cloudflare Ray
  ID). This value is used internally to coordinate log event in Zuplo to log
  events in the environment where your API runs. It's provided in your logs for
  potential troubleshooting. Normally, it's recommended to rely on the
  `requestId` for tracing.
