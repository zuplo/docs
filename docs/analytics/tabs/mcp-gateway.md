---
title: "MCP Gateway"
sidebar_label: "MCP Gateway"
---

The **MCP Gateway** tab shows server-side traffic through Zuplo's MCP gateway:
OAuth flows, auth and policy decisions, virtual-server routing, capability
invocations, and upstream MCP server health. It's visible when the project type
is **standard** and an MCP gateway is in use.

## When to use this

- See which virtual servers and capabilities are being exercised, and by whom.
- Track auth and policy decision outcomes.
- Identify whether failures originate in the gateway, the upstream, or the
  client.

## MCP Gateway vs MCP Server

This tab is about traffic _to_ an MCP fleet via Zuplo's gateway. If you're
looking for what happened _inside_ an MCP server you host on Zuplo (tool calls,
JSON-RPC methods), see the [MCP Server](./mcp-server.md) tab. Some accounts see
both tabs; some see only one.

## Summary KPIs

| Name                | What it measures                                                                               |
| ------------------- | ---------------------------------------------------------------------------------------------- |
| **Events**          | Total MCP Gateway events in the window.                                                        |
| **Success Rate**    | Share of events with outcome = success. Secondary: success / error split.                      |
| **p95 Latency**     | Total P95. Secondary: gateway-vs-upstream split, useful for telling where time is being spent. |
| **Failure Origins** | Sum of gateway + upstream + client failure counts.                                             |

See [Metrics glossary](../reference/metrics-glossary.md) for the failure-origin
and outcome-class definitions.

## Charts

**Events Time Series.** Stacked by top event types.

**Event Family Donut.** Distribution across families: `mcp_request`,
`capability_invocation`, `auth_event`, `upstream_request`, `policy_decision`,
`control_plane_audit`.

**Latency Split.** Total, gateway, and upstream P50 / P95 / P99 over time. _What
to look for:_ a P95 driven entirely by the upstream slice points to a slow MCP
backend; a gateway-heavy P95 points to policy or auth overhead.

## Breakdown tables

| Table                | Columns                                                 |
| -------------------- | ------------------------------------------------------- |
| Top Capabilities     | Capability, Type, Calls, Errors (count + %), P95.       |
| Top Virtual Servers  | Virtual Server, Events, Errors.                         |
| Top Upstream Servers | Upstream, Events, Errors, P95 upstream latency.         |
| Top Clients          | Client, Kind (from the `initialize` handshake), Events. |
| MCP Methods          | Method, Events.                                         |
| Upstream Auth Modes  | Auth Mode, Events.                                      |
| Failure Origins      | Origin layer (gateway / upstream / client), Errors.     |
| Top Reason Codes     | Class, Code, Events, Errors.                            |

## Filters

The filter bar applies. See [Shared controls](../shared-controls.md#filters).

## Troubleshooting

**The MCP Gateway tab is empty.** No MCP Gateway events have been recorded in
the selected window. Once a client connects and invokes a capability, the
dashboard populates.

**I don't see this tab.** Visibility requires project type **standard** and an
MCP gateway in use. If you're hosting an MCP server on Zuplo instead, look for
the [MCP Server](./mcp-server.md) tab.

**Errors show but Failure Origins is empty.** Failure origins are classified
server-side from event metadata. Events without a clear origin classification
are counted in Errors but not in any of the gateway / upstream / client buckets.
