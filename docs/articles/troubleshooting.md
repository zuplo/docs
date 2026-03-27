---
title: Troubleshooting
sidebar_label: Troubleshooting
---

This guide covers common errors you may encounter when building, deploying, and
running your Zuplo API gateway, along with steps to diagnose and fix them.

## Build errors

Build errors prevent your project from compiling during deployment. The gateway
returns a `BUILD_ERROR` when this happens.

### TypeScript compilation errors

Type mismatches, missing type definitions, or invalid syntax prevent the build
from completing. Check the deployment logs for the file name, line number, and
error description.

**Fix:** Run your build locally before deploying to catch these errors early:

```bash
npx zuplo test
```

### Module resolution failures

Imports that do not start with `./` or `../` and have no matching `paths`
mapping in `tsconfig.json` fail to resolve.

```ts
// This fails if there is no paths mapping
import { myFunction } from "modules/my-module";

// Use a relative path instead
import { myFunction } from "./modules/my-module";
```

**Fix:** Use relative paths for local modules, or configure
`compilerOptions.paths` in your `tsconfig.json`. See
[TypeScript Configuration](./tsconfig.mdx) for details.

### Missing or incompatible packages

Zuplo does not run Node.js and does not run `npm install` during deployment.
Only npm packages that don't use native code or Node.js-specific APIs (like the
filesystem or `child_process`) are compatible. Packages must be installed
locally and their bundled output checked into source control.

**Fix:** Install the package locally, verify it works with `zuplo dev`, and
ensure the compiled output is committed to your repository. See
[Node Modules](../programmable-api/node-modules.mdx) for details on package
compatibility and limitations.

### Invalid route configuration

The `routes.oas.json` file contains syntax errors or references handlers and
policies that do not exist.

**Fix:** Validate that all `handler.module` and `handler.export` values in your
route configuration match actual modules and exported functions. Check for typos
in policy names referenced in the `policies.inbound` and `policies.outbound`
arrays.

## Deployment errors

### FATAL_PROJECT_ERROR

The gateway returns this error when the project has a critical configuration
issue that prevents it from starting.

**Fix:** Check the deployment logs in the Zuplo Portal for the specific error
message. Common causes include invalid `zuplo.runtime.ts` configuration or
broken runtime extensions.

### MAIN_MOD_ERROR

This error indicates that the main module failed to load at startup.

**Fix:** Verify that your `zuplo.runtime.ts` file (if present) exports valid
configuration and that all plugins are properly initialized. Check for runtime
errors in module-level code that runs during startup.

### NO_PROJECT_SET

This error typically occurs in local development when trying to run a project
that cannot build or is invalid.

**Fix:** Verify that your project structure is correct and that the project
builds successfully. See
[Local Development Troubleshooting](./local-development-troubleshooting.mdx) for
more details.

## Runtime errors

### Policy errors

When a policy throws an unhandled error, the gateway returns a `500` response.
Use `RuntimeError` or `ConfigurationError` from `@zuplo/runtime` to return
structured error responses instead.

```ts
import { RuntimeError, ZuploContext, ZuploRequest } from "@zuplo/runtime";

export default async function policy(
  request: ZuploRequest,
  context: ZuploContext,
) {
  const apiKey = request.headers.get("x-api-key");
  if (!apiKey) {
    throw new RuntimeError("Missing API key", { status: 401 });
  }
  return request;
}
```

See [Runtime Errors](../programmable-api/runtime-errors.mdx) for the full API.

### Handler errors

If a request handler throws an unhandled exception, the gateway returns a
generic error response. Wrap handler logic in try/catch blocks and return
meaningful error responses.

```ts
import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

export default async function handler(
  request: ZuploRequest,
  context: ZuploContext,
) {
  try {
    const response = await fetch("https://api.example.com/data");
    if (!response.ok) {
      context.log.error("Upstream request failed", {
        status: response.status,
      });
      return new Response("Bad Gateway", { status: 502 });
    }
    return response;
  } catch (err) {
    context.log.error("Handler error", { error: String(err) });
    return new Response("Internal Server Error", { status: 500 });
  }
}
```

### Timeout errors

Requests to upstream services can time out if the backend is slow or
unresponsive. The gateway enforces platform-level timeouts on outbound requests.

