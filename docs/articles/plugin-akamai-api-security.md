---
title: Akamai API Security (AKA NONAME) plugin
sidebar_label: Akamai API Security
---

This plugin pushes request/response data to Akamai API Security, formerly known
as "NONAME" API Security. It can also pull data from Akamai API Security to
actively block traffic based on the blocklist rules provided by Akamai API
Security; known as "Protection".

:::info

This plugin is currently in private beta. Please contact us to request access to
this preview at support@zuplo.com.

:::

<EnterpriseFeature name="Custom logging" />

## Setup

To get started, you'll need to configure the Zuplo Integration in Akamai API
Security. Once this step is completed you'll have a 'key' to allow us to connect
to Akamai API Security on your behalf.

Un Zuplo you configure the plugin in the
[Runtime Extensions](./runtime-extensions.md) file `zuplo.runtime.ts`, as
follows:

```ts title="modules/zuplo.runtime.ts"
import { environment, AkamaiApiSecurityPlugin } from "@zuplo/runtime";

runtime.addPlugin(
  new AkamaiApiSecurityPlugin({
    hostname: "your-akamai-api-security-hostname.com",
    // index, provided by Akamai API Security
    index: 1,
    // Key provided by Akamai API Security
    key: environment.AKAMAI_API_SECURITY_KEY,
    // Enable the active prevention/protection feature
    enableProtection: true,
    // optional filter function to exclude requests
    shouldLog: async (request: ZuploRequest, context: ZuploContext) => {
      if (request.headers.get("content-type") !== "application/json") {
        return false;
      }

      return true;
    },
  }),
);
```

As shown, we recommend storing your Key in an environment variable. If you want
the active protection feature enabled, set `enableProtection` to `true`.
