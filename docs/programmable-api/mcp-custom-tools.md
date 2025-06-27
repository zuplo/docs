---
title: MCP Custom Tools
---

The MCP Custom Tools plugin allows you to create sophisticated MCP
([Model Context Protocol](https://modelcontextprotocol.io/introduction)) tools
using code rather than just simple OpenAPI route mappings. This provides the
flexibility to build complex workflows that can invoke multiple API routes,
implement custom business logic, and provide rich responses to AI systems.

:::tip

This is more powerful than the [MCP Server Handler](./handlers/mcp-server.md)
which automatically transforms your OpenAPI routes into MCP tools. Custom MCP
Tools give you full programmatic control over tool behavior.

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

### 1. Create Your Custom Tools

Create a module that defines your custom MCP tools:

```typescript
// modules/mcp-tools.ts
import { McpCustomToolsSDK, McpToolDefinition } from "@zuplo/runtime";
import { z } from "zod/v4";

const sdk = new McpCustomToolsSDK();

export const addNumbersTool: McpToolDefinition = sdk.defineTool({
  name: "add_numbers",
  description: "Adds two numbers together and returns the result",
  schema: z.object({
    a: z.number().describe("First number to add"),
    b: z.number().describe("Second number to add"),
  }),
  handler: async (args, context) => {
    context.log.info(`Adding ${args.a} + ${args.b}`);
    const result = args.a + args.b;
    return sdk.textResponse(`${args.a} + ${args.b} = ${result}`);
  },
});

export const myTools: McpToolDefinition[] = [addNumbersTool];
```

### 2. Register the Plugin

Configure the plugin in your runtime initialization. This _must_ occur in the
file named `zuplo.runtime.ts`:

```typescript
// modules/zuplo.runtime.ts
import { RuntimeExtensions, McpCustomToolsPlugin } from "@zuplo/runtime";
import { myTools } from "./mcp-tools";

export function runtimeInit(runtime: RuntimeExtensions) {
  const mcpPlugin = new McpCustomToolsPlugin({
    name: "My Custom MCP Server",
    version: "1.0.0",
    endpoint: "/mcp-custom", // Optional, defaults to "/mcp"
    tools: myTools,
  });

  runtime.addPlugin(mcpPlugin);
}
```

### 3. Deploy and Test

Deploy your project and test your MCP server:

```bash
# Test with MCP Inspector
npx @modelcontextprotocol/inspector

# Or test with curl
curl https://your-gateway.zuplo.dev/mcp-custom \
  -X POST \
  -H 'Content-Type: application/json' \
  -d '{ "jsonrpc": "2.0", "id": "0", "method": "tools/list" }'
```

## SDK Reference

### `McpCustomToolsSDK`

The main SDK class providing helper methods for creating tools and responses.

#### Methods

**`createTool()`** Returns a new `McpToolBuilder` for fluent tool definition.

**`defineTool(config)`** Define a tool with a configuration object.

**Response Helpers:**

- `textResponse(text: string)` - Create a text response
- `jsonResponse(data: any)` - Create a JSON response with structured content
- `errorResponse(message: string)` - Create an error response
- `imageResponse(data: string, mimeType: string)` - Create an image response
- `resourceResponse(uri: string, mimeType?: string)` - Create a resource
  response

### `McpToolBuilder`

Fluent builder class for creating type-safe tools.

```typescript
const tool = new McpToolBuilder()
  .name("my_tool")
  .description("Does something useful")
  .schema(z.object({ input: z.string() }))
  .outSchema(z.object({ result: z.string() }))
  .handler(async (args, context) => {
    // Tool implementation
    return sdk.textResponse("Hello!");
  })
  .build();
```

### `McpCustomToolsPlugin`

Runtime plugin configuration options:

```typescript
interface McpCustomToolsPluginOptions {
  name?: string; // Server name (default: "MCP Custom Server")
  version?: string; // Server version (default: "0.0.0")
  endpoint?: string; // Endpoint path (default: "/mcp")
  tools: McpToolDefinition[]; // Array of tool definitions
}
```

## Advanced Usage

### Tool with Output Schema Validation

Starting with `2025-06-18`, MCP clients support validating the output of tool
calls from servers based on a provided `outputSchema`:

```typescript
const weatherTool: McpToolDefinition = sdk.defineTool({
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

    return sdk.jsonResponse({
      temperature: weather.temp,
      condition: weather.conditions,
      humidity: weather.humidity,
    });
  },
});
```

### Error Handling Tool

For more ergonomic and AI friendly error handling, utilize the `errorResponse`
helper:

```typescript
const safeTool: McpToolDefinition = sdk.defineTool({
  name: "safe_operation",
  description: "Demonstrates error handling",
  schema: z.object({
    shouldFail: z.boolean().default(false),
  }),
  handler: async (args, context) => {
    try {
      if (args.shouldFail) {
        throw new Error("Intentional failure");
      }
      return sdk.textResponse("Operation succeeded");
    } catch (error) {
      context.log.error("Tool failed:", error);
      return sdk.errorResponse(error.message);
    }
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
const orderProcessingTool: McpToolDefinition = sdk.defineTool({
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
      return sdk.errorResponse("Customer not found");
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
      return sdk.errorResponse(
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

    return sdk.jsonResponse({
      orderId: order.id,
      status: "created",
      total: order.total,
      estimatedDelivery: order.estimatedDelivery,
    });
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
2. Set **URL** to your custom tools endpoint (e.g.,
   `https://your-gateway.zuplo.dev/mcp-custom`)
3. Connect and test your tools interactively

### Using cURL

Test individual tools directly:

```bash
# List available tools
curl https://your-gateway.zuplo.dev/mcp-custom \
  -X POST \
  -H 'Content-Type: application/json' \
  -d '{
    "jsonrpc": "2.0",
    "id": "0",
    "method": "tools/list"
  }'

# Call a specific tool
curl https://your-gateway.zuplo.dev/mcp-custom \
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

Always use a Zod schema with the `schema` param to validate inputs. This
validation is done automatically and the `args` passed to your handler are type
safe. Providing descriptive schemas also ensures an MCP Client's LLM always has
the appropriate context on exactly _what_ arguments to provide to tools.

```typescript
schema: z.object({
  userId: z.string().uuid().describe("Valid UUID for user ID"),
  amount: z.number().positive().max(10000).describe("Amount in cents"),
});
```

### Tool Design

1. **Clear Names**: Use descriptive, action-oriented names (`get_user_profile`,
   `create_order`)
2. **Detailed Descriptions**: Help AI systems understand what your tool does
3. **Error Handling**: Provide meaningful error messages

### Schema Design

```typescript
// Good: Descriptive and well-structured
schema: z.object({
  customerId: z.uuid().describe("UUID of the customer"),
  orderType: z.enum(["standard", "express", "overnight"]).describe("Delivery speed"),
  items: z.array(z.object({
    productId: z.string().describe("Product SKU or ID"),
    quantity: z.number().int().positive().describe("Number of items"),
  })).min(1).describe("List of items to order"),
}),

// Good: Output schema for structured responses
outputSchema: z.object({
  orderId: z.string().describe("Generated order ID"),
  total: z.number().describe("Total amount in cents"),
  status: z.enum(["pending", "confirmed", "failed"]).describe("Order status"),
})
```

## Troubleshooting

### Common Issues

**Tool not appearing in `tools/list`:**

- Check tool name for duplicates
- Verify tool is included in the `tools` array when registering the plugin
- Check for validation errors in plugin configuration or relevant logs

**Schema validation errors:**

- Ensure Zod schemas are properly defined and aligned with expected tool handler
  usage
- Check that handler arguments match schema types
- Verify output matches `outputSchema` if defined

**Handler execution failures:**

- Apply logs using `context.log.error()`
- Verify API routes being invoked through `invokeRoute` exist and are accessible
- Test individual API calls outside the MCP context

### Debugging Tips

1. **Enable Debug Logging**: Use `context.log.debug()` liberally
2. **Test Components Separately**: Test API routes and business logic
   independently
3. **Use MCP Inspector**: Interactive testing is invaluable for development

## Learn More

- [MCP Server Handler](./handler/mcp-server.md) - For simple route-to-tool
  mapping
- [Model Context Protocol Overview](/docs/ai/mcp) - Understanding MCP concepts
- [MCP Specification](https://modelcontextprotocol.io/specification/) - Official
  protocol documentation
- [Runtime Extensions](/docs/programmable-api/) - Zuplo's plugin system
