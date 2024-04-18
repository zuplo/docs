---
title: BackgroundLoader
sidebar_label: BackgroundLoader
---

The BackgroundLoader class is used to asynchronous load information in the
background while minimizing gateway latency using this information. It is ideal
to use for critical configuration that might be powering your gateway for smart
routing or similar.

:::note

This component is in Beta - please use with care and provide feedback to the
team if you encounter any issues.

:::

Obviously, you don't want to incur the cost of an async cost load on every
request so it's important to cache any config you load into your gateway.
However, sometimes this information is critical to keep very up to date so a
traditional approach of awaiting cache expiry isn't sufficient. The
BackgroundLoader will immediately return a cache entry if available, but also
asynchronously load the config in the background to keep the cache up to date.

If the cache has not been refreshed and the current entry exceeds the TTL (Time
to Live) specified in the constructor the `get` invocation will block while the
data is loaded.

You get to specify the loading function, which is just a simple async function
that can use `fetch`.

```ts
import { ZuploContext, ZuploRequest } from "@zuplo/runtime";
import { BackgroundLoader } from "@zuplo/runtime";

const loaderFunction = async (key: string) => {
  // TODO - consider stronger error handling and checking here
  const result = await fetch(`https://example-config-service.com/${key}`);
  const data = await result.json();
  return data;
};

// create an instance of the component at the module level
// here with a cache expiry of 60s.
const backgroundLoader = new BackgroundLoader(loaderFunction, 60);

export default async function (request: ZuploRequest, context: ZuploContext) {
  // once an entry is cached this will return immediately. It will only block
  // if the cache is empty or has expired.
  const data = await backgroundLoader.get(request.params.loaderId);
  return data;
}
```

The BackgroundLoader will ensure that only one request per 'key' is active at
any one time to avoid overloading your destination services.

:::warning 
You cannot return a `Response` created by the BackgroundLoader as a response from 
a policy or handler. Responses cannot be re-used in this way - they are associated 
with the originating request and results from the BackgroundLoader can be shared 
across requests. 
:::
