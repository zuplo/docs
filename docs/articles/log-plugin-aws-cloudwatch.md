---
title: AWS Cloudwatch Plugin
sidebar_label: AWS Cloudwatch Logging
---

The AWS Cloudwatch Log plugin enables pushing logs to AWS Cloudwatch.

<EnterpriseFeature name="Custom logging" />

## Setup

To add the AWS Cloudwatch logging plugin to your Zuplo project, add the
following code to your `zuplo.runtime.ts` file. Set the `AWS_REGION`,
`AWS_ACCESS _KEY_ID`, and `AWS_SECRET_ACCESS_KEY` environment variables to the
values of your AWS credentials. You can also customize the `logGroupName` and
the `logStreamName` as you see fit.

Any custom fields you want to include in the log entry can be added to the
`fields` property. These values will be appended to every log entry.

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
      logGroupName: "zuplo",
      logStreamName: "my-stream",
      fields: {
        field1: "value1",
        field2: "value2",
      },
    }),
  );
}
```

## Standard Fields

Every log entry will include the following fields:

- `timestamp` - The time the log was created
- `severity` - The level of the log, for example `ERROR`, `INFO`, etc.
- `data` - The log message and data.
- `environmentType` - Where the Zuplo API is running. Values are `edge`,
  `working-copy`, or `local`
- `environmentStage` - If the environment is `working-copy`, `preview`, or
  `production`
- `requestId` - The UUID of the request (the value of the `zp-rid` header)
- `atomicCounter` - An atomic number that's used to order logs that have the
  same timestamp
- `rayId` - The network provider identifier (i.e. Cloudflare RayID) of the
  request
