---
title: BackgroundDispatcher
sidebar_label: BackgroundDispatcher
---

The BackgroundDispatcher class batches outbound transmissions for efficient
processing. It's ideal for logging and analytics calls to external services
where you don't need 1:1 transmission with incoming requests. The dispatcher
groups entries and invokes your callback with batches at regular intervals.

## Constructor

```ts
new BackgroundDispatcher<T>(
  dispatchFunction: (entries: T[]) => Promise<void>,
  options: { msDelay: number }
)
```

Creates a new background dispatcher instance.

- `dispatchFunction` - Async function called with batched entries
- `options.msDelay` - Milliseconds between dispatch calls (required, non-zero)
- `T` - The type of entries being batched

## Methods

**`enqueue`**

Adds an entry to the batch queue for later dispatch.

```ts
enqueue(entry: T, context: ZuploContext): void
```

## Example

```ts

import { ZuploContext, ZuploRequest, BackgroundDispatcher, environment } from "@zuplo/runtime";

// The type that identifies the entries
// to be batched
interface ExampleEntry {
  message: string;
}


// The dispatch function that will be invoked by the
// BatchDispatcher at most every 'n' milliseconds
const dispatchFunction<TestEntry> = async (entries) => {

    // consider implementing a retry or backup call
    // if the data being transmitted is important
    await fetch(`https://example-logging-service.com/`,
    {
        method: "POST",
        headers: {
            "api-key": environment.MY_LOGGING_API_KEY
        }
        body: JSON.stringify(entries)
    })
};

// The dispatcher is typically initiated at the module level
// so it can be shared by requests. Note that the msDelay is set
// to 100ms.
const backgroundDispatcher = new BackgroundDispatcher<TestEntry>(
  dispatchFunction,
  { msDelay: 100 }
);


// This is an example Request Handler that used the component, a simple
// "Hello World" handler.
export default async function (request: ZuploRequest, context: ZuploContext) {
  backgroundDispatcher.enqueue(
    {
        message: `new request on '${request.url}' with id ${context.requestId}`
    },
    context);

  return "Hello World!";
}

```

The dispatcher invokes the dispatch function with batched records at most every
'n' milliseconds (as configured) when items are enqueued. If no items are
enqueued, the function won't be invoked.

:::tip There are no automatic retries for failed dispatch functions. Implement
retry logic in your dispatch function if needed. :::

## Best Practices

### Module-Level Initialization

Initialize the dispatcher at the module level so it can be shared across
multiple requests:

```ts
// Create at module level
const dispatcher = new BackgroundDispatcher<LogEntry>(dispatchFunction, {
  msDelay: 100,
});

// Or use a Map for multiple dispatchers
const dispatchers = new Map<string, BackgroundDispatcher<any>>();
```

### Choosing the Right Delay

The longer the delay, the larger your batches will get and the less frequently
you'll send batched information. However, on a busy server this could build up a
lot of memory and potentially cause an OOM (out-of-memory) situation.

The shorter the delay, the more frequently you'll send smaller batches. We
typically recommend 10ms for very high traffic gateways and 100ms for lower
traffic gateways.
