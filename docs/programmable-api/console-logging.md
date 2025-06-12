---
title: Console Logging
sidebar_label: Console Logging
---

Zuplo supports standard JavaScript console logging methods as a convenience for
developers. These console methods map directly to the Zuplo context logger
methods.

## Supported Methods

The following console methods are supported:

- `console.log()` - Maps to `context.log.info()`
- `console.info()` - Maps to `context.log.info()`
- `console.warn()` - Maps to `context.log.warn()`
- `console.error()` - Maps to `context.log.error()`
- `console.debug()` - Maps to `context.log.debug()`

## Usage

You can use console methods anywhere in your Zuplo code:

```ts
export default async function (request: ZuploRequest, context: ZuploContext) {
  console.log("Processing request", request.url);

  try {
    const result = await processRequest(request);
    console.info("Request processed successfully");
    return result;
  } catch (error) {
    console.error("Error processing request:", error);
    throw error;
  }
}
```

## Limitations

- Only the standard logging methods listed above are supported
- Other console methods (like `console.table()`, `console.time()`, etc.) are
  no-ops and will not produce any output
- For advanced logging features and structured logging, use the
  [context logger](./logger.md) directly

## See Also

- [Logger](./logger.md) - Using the context logger
- [Logging Guide](../articles/logging.md) - Detailed logging documentation
