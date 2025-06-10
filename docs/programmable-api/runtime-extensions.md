---
title: Runtime Extensions
---

While most configuration in your Zuplo gateway is set on a per-route or
per-policy basis, there are times when behaviors need to be modified globally.
To plug into the global initialization of your gateway, create a file called
`zuplo.runtime.ts` in the `modules` folder with the following code.

:::warning

Any error thrown in the `runtimeInit` method will prevent the gateway from
starting and yield a 500 error for all requests. Be sure to add only reliable
code here and use `try/catch` as appropriate to handle any recoverable
exceptions.

:::

```ts
import { RuntimeExtensions } from "@zuplo/runtime";

export function runtimeInit(runtime: RuntimeExtensions) {
  // Extensions go here
}
```

:::note

The name of the export must be `runtimeInit` and must conform to the above
function signature.

:::

The following configurations are available.

## Custom Problem (Error) Response Formatter

Zuplo includes built-in error handling that returns errors in the format of the
[Problem Details for HTTP APIs](http://httpproblems.com/) proposed standard.
This means that HTTP errors (or other exceptions) will return responses that
look like the following.

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

If you want to customize this format, you can configure the
`problemResponseFormat` function and return a `Response` in the format of your
choice.

```ts
import { RuntimeExtensions } from "@zuplo/runtime";

export function runtimeInit(runtime: RuntimeExtensions) {
  runtime.problemResponseFormat = (
    { problem, statusText, additionalHeaders },
    request,
    context,
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

## Hooks

Hooks allow code to be run as part of the request/response pipeline. Hooks can
be created at the API level in `zuplo.runtime.ts` as shown below or can be added
[via a plugin](./hooks.md).

:::tip

All hooks can be either synchronous or asynchronous. To make your hook
asynchronous simply add the `async` keyword on the function.

:::

The following hooks can be set globally in the `zuplo.runtime.ts`:

### Hook: OnPreRouting

Runs before the request is matched to a route. This is useful if you want to
customize the routing behaviour. Example use cases include:

- Routing to a different url based on a header value
- Normalizing urls to be all lowercase

```ts
import { RuntimeExtensions } from "@zuplo/runtime";

export function runtimeInit(runtime: RuntimeExtensions) {
  runtime.addPreRoutingHook(async (request) => {
    const nr = new Request(request.url.toLowerCase(), request);
    return nr;
  });
}
```

### Hook: OnRequest

Runs when a request is received, before any plugins or handlers.

```ts
import { RuntimeExtensions } from "@zuplo/runtime";

export function runtimeInit(runtime: RuntimeExtensions) {
  runtime.addRequestHook((request, context) => {
    // Code here

    // Can return a request or a response. If a response is returned the
    // pipeline stops and the response is returned.
    return request;
  });
}
```

### Hooks: OnResponseSending

Runs before a response is sent. Response can be modified.
[More details.](/docs/articles/hooks#hook-onresponsesending)

```ts
import { RuntimeExtensions } from "@zuplo/runtime";

export function runtimeInit(runtime: RuntimeExtensions) {
  runtime.addResponseSendingHook((response, request, context) => {
    // Code here
    return response;
  });
}
```

### Hooks: OnResponseSendingFinal

Runs before a response is sent. The response can't be modified.
[More details.](/docs/articles/hooks#hook-onresponsesendingfinal)

```ts
import { RuntimeExtensions } from "@zuplo/runtime";

export function runtimeInit(runtime: RuntimeExtensions) {
  runtime.addResponseSendingFinalHook((response, request, context) => {
    // Code here
  });
}
```

## Plugin and Handler Extensions

Built-in and custom plugins and handlers can expose their own extensibility. For
example, [AWS Lambda handler](../handlers/aws-lambda.md) exposes the ability to
customize the event that's sent when invoking the Lambda function.

The example below shows how to use a route's custom property to set the path on
the outgoing event to a custom value.

```ts
import {
  AwsLambdaHandlerExtensions,
  RuntimeExtensions,
  ContextData,
} from "@zuplo/runtime";

export function runtimeInit(runtime: RuntimeExtensions) {
  AwsLambdaHandlerExtensions.addSendingAwsLambdaEventHook(
    async (request, context, event: AwsLambdaEventV1) => {
      const lambdaPath = ContextData.get(context, "lambdaPath");
      event.path = lambdaPath ?? event.path;
      return event;
    },
  );
}
```
