---
title: "Consumers"
sidebar_label: "Consumers"
---

The **Consumers** tab breaks traffic down by API consumer: anyone calling your
gateway, whether authenticated or anonymous. Use it to see who your noisiest
callers are, who's hitting errors, and which consumers experience the slowest
latency.

## When to use this

- Find the top API consumers by request volume.
- Identify which consumer is responsible for a 4xx or 5xx surge.
- Compare latency experience across consumers (for example, paid vs free tier).

## Summary KPIs

| Name              | What it measures                                                                                                                          |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Requests**      | Total requests across all consumers in the window.                                                                                        |
| **Client Errors** | Request-weighted 4xx rate across consumers (high-traffic consumers count more). See [Metrics glossary](../reference/metrics-glossary.md). |
| **Server Errors** | Request-weighted 5xx rate. Secondary: count of consumers with at least one 5xx.                                                           |
| **Consumers**     | Distinct consumers (authenticated plus anonymous).                                                                                        |
| **Total Errors**  | Combined 4xx + 5xx count. Secondary: consumers affected.                                                                                  |

## Charts

**Request Volume.** Stacked bars by status class. The chart title updates to
reflect the active consumer filter so you can tell at a glance whether you're
looking at one consumer or all of them.

**Consumer Error Rates.** 4xx and 5xx over time. _What to look for:_ a sustained
4xx rate from one consumer usually points to a broken integration on their side.

**Consumer Latency Over Time.** P50, P95, P99 lines.

## Consumer table

| Column          | Notes                                                               |
| --------------- | ------------------------------------------------------------------- |
| User            | Consumer identity. Anonymous requests show **Anonymous · No auth**. |
| Requests        | Count with an inline volume bar.                                    |
| Client Errors % | 4xx percentage.                                                     |
| Server Errors % | 5xx percentage.                                                     |
| Avg / P95 / P99 | Latency percentiles.                                                |
| 4xx sparkline   | Inline trend over the window.                                       |
| 5xx sparkline   | Inline trend over the window.                                       |

The table is searchable and sortable on any column (default: requests
descending). Clicking a row filters the entire tab to that consumer. **Show
more** loads the next 50.

## Filters

The filter bar applies. `originHost` is not applicable on this tab. See
[Shared controls](../shared-controls.md#filters).

## Troubleshooting

**Everything is showing as Anonymous.** If your gateway isn't authenticating
requests, or your auth policy isn't attaching a consumer identity, every request
falls into the **Anonymous · No auth** bucket. Check your API key or JWT policy
configuration.

**I clicked a row but the charts didn't change.** A row click adds a consumer
filter pill. If you don't see the pill in the sticky bar, your click landed on a
non-row element. Try clicking the user cell directly.

**The 5xx rate here is higher than on Requests.** The Consumers KPI is
request-weighted across consumers, while the Requests KPI is a flat rate over
all requests. They diverge when high-error consumers are a small share of total
volume. See [Metrics glossary](../reference/metrics-glossary.md).
