---
title: "Origins"
sidebar_label: "Origins"
---

The **Origins** tab shows backend performance: how each upstream host you proxy
to is performing in terms of volume, error rate, and latency. It's visible when
the project uses managed-edge origins.

## When to use this

- Identify which backend is slow or returning errors.
- Compare the latency contribution of DNS, TCP, TLS, and application time.
- Audit traffic distribution across direct origins and service tunnels.

## Summary metrics

The header strip shows totals derived from the time series:

| Name                 | What it measures                                                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Total requests       | All requests served against any origin in the window.                                                                                       |
| 4xx rate             | Client error rate across all origins.                                                                                                       |
| 5xx rate             | Server error rate across all origins.                                                                                                       |
| Weighted avg latency | Origin response time weighted by request count, so high-traffic origins dominate. See [Metrics glossary](../reference/metrics-glossary.md). |

## Charts

**Backend Request Time Series.** Stacked bars by status class, aggregated across
origins by default. Apply a host filter to scope to one origin.

**Backend Latency.** Average and P95 over time. _What to look for:_ a P95 climb
while the average stays flat usually points to a few slow origins or routes
inside an otherwise healthy fleet.

**Backend Error Rate.** 4xx and 5xx rates over time.

**Request Lifecycle.** Stacked time spent in each phase of an origin request:
**DNS time**, **TCP time**, **TLS time**, and **application time**. A high TLS
slice indicates handshake overhead; a high application slice indicates the
origin is slow.

## Tables

Two tables sit side by side in a 2-column grid.

### Direct Origins

| Column          | Notes                            |
| --------------- | -------------------------------- |
| Host            | The origin hostname.             |
| Requests        | Count with an inline volume bar. |
| Client Errors   | 4xx percentage.                  |
| Server Errors   | 5xx percentage.                  |
| Avg / P95 / P99 | Latency percentiles.             |
| 4xx sparkline   | Inline trend over the window.    |
| 5xx sparkline   | Inline trend over the window.    |

Clicking a row toggles a host filter. Click again to remove it.

### Service Tunnels

Same columns and behavior as Direct Origins, scoped to tunnel-routed origins.
The table is hidden when no tunnel traffic is present.

## Filters

The filter bar applies, with one exception: `userSub` is not applicable on this
tab. See [Shared controls](../shared-controls.md#filters).

## Troubleshooting

**The Origins tab isn't visible.** It appears only when the project uses
managed-edge origins. If your project routes traffic differently, the tab is
hidden.

**Service Tunnels table is missing.** That table only renders when at least one
origin is reached over a service tunnel.

**A 5xx spike on one origin doesn't match the Requests tab.** If you've filtered
the Requests tab to a different route or status class, totals won't match. Clear
filters or compare with the same filters applied on both tabs.
