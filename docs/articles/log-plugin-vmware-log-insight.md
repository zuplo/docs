---
title: VMWare Log Insight Log Plugin
---

## Setup

The VMWare Log Insight plugin enables pushing logs to your VMWare Log Insights
via the REST API. Simply set the `url` option to the value of your Log Insights
host (i.e. `https://loginsight.example.com`).

Optionally, you can configure additional fields that will be sent with your
logs, for example if you want to include an `appname` field that indicates the
name of your Zuplo API, you can do so as shown below. Theses fields will be
included on every log entry.

```ts
import {
  RuntimeExtensions,
  VMWareLogInsightLoggingPlugin,
  environment,
} from "@zuplo/runtime";

export function runtimeInit(runtime: RuntimeExtensions) {
  runtime.addPlugin(
    new VMWareLogInsightLoggingPlugin({
      url: "https://loginsight.example.com",
      fields: [{ name: "appname", content: "zuplo" }],
    })
  );
}
```

## Standard Fields

Every log entry will have a `timestamp` and a `text` object. The value of the
text object is an JSON encoded array of messages sent in that log entry.

Default fields are:

- `severity` - The level of the log, i.e. `ERROR`, `INFO`, etc.
- `request_id` - The UUID of the request (the value of the `zp-rid` header)
- `environment_type` - Where the Zuplo API is running. Values are `edge`,
  `working-copy`, or `local`
- `log_source` - The source of the log. Either `user` or `system`
- `atomic_counter` - An atomic number that is used to order logs that have the
  same timestamp
- `environment` - The environment name of the Zuplo API
- `request_ray_id` - The Cloudflare RayID of the request (for edge deployed
  environments)

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
