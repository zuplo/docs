---
title: AWS CloudWatch Plugin
sidebar_label: AWS CloudWatch Logging
---

The AWS CloudWatch Log plugin enables pushing logs to AWS CloudWatch.

<EnterpriseFeature name="Custom logging" />

## Setup

To add the AWS CloudWatch logging plugin to your Zuplo project, add the
following code to your `zuplo.runtime.ts` file.

```ts title="modules/zuplo.runtime.ts"
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
      logGroupName: "/aws/zuplo/api",
      logStreamName: "production",
    }),
  );
}
```

## Configuration Options

The `AWSLoggingPlugin` constructor accepts an options object with the following
properties:

- `region` - (required) AWS region where your CloudWatch logs are stored (e.g.,
  "us-east-1")
- `accessKeyId` - (required) AWS access key ID for authentication
- `secretAccessKey` - (required) AWS secret access key for authentication
- `logGroupName` - (required) CloudWatch log group name
- `logStreamName` - (required) CloudWatch log stream name
- `fields` - (optional) Custom fields to include in each log entry. Can contain
  string, number, or boolean values

### Custom Fields

Any custom fields you want to include in the log entry can be added to the
`fields` property. These values will be appended to every log entry.

```ts
new AWSLoggingPlugin({
  region: environment.AWS_REGION,
  accessKeyId: environment.AWS_ACCESS_KEY_ID,
  secretAccessKey: environment.AWS_SECRET_ACCESS_KEY,
  logGroupName: "/aws/zuplo/api",
  logStreamName: "production",
  fields: {
    field1: "value1",
    field2: "value2",
  },
});
```

## Default Fields

Every log entry will include the following fields (in camelCase format):

- `timestamp` - The time the log was created (ISO 8601 format)
- `severity` - The log level (e.g., `ERROR`, `INFO`, `DEBUG`, `WARN`)
- `data` - The log message and any additional data
- `environmentType` - Where the Zuplo API is running. Values are `edge`,
  `working-copy`, or `local`
- `environmentStage` - The deployment stage: `working-copy`, `preview`, or
  `production`
- `requestId` - The UUID of the request (the value of the `zp-rid` header)
- `atomicCounter` - An atomic counter used to order logs with identical
  timestamps
- `rayId` - The network provider identifier (e.g., Cloudflare Ray ID) of the
  request
