---
title: ContextData - Sharing Request Data
sidebar_label: ContextData
---

It's often useful to store data throughout the life of a single request. This
data could be used on multiple policies, handlers, or for logging. However,
because the Zuplo runtime is asynchronous, you can't simply create global
variables and reference them in other modules if the value is unique across
requests. Additionally, using a traditional data structure like a `Map` is also
not recommended as it can build up memory over time.

## ContextData

The `ContextData` utility store data that's tied to a specific request.
Additionally, this utility ensures that data stored is garbage collected
(removed from memory) when the request is complete.

**`ContextData.set`**

Static method to store data in the context.

```ts
ContextData.set(context, "my-data", { prop1: "hello world" });
```

**`ContextData.get`**

Static method to retrieve data from the context.

```ts
const data = ContextData.get(context, "my-data");
```

**`set` (instance method)**

Stores data in the context using an instance.

```ts
const myData = new ContextData("my-data");
myData.set(context, { prop1: "hello world" });
```

**`get` (instance method)**

Retrieves data from the context using an instance.

```ts
const myData = new ContextData("my-data");
const data = myData.get(context);
```

### Typing

The methods of `ContextData` support generics in order to support typing.

```ts
const myData = new ContextData<{ key: string }>("my-data");
ContextData.get<{ key: string }>(context, "my-data");
ContextData.set<{ key: string }>(context, "my-data", { key: "hello" });
```

## How NOT to Share Data

Below are a few examples of how **NOT** to share data in your API.

:::danger

Don't write code like this in your API. It won't work reliably. These are
examples of what NOT to do. See the next section for best practices.

:::

The first example uses a simple shared global variable called `currentRequestId`
to store the current `requestId`. On the surface this looks straightforward.
However, because the gateway is being shared among many requests who are all
running at the same time, the value of `currentRequestId` is completely
unpredictable when your API is under load.

```ts title="/modules/policies.ts"
let currentRequestId: string | undefined;

export function myFirstPolicy(request: ZuploRequest, context: ZuploContext) {
  currentRequestId = context.requestId;
  context.log.info(`The current requestId is: ${currentRequestId}`);
}

export function mySecondPolicy(request: ZuploRequest, context: ZuploContext) {
  currentRequestId = context.requestId;
  context.log.info(`The current requestId is: ${currentRequestId}`);
}
```

## Using ContextData

Below you will find examples of how to use `ContextData` to safely share data
throughout the lifecycle of a request.

### Using static methods

```ts
import { ContextData, ZuploContext, ZuploRequest } from "@zuplo/runtime";

export function myFirstPolicy(request: ZuploRequest, context: ZuploContext) {
  ContextData.set(context, "currentRequestId", context.requestId);

  const currentRequestId = ContextData.get(context, "currentRequestId");
  context.log.info(`The current requestId is: ${currentRequestId}`);
}
```

### Using Shared Variable

Reusable class shared across modules The shared module allows other modules to
access the same storage without passing the string name or type around.

```ts
export const myData = new ContextData<{ prop1: string }>("my-data");
```

Then use the class in another module.

```ts
import { myData } from "./my-module";
const data = myData.get(context);
myData.set(context, data);
```
