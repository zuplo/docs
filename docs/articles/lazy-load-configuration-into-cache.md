---
title: Lazy Load Configuration
---

Often when working with a programmable gateway like Zuplo you'll want to load some configuration and store it safely for fast access on future requests without impacting latency.

The fastest place to store such information is in memory, but there can be thousands of processes on Zuplo when you're at scale and sometimes those processes are not long lived.

The next fastest place is in [ZoneCache](/docs/articles/zone-cache) which is a cache located in each datacenter. This requires an async connection but is usually much faster than going back to your configuration data store (often in a single location worldwide).

The MemoryZoneReadthroughCache offers the best of both worlds - it uses memory and zone cache in combination to afford the lowest possible latency.

:::warning
Do take care not to load so much data into memory that you OOM (out-of-memory) your process. Processes in Zuplo typically have ~120MB of memory to perform all their work, including holding request bodies etc.
:::

Here's a simple example of the usage of MemoryZoneReadthroughCache being used to store configuration data.

```ts

import { ZuploContext, ZuploRequest, environment } from "@zuplo/runtime";

interface MyConfig {
  data: Record<string, string>[]
}

const cacheName = "CACHE_NAME";
const configKey = "CONFIG_KEY";
const cacheTtlSeconds = 3600;

async function loadConfig(context: ZuploContext) {
  // We will type the cache to work with MyConfig type, but
  // you can use `any` if there. Use the same cache name
  // when trying to use the same cache store from different modules.
  const cache = new MemoryZoneReadThroughCache<MyConfig>(cacheName, context);
  let config = await cache.get(configKey);

  if (!config) {
    // This is where you load the configuration for your own backend API
    const response = await fetch(`https://your-backend-config-api.com`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${environment.CONFIG_API_KEY}`
      }
    }
    if (response.status !== 200) {
      throw new Error(`Error reading config ${response.status}: '${await response.text()}'`);
    }
    config = await response.json();
    cache.put(configKey, config, cacheTtlSeconds);
  }
  return config;
}


export default async function (
  request: ZuploRequest,
  context: ZuploContext,
) {

  const config = loadConfig(context);

  // use the config in your pipeline or request handler etc
  // ...
  // ...
}


```
