---
title: "AI Gateway"
sidebar_label: "AI Gateway"
---

The **AI Gateway** tab shows LLM traffic flowing through Zuplo's AI Gateway:
request volume, token usage, estimated cost, model and provider distribution,
latency, cache effectiveness, and blocked-request reasons. It's visible when the
project type is **ai**.

## When to use this

- Audit AI spend by model or provider.
- Compare cache hit rate before and after enabling caching.
- Investigate why requests are being blocked by your guardrails.

## Summary KPIs

| Name               | What it measures                                           |
| ------------------ | ---------------------------------------------------------- |
| **Total Requests** | All AI gateway requests in the window.                     |
| **Total Tokens**   | Sum across requests. Secondary: prompt / completion split. |
| **Estimated Cost** | Computed from model pricing × token usage.                 |
| **Median Latency** | P50 across all AI gateway requests.                        |

## Charts

**Request Time Series.** Three series in one chart: requests, tokens, and cost
over the window.

**Model Usage.** Stacked bars by model with a sidebar legend showing top models
by share. Click a model in the legend to highlight it; the others fade.

**Token Breakdown.** A donut split of prompt / completion / embedding tokens,
plus a time series of the same.

**Provider Breakdown.** A donut and time series by provider, plus a
top-providers list.

**Latency Distribution.** Histogram of P10, P50, P90, P95, P99.

**Latency Over Time.** P50, P95, P99 lines.

**Cache Hit Rate.** Hits vs misses over time, with a summary hit rate. _What to
look for:_ a stable hit rate above your target after enabling caching means
semantic caching is working as configured.

**Blocked Requests.** Donut and time series by block reason type. Useful when
guardrails or quota policies are doing meaningful work.

## Filters

The filter bar applies. See [Shared controls](../shared-controls.md#filters).

## Troubleshooting

**The AI Gateway tab is empty.** No AI Gateway traffic has been recorded in the
selected window. Start proxying requests through the AI Gateway and the charts
populate automatically.

**Estimated cost doesn't match my provider bill.** Estimated cost is computed
from token usage and published pricing. It excludes discounts and credits. See
[Metrics glossary](../reference/metrics-glossary.md#estimated-cost-ai-gateway).

**Cache hit rate is 0%.** Either caching isn't enabled on the route, or every
request was unique enough that no entry matched. Check your AI Gateway cache
configuration.
