---
title: "Agents"
sidebar_label: "Agents"
---

The **Agents** tab isolates AI agent traffic: requests classified as coming from
ChatGPT, Claude.ai, Cursor, GPTBot, and similar clients. It's a focused view;
browsers, webhooks, and generic SDK callers are excluded.

## When to use this

- See which AI agents are calling your API and how much volume they generate.
- Catch agent-specific error patterns. For example, one agent that fails CORS or
  returns 4xx more often than the others.
- Compare latency experience across agents.

## Summary KPIs

| Name              | What it measures                                                             |
| ----------------- | ---------------------------------------------------------------------------- |
| **Requests**      | Total agent-classified requests. Excludes browsers, webhooks, generic SDKs.  |
| **Client Errors** | Request-weighted 4xx rate across agents.                                     |
| **Server Errors** | Request-weighted 5xx rate. Secondary: count of agents with at least one 5xx. |
| **Agents**        | Distinct classified agents seen in the window.                               |
| **Total Errors**  | Combined 4xx + 5xx count. Secondary: agents affected.                        |

## Charts

**Request Volume.** Stacked bars by status class. Granularity is always hourly
on this tab.

**Agent Error Rates.** 4xx and 5xx over time. _What to look for:_ divergence
between agents is the headline signal. If Cursor shows a 12% 4xx rate while
ChatGPT sits at 2%, the issue is almost certainly specific to how Cursor calls
your endpoint.

**Agent Latency Over Time.** P50, P95, P99 lines.

## Agent table

| Column          | Notes                            |
| --------------- | -------------------------------- |
| Agent           | Classified agent name.           |
| Requests        | Count with an inline volume bar. |
| Client Errors % | 4xx percentage.                  |
| Server Errors % | 5xx percentage.                  |
| Avg / P95 / P99 | Latency percentiles.             |
| 4xx sparkline   | Inline trend over the window.    |
| 5xx sparkline   | Inline trend over the window.    |

Searchable and sortable on any column. Click a row to filter the tab to that
agent. **Show more** loads the next 50.

## Classified agents

The classifier currently recognizes: ChatGPT, Claude.ai, Cursor, Claude Code,
GPTBot, Perplexity, Cline, Continue, OpenAI SDK, Anthropic SDK, Google AI,
Common Crawl. The list expands over time.

Unclassified traffic is excluded from the Agents tab.

:::warning

Agent charts use a dedicated hourly rollup. Filtering other tabs by agent isn't
supported. Use the Agents tab to drill into an individual agent.

:::

## Filters

The filter bar applies. `originHost` is not applicable here. See
[Shared controls](../shared-controls.md#filters).

## Troubleshooting

**The Agents tab is empty.** Either no classified agents called your gateway in
the window, or your retention window doesn't yet include any agent traffic. Try
the demo with **View demo →** in the trial banner to see what a populated tab
looks like. See [Access and entitlements](../access-and-entitlements.md).

**I see a known agent in my logs but not here.** The classifier is conservative;
it labels traffic that clearly matches a known agent fingerprint. Generic SDK
traffic that doesn't identify itself is excluded. If you believe an agent should
be classified, send the User-Agent string to your Zuplo contact.

**An agent shows zero requests but appears in the table.** Filters on the rest
of the tab may be excluding its traffic for the current window. Clear filters to
verify.
