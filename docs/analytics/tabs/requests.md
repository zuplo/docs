---
title: "Requests"
sidebar_label: "Requests"
---

The **Requests** tab is the default Analytics overview: every request through
your gateway in the selected time window, with charts and breakdowns for volume,
latency, and errors.

## When to use this

- Spot-check overall traffic and error rate across a project or the whole
  account.
- Investigate a spike in 4xx or 5xx responses.
- Drill from a route, status code, or geographic breakdown into the underlying
  requests.

## Summary KPIs

| Name              | What it measures                                              | When it's useful                          |
| ----------------- | ------------------------------------------------------------- | ----------------------------------------- |
| **Requests**      | Total request count. Secondary value: successful (2xx) count. | Quick health check on volume and success. |
| **Client Errors** | 4xx rate (4xx ÷ total). Secondary value: raw 4xx count.       | Spot bad-input or auth issues.            |
| **Server Errors** | 5xx rate (5xx ÷ total). Secondary value: raw 5xx count.       | Spot gateway or upstream failures.        |
| **Avg Latency**   | Mean response time. Secondary value: min to max.              | Detect broad latency regressions.         |
| **Consumers**     | Distinct API consumers (authenticated + anonymous).           | Gauge active audience.                    |

See [Metrics glossary](../reference/metrics-glossary.md) for how rates and
percentiles are computed.

## Charts

**Request Time Series.** Stacked bars per interval, broken down by status class
(2xx / 3xx / 4xx / 5xx). Drag to select a region to zoom; the time range picker
updates to match.

**Request Locations Map.** A world map with a heatmap of request volume by
location. Shown only when geolocation data is present.

**Latency Over Time.** P50, P95, and P99 lines. _What to look for:_ a widening
gap between P50 and P95 typically signals a tail-latency problem affecting a
subset of requests.

**Error Rate.** 4xx and 5xx rates plotted over time.

**Latency Distribution.** A histogram of P10, P50, P90, P95, and P99 buckets.
Click a band to filter the rest of the tab to requests in that duration range.

**Active Instances.** Distinct active edge instances over time. A rough
indicator of how widely your traffic is distributed across gateway workers.

## Breakdowns

Each breakdown shows the top 10 values by request count. Click **Show more** to
load the next 50.

**Primary breakdowns:**

- **HTTP Method**
- **HTTP Status**
- **Route Path**

**Account scope only:**

- **Project Name**: click to drill into project-scope analytics.
- **Deployment Name**: click to drill into a specific deployment.

**Secondary breakdowns:**

- **Country**, **City**, **Colo**
- **User Sub**
- **Client IP**
- **AS Organization**

Clicking any value applies an `equals` filter for that field.

## Filters

The full filter bar applies. `originHost` is not applicable on this tab. See
[Shared controls](../shared-controls.md#filters) for match modes and the filter
pill UI.

## Troubleshooting

**The map is missing.** The Request Locations Map only renders when geolocation
data is present in the time window. Short windows for low-traffic projects may
not include any geolocated requests.

**Show more doesn't load anything.** You may already be viewing every value for
that breakdown. Top-10 plus 50 covers up to 60 distinct values; beyond that,
narrow the time range or add a filter.

**My charts look sparse.** If your account is new, the trial banner across the
top calls this out. Click **View demo →** in the banner to see what a fully
populated dashboard looks like. See
[Access and entitlements](../access-and-entitlements.md).
