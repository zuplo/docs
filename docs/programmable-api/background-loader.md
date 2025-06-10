---
title: BackgroundLoader
sidebar_label: BackgroundLoader
---

The BackgroundLoader class is used to asynchronous load information in the
background while minimizing gateway latency using this information. It's ideal
to use for critical configuration that might be powering your gateway for smart
routing or similar.

:::note

This component is in Beta - please use with care and provide feedback to the
team if you encounter any issues.

:::

Obviously, you don't want to incur the cost of an asynchronous cost load on
every request so it's important to cache any configuration you load into your
gateway. However, sometimes this information is critical to keep very up to date
so a traditional approach of awaiting cache expiry isn't sufficient. The
BackgroundLoader will immediately return a cache entry if available, but also
asynchronously load the configuration in the background to keep the cache up to
date.

If the cache hasn't been refreshed and the current entry exceeds the TTL (Time
to Live) specified in the constructor the `get` invocation will block while the
data is loaded.

You get to specify the loading function, which is just a simple asynchronous
function that can use `fetch`.

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
