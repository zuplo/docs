---
title: "Analytics"
sidebar_label: "Overview"
---

Zuplo Analytics is the dashboard inside the Zuplo portal that shows how traffic
moves through your gateway: request volume, latency, errors, who's calling you,
and (when relevant) AI gateway and MCP gateway activity. It's the page you open
when something looks off in production, when you're auditing spend, or when
you're answering "is anyone actually using this endpoint?"

## When to use this

- Investigate a latency spike or error surge across all projects in your
  account, or inside a single project.
- Identify which API consumers, AI agents, or upstream origins drive the most
  traffic or errors.
- Track AI gateway token usage and cost, or MCP gateway and server activity.

## How to access

Open **Analytics** in the Zuplo portal sidebar. The page works at two scopes:

- **Account scope**: aggregates across every project in your account. Open
  [Account Analytics](https://portal.zuplo.com/+/account/analytics).
- **Project scope**: open a project, then click **Analytics**. Filters to one
  project and adds an **Environment** selector.

## What's in this section

- [Access and entitlements](./access-and-entitlements.md): plans, free trial,
  demo mode, retention.
- [Shared controls](./shared-controls.md): time range, filters, environment
  selector, banners, URL state.
- Tabs:
  - [Requests](./tabs/requests.md): overall traffic, latency, errors.
  - [Origins](./tabs/origins.md): backend performance.
  - [Consumers](./tabs/consumers.md): per-consumer breakdowns.
  - [Agents](./tabs/agents.md): classified AI agent traffic.
  - [AI Gateway](./tabs/ai-gateway.md): LLM request volume, tokens, cost.
  - [MCP Gateway](./tabs/mcp-gateway.md): virtual server routing, capability
    invocations, upstream health.
  - [MCP Server](./tabs/mcp-server.md): tool calls, resources, prompts on
    Zuplo-hosted MCP servers.
- Reference:
  - [Metrics glossary](./reference/metrics-glossary.md): every KPI and
    percentile defined once.
  - [URL parameters](./reference/url-parameters.md): permalink reference.

## Tab visibility

You'll see a subset of tabs depending on your plan and project setup:

| Tab         | When it appears                                                       |
| ----------- | --------------------------------------------------------------------- |
| Requests    | All accounts with advanced analytics enabled.                         |
| Origins     | The project uses managed-edge origins.                                |
| Consumers   | All accounts with advanced analytics enabled.                         |
| Agents      | All accounts with advanced analytics enabled.                         |
| AI Gateway  | The project type is **ai**.                                           |
| MCP Gateway | The project type is **standard** and an MCP gateway is in use.        |
| MCP Server  | The project type is **standard** and the project hosts an MCP server. |

If you don't see Analytics at all, your account likely doesn't have advanced
analytics enabled. See [Access and entitlements](./access-and-entitlements.md).
