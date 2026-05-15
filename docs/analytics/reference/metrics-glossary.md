---
title: "Metrics Glossary"
sidebar_label: "Metrics Glossary"
---

This page defines every term used in the Analytics dashboards once. KPI tables
on tab pages link here for depth.

## HTTP status classes

| Class | Meaning                                                                                         |
| ----- | ----------------------------------------------------------------------------------------------- |
| 2xx   | Success.                                                                                        |
| 3xx   | Redirection.                                                                                    |
| 4xx   | Client error. The caller sent something the gateway or backend rejected.                        |
| 5xx   | Server error. The gateway, an upstream origin, or an MCP backend failed to fulfill the request. |

## Error rates

**Client error rate.** 4xx count divided by total requests in the window,
expressed as a percentage.

**Server error rate.** 5xx count divided by total requests in the window.

**Request-weighted average.** When aggregating a rate across many entities
(consumers, agents, origins), each entity's rate is weighted by its request
count. A consumer with 100,000 requests at a 1% error rate contributes more than
a consumer with 100 requests at a 50% error rate. Use the request-weighted
figure to answer "what does the average request experience look like?"; use a
simple unweighted average to answer "what does the average consumer experience
look like?"

## Latency

**Avg latency.** Arithmetic mean response time. Sensitive to outliers.

**P50 (median) latency.** Half of requests completed within this time.

**P95 latency.** 95% of requests completed within this time. The other 5% took
longer. P95 is the standard tail-latency metric.

**P99 latency.** 99% of requests completed within this time. Useful for spotting
outlier behavior that P95 may smooth over.

**Latency distribution histogram.** Bands at P10, P50, P90, P95, P99. Clicking a
band on the Requests tab filters to requests in that duration range.

## Active edge instances

Distinct gateway worker instances actively serving traffic in each interval. A
rough indicator of how widely your traffic is distributed.

## Active sessions (MCP Server)

Distinct MCP sessions, estimated using HyperLogLog. The figure is approximate
but monotonic within a single time window. Accurate enough for trend analysis,
not for exact session counting.

## Failure origin

Classifies an error by where it originated:

| Origin   | Meaning                                                    |
| -------- | ---------------------------------------------------------- |
| gateway  | The Zuplo gateway returned the error.                      |
| upstream | A backend origin or MCP server returned the error.         |
| client   | The client sent something invalid that caused the failure. |

## Outcome class

Used on MCP Gateway events:

| Class             | Meaning                                                              |
| ----------------- | -------------------------------------------------------------------- |
| success           | Event completed normally.                                            |
| application_error | Event failed due to an application-layer issue (e.g. invalid input). |
| gateway_error     | The gateway itself returned an error.                                |
| upstream_error    | An upstream MCP server returned an error.                            |

## Tokens (AI Gateway)

| Type       | Meaning                                                   |
| ---------- | --------------------------------------------------------- |
| Prompt     | Tokens in the request the gateway forwarded to the model. |
| Completion | Tokens in the model's response.                           |
| Embedding  | Tokens consumed by embedding requests.                    |

## Estimated cost (AI Gateway)

Computed from token usage × the model's published pricing. Does not include
discounts, credits, or provider-side rounding. Use it for trend analysis, not
invoice reconciliation.
