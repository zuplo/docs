---
title: ProblemResponseFormatter
sidebar_label: ProblemResponseFormatter
---

The `ProblemResponseFormatter` class provides a way to customize the format of
problem responses in your API. This allows you to maintain consistent error
response formats across your API while adhering to the
[RFC 7807 Problem Details](https://httpproblems.com/) specification.

## Overview

The `ProblemResponseFormatter` class works in conjunction with the
`HttpProblems` helper to format error responses. It can be used to customize how
problem details are serialized and presented to API consumers.

## Static Methods

### format

Formats a problem response with the provided details.

```typescript
static format(
  problemDetails: ProblemResponseDetails,
  request: ZuploRequest,
  context: ZuploContext
): Promise<Response>
```

#### Parameters

- **problemDetails**: `ProblemResponseDetails` - The problem details to format
- **request**: `ZuploRequest` - The current request object
- **context**: `ZuploContext` - The current context object

#### Returns

A `Promise<Response>` containing the formatted problem response.

## Usage

### Basic Usage

```typescript
import {
  ProblemResponseFormatter,
  ZuploRequest,
  ZuploContext,
} from "@zuplo/runtime";

export default async function handler(
  request: ZuploRequest,
  context: ZuploContext,
) {
  try {
    // Your handler logic
  } catch (error) {
    const problemDetails = {
      type: "https://example.com/errors/validation-failed",
      title: "Validation Failed",
      status: 400,
      detail: "The request body contains invalid fields",
      instance: request.url,
    };

    return ProblemResponseFormatter.format(problemDetails, request, context);
  }
}
```

### Custom Error Handler

```typescript
import {
  ProblemResponseFormatter,
  RuntimeExtensions,
  ProblemResponseDetails,
} from "@zuplo/runtime";

export function runtimeInit(runtime: RuntimeExtensions) {
  runtime.addErrorHandler(async (error, request, context) => {
    // Map errors to problem details
    const problemDetails: ProblemResponseDetails = {
      type: "https://api.example.com/errors/internal",
      title: "Internal Server Error",
      status: 500,
      detail: error.message,
      instance: request.url,
      // Add custom extensions
      extensions: {
        errorId: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
      },
    };

    return ProblemResponseFormatter.format(problemDetails, request, context);
  });
}
```

## Problem Response Details Interface

The `ProblemResponseDetails` interface defines the structure of problem details:

```typescript
interface ProblemResponseDetails {
  type?: string; // URI reference for the problem type
  title: string; // Short, human-readable summary
  status: number; // HTTP status code
  detail?: string; // Human-readable explanation
  instance?: string; // URI reference for the specific occurrence
  extensions?: Record<string, any>; // Additional problem-specific details
}
```

## Integration with HttpProblems

The `ProblemResponseFormatter` is used internally by the `HttpProblems` helper
class. When you use `HttpProblems` methods, they utilize
`ProblemResponseFormatter` to ensure consistent formatting:

```typescript
// This internally uses ProblemResponseFormatter
return HttpProblems.badRequest(request, context, {
  detail: "Invalid request parameters",
});
```

## Custom Formatting Example

You can extend problem responses with custom fields:

```typescript
import { ProblemResponseFormatter } from "@zuplo/runtime";

export async function customErrorHandler(
  error: Error,
  request: ZuploRequest,
  context: ZuploContext,
) {
  const problemDetails = {
    type: "https://api.example.com/errors/business-rule",
    title: "Business Rule Violation",
    status: 422,
    detail: error.message,
    instance: request.url,
    // Custom extensions
    extensions: {
      code: "BRV_001",
      timestamp: new Date().toISOString(),
      requestId: context.requestId,
      supportUrl: "https://support.example.com",
    },
  };

  return ProblemResponseFormatter.format(problemDetails, request, context);
}
```

## Response Format

The formatter produces responses in the standard Problem Details format:

```json
{
  "type": "https://api.example.com/errors/validation-failed",
  "title": "Validation Failed",
  "status": 400,
  "detail": "The 'email' field is invalid",
  "instance": "/api/users",
  "code": "VAL_001",
  "timestamp": "2024-01-15T10:30:00Z",
  "requestId": "req_123abc"
}
```

## See Also

- [HttpProblems](./http-problems.md)
- [Runtime Extensions](./runtime-extensions.md)
- [Runtime Errors](./runtime-errors.md) - Error handling with RuntimeError and
  ConfigurationError
