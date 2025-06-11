---
title: Compatibility Dates
---

Zuplo is constantly shipping updates to the underlying runtime of projects.
Occasionally, these updates aren't backwards compatible. In order to ensure that
your project continues to build, deploy and operate as you expect it you can set
a compatibility date to lock in the behavior and APIs of the runtime.

## 2025-02-06

This compatibility date introduces a number of breaking changes to improve the
overall behavior of Zuplo APIs. This compatibility date is the default for any
projects created after 2025-03-27.

### Special Characters in OpenAPI Format URLs

Previously, special characters that were included in URLs that used the
`open-api` formatted URLs were not escaped. This allowed an unintended behavior
where the URL could include Regex patterns even though the OpenAPI format urls
do not allow regex. This has been fixed and now all special characters are
escaped. This allows URLs with formats like:

```
/accounts/open({id})
/accounts/:action
```

### Removed legacy Log Initialization

Previously, several of the Zuplo log plugins could be enabled by setting
undocumented environment variables. This was a legacy feature that was added
before the current plugin system existed. This feature has been removed. Log
plugins should be enabled using the
[documented plugin system](../articles/logging.md).

If you are setting any of the following environment variables, you should
migrate to the log plugin initialization.

```txt
GCP_USER_LOG_NAME
GCP_USER_LOG_SVC_ACCT_JSON
ZUPLO_USER_LOGGER_DATA_DOG_URL
```

### Removed legacy Log Context

Previously, several log plugins used special properties on `context.custom` to
set global attributes on logs. This was a legacy feature that was added before
the current plugin system existed. This feature has been removed. Log plugins
should be enabled using the [documented plugin system](./logging.md).

If you are using setting any of the following in your code, you should migrate
to the plugin configuration instead.

```ts
context.custom["__ddtags"]; // Sets tags
context.custom["__ddattr"]; // Sets fields
```

Migrate to the following:

```ts
export function runtimeInit(runtime: RuntimeExtensions) {
  runtime.addPlugin(
    new DataDogLoggingPlugin({
      url: "https://http-intake.logs.datadoghq.com/api/v2/logs",
      apiKey: environment.DATADOG_API_KEY,
      source: "MyAPI", // Optional, defaults to "Zuplo"
      tags: {
        tag: "hello",
      },
      fields: {
        field1: "value1",
        field2: "value2",
      },
    }),
  );
}
```

### Improved Node.js Compatibility

The Zuplo runtime does not run Node.js, but is compatible with a number of
Node.js APIs. This compatibility date adds some additional support for Node.js
specific APIs.

## 2024-09-02

The compatibility date allows the ability to call `fetch` to hosts with custom
ports. Previously only the standard ports (80, 443) were allowed.

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

On SaaS deployments, Zuplo routes all requests through Cloudflare. Cloudflare
adds a number of headers to requests. Previously, some Cloudflare location
headers (for example `cf-ipregion`) could be passed through your Zuplo gateway.
Now these headers are always removed from the outbound request if they have been
set. If you need access to geo-location data use
[`context.incomingRequestProperties`](./zuplo-context.md) instead.

### Remove Internal Zuplo Headers

Zuplo uses several internal headers to send data between different layers of our
systems. Previously, some of these headers where exposed in a way that they
could be accessed directly. Examples were `zp-ipcity` and `zp-ipcountry`. These
headers are now always removed from the outbound request if they have been set.
If you need access this data use
[`context.incomingRequestProperties`](./zuplo-context.md) instead.
