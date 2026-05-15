---
title: "URL Parameters"
sidebar_label: "URL Parameters"
---

Every Analytics control persists to the URL. Copy the address bar to share any
view.

## When to use this

- Build a permalink to a specific time window, filter set, or demo view.
- Embed an Analytics link in a runbook, postmortem, or dashboard.
- Understand what each query parameter does.

## Parameters

| Parameter      | Example                                                | Effect                                                                                    |
| -------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| `time`         | `?time=7d`                                             | Apply a preset. Values: `1h`, `6h`, `24h`, `3d`, `7d`, `14d`, `28d`, `60d`, `90d`.        |
| `start`, `end` | `?start=2026-05-01T00:00:00Z&end=2026-05-15T00:00:00Z` | Custom range as ISO-8601 datetimes. Overrides `time` when both are present.               |
| `filter`       | `?filter=httpStatus:class:5xx`                         | Add a filter as `<field>:<matchmode>:<value>`. Repeat the parameter for multiple filters. |
| `demo`         | `?demo=true`                                           | Demo mode (sample data instead of your real analytics).                                   |
| `preview`      | `?preview=1`                                           | Legacy preview mode.                                                                      |

## Match modes for `filter`

| Mode       | Meaning               | Example                            |
| ---------- | --------------------- | ---------------------------------- |
| equals     | Exact match.          | `filter=httpMethod:equals:POST`    |
| contains   | Substring match.      | `filter=route:contains:/v1/users`  |
| in         | Comma-separated list. | `filter=httpStatus:in:500,502,503` |
| not        | Negation of equals.   | `filter=country:not:US`            |
| class      | HTTP status class.    | `filter=httpStatus:class:5xx`      |
| startsWith | String prefix.        | `filter=route:startsWith:/v1/`     |
| endsWith   | String suffix.        | `filter=route:endsWith:.json`      |

## Permalink examples

Last 7 days of 5xx errors on a specific route:

```
?time=7d&filter=httpStatus:class:5xx&filter=route:startsWith:/v1/users
```

Custom range with two filters:

```
?start=2026-05-01T00:00:00Z&end=2026-05-08T00:00:00Z&filter=country:equals:US&filter=httpMethod:equals:POST
```

Open the demo:

```
?demo=true
```

## Sharing

The recipient sees the same view, provided they have access to the project or
account.

## See also

- [Shared controls](../shared-controls.md): what each control does in the UI.
- [Metrics glossary](./metrics-glossary.md): definitions for the fields you can
  filter on.
