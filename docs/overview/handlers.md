---
sidebar_position: 4
title: Using Handlers
---

Handlers are the core of the Zuplo API gateway. Handlers are responsible for streaming a response from your downstream API or a place where you can write custom code for any scenario.

Handlers are in the middle of the request lifecycle of Zuplo between inbound and outbound [policies](./policies.md).

Zuplo comes with several built-in handlers as well as the ability to write your own with a custom module.

## Built In Handlers

There are several built-in handlers including [URL Rewrite](../handlers/url-rewrite.md) and [AWS Lambda](../handlers/aws-lambda.md) that allow you to execute requests without writing any code.

## Custom Handlers

If one of the built in handlers doesn't meet your needs, you can write anything needed in a custom handler. Custom handlers are simple Javascript/Typescript functions with the following signature.

```ts
import { ZuploRequest, ZuploContext } from "@zuplo/runtime";

export default async function (request: ZuploRequest, context: ZuploContext) {
  // Your code here
}
```

A handler can make requests to external resources.

```ts
import { ZuploRequest, ZuploContext } from "@zuplo/runtime";

export default async function (request: ZuploRequest, context: ZuploContext) {
  return fetch("https://echo.zuplo.io");
}
```

Or a handler can return custom content.

```ts
import { ZuploRequest, ZuploContext } from "@zuplo/runtime";

export default async function (request: ZuploRequest, context: ZuploContext) {
  return new Response("What's Zup?");
}
```

[To learn more about custom handlers see the reference.](../handlers/custom-handler.md)
