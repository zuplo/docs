---
title: BackgroundLoader
sidebar_label: BackgroundLoader
---

The BackgroundLoader class provides asynchronous loading of configuration data
while minimizing gateway latency. It's ideal for critical configuration that
powers your gateway for smart routing or similar use cases.

The BackgroundLoader optimizes performance by:

- Immediately returning cached data when available
- Asynchronously refreshing data in the background
- Only blocking when cache is empty or expired

## Constructor

```ts
new BackgroundLoader<T>(
  loader: (key: string) => Promise<T>,
  options: BackgroundLoaderOptions
)
```

Creates a new background loader instance.

- `loader` - Async function that loads data for a given key
- `options` - Configuration options including TTL and timeout
- `T` - The type of data being loaded

## Options

```ts
interface BackgroundLoaderOptions {
  // (Required) Time to live for cache entries in seconds
  ttlSeconds: number;
  // (Optional) Timeout for the loader function in seconds
  loaderTimeoutSeconds?: number;
}
```

## Methods

**`get`**

Retrieves data for the specified key. Returns immediately if cached, otherwise
blocks while loading.

```ts
get(key: string): Promise<T>
```

## Example

```ts
import { ZuploContext, ZuploRequest } from "@zuplo/runtime";
import { BackgroundLoader } from "@zuplo/runtime";

const loaderFunction = async (key: string) => {
  // TODO - consider stronger error handling and checking here
  const result = await fetch(`https://example-config-service.com/${key}`);
  const data = await result.json();
  return data;
};

// Create an instance of the component at the module level
// Here with a cache expiry of 60s
//
const bg = new BackgroundLoader(loaderFunction, {
  ttlSeconds: 60,
  loaderTimeoutSeconds: 10,
});

export default async function (request: ZuploRequest, context: ZuploContext) {
  // once an entry is cached this will return immediately. It will only block
  // if the cache is empty or has expired.
  const data = await backgroundLoader.get(request.params.loaderId);
  return data;
}
```

The BackgroundLoader will ensure that only one request per 'key' is active at
any one time to avoid overloading your destination services.

The BackgroundLoader has the following options. In the above example, we set
`ttlSeconds`:

```ts
interface BackgroundLoaderOptions {
  // (Required) The time to live for the cache entry in seconds
  ttlSeconds: number;
  // (Optional) The timeout for the loader -- error out if the load takes longer than this. Useful to prevent hanging background requests.
  loaderTimeoutSeconds?: number;
}
```

:::warning

You can't return a `Response` created by the BackgroundLoader as a response from
a policy or handler. Responses can't be re-used in this way - they're associated
with the originating request and results from the BackgroundLoader can be shared
across requests.

:::
