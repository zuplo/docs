---
title: AWS Lambda Handler
sidebar_label: AWS Lambda
---

The AWS Lambda handler is used to send requests to AWS Lambda. This handler can be used as a drop in replacement for AWS API Gateway when exposing Lambda functions as an API or HTTP endpoint.

## Setup via Portal

To setup the AWS Lambda handler in the portal UI, select the AWS Lambda handler on any route.

![](https://cdn.zuplo.com/assets/aa9dc09d-6636-4a8b-94bc-ee28bb779fc8.png)

Configure the properties for your AWS Lambda function.

::: warning

Don't add the AWS Secure Access Key directly in the `routes.json` file. Instead use environment variables like `$env(AWS_SECURE_ACCESS_KEY)`

:::

## Setup via Routes.json

The AWS Lambda handler can be setup by editing the `routes.json` file directly by configuring the handler property on any route.

```json
{
  "handler": {
    "export": "awsLambdaHandler",
    "module": "$import(@zuplo/runtime)",
    "options": {
      "accessKeyId": "$env(AWS_ACCESS_KEY_ID)",
      "functionName": "demo-post-1",
      "region": "us-east-2",
      "secretAccessKey": "$env(AWS_SECURE_ACCESS_KEY)"
    }
  }
}
```
