---
title: Audit Log Feature
sidebar_label: Audit Log
---

Zuplo has a built-in auditing feature that can write output to a selection of
data sinks.

If enabled, the Audit Log feature will log full details of

- The request including URL, headers (optional), and full body (optional)
- The response including status, headers (optional) and full body (optional)

These can then be written to a configured Audit Log Output Provider of your
choosing, like AstraDB by DataStax. Contact
[support@zuplo.com](mailto:support@zuplo.com) to request a new provider.

:::note

While you can use it on any tier in working-copy, the Audit Log capability is an
**enterprise** feature. Contact us to have Audit Logging enabled for your
enterprise deployment. [Pricing](https://zuplo.com/pricing)

:::

## Configuring Audit Log

Audit Logging is enabled via a plugin that is registered in the
`zuplo.runtime.ts` runtime extensions module;
[learn more about runtime extensions](./runtime-extensions.md). Here we show an
example configuring Audit Log to write to a DataStax Astra DB collection.

Note you must provide the full URL to the collection, e.g.

`https://<id-and-region>.apps.astra.datastax.com/api/rest/v2/namespaces/<namespace>/collections/<collection>`

```ts

import {
  AuditLogDataStaxProvider,
  AuditLogPlugin,
  RuntimeExtensions,
  ZuploRequest,
} from "@zuplo/runtime";

export function runtimeInit(runtime: RuntimeExtensions) {

  runtime.addPlugin(
    // add the audit plugin, have Datastax write to a requestbin
    // only log methods with audit === true in the filter
    new AuditLogPlugin(
      new AuditLogDataStaxProvider({
        url: "THE_FULL_URL_TO_YOUR_COLLECTION_HERE",
        xCassandraToken: "YOUR_API_KEY_HERE"
      }),
      {
	include: {
		request: {
			body: false
		},
		response: {
			headers: false
			}
		}
      }
    )
  );

```

Note the use of options to disable capture of the full request body and full
response headers.
