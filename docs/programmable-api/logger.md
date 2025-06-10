---
title: Logger
---

The `Logger` interface provides structured logging capabilities throughout your
Zuplo API gateway. The logger is accessible via the `context.log` property and
supports multiple log levels.

## Interface

```ts
interface Logger {
  debug(...messages: unknown[]): void;
  info(...messages: unknown[]): void;
  warn(...messages: unknown[]): void;
  error(...messages: unknown[]): void;
  log(...messages: unknown[]): void;
}
```

## Log Levels

The logger supports the following levels (from least to most severe):

- `debug` - Detailed information for debugging
- `info` - General informational messages
- `warn` - Warning messages for potentially problematic situations
- `error` - Error messages for failures and exceptions
- `log` - Alias for `info` level

## Usage

The logger is available on the [ZuploContext](./zuplo-context.md) object:

```ts
import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

export default async function handler(
  request: ZuploRequest,
  context: ZuploContext,
) {
  // Log at different levels
  context.log.debug("Detailed debug information");
  context.log.info("Request received", { path: request.url });
  context.log.warn("Deprecated endpoint accessed");
  context.log.error("Failed to process request", { error: "Invalid input" });

  return new Response("OK");
}
```

## Structured Logging

The logger accepts multiple arguments and automatically serializes objects:

```ts
// Log simple strings
context.log.info("User authenticated");

// Log objects
context.log.info({
  userId: "user-123",
  action: "login",
  timestamp: Date.now(),
});

// Log multiple arguments
context.log.info(
  "Processing request",
  {
    method: request.method,
    path: request.url,
  },
  "additional info",
);

// Log arrays
context.log.debug(["step1", "step2", "step3"]);

// Log errors
try {
  await riskyOperation();
} catch (error) {
  context.log.error("Operation failed", {
    error: error.message,
    stack: error.stack,
  });
}
```

## Automatic Request ID

The logger automatically includes the request ID with every log entry:

```ts
context.log.info("Processing payment");
// Output includes: { "message": "Processing payment", "requestId": "req_abc123..." }
```

## Environment Configuration

Log levels vary by environment:

- **Development/Preview**: Typically set to `debug` or `info` level
- **Production**: Typically set to `error` level only

## Best Practices

### 1. Use Appropriate Log Levels

```ts
// Debug - detailed information for troubleshooting
context.log.debug("Cache lookup", { key: cacheKey, ttl: 300 });

// Info - general application flow
context.log.info("Order created", { orderId: "order-123", total: 99.99 });

// Warn - concerning but not critical
context.log.warn("Rate limit approaching", { current: 95, limit: 100 });

// Error - failures and exceptions
context.log.error("Payment failed", {
  orderId: "order-123",
  errorCode: "INSUFFICIENT_FUNDS",
});
```

### 2. Include Contextual Information

```ts
export default async function handler(
  request: ZuploRequest,
  context: ZuploContext,
) {
  const startTime = Date.now();
  const userId = request.user?.sub;

  context.log.info("Request started", {
    userId,
    method: request.method,
    path: new URL(request.url).pathname,
    userAgent: request.headers.get("user-agent"),
  });

  try {
    const result = await processRequest(request);

    context.log.info("Request completed", {
      userId,
      duration: Date.now() - startTime,
      status: "success",
    });

    return new Response(JSON.stringify(result));
  } catch (error) {
    context.log.error("Request failed", {
      userId,
      duration: Date.now() - startTime,
      error: error.message,
      stack: error.stack,
    });

    throw error;
  }
}
```

### 3. Avoid Logging Sensitive Data

```ts
// DON'T log sensitive information
context.log.info("User login", {
  email: user.email,
  password: user.password, // Never log passwords!
});

// DO log safe identifiers
context.log.info("User login", {
  userId: user.id,
  email: user.email.replace(/(.{2}).*(@.*)/, "$1***$2"), // Partially masked
});
```

### 4. Use Structured Data for Better Querying

```ts
// Good - structured data that can be queried
context.log.info("API call completed", {
  service: "payment-processor",
  operation: "charge",
  duration: 1234,
  status: "success",
  amount: 99.99,
  currency: "USD",
});

// Less useful - unstructured string
context.log.info(`Payment of $99.99 USD processed in 1234ms`);
```

## Integration with Log Management

Logs are automatically forwarded to your configured log management solution
(DataDog, Loki, etc.). The structured format makes it easy to:

- Search and filter logs
- Create alerts based on log patterns
- Generate metrics from log data
- Trace requests across services

## Performance Considerations

- Logging has minimal performance impact
- Logs are processed asynchronously
- In production, use `error` level to reduce log volume
- Avoid logging large objects or sensitive data

## See Also

- [ZuploContext](./zuplo-context.md) - The context object that provides the
  logger
- [Logging](../articles/logging.md) - General logging documentation
- [Log Export](../articles/log-export.md) - Exporting logs to external services
