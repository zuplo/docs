---
title: Runtime Extensions
---

While most configuration in your Zuplo gateway is set on a per-route or per-policy basis, there are times when behaviors need to be modified globally. To plug into the global initialization of your gateway, create a file called `zuplo.runtime.ts` in the `modules` folder with the following code.

```ts
import { RuntimeExtensions } from "@zuplo/runtime";

export function runtimeInit(runtime: RuntimeExtensions) {
  // Extensions go here
}
```

> NOTE: the name of the export must be `runtimeInit` and must conform to the above function signature.

The following configurations are available.

### Custom Problem (Error) Response Formatter

Zuplo includes built-in error handling that returns errors in the format of the [Problem Details for HTTP APIs](http://httpproblems.com/) proposed standard. This means that HTTP errors (or other exceptions) will return responses that look like the following.

```json
{
  "type": "https://httpproblems.com/http-status/404",
  "title": "Not Found",
  "status": 404,
  "detail": "Not Found",
  "instance": "/not-a-path",
  "trace": {
    "timestamp": "2023-03-14T15:49:38.581Z",
    "requestId": "05968b6d-6f82-4ae3-8e13-f92e0d0499c5",
    "buildId": "a9b200a3-734c-413a-a1ae-ce171d53e5a7",
    "rayId": "7a7daaf3bac2f325"
  }
}
```

If you want to customize this format, you can configure the `problemResponseFormat` function and return a `Response` in the format of your choice.

```ts
import { RuntimeExtensions } from "@zuplo/runtime";

export function runtimeInit(runtime: RuntimeExtensions) {
  runtime.problemResponseFormat = (
    { problem, statusText, additionalHeaders },
    request,
    context
  ) => {
    // Build the response body
    const body = JSON.stringify(problem, null, 2);

    // Send the response with headers and status
    return new Response(body, {
      status: problem.status,
      statusText,
      headers: {
        ...additionalHeaders,
        "content-type": "application/problem+json",
      },
    });
  };
}
```

### Hook: OnResponseSending

:::caution

This hook is in beta and will likely change before release.

:::

The `OnResponseSending` hook allows modification of the `Response` immediately before it is sent to the client. The hook provides the `Request` and `Response` and returns a `Response`. To modify the outgoing response create and return a `new Response()`.

The example below shows modifying the response for a specific path.

```ts
import { RuntimeExtensions } from "@zuplo/runtime";

export function runtimeInit(runtime: RuntimeExtensions) {
  runtime.addResponseSendingHook(async (request, response) => {
    const url = new URL(request.url);
    if (url.pathname === "/path-to-change-response") {
      return new Response("New Response", response);
    }
    return response;
  });
}
```

### Hook: OnResponseSent

:::caution

This hook is in beta and will likely change before release.

:::

The `OnResponseSent` hook fires immediately after the response is sent to the client. The `Response` in this hook is immutable and the body has been used. This hook is useful for custom performing various tasks like logging or analytics. This hook does not block the response being sent to the client.

```ts
import { RuntimeExtensions } from "@zuplo/runtime";

export function runtimeInit(runtime: RuntimeExtensions) {
  runtime.addResponseSentHook(async (request, response) => {
    await fetch("https://example.com", {
      method: "GET",
      body: "A response happened",
    });
  });
}
```

## Plugin and Handler Extensions

Built-in and custom plugins and handlers can expose their own extensibility. The [AWS Lambda handler](../handlers/aws-lambda.md) exposes the ability to customize the event that is sent when invoking the Lambda function.

The example below shows how to use a route's custom property to set the path on the outgoing event to a custom value.

```ts
import { AwsLambdaHandlerExtensions, RuntimeExtensions } from "@zuplo/runtime";

export function runtimeInit(runtime: RuntimeExtensions) {
  AwsLambdaHandlerExtensions.addSendingAwsLambdaEventHook(
    async (request, context, event: AwsLambdaEventV1) => {
      event.path = context.custom.lambdaPath ?? event.path;
      return event;
    }
  );
}
```
