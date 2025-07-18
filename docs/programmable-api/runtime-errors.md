---
title: Runtime Errors
---

Zuplo provides specialized error classes for handling runtime and configuration
errors in your API gateway.

## RuntimeError

The `RuntimeError` class extends the standard JavaScript `Error` class and
provides additional functionality for including extension members in error
responses.

### Constructor

```ts
new RuntimeError(message: string, options?: ErrorOptions)
new RuntimeError(
  info: {
    message: string;
    extensionMembers?: Record<string, unknown>
  },
  options?: ErrorOptions
)
```

Creates a new runtime error with optional extension data.

- `message` - The error message
- `info` - Object containing message and optional extension members
- `options` - Standard error options (e.g., `cause`)

### Properties

**`extensionMembers`**

Additional data included with the error for context and debugging.

```ts
extensionMembers?: Record<string, unknown>
```

### Example

```ts
import { RuntimeError, ZuploContext, ZuploRequest } from "@zuplo/runtime";

export default async function handler(
  request: ZuploRequest,
  context: ZuploContext,
) {
  try {
    // Some operation that might fail
    const result = await riskyOperation();
    return new Response(JSON.stringify(result));
  } catch (error) {
    // Throw a RuntimeError with additional context
    throw new RuntimeError(
      {
        message: "Failed to process request",
        extensionMembers: {
          requestId: context.requestId,
          operation: "riskyOperation",
          timestamp: new Date().toISOString(),
        },
      },
      { cause: error },
    );
  }
}
```

## ConfigurationError

The `ConfigurationError` class extends `RuntimeError` and is specifically
designed for configuration-related errors.

### Constructor

```ts
new ConfigurationError(message: string, options?: ErrorOptions)
```

Creates a new configuration error.

- `message` - The error message describing the configuration issue
- `options` - Standard error options

### Example

```ts
import {
  ConfigurationError,
  ZuploContext,
  ZuploRequest,
  environment,
} from "@zuplo/runtime";

export default async function handler(
  request: ZuploRequest,
  context: ZuploContext,
) {
  const apiKey = environment.EXTERNAL_API_KEY;

  if (!apiKey) {
    throw new ConfigurationError(
      "EXTERNAL_API_KEY environment variable is not configured",
    );
  }

  const maxRetries = parseInt(environment.MAX_RETRIES || "3");

  if (isNaN(maxRetries) || maxRetries < 1) {
    throw new ConfigurationError("MAX_RETRIES must be a positive integer");
  }

  // Continue with properly configured values
  return fetch("https://api.example.com", {
    headers: { "X-API-Key": apiKey },
  });
}
```

## Error Handling Best Practices

### 1. Use Specific Error Types

```ts
import { ConfigurationError, RuntimeError } from "@zuplo/runtime";

// For configuration issues
if (!config.isValid()) {
  throw new ConfigurationError(
    "Invalid configuration: missing required fields",
  );
}

// for runtime issues
if (response.status === 503) {
  throw new RuntimeError({
    message: "Service temporarily unavailable",
    extensionMembers: {
      retryAfter: response.headers.get("Retry-After"),
      service: "external-api",
    },
  });
}
```

### 2. Include Helpful Context

```ts
throw new RuntimeError(
  {
    message: "Database query failed",
    extensionMembers: {
      query: "SELECT * FROM users WHERE id = ?",
      parameters: [userId],
      errorCode: "DB_CONNECTION_TIMEOUT",
      suggestion: "Check database connection settings",
    },
  },
  { cause: originalError },
);
```

### 3. Use Error Boundaries in Policies

```ts
import { RuntimeError, ZuploContext, ZuploRequest } from "@zuplo/runtime";

export default async function customPolicy(
  request: ZuploRequest,
  context: ZuploContext,
  options: any,
  policyName: string,
) {
  try {
    // Policy logic here
    return request;
  } catch (error) {
    // Log the error
    context.log.error("Policy execution failed", {
      policyName,
      error: error instanceof Error ? error.message : String(error),
    });

    // Re-throw as RuntimeError with context
    throw new RuntimeError(
      {
        message: `Policy '${policyName}' failed to execute`,
        extensionMembers: {
          policyName,
          originalError: error instanceof Error ? error.message : String(error),
        },
      },
      { cause: error },
    );
  }
}
```

## Integration with Problem Details

When using [HttpProblems](./http-problems.md), errors can be automatically
converted to RFC 7807 Problem Details responses:

```ts
import {
  RuntimeError,
  HttpProblems,
  ZuploContext,
  ZuploRequest,
} from "@zuplo/runtime";

export default async function handler(
  request: ZuploRequest,
  context: ZuploContext,
) {
  try {
    // Your logic here
  } catch (error) {
    if (error instanceof ConfigurationError) {
      return HttpProblems.internalServerError(request, context, {
        detail: error.message,
        instance: `/errors/${context.requestId}`,
      });
    }

    if (error instanceof RuntimeError && error.extensionMembers) {
      return HttpProblems.internalServerError(request, context, {
        detail: error.message,
        ...error.extensionMembers,
      });
    }

    // Default error response
    return HttpProblems.internalServerError(request, context);
  }
}
```

## See Also

- [HttpProblems](./http-problems.md) - Creating standardized error responses
- [ZuploContext](./zuplo-context.md) - Context object with logging capabilities
