---
title: Environment Variables API
sidebar_label: Environment Variables
---

The `environment` object provides access to environment variables in your Zuplo
API gateway. It returns a record of environment variable names to their values.

:::info{title="Configuration Guide"}

For information on how to set and manage environment variables in the Zuplo
Portal, see
[Configuring Environment Variables](../articles/environment-variables.md).

:::

## Interface

```ts
const environment: Record<string, string | undefined>;
```

## Usage

Access environment variables using the `environment` object:

```ts
import { environment, ZuploContext, ZuploRequest } from "@zuplo/runtime";

export default async function handler(
  request: ZuploRequest,
  context: ZuploContext,
) {
  // Access environment variables
  const apiKey = environment.API_KEY;
  const apiUrl = environment.API_BASE_URL;

  if (!apiKey) {
    throw new Error("API_KEY environment variable is not set");
  }

  const response = await fetch(`${apiUrl}/data`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  return response;
}
```

## Type Safety

Since environment variables might not be defined, they return
`string | undefined`:

```ts
import { environment } from "@zuplo/runtime";

// TypeScript knows this could be undefined
const value = environment.MY_VAR; // string | undefined

// Always check before using
if (value) {
  // value is string here
  console.log(value.toUpperCase());
}

// Or provide a default
const port = environment.PORT || "3000";
```

## Common Patterns

### Required Environment Variables

Create a helper to validate required variables:

```ts
import { environment, ConfigurationError } from "@zuplo/runtime";

function getRequiredEnv(name: string): string {
  const value = environment[name];
  if (!value) {
    throw new ConfigurationError(
      `Required environment variable '${name}' is not set`,
    );
  }
  return value;
}

// Usage
export default async function handler(
  request: ZuploRequest,
  context: ZuploContext,
) {
  const apiKey = getRequiredEnv("API_KEY");
  const apiUrl = getRequiredEnv("API_BASE_URL");

  // Both are guaranteed to be strings
  return fetch(`${apiUrl}/endpoint`, {
    headers: { "X-API-Key": apiKey },
  });
}
```

### Configuration Object

Create a configuration object from environment variables:

```ts
import { environment, ConfigurationError } from "@zuplo/runtime";

interface Config {
  apiKey: string;
  apiUrl: string;
  maxRetries: number;
  timeout: number;
  debug: boolean;
}

function loadConfig(): Config {
  const apiKey = environment.API_KEY;
  const apiUrl = environment.API_URL;

  if (!apiKey || !apiUrl) {
    throw new ConfigurationError("Missing required environment variables");
  }

  return {
    apiKey,
    apiUrl,
    maxRetries: parseInt(environment.MAX_RETRIES || "3"),
    timeout: parseInt(environment.TIMEOUT_MS || "5000"),
    debug: environment.DEBUG === "true",
  };
}

// Load once and reuse
const config = loadConfig();

export default async function handler(
  request: ZuploRequest,
  context: ZuploContext,
) {
  if (config.debug) {
    context.log.debug("Request received", { url: request.url });
  }

  // Use config values
  return fetchWithRetry(config.apiUrl, {
    headers: { Authorization: `Bearer ${config.apiKey}` },
    maxRetries: config.maxRetries,
    timeout: config.timeout,
  });
}
```

### Environment-Specific Configuration

To handle environment-specific logic, use environment variables that you define:

```ts
import { environment } from "@zuplo/runtime";

// Define your own environment variable to identify the environment
const isProduction = environment.ENVIRONMENT === "production";
const isStaging = environment.ENVIRONMENT === "staging";
const isDevelopment = environment.ENVIRONMENT === "development";

export default async function handler(
  request: ZuploRequest,
  context: ZuploContext,
) {
  // Use different endpoints based on environment
  const apiUrl = isProduction
    ? "https://api.example.com"
    : isStaging
      ? "https://staging-api.example.com"
      : "https://dev-api.example.com";

  // Enable debug logging in non-production
  if (!isProduction) {
    context.log.debug("Incoming request", {
      headers: Object.fromEntries(request.headers),
      url: request.url,
    });
  }

  // Use stricter security in production
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (isProduction) {
    headers["Strict-Transport-Security"] = "max-age=31536000";
  }

  return new Response("OK", { headers });
}
```

### Secret Management

```ts
import { environment } from "@zuplo/runtime";

// Group related secrets
const secrets = {
  database: {
    host: environment.DB_HOST || "localhost",
    port: environment.DB_PORT || "5432",
    user: environment.DB_USER,
    password: environment.DB_PASSWORD,
    name: environment.DB_NAME || "myapp",
  },
  redis: {
    url: environment.REDIS_URL || "redis://localhost:6379",
  },
  external: {
    stripeKey: environment.STRIPE_SECRET_KEY,
    sendgridKey: environment.SENDGRID_API_KEY,
  },
};

// Validate all required secrets on startup
function validateSecrets() {
  const missing: string[] = [];

  if (!secrets.database.user) missing.push("DB_USER");
  if (!secrets.database.password) missing.push("DB_PASSWORD");
  if (!secrets.external.stripeKey) missing.push("STRIPE_SECRET_KEY");

  if (missing.length > 0) {
    throw new ConfigurationError(
      `Missing required secrets: ${missing.join(", ")}`,
    );
  }
}

// Run validation
validateSecrets();
```

## Environment Detection

Zuplo does not provide a built-in `NODE_ENV` variable since it runs on a custom
V8 runtime, not Node.js. To implement environment-specific logic, define your
own environment variables (e.g., `ENVIRONMENT`, `STAGE`, or `ENV_TYPE`) and set
them appropriately for each environment in your project settings.

## Best Practices

### 1. Use Descriptive Names

```ts
// Good
environment.STRIPE_WEBHOOK_SECRET;
environment.DATABASE_CONNECTION_STRING;
environment.SLACK_WEBHOOK_URL;

// Less clear
environment.KEY;
environment.URL;
environment.SECRET;
```

### 2. Provide Defaults Where Appropriate

```ts
const config = {
  port: environment.PORT || "3000",
  logLevel: environment.LOG_LEVEL || "info",
  maxConnections: parseInt(environment.MAX_CONNECTIONS || "100"),
  enableCache: environment.ENABLE_CACHE !== "false", // Default true
};
```

### 3. Validate Early

```ts
// Validate at module load time, not request time
const apiKey = environment.API_KEY;
if (!apiKey) {
  throw new ConfigurationError("API_KEY must be set");
}

export default async function handler(
  request: ZuploRequest,
  context: ZuploContext,
) {
  // apiKey is guaranteed to exist here
  return fetch("https://api.example.com", {
    headers: { "X-API-Key": apiKey },
  });
}
```

### 4. Don't Log Secrets

```ts
// DON'T do this
context.log.info("Config loaded", {
  apiKey: environment.API_KEY,
});

// DO this instead
context.log.info("Config loaded", {
  apiKeyPresent: !!environment.API_KEY,
  apiKeyLength: environment.API_KEY?.length,
});
```

## Setting Environment Variables

Environment variables are set in the Zuplo Portal:

1. Navigate to your project
2. Go to Settings → Environment Variables
3. Add variables for each environment (production, preview, development)
4. Variables are encrypted at rest and in transit

## See Also

- [Environment Variables](../articles/environment-variables.md) - Setting up
  environment variables
- [ConfigurationError](./runtime-errors.md#configurationerror) - Error handling
  for configuration issues
