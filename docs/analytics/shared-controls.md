---
title: "Shared Controls"
sidebar_label: "Shared Controls"
---

Every Analytics tab uses the same set of controls at the top of the page: a time
range picker, a filter bar, and (at project scope) an environment selector.
State persists to the URL so you can share or bookmark any view.

## When to use this

- Narrow a tab to a time window, environment, or set of filter values.
- Build a shareable link to a specific view.
- Understand what each banner across the top of the page means.

## Time range

The time range picker controls every chart, table, and KPI on the active tab.

**Presets.** Last 1h, 6h, 24h, 3d, 7d, 14d, 28d, 60d, 90d.

**Custom range.** Use the datetime-local inputs for **Start** and **End**. Both
fields are clamped to your account's retention window.

**Locked presets.** Presets longer than your retention window show an **Upgrade
for [preset]** tooltip. See
[Access and entitlements](./access-and-entitlements.md).

## Filters

Filters render as removable pills in a sticky bar at the top of the tab. Add a
filter from any breakdown table by clicking a value, or build one manually.

**Match modes.** Each filter uses one of:

| Mode       | Meaning                             |
| ---------- | ----------------------------------- |
| equals     | Exact match.                        |
| contains   | Substring match.                    |
| in         | Value is in a comma-separated list. |
| not        | Negation of equals.                 |
| class      | HTTP status class (e.g. `5xx`).     |
| startsWith | String prefix.                      |
| endsWith   | String suffix.                      |

**Clearing.** Remove a single pill with its **×**, or click **Clear all
filters** to reset.

**Disabled fields.** Some fields are grayed out on tabs where they don't apply.
For example, `originHost` is unavailable on Requests, Consumers, and Agents;
`userSub` is unavailable on Origins.

## Environment selector

The environment selector appears only at project scope. It's a dropdown grouped
as:

- **Working Copy**
- **Production**
- **Preview**
- **Other**

Each environment shows a request count next to its name. The active selection
appears as a blue pill in the top bar.

## Account vs project scope

See
[Access and entitlements](./access-and-entitlements.md#scope-account-vs-project)
for how scope affects available breakdowns and the environment selector.

## URL state and permalinks

Every control persists to the URL. To share a view, copy the address bar.
There's no separate share button.

| Parameter      | Example                                                | Effect                                                  |
| -------------- | ------------------------------------------------------ | ------------------------------------------------------- |
| `time`         | `?time=7d`                                             | Apply a preset.                                         |
| `start`, `end` | `?start=2026-05-01T00:00:00Z&end=2026-05-15T00:00:00Z` | Custom range. Overrides `time`.                         |
| `filter`       | `?filter=httpStatus:class:5xx`                         | Add a filter. Repeat the parameter for multiple values. |
| `demo`         | `?demo=true`                                           | Demo mode (sample data).                                |
| `preview`      | `?preview=1`                                           | Legacy preview mode.                                    |

See [URL parameters](./reference/url-parameters.md) for the full reference.

## Refresh

A spinning loader appears in the sticky bar while data refetches, and a
semi-transparent **Updating…** overlay covers the content area. There's no
manual refresh button and no auto-refresh interval. Change a control to trigger
a refetch.

## Banners

Banners appear at the top of the page in this priority order:

1. **Preview banner**: when `preview=1` is set. Indicates legacy preview mode.
2. **Demo banner**: when `demo=true` is set. Reminds you sample data is shown
   instead of your real analytics.
3. **Trial banner**: for new accounts with advanced analytics. Shows days
   remaining and offers **View demo →** and **Contact Sales**.

## Loading and empty states

Each tab uses a shape-aware skeleton while the first request is in flight. The
product analytics tabs (AI Gateway, MCP Gateway, MCP Server) suppress that
skeleton briefly to avoid flashing when data is already cached. Empty states on
those tabs include a short description and a "Read the … docs" link to the
relevant product section.

## Status colors

The same color palette is used across every chart that breaks down by HTTP
status class:

| Class | Color |
| ----- | ----- |
| 2xx   | Green |
| 3xx   | Blue  |
| 4xx   | Amber |
| 5xx   | Red   |
