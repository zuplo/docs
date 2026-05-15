---
title: "MCP Server"
sidebar_label: "MCP Server"
---

The **MCP Server** tab shows what happens inside MCP servers hosted on Zuplo:
tool invocations, resource reads, prompt gets, JSON-RPC method usage, transport
mix, and per-tool latency. It's visible when the project type is **standard**
and the project hosts an MCP server.

## When to use this

- Find the slowest or most-called tools.
- See which transport (stdio, HTTP, SSE) and which clients dominate traffic.
- Investigate JSON-RPC error codes returned to clients.

## MCP Server vs MCP Gateway

This tab is about activity inside MCP servers you host on Zuplo. If you're
looking for the server-side picture of traffic flowing through Zuplo's MCP
gateway (auth, routing, upstream health), see the
[MCP Gateway](./mcp-gateway.md) tab.

## Summary KPIs

| Name                | What it measures                                                                                                          |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **Tool Calls**      | Total tool invocations in the window. Secondary: resource reads and prompt gets.                                          |
| **Active Sessions** | Distinct MCP sessions (approximate, estimated via HyperLogLog). See [Metrics glossary](../reference/metrics-glossary.md). |
| **Error Rate**      | Share of tool calls returning an application, gateway, or upstream error.                                                 |
| **p95 Latency**     | P95 across all tool calls.                                                                                                |

## Charts

**Calls Time Series.** Four series in one chart: tool calls, resource reads,
prompt gets, and session starts.

**Three donuts in a row.**

- **JSON-RPC Methods**: distribution across the methods clients invoke.
- **Transport**: stdio / http / sse split.
- **Clients**: top clients by name from the `initialize` handshake.

**Latency Percentiles Card and Latency Time Series.** Summary card plus P50 /
P95 / P99 over time.

## Tables

**Top Tools.** Tool name, Calls, Errors (count + %), and P50 / P95 / P99
latency. The fastest way to find a slow or noisy tool.

**Three list panels.**

- **Top Resources Read**: URI, optional name, reads.
- **Top Prompts**: prompt, gets.
- **JSON-RPC Error Codes**: label, count.

## Filters

The filter bar applies. See [Shared controls](../shared-controls.md#filters).

## Troubleshooting

**The MCP Server tab is empty.** No MCP Server traffic has been recorded in the
selected window. Invoke a tool from a client and the dashboard populates.

**Active sessions count looks too round.** Active sessions are estimated with
HyperLogLog. Accurate at scale, but the figure is approximate and may not
exactly match a count of unique session IDs.

**I don't see this tab.** Visibility requires project type **standard** and an
MCP server hosted by the project. If you're consuming an MCP fleet through
Zuplo's gateway instead, look for the [MCP Gateway](./mcp-gateway.md) tab.
