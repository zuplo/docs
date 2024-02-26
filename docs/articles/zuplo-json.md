---
title: Zuplo Project Config (zuplo.json)
---

Certain advanced project-level settings can be configured using the
`zuplo.jsonc` file at the root of a project. The `zuplo.json` file is created by
default for new projects and contains the default configuration.

The default `zuplo.jsonc` file is shown below. The only current valid `version`
of the file is `1`.

```jsonc
{
  "version": 1,
  "project": "my-project",
  "compatibilityDate": "01-15-2024",
}
```

:::warning

The `zuplo.jsonc` file is not currently shown or editable in the Zuplo portal.
Connect your project to source control and edit inside your source control
provider or by pushing a local change with git. If your project does not have a
`zuplo.jsonc` it can be added using source control

:::

## Compatibility Date

Zuplo is constantly shipping updates to the underlying runtime of projects.
Occasionally, these updates are not backwards compatible. Additionally, Zuplo
deploys portions of projects to Cloudflare Workers who also occasionally make
non-backward compatible changes. In order to ensure that your project continues
to build, deploy and operate as you expect it you can set a compatibility date
to lock in the behavior and APIs of the runtime.

Current valid settings for the compatibility date are to not have it set or to
set it to `2023-03-14`. When not set, the Zuplo runtime does not set a
compatibility date on Cloudflare Workers. When the value is set to `2023-03-14`,
the value is also set on the Cloudflare Worker which enables all changes up to
March 14, 2023. See
[Cloudflare's documentation](https://developers.cloudflare.com/workers/platform/compatibility-dates/)
for a list of changes.

## 01-15-2024

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

Previously, some Cloudflare location headers (i.e. `cf-ipregion`) could be
passed through your Zuplo gateway. Now these headers are always removed from the
outbound request if they have been set. If you need access to geo-location data
use [`context.incomingRequestProperties`](./zuplo-context.md) instead.
