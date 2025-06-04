---
title: MCP Server Handler
sidebar_label: MCP Server
---

The MCP (Model Context Protocol) Server handler allows you to run a lightweight, stateless MCP server on your gateway
that automatically transforms your API routes into MCP tools.

This enables your API gateway to seamlessly service external AI tools and agents
through [Model Context Protocol](https://modelcontextprotocol.io/introduction) interactions.
By using your existing APIs, without needing to duplicate functionality or rebuild business logic in your backend.

Each MCP Server handler has a 1:1 relationship with a route. That means one route can host one server.

A single MCP server may have _many_ tools where each tool interfaces with a route on your API in your gateway.
You can compose multiple MCP servers on different routes to tailor MCP tools for each server's specific purpose.

## Setup via Portal

Open the **Route Designer** by navigating to the **Files** tab then click **routes.oas.json**.
Inside any route, select **MCP Server** from the **Request Handlers** drop-down.

Configure the handler with the following required options:

- **Server Name** - The name of the MCP server: AI MCP clients will read this name
  when they initialize with the server.
- **Server Version** - The version of your MCP server: AI MCP clients read this
  version whey they initialize with the server and _may_ make autonomous decision
  based on the versioning of your MCP server.

![MCP Server Handler Portal](../../public/media/mcp/portal-handler.png)

Next, configure your OpenAPI file or the specific routes that you want transformed into MCP tools.

## Setup via routes.oas.json

The MCP Server handler can be manually added to the **routes.oas.json** file
with the following route configuration:

```json
"paths": {
  "/mcp": {
    "x-zuplo-path": {
      "pathMode": "open-api"
    },
    "post": {
      "summary": "MCP Server",
      "x-zuplo-route": {
        "corsPolicy": "none",
        "handler": {
          "export": "mcpServerHandler",
          "module": "$import(@zuplo/runtime)",
          "options": {
            "name": "example-mcp-server",
            "version": "1.0.0"
          }
        },
        "policies": {
          "inbound": []
        }
      }
    }
  }
}
```

## Options

The MCP Server handler requires the following configurations:

- `name` - The name identifier of the MCP server to connect to.
- `version` - The version of the MCP server protocol to use.

There are several options for configuring your APIs to be transformed into MCP tools.

### Option 1: OpenAPI File Paths

Transform entire OpenAPI files into MCP tools by specifying `openApiFilePaths` in the options:

```json
"openApiFilePaths": [
  {
    "filePath": "./config/weather.oas.json"
  },
  {
    "filePath": "./config/todos.oas.json"
  }
],
```

Each route method is exposed as an MCP tool. Tool names are taken from the route’s operationId, or fall back to a generated name if none is provided.
Descriptions are pulled from the route’s description, then summary, and finally a generated description if neither is available.

### Option 2: Individual Routes

Add specific MCP tools using the `openApiTools` array.
Specify **either** `path` or `operationId` plus the required `method`:

```json
"openApiTools": [
    {
      "path": "/todos",
      "method": "GET",
      "name": "get_todos",
      "description": "Gets todos from the backend"
    },
    {
      "operationId": "e855b869-9c4c-485b-94c5-41b865b0f199",
      "method": "GET"
    }
]
```

The `name` and `description` fields are optional but strongly recommended. These should contain LLM specific instructions that will be read by MCP clients (and the underlying LLM systems) to
understand exactly _what_ the tools on your MCP server do.
