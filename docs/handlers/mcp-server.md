---
title: MCP Server Handler
sidebar_label: MCP Server
---

The MCP Server handler allows you to run a lite-weight, stateless MCP server on your gateway
that automatically transforms your API routes into MCP tools.
This enables your API gateway to seamlessly service external AI tools and agents
through the [Model Context Protocol](https://modelcontextprotocol.io/introduction).
By using your existing APIs, you won't have to rebuild API functionality for MCP
clients into your backend!

An MCP Server Handler is made to have a 1:1 relationship with a route where there is one route per server.
A sole MCP server on a given route may have _many_ tools which interface with your various APIs.
This means that you can compose many different MCP servers on different routes
to facilitate your MCP gateway needs and tailor make MCP tools for each server's exact purpose.

## Setup via Portal

Open the **Route Designer** by navigating to the **Files** tab then click **routes.oas.json**.
Inside any route, select **MCP Server** from the **Request Handlers** drop-down.

Configure the handler with the following required options:

- **Server Name** - The name of the MCP server: AI MCP clients will read this name
  when they initialize with the server.
- **Server Version** - The version of your MCP server: AI MCP clients read this
  version whey they initialize with the server and _may_ make autonomous decision
  based on the versioning of your MCP server.

## Setup via routes.oas.json

The MCP Server handler can be manually added to the **routes.oas.json** file
with the following route configuration:

```json
"paths": {
  "/mcp": {
    "x-zuplo-path": {
      "pathMode": "open-api"
    },
    "get": {
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
