---
title: MCP Server Custom Tools
sidebar_label: Custom Tools
---

The MCP Server Handler supports custom tools that allow you to create
sophisticated MCP
([Model Context Protocol](https://modelcontextprotocol.io/introduction)) tools
using code rather than simple 1:1 OpenAPI route mappings. This provides the
flexibility to build complex workflows that can invoke multiple API routes,
implement custom business logic, and provide rich responses to AI systems.

:::tip

Custom tools give you full programmatic control over tool behavior within the
[MCP Server Handler](./mcp-server.md). This is more flexible than automatic
OpenAPI route transformation, allowing complex multi-step workflows and custom
logic.

:::

## Key Features

- **Programmatic Control**: Define tools using TypeScript with full access to
  Zuplo's runtime
- **Complex Workflows**: Chain multiple API calls, implement business logic, and
  handle complex data transformations
- **Type Safety**: Built-in Zod schema validation for inputs and outputs
- **Runtime Integration**: Access to `context.invokeRoute()`, logging, and other
  Zuplo runtime features

## Quick Start

### 1. Create Your Custom Tools Module

Create a module that defines your custom MCP tools:

```typescript
// modules/mcp-tools.ts
import { McpCustomToolsSDK, McpToolDefinition } from "@zuplo/runtime";
import { z } from "zod/v4";

// Initialize the SDK
const mcpSdk = new McpCustomToolsSDK();

// Define a tool
const addNumbersTool: McpToolDefinition = mcpSdk.defineTool({
  name: "add_numbers",
  description: "Adds two numbers together and returns the result",
  schema: z.object({
    a: z.number().describe("First number to add"),
    b: z.number().describe("Second number to add"),
  }),
  handler: async (args, context) => {
    context.log.info(`Adding ${args.a} + ${args.b}`);
    const result = args.a + args.b;
    return mcpSdk.textResponse(`${args.a} + ${args.b} = ${result}`);
  },
});

// Make a "default" export for all tools as an array of McpToolDefinitions
const allTools: McpToolDefinition[] = [addNumbersTool];

export default allTools;
```

### 2. Configure the MCP Server Handler

Add the custom tools to your MCP Server Handler in **routes.oas.json**:

```json
{
  "paths": {
    "/mcp": {
      "post": {
        "operationId": "mcp-custom-tools-handler",
        "x-zuplo-route": {
          "handler": {
            "export": "mcpServerHandler",
            "module": "$import(@zuplo/runtime)",
            "options": {
              "name": "Custom Tools MCP Server",
              "version": "0.0.0",
              "customTools": "$import(./modules/mcp-tools)"
            }
          }
        }
      }
    }
  }
}
```

### 3. Deploy and Test

Deploy your project and test your MCP server:

```bash
# Test with MCP Inspector
npx @modelcontextprotocol/inspector

# Or test with curl
curl https://your-gateway.zuplo.dev/mcp \
  -X POST \
  -H 'Content-Type: application/json' \
  -d '{ "jsonrpc": "2.0", "id": "0", "method": "tools/list" }'
```

## SDK Reference

### `McpCustomToolsSDK`

The main SDK class providing helper methods for creating tools and responses.

#### Methods

**`defineTool(config)`** Define a tool with a configuration object.

**Response Helpers:**

- `textResponse(text: string)` - Create a text response
- `jsonResponse(data: any)` - Create a JSON response with structured content
- `errorResponse(message: string)` - Create an error response
- `imageResponse(data: string, mimeType: string)` - Create an image response
- `resourceResponse(uri: string, mimeType?: string)` - Create a resource
  response
- `getInvokeHeaders()` - Access original MCP request headers

### Handler Configuration

The `customTools` option in the MCP Server Handler expects:

- **Default Export**: Your module must export an array of `McpToolDefinition` as
  the default export
- **Tool Names**: Must be unique across all tools (server won't build if names
  clash)
- **Array Format**: Tools must be exported as an array, not individual exports

## Advanced Usage

### Output Schema Validation

Starting with `2025-06-18`, MCP clients may support validating the output of
tool calls from servers based on a provided `outputSchema`:

```typescript
const weatherTool: McpToolDefinition = mcpSdk.defineTool({
  name: "get_weather",
  description: "Get current weather for a location",
  schema: z.object({
    location: z.string().describe("City name or coordinates"),
  }),
  outputSchema: z.object({
    temperature: z.number(),
    condition: z.string(),
    humidity: z.number(),
  }),
  handler: async (args, context) => {
    const weatherResp = await context.invokeRoute(
      `/weather?location=${args.location}`,
    );
    const weather = await weatherResp.json();

    return mcpSdk.jsonResponse({
      temperature: weather.temp,
      condition: weather.conditions,
      humidity: weather.humidity,
    });
  },
});
```

### Error Handling

For more ergonomic and AI friendly error handling, utilize the `errorResponse`
helper. This wraps the JSON RPC 2.0 for raising errors.

For example, the following tool will raise an error if the caller selects
`shouldFail`:

```typescript
const errorHandlingTool: McpToolDefinition = mcpSdk.defineTool({
  name: "test_error_handling",
  description: "Tests error handling capabilities",
  schema: z.object({
    shouldFail: z.boolean().default(false),
    errorMessage: z.string().optional(),
  }),
  handler: async (args) => {
    if (args.shouldFail) {
      return mcpSdk.errorResponse(
        args.errorMessage || "Intentional test error",
      );
    }

    return mcpSdk.textResponse("Success! No error occurred.");
  },
});
```

### Multi-Step Workflow Tool

Using the ZuploContext `invokeRoute`, you can create powerful aggregate
workflows that call multiple routes on your gateway. This works by re-invoking
routes on your gateway _without_ having to go back out to HTTP.

:::note

`context.invokeRoute` _will_ utilize the full inbound and outbound policy
pipeline. This means that policies you set on your MCP server route will be
invoked alongside policies that are associated with any calls made through
`invokeRoute`.

:::

```typescript
const orderProcessingTool: McpToolDefinition = mcpSdk.defineTool({
  name: "process_order",
  description: "Process a customer order through multiple steps",
  schema: z.object({
    customerId: z.string(),
    items: z.array(
      z.object({
        productId: z.string(),
        quantity: z.number(),
      }),
    ),
  }),
  handler: async (args, context) => {
    // Step 1: Validate customer
    const customerResp = await context.invokeRoute(
      `/customers/${args.customerId}`,
    );
    if (!customerResp.ok) {
      return mcpSdk.errorResponse("Customer not found");
    }

    // Step 2: Check inventory
    const inventoryChecks = await Promise.all(
      args.items.map((item) =>
        context.invokeRoute(
          `/inventory/${item.productId}/check?quantity=${item.quantity}`,
        ),
      ),
    );

    const unavailableItems = inventoryChecks
      .map((resp, i) => ({ resp, item: args.items[i] }))
      .filter(({ resp }) => !resp.ok)
      .map(({ item }) => item.productId);

    if (unavailableItems.length > 0) {
      return mcpSdk.errorResponse(
        `Items not available: ${unavailableItems.join(", ")}`,
      );
    }

    // Step 3: Create order
    const orderResp = await context.invokeRoute("/orders", {
      method: "POST",
      body: JSON.stringify({
        customerId: args.customerId,
        items: args.items,
      }),
      headers: { "Content-Type": "application/json" },
    });

    const order = await orderResp.json();

    return mcpSdk.jsonResponse({
      orderId: order.id,
      status: "created",
      total: order.total,
      estimatedDelivery: order.estimatedDelivery,
    });
  },
});
```

### Request Headers

You can access the original MCP request headers using the SDK and the
`getInvokeHeaders` method. This is especially useful if a tool uses
`context.invokeRoute` and headers need to be passed through to your downstream
request.

For example, this tool gets the original headers via `getInvokeHeaders` and
returns the provided as an argument in `headerName`.

```typescript
const headerAccessTool: McpToolDefinition = mcpSdk.defineTool({
  name: "check_headers",
  description: "Demonstrates access to original MCP request headers",
  schema: z.object({
    headerName: z.string().describe("Specific header name to check"),
  }),
  handler: async (args) => {
    const headers = mcpSdk.getInvokeHeaders();
    if (headers[args.headerName]) {
      return mcpSdk.textResponse(
        `Header '${args.headerName}': ${headers[args.headerName]}`,
      );
    } else {
      return mcpSdk.textResponse(`Header '${args.headerName}' not found`);
    }
  },
});
```

## Testing Custom Tools

### Using MCP Inspector

The [MCP Inspector](https://github.com/modelcontextprotocol/inspector) is ideal
for testing custom tools:

```bash
npx @modelcontextprotocol/inspector
```

1. Set **Transport Type** to "Streamable HTTP"
2. Set **URL** to your MCP endpoint (e.g., `https://your-gateway.zuplo.dev/mcp`)
3. Connect and test your tools interactively

### Using cURL

Test individual tools directly:

```bash
# List available tools
curl https://your-gateway.zuplo.dev/mcp \
  -X POST \
  -H 'Content-Type: application/json' \
  -d '{
    "jsonrpc": "2.0",
    "id": "0",
    "method": "tools/list"
  }'

# Call a specific tool
curl https://your-gateway.zuplo.dev/mcp \
  -X POST \
  -H 'Content-Type: application/json' \
  -d '{
    "jsonrpc": "2.0",
    "id": "1",
    "method": "tools/call",
    "params": {
      "name": "add_numbers",
      "arguments": {
        "a": 5,
        "b": 3
      }
    }
  }'
```

## Best Practices

### Input Validation

Use a well structured and defined Zod schema with the `schema` param. This is
used by the server to validate MCP client inputs (i.e., JSON generated by an
LLM). Providing descriptive schemas ensures an MCP Client's LLM always has the
appropriate context on exactly _what_ arguments to provide to tools and can
dramatically reduce invalid tool usage. This validation is done automatically.

The `args` passed to your handler assume the type of the object inferred by
`schema`.

```typescript
// Good! Uses descriptive names and specific types
schema: z.object({
  userId: z.string().uuid().describe("Valid UUID for user ID"),
  amount: z.number().positive().max(10000).describe("Amount in cents"),
});

// Bad! Confusing. What is "a"? What is "b"? An LLM won't understand this.
schema: z.object({
  a: z.string(),
  b: z.number(),
});

// Good! Descriptive nested items and well-structured
schema: z.object({
  customerId: z.uuid().describe("UUID of the customer"),
  orderType: z.enum(["standard", "express", "overnight"]).describe("Delivery speed"),
  items: z.array(z.object({
    productId: z.string().describe("Product SKU or ID"),
    quantity: z.number().int().positive().describe("Number of items"),
  })).min(1).describe("List of items to order"),
}),

// Good! Output schema for structured responses using enums
outputSchema: z.object({
  orderId: z.string().describe("Generated order ID"),
  total: z.number().describe("Total amount in cents"),
  status: z.enum(["pending", "confirmed", "failed"]).describe("Order status"),
})
```

### Tool Design

1. **Clear Names**: Use descriptive, action-oriented names (`get_user_profile`,
   `create_order`)
2. **Detailed Descriptions**: Help AI systems understand what your tool does
3. **Error Handling**: Provide meaningful error messages
4. **Avoid Name Clashes**: Ensure tool names are unique (server won't build
   otherwise)

## Troubleshooting

### Common Issues

**Tool not appearing in `tools/list`:**

- Check tool name for duplicates (server won't build with name clashes)
- Verify tool is included in the default export array
- Check that the module exports an array as default export
- Check for validation errors in handler configuration or relevant logs

**Server won't build:**

- Check for tool name conflicts across all tools
- Verify the module has a proper default export of type `McpToolDefinition[]`
- Check TypeScript compilation errors in your tools module

**Schema validation errors:**

- Ensure Zod schemas are properly defined and aligned with expected tool handler
  usage
- Check that handler arguments match schema types
- Verify output matches `outputSchema` if defined

**Handler execution failures:**

- Apply logs using `context.log.error()`, `context.log.warn()`,
  `context.log.info()`, etc.
- Verify API routes being invoked through `invokeRoute` exist and are accessible
- Test individual API calls outside the MCP context

### Debugging Tips

1. **Enable Debug Logging**: Use `context.log.debug()` liberally and turn on
   [debug mode in your MCP server](./mcp-server.md)
2. **Test Components Separately**: Test API routes and business logic
   independently
3. **Use MCP Inspector**: Interactive testing is invaluable for development

## Learn More

- [MCP Server Handler](./mcp-server.md) - For simple route-to-tool mapping
- [Model Context Protocol Overview](../ai/mcp.md) - Understanding MCP concepts
- [MCP Specification](https://modelcontextprotocol.io/specification/) - Official
  protocol documentation