**Fix:** Check that your upstream service is healthy and responding within
acceptable timeframes. Add timeout handling in custom handlers using
`AbortSignal.timeout()`:

```ts
const response = await fetch("https://api.example.com/data", {
  signal: AbortSignal.timeout(5000), // 5 second timeout
});
```

## Debugging with logs

### Portal live logs

The Zuplo Portal provides real-time log viewing for deployed environments.
Navigate to your project in the portal and open the logs tab to see live request
logs and any messages logged with `context.log`.

### Using context.log

The `context.log` object is available in all handlers and policies. It supports
`debug`, `info`, `warn`, and `error` levels:

```ts
context.log.debug("Detailed debug information");
context.log.info("Request received", { path: request.url });
context.log.warn("Deprecated endpoint accessed");
context.log.error("Failed to process request", { error: "Invalid input" });
```

You can also attach custom properties to all subsequent log entries for a
request using `context.log.setLogProperties`:

```ts
context.log.setLogProperties({ customerId: "cust_123" });
```

### Log shipping

For production observability, ship logs to an external provider by configuring a
log plugin in your `zuplo.runtime.ts` file. Supported providers include AWS
CloudWatch, Datadog, Dynatrace, Google Cloud Logging, Loki, New Relic, Splunk,
and Sumo Logic.

See [Logging](./logging.mdx) for setup instructions.

## Request tracing with zp-rid

Every request processed by Zuplo is assigned a unique request ID. This ID is
returned in the `zp-rid` response header and is available in code as
`context.requestId`.

To trace a failed request:

1. Copy the `zp-rid` value from the response headers.
2. Search your log provider (Datadog, Loki, Splunk, etc.) for that `requestId`
   value.
3. All log entries for that request share the same `requestId`, so you can see
   the full request lifecycle.

You can also log the request ID explicitly for correlation:

```ts
context.log.info(`Processing request ${context.requestId}`);
```

Default log fields include `requestId`, `environment`, `environmentType`,
`environmentStage`, `buildId`, and `rayId`, which you can use to filter and
correlate across requests.

## Common gotchas

### Environment variables not set

Environment variables are only applied on new deployments. If you change a
variable value, you must redeploy the environment for the change to take effect.

Variables return `undefined` if not set. Always validate required variables
early:

```ts
import { environment, ConfigurationError } from "@zuplo/runtime";

const apiKey = environment.API_KEY;
if (!apiKey) {
  throw new ConfigurationError("API_KEY environment variable is not set");
}
```

See [Configuring Environment Variables](./environment-variables.mdx) for more
details.

### CORS misconfiguration

Common CORS issues include:

- **No CORS headers in response** - Verify the route has a `corsPolicy` set (not
  `none`) and that the request `Origin` matches one of the `allowedOrigins`.
- **Preflight returns 404** - Ensure the CORS policy is not set to `none` and
  the request method matches a method configured on the route.
- **Wildcard subdomain not matching** - The `*.` pattern only matches a single
  subdomain level. `https://*.example.com` does not match
  `https://v2.api.example.com` or `https://example.com`.
- **Credentials not working** - Set `allowCredentials` to `true` in the CORS
  policy.

See [Configuring CORS](./cors.mdx) for the full configuration reference.

### Rate limit surprises

Rate limiting policies apply per-environment. Preview and development
environments have their own rate limit counters separate from production.

If requests are unexpectedly rate limited, check:

- The rate limit policy configuration for the correct `requestsAllowed` and
  `timeWindowMinutes` values.
- Whether a per-user or per-IP rate limit is in use and the identifier is
  resolving correctly.
- Whether multiple rate limit policies are applied to the same route.

See [Rate Limiting](../policies/rate-limit-inbound.mdx) for configuration
details.

### GET or HEAD requests with a body

Sending a body with a `GET` or `HEAD` request results in a `GET_HEAD_BODY_ERROR`
response. Some HTTP clients attach a body by default.

**Fix:** Remove the request body for `GET` and `HEAD` requests, or change the
HTTP method to `POST` or `PUT` if a body is required.

## Getting help

If you cannot resolve an issue using this guide:

- Check the [Zuplo Errors](../errors.mdx) reference for detailed error
  descriptions.
- Reach out to support@zuplo.com or join the
  [Zuplo Discord server](https://discord.gg/8QbEjr2MgZ).
