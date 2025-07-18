---
title: ZoneCache
sidebar_label: ZoneCache
---

The ZoneCache is used to store data in a shared cache, typically local to the
Zone your gateway is running (for example, the same data center). This can be
used to store small, simple objects. It's excellent for improving the latency of
your gateway if you need to access remote data in your policies, such as calling
another API in a policy.

There's an demonstration of ZoneCache use in the
[Per User Rate Limits Using a Database](/docs/articles/per-user-rate-limits-using-db)
example.

## Constructor

```ts
new ZoneCache<T = unknown>(name: string, context: ZuploContext)
```

Creates a new cache instance for the specified zone.

- `name` - A unique identifier for the cache
- `context` - The [ZuploContext](./zuplo-context.md) object
- `T` - The type of data stored in the cache (defaults to `unknown`)

## Methods

**`get`**

Retrieves a value from the cache. Returns `undefined` if the key doesn't exist
or has expired.

```ts
get(key: string): Promise<T | undefined>
```

**`put`**

Stores a value in the cache with a time-to-live (TTL) in seconds. The data will
be JSON serialized.

```ts
put(key: string, data: T, ttlSeconds: number): Promise<void>
```

:::note

Objects that don't serialize cleanly to JSON (like the `Headers` object) won't
be readable after storage.

:::

**`delete`**

Removes a value from the cache.

```ts
delete(key: string): Promise<void>
```

## Example

```ts
import { ZoneCache, ZuploContext, ZuploRequest } from "@zuplo/runtime";

interface UserData {
  id: string;
  name: string;
  email: string;
}

export default async function handler(
  request: ZuploRequest,
  context: ZuploContext,
) {
  const cache = new ZoneCache<UserData>("user-cache", context);

  // Try to get user from cache
  const userId = request.params.userId;
  let userData = await cache.get(userId);

  if (!userData) {
    // Not in cache, fetch from API
    const response = await fetch(`https://api.example.com/users/${userId}`);
    userData = await response.json();

    // Cache for 5 minutes
    await cache.put(userId, userData, 300);
  }

  return new Response(JSON.stringify(userData));
}
```

## Performance Tips

When writing to the cache, you may not want to `await` the operation to
complete. This can improve response times:

```ts
// Fire and forget pattern - don't wait for cache write
cache.put("key", data, 60).catch((err) => context.log.error(err));
```

Always catch errors when using the fire-and-forget pattern to avoid unhandled
promise rejections.
