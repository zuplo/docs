---
title: Azure Event Hubs Request Logger Plugin
sidebar_label: Azure Event Hubs
---

This plugin pushes request/response logs to Azure Event Hubs. This can be used
to stream the request data generated by your API Gateway to use for monitoring,
analytics, auditing, or debugging purposes.

<EnterpriseFeature name="Custom logging" />

## Setup

You can define the fields created in the JSON object by creating a custom type
in TypeScript and a function to extract the field data from the `Response`,
`ZuploRequest`, and `ZuploContext`.

The plugin is configured in the
[Runtime Extensions](../programmable-api/runtime-extensions.md) file
`zuplo.runtime.ts`: git sta

```ts title="modules/zuplo.runtime.ts"
// The interface that describes the rows
// in the output
interface LogEntry {
  timestamp: string;
  method: string;
  url: string;
  status: number;
  statusText: string;
  sub: string | null;
  contentLength: string | null;
}

// Add the plugin
runtime.addPlugin(
  new AzureEventHubsRequestLoggerPlugin<LogEntry>({
    connectionString: environment.AZURE_EVENT_HUBS_CONNECTION_STRING,
    // e.g. "Endpoint=sb://your-namespace.servicebus.windows.net/;SharedAccessKeyName=key-name;SharedAccessKey=YOUR_SHARED_ACCESS_KEY"
    batchPeriodSeconds: 1,
    entityPath: "your-event-hub-name",
    generateLogEntry: (response: Response, request: ZuploRequest) => ({
      // You can customize the log entry here by adding new fields
      timestamp: new Date().toISOString(),
      url: request.url,
      method: request.method,
      status: response.status,
      statusText: response.statusText,
      sub: request.user?.sub ?? null,
      contentLength: request.headers.get("content-length"),
    }),
  }),
);
```

The configuration requires a `connectionString` which you can get from the Azure
portal "Shared access policies" section in Event Hubs. If the connection string
contains an EntityPath property the separate `entityPath` option to define the
event hub's name is not required.

Entries will be batched and sent as an array, they will be sent every
`batchPeriodSeconds`. If not specified it will be sent very frequently (~every
10ms) to avoid data loss. Note that `batchPeriodSeconds` can be specified as a
fraction, e.g. `0.1` for every 100ms.
