---
title: Compatibility Dates
---

Zuplo is constantly shipping updates to the underlying runtime of projects.
Occasionally, these updates aren't backwards compatible. In order to ensure that
your project continues to build, deploy and operate as you expect it you can set
a compatibility date to lock in the behavior and APIs of the runtime.

## 2024-01-15

This compatibility date includes a number of minor breaking changes to improve
the overall behavior of Zuplo APIs. This compatibility date is the default for
any projects created after Feb. 23rd, 2024.

### Outbound Handlers on all Response Statuses

Previously, outbound handlers would only run on response status ranging from
200-299. Now outbound handlers will always run, regardless of the response code.

### No Hooks on System Routes

Previously runtime hooks such as `OnRequest` or `OnResponseSending` would run on
system routes. For example, if you are using our Developer Portal and have it
running on `/docs`, before this change you could write a hook that modified the
output of the Developer Portal.

### Remove Cloudflare Location Headers

Previously, some Cloudflare location headers (for example `cf-ipregion`) could
be passed through your Zuplo gateway. Now these headers are always removed from
the outbound request if they have been set. If you need access to geo-location
data use [`context.incomingRequestProperties`](./zuplo-context.md) instead.

## 2024-01-15

This compatibility date includes a several breaking changes to improve the
overall behavior of Zuplo APIs. This compatibility date is the default for any
projects created after Jan. 15th, 2024.

### Run Outbound Policies on All Responses

Previously, outbound policies would only run on response status ranging from
200-299. Now outbound policies will always run, regardless of the response code.

### No Hooks on System Routes

Previously runtime hooks such as `OnRequest` or `OnResponseSending` would run on
system routes. For example, if you are using our Developer Portal and have it
running on `/docs`, before this change you could write a hook that modified the
output of the Developer Portal. This could result in unexpected behavior and is
now disallowed.

### Remove Cloudflare Location Headers

Zuplo routes all requests through Cloudflare. Cloudflare adds a number of
headers to requests. Previously, some Cloudflare location headers (for example
`cf-ipregion`) could be passed through your Zuplo gateway. Now these headers are
always removed from the outbound request if they have been set. If you need
access to geo-location data use
[`context.incomingRequestProperties`](./zuplo-context.md) instead.

## 2024-03-14

This compatibility date doesn't include any breaking changes. However, Zuplo
made a number of changes to the runtime build process. These changes will allow
a number of future improvements. Out of an abundance of caution, these changes
are only enabled for projects that have set their compatibility date to
`2024-03-14`. This compatibility date is the default for any projects created
after March 14th, 2024.

Over time, the build changes will be enabled by default on all future
deployments regardless of compatibility date. Existing customers are encouraged
to update their compatibility date to `2024-03-14` and test their projects to
ensure that they continue to operate as expected.

We expect that this new build process will roll out to all customers (regardless
of compatibility date) by the end of April 2024.

## 2024-09-02

The compatibility date allows the ability to call `fetch` to hosts with custom
ports. Previously only the standard ports (80, 443) were allowed.
