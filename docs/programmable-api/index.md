---
title: Programmable API
sidebar_label: Overview
description:
  "This section provides a comprehensive index of all public APIs available in
  the Zuplo runtime. The APIs are organized by category for easy reference."
---

This section provides a comprehensive index of all public APIs available in the
Zuplo runtime. The APIs are organized by category for easy reference.

## Core Request/Response APIs

### ZuploRequest

- **Status**: Documented ([ZuploRequest](./zuplo-request.md))
- **Description**: Extended Request class with additional properties for params,
  query, and user data
- **Key Features**: Type-safe params and query access, user authentication data

### ZuploContext

- **Status**: Documented ([ZuploContext](./zuplo-context.md))
- **Description**: Context object available in all handlers and policies
- **Key Features**: Request ID, logging, route information, event hooks

### HttpProblems

- **Status**: Documented ([HttpProblems](./http-problems.md))
- **Description**: Utility class for generating RFC 7807 compliant problem
  responses
- **Methods**: Static methods for all HTTP status codes (e.g., `badRequest`,
  `unauthorized`, `notFound`)

### HttpStatusCode

- **Status**: Documented ([HttpProblems](./http-problems.md))
- **Description**: Enum containing all standard HTTP status codes

### ProblemResponseFormatter

- **Status**: Documented
  ([ProblemResponseFormatter](./problem-response-formatter.md))
- **Description**: Utility class for formatting RFC 7807 compliant problem
  responses
- **Methods**: `format` - Formats problem details into standard responses

## Handlers

See the [Handlers documentation](/docs/handlers) for information about built-in
request handlers.

### Available Handlers

- `awsLambdaHandler` - [AWS Lambda Handler](/docs/handlers/aws-lambda)
- `mcpServerHandler` - [MCP Server Handler](/docs/handlers/mcp-server)
- `openApiSpecHandler` - [OpenAPI Spec Handler](/docs/handlers/openapi)
- `redirectHandler` - [Redirect Handler](/docs/handlers/redirect)
- `urlForwardHandler` - [URL Forward Handler](/docs/handlers/url-forward)
- `urlRewriteHandler` - [URL Rewrite Handler](/docs/handlers/url-rewrite)
- `webSocketHandler` - [WebSocket Handler](/docs/handlers/websocket-handler)
- Custom handlers - [Function Handler](/docs/handlers/custom-handler)

## Caching APIs

### ZoneCache

- **Status**: Documented ([Zone Cache](./zone-cache.md))
- **Description**: Key-value cache with zone-level storage
- **Key Methods**: `get`, `put`, `delete`

### MemoryZoneReadThroughCache

- **Status**: Documented
  ([Memory Zone Read Through Cache](./memory-zone-read-through-cache.md))
- **Description**: In-memory cache with automatic loading
- **Key Methods**: `get`, `put`

### StreamingZoneCache

- **Status**: Documented ([Streaming Zone Cache](./streaming-zone-cache.md))
- **Description**: Cache for streaming responses
- **Key Methods**: `get`, `put`, `delete`

## Data Management

### ContextData

- **Status**: Documented ([Context Data](./context-data.md))
- **Description**: Type-safe context data storage
- **Key Methods**: `get`, `set`

### BackgroundLoader

- **Status**: Documented ([Background Loader](./background-loader.md))
- **Description**: Background data loading with caching
- **Key Methods**: `get`

### BackgroundDispatcher

- **Status**: Documented ([Background Dispatcher](./background-dispatcher.md))
- **Description**: Batch processing for background tasks
- **Key Methods**: `enqueue`

## Runtime Extensions

### RuntimeExtensions

- **Status**: Documented ([Runtime Extensions](./runtime-extensions.md))
- **Description**: API for extending runtime behavior
- **Key Features**: Plugin support, request/response hooks, custom error
  handling

### RuntimeError

- **Status**: Documented ([Runtime Errors](./runtime-errors.md))
- **Description**: Base error class for runtime errors

### ConfigurationError

- **Status**: Documented ([Runtime Errors](./runtime-errors.md))
- **Description**: Error class for configuration issues

## Plugins

### AuditLogPlugin

- **Status**: Documented ([Audit Log](./audit-log.md))
- **Description**: Comprehensive request/response logging
- **Key Features**: Configurable request/response capture, custom output
  providers

### Logging Plugins

See [Logging documentation](/docs/articles/logging.md) for details on logging
plugins:

- `AWSLoggingPlugin` - AWS CloudWatch logging
- `DataDogLoggingPlugin` - Datadog logging
- `DynaTraceLoggingPlugin` - Dynatrace logging
- `GoogleCloudLoggingPlugin` - Google Cloud logging
- `LokiLoggingPlugin` - Grafana Loki logging
- `NewRelicLoggingPlugin` - New Relic logging
- `SplunkLoggingPlugin` - Splunk logging
- `SumoLogicLoggingPlugin` - Sumo Logic logging
- `VMWareLogInsightLoggingPlugin` - VMware Log Insight logging

### Metrics Plugins

See [Metrics documentation](/docs/articles/metrics-plugins.md) for details on
metrics plugins:

- `DataDogMetricsPlugin` - Datadog metrics
- `DynatraceMetricsPlugin` - Dynatrace metrics
- `NewRelicMetricsPlugin` - New Relic metrics

### Storage Plugins

- `AzureBlobPlugin` - Azure Blob Storage integration
- `AzureEventHubsRequestLoggerPlugin` - Azure Event Hubs logging
- `HydrolixRequestLoggerPlugin` - Hydrolix data platform integration

### Special Plugins

- `AkamaiApiSecurityPlugin` - Akamai API security integration
- `StripeMonetizationPlugin` - Stripe billing integration

## Utility APIs

### environment

- **Status**: Documented ([Environment Variables](./environment.md))
- **Description**: Access to environment variables

### ZuploServices

- **Status**: Documented ([Zuplo ID Token](./zuplo-id-token.md))
- **Description**: Zuplo platform services

## Types and Interfaces

### RequestUser

- **Status**: Documented ([Request User](./request-user.md))
- **Description**: User data structure for authenticated requests

### Logger

- **Status**: Documented ([Logger](./logger.md))
- **Description**: Structured logging interface

### ContextData

- **Status**: Documented ([Context Data](./context-data.md))
- **Description**: Type-safe context data storage

### CorsPolicyConfiguration

- **Status**: Documented ([Custom CORS Policy](./custom-cors-policy.md))
- **Description**: CORS policy configuration

## Hooks and Events

### ZuploContextHooks

- **Status**: Documented ([Hooks](./hooks.md))
- **Description**: Request/response lifecycle hooks

---

This index provides an overview of the runtime APIs available in Zuplo. For
detailed information about each API, follow the documentation links provided.
