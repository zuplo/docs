---
title: "Access and Entitlements"
sidebar_label: "Access & Entitlements"
---

## When to use this

- Confirm whether your account can see advanced analytics.
- Find out how many days of history you have access to.
- Understand the trial banner or the demo mode link.

## Plan requirements

Advanced analytics must be enabled on your account. Without it, the Analytics
page shows an upsell view with a **Contact Sales** call-to-action and no charts.

## Free trial

New accounts with advanced analytics enabled get an automatic free trial. The
trial:

- Runs for the same number of days as your account's retention window.
- Shows a banner across the top of the Analytics page: "You're on a {N}-day
  preview of Advanced Analytics, {N} days left."
- Includes two call-to-actions: **View demo →** (loads the dashboard with sample
  data) and **Contact sales**.

Accounts on the legacy analytics version are not eligible for the trial. They
continue to use the previous experience.

:::note

The trial banner notes that the charts may look sparse if your account hasn't
yet generated much traffic. Use **View demo →** to see what a fully populated
dashboard looks like.

:::

## Data retention

Each account has an analytics history window measured in days. The window
controls:

- How far back you can scroll using the time-range picker.
- Which presets in the picker are available. Presets longer than your window are
  locked with an **Upgrade for [preset]** tooltip.
- The maximum start and end values when you pick a custom range.

If you need a longer window, contact your Zuplo account team.

## Demo mode

Append `?demo=true` to the Analytics URL, or click **View demo →** in the trial
banner, to switch into demo mode. In demo mode:

- Charts and tables are populated with synthetic sample data.
- A persistent banner reads: "You're viewing the Advanced Analytics demo with
  sample data. Your real analytics aren't shown here."

Remove the `demo` parameter from the URL to return to your real data.

## Scope: account vs project

- **Account scope** aggregates across every project in the account. The Requests
  tab adds **Project Name** and **Deployment Name** as breakdowns; click a
  project name to drill into project scope.
- **Project scope** filters to a single project and adds an **Environment**
  selector (Working Copy, Production, Preview, Other) in the top bar.

See [Shared controls](./shared-controls.md) for how scope affects filters and
breakdowns.
