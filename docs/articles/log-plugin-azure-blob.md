---
title: Azure Blob Plugin
sidebar_label: Azure Blob
---

<EnterpriseFeature name="Custom logging" />

## Setup

This plugin pushes request/response logs to Azure Blob Storage.

You can define the fields created in the CSV by creating a custom type in
TypeScript and a function to extract the field data from the `Response`,
`ZuploRequest`, and `ZuploContext`.

The plugin is configured in the [Runtime Extensions](./runtime-extensions.md)
file `zuplo.runtime.ts`:

```ts

// The interface that describes the rows
// in the output
interface AzureBlobLogEntry {
  timestamp: string;
  method: string;
  url: string;
  status: number;
  statusText: string;
  sub: string | null;
  contentLength: string | null;
}

// The function that creates an entry
async function generateLogEntry(response: Response, request: ZuploRequest, context: ZuploContext) {
  const entry: AzureBlobLogEntry = {
    timestamp: new Date().toISOString(),
    url: request.url,
    method: request.method,
    status: response.status,
    statusText: response.statusText,
    sub: request.user?.sub ?? null,
    contentLength: request.headers.get("content-length")
  };
  return entry;
}

// Add the plugin - use a SAS URL
runtime.addPlugin(
  new AzureBlobPlugin<AzureBlobLogEntry>({
    sasUrl: "https://YOUR_ACCOUNT.blob.core.windows.net/YOUR_CONTAINER?sv=2022-11-02&ss=b&srt=co&sp=wactfx&se=2045-11-17T13:50:53Z&st=2024-11-17T05:50:53Z&spr=https&sig=YOUR_SIG",
    batchPeriodSeconds: 1,
    generateLogEntry,
  })
);

```

The plugin writes Block Blobs using SAS signatures. Ensure that your SAS URL has
the correct structure and contains the container name, and the SAS has the
appropriate permissions.

## Writing the response or request

Writing the full request or response body can be expensive but is supported.
Alternatively, you may want to parse the body for a particular property to log,
in this case it's important that the request or response is cloned so that the
stream is available for the response.

Also, note that the `generateLogEntry` function will be called **after** the
request stream has been read. So if you need to read the request, you will need
to store the cloned response before it reaches the request handler and store it,
ideally using [ContextData](./context-data.md).
