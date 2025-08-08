---
title: VMWare Log Insight Log Plugin
sidebar_label: VMWare Log Insight
---

The VMWare Log Insight plugin enables pushing logs to your VMWare Log Insights
via the REST API.

<EnterpriseFeature name="Custom logging" />

## Setup

To add the VMWare Log Insight logging plugin to your Zuplo project, add the
following code to your `zuplo.runtime.ts` file.

```ts title="modules/zuplo.runtime.ts"
import {
  RuntimeExtensions,
  VMWareLogInsightLoggingPlugin,
  environment,
} from "@zuplo/runtime";

export function runtimeInit(runtime: RuntimeExtensions) {
  runtime.addPlugin(
    new VMWareLogInsightLoggingPlugin({
      // This is the URL of your VMWare Log Insight host
      url: "https://loginsight.example.com",
      fields: {
        appname: "zuplo",
      },
    }),
  );
}
```

## Configuration Options

The `VMWareLogInsightLoggingPlugin` constructor accepts an options object with
the following properties:

- `url` - (required) The URL of your VMWare Log Insight host (e.g.,
  `https://loginsight.example.com`)
- `agentId` - (optional) The unique agent identifier of the logger
- `fields` - (optional) Custom fields to include in each log entry. Can contain
  string, number, or boolean values
- `textReplacements` - (optional) An array of string tuples to replace within
  the text field of a log entry
- `onMessageSending` - (optional) A callback function to modify log entries
  before sending

### Custom Fields

Any custom fields you want to include in the log entry can be added to the
`fields` property. These values will be appended to every log entry.

### Text Replacements

The `textReplacements` option allows you to specify character replacements in
the log text. For example: `[["'", ""], ['"', ""], ["\\n", ""], [":", "="]]`

## Default Fields

Every log entry will have a `timestamp` and a `text` field. The text field
contains the log message, which may be JSON encoded for complex data.

Default fields are (in snake_case format):

- `severity` - The log level (e.g., `ERROR`, `INFO`, `DEBUG`, `WARN`)
- `request_id` - The UUID of the request (the value of the `zp-rid` header)
- `environment_type` - Where the Zuplo API is running. Values are `edge`,
  `working-copy`, or `local`
- `environment_stage` - The deployment stage: `working-copy`, `preview`, or
  `production`
- `log_source` - The source of the log. Either `user` or `system`
- `atomic_counter` - An atomic counter used to order logs with identical
  timestamps
- `environment` - The environment name of the Zuplo API
- `request_ray_id` - The network provider identifier (e.g., Cloudflare Ray ID)
  of the request

:::note

VMWare Log Insight uses snake_case naming convention for field names.

:::

## Log Format

The shape of the logs sent from Zuplo will be in the following format:

```json
{
  "timestamp": 1696596905883,
  "text": "hello world",
  "fields": [
    { "name": "severity", "content": "INFO" },
    {
      "name": "request_id",
      "content": "709d2491-0703-4ea9-86ea-d2af548cd4d9"
    },
    { "name": "environment_type", "content": "working-copy" },
    { "name": "log_source", "content": "request" },
    { "name": "atomic_counter", "content": 1 }
  ]
}
```

## Example Logs

When objects are logged, they will be converted to a key value string format as
shown below.

```json
{
  "timestamp": 1696603735057,
  "text": "hello=\"hello world\" foo=1 baz=true",
  "fields": [
    { "name": "severity", "content": "INFO" },
    {
      "name": "request_id",
      "content": "709d2491-0703-4ea9-86ea-d2af548cd4d9"
    },
    { "name": "environment_type", "content": "working-copy" },
    { "name": "log_source", "content": "request" },
    { "name": "atomic_counter", "content": 1 }
  ]
}
```

Errors will be included as fields in the log. The fields are `error_name`,
`error_message`, and `error_stack`.

```json
{
  "timestamp": 1696603735055,
  "text": "Something bad happened",
  "fields": [
    { "name": "severity", "content": "INFO" },
    {
      "name": "request_id",
      "content": "709d2491-0703-4ea9-86ea-d2af548cd4d9"
    },
    { "name": "environment_type", "content": "working-copy" },
    { "name": "log_source", "content": "request" },
    { "name": "atomic_counter", "content": 1 },
    { "name": "error_name", "content": "Error" },
    { "name": "error_message", "content": "This is an error" },
    {
      "name": "error_stack",
      "content": "Error: This is an error\n    at exampleFunction (module/foo.ts:32:21)"
    }
  ]
}
```
