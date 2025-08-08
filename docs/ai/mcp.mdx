---
title: Model Context Protocol (MCP)
sidebar_label: Model Context Protocol (MCP)
---

[Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction) is
an open protocol that enables controlled interactions between AI systems and
agents. It enables external tools and data sources to be utilized and read by AI
agents that implement the protocol.

Developed by Anthropic, MCP standardizes how AI applications can connect to a
robust number of services while maintaining user control.

## What is MCP?

MCP acts as a bridge between AI systems (like Cursor, Claude Desktop, ChatGPT,
or other LLMs) and external resources such as:

- APIs and databases
- File systems and cloud storage
- Development tools and services
- Custom business backends and workflows

The protocol ensures that AI interactions with external systems are:

- **Auditable**: Full visibility into what tools are accessed and how they're
  used via a simple [JSON-RPC 2.0](https://www.jsonrpc.org/specification)
  message flow.
- **Standardized**: Consistent interface across different tools, servers,
  clients, languages, and services.

## How Zuplo Enables MCP

Zuplo's MCP Server Handler provides a perfect foundation for MCP implementations
by:

1. **Unified API Interface**: Transform any backend API service into a
   standardized MCP-compatible server
2. **Security & Control**: Built-in authentication, rate limiting, and access
   controls
3. **Monitoring & Analytics**: Full observability into AI tool usage and
   performance
4. **Developer Experience**: Easy configuration and deployment using your
   existing OpenAPI specifications

The MCP Server Handler transforms your existing Zuplo API gateway into a
powerful toolset that AI systems can discover, understand, and invoke - bringing
AI capabilities directly into your business workflows!

## MCP Implementation Options

Zuplo provides two approaches for implementing MCP servers:

### 1. MCP Server Handler: Transform Routes into AI Tools

The MCP Server Handler automatically transforms your API gateway routes into MCP
tools that AI systems can discover and use.

#### How It Works

The MCP Server Handler:

1. **Route Discovery**: Automatically exposes your Zuplo routes as discoverable
   MCP tools
2. **OpenAPI Integration**: Uses your existing OpenAPI specifications to provide
   tool descriptions
3. **Secure Access**: Leverages Zuplo's authentication and authorization
   policies
4. **Real-time Execution**: AI systems can invoke your routes as tools in
   real-time

#### Example Use Cases

##### Customer Service AI Tools

Transform your customer management APIs into AI tools:

```
- GET /customers/{id} → "Get customer information for user 123"
- POST /tickets → "Create a support ticket with the following ..."
- PUT /customers/{id}/status → "Update customer 123 status ..."
```

##### E-commerce AI Assistant

Expose your e-commerce APIs as shopping tools:

```
- GET /products/search → "Search for products ..."
- POST /cart/add → "Add item to cart"
- GET /orders/{id} → "Get order status"
```

##### DevOps Automation

Make your infrastructure APIs available to AI:

```
- GET /deployments → "List deployments"
- POST /deployments → "Create new deployment"
- GET /metrics → "Get system metrics"
```

#### Security Considerations

When exposing routes as MCP tools:

1. **Apply appropriate authentication policies** to ensure only authorized AI
   systems can access your tools
2. **Use rate limiting** to prevent abuse and control usage costs
3. **Implement audit logging** to track tool usage and maintain compliance
4. **Scope permissions carefully** - only expose routes and OpenAPI specs that
   should be accessible to AI systems

#### Getting Started

1. Set up your APIs in Zuplo using OpenAPI specifications
2. Add the MCP Server Handler to a route
3. Configure your server name, version, and which APIs to expose as tools
4. Deploy your project to make the MCP tools available
5. Connect your AI systems to the MCP server endpoint

[Read the full technical documentation on the MCP Server Handler](/docs/handlers/mcp-server)

### 2. MCP Custom Tools: Programmable AI Tools

For more complex scenarios, use MCP Custom Tools to create sophisticated AI
tools with custom business logic, multi-step workflows, and programmatic
control.

#### Key Features

- **Custom Logic**: Implement complex business workflows that go beyond simple
  API calls to enable powerful AI workloads
- **Multi-Step Operations**: Chain multiple API calls, data transformations, and
  conditional logic
- **Type Safety**: Built-in Zod schema validation for inputs and outputs
- **Runtime Integration**: Full access to your gateway through
  `context.invokeRoute()`

#### Example Use Case

The following shows a powerful workflow that can enable an AI agent to interface
with a process ordering system: instead of an agent calling each of your APIs
manually, this workflow can be used as a single "aggregate" process to validate
the provided customer, check that items are in stock, determine pricing, and
place orders for those items.

```typescript
const mcpSdk = new McpCustomToolsSDK();

const checkCustomerOrder = mcpSdk.defineTool({
  // The name of the tool that an MCP client can call
  name: "process_customer_order",

  // The meaningful description provided to an MCP client's LLM for tool selection
  description: "Process a customer order with inventory validation and pricing",

  // The schea that is used to validate incoming arguments from MCP client tool calls
  inputSchema: z.object({
    customerId: z.string(),
    orderNum: z.number(),
  }),

  // The actual code that is invoked when a tool is called and the JSON arguments
  // are validated. The tool's type-checked arguments and the ZuploContext
  // are passed through.
  handler: async (args, context) => {
    // 1. Validate customer exists and is active
    const customerRes = await context.invokeRoute(
      `/customers/${args.customerId}`,
    );
    if (!customerRes.ok) {
      return mcpSdk.errorResponse("Customer not found or inactive");
    }
    const customer = await customerRes.json();

    // 2. Check the customers order
    const orderResponse = await context.invokeRoute(`/orders/${args.orderNum}`);

    if (!orderResponse.ok) {
      const error = await orderResponse.text();
      return mcpSdk.errorResponse("Order not found");
    }
    const order = await orderResponse.json();

    // 3. Response to MCP client with JSON response
    return mcpSdk.jsonResponse({
      orderNum: orderResponse.id,
      items: orderResponse.items,
    });
  },
});
```

#### Getting Started with Custom Tools

1. Create custom tool definitions using the SDK
2. Configure tools in the MCP Server Handler
3. Deploy and test with MCP clients

[Read the full documentation on MCP Custom Tools](/docs/handlers/mcp-server-custom-tools)

## Learn More

- [MCP Server Handler Technical Documentation](/docs/handlers/mcp-server)
- [MCP Custom Tools Documentation](/docs/handlers/mcp-server-custom-tools)
- [Model Context Protocol Specification](https://spec.modelcontextprotocol.io/)
- [OpenAPI Specification](https://swagger.io/specification/)
