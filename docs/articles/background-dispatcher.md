---
title: BackgroundDispatcher
sidebar_label: BackgroundDispatcher
---

The BackgroundDispatcher class is used to group outbound transmission into
batches. This is useful for logging and analytics calls to external services
were you don't need or want to send information 1:1 with requests arriving into
the gateway. The BackgroundDispatcher will group entries and invoke a callback,
specified by you, with a batch of entries every 'n' milliseconds.

:::note

This component is in Beta - please use with care and provide feedback to the
team if you encounter any issues.

:::

Below is an example usage

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

The dispatcher will invoke the dispatch function with a batch of records at most
ever 'n' milliseconds (as set in the options) if there are items enqueued. If
items are not enqueued the function will not be invoked.

Note, there are no automatic retries for failed dispatch functions, but you can
implement this yourself in the dispatch function.

## Constructing the BackgroundDispatcher

The dispatcher is only useful if used by multiple request, thus it must be
placed somewhere in code that can be reached from multiple requests. We
recommend doing this at the module level. You can also create a Set to store
multiple at the module level keyed by name if necessary.

The `options.msDelay` parameter is required and must be a valid non-zero number.

```ts
const backgroundDispatcher = new BackgroundDispatcher<TestEntry>(
  dispatchFunction,
  { msDelay: 100 },
);
```

## Setting the delay

The longer the delay, the larger your batches will get and the less frequently
you'll send batched information. However, on a busy server this could build up a
lot of memory and potentially cause an OOM (out-of-memory) situation.

The shorter the delay, the more frequently you'll send smaller batches. We
typically recommend 10ms for very high traffic gateways and 100ms for lower
traffic gateways.
