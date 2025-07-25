---
title: MemoryZoneReadThroughCache
sidebar_label: MemoryZoneReadThroughCache
---

The `MemoryZoneReadThroughCache` class provides an in-memory caching solution
with automatic read-through capabilities. This cache stores data in memory for
fast access and automatically handles cache misses.

## Constructor

```ts
new MemoryZoneReadThroughCache<T = unknown>(name: string, context: ZuploContext)
```

Creates a new instance of the memory cache with read-through capabilities.

- `name` - A unique identifier for the cache instance
- `context` - The [ZuploContext](./zuplo-context.md) object
- `T` - The type of data stored in the cache (defaults to `unknown`)

## Methods

**`get`**

Retrieves a value from the cache by its key. Returns `undefined` if not found.

```ts
get(key: string): Promise<T | undefined>
```

**`put`**

Stores a value in the cache with a time-to-live (TTL) in seconds.

```ts
put(key: string, data: T, ttlSeconds: number): void
```

**`delete`**

Removes a value from the cache.

```ts
delete(key: string): Promise<void>
```

## Example

```ts
import {
  MemoryZoneReadThroughCache,
  ZuploContext,
  ZuploRequest,
} from "@zuplo/runtime";

export default async function handler(
  request: ZuploRequest,
  context: ZuploContext,
) {
  // Create a cache instance for user data
  const userCache = new MemoryZoneReadThroughCache<{
    name: string;
    email: string;
  }>("user-cache", context);

  // Try to get user from cache
  const userId = "user-123";
  let user = await userCache.get(userId);

  if (!user) {
    // User not in cache, fetch from database
    user = await fetchUserFromDatabase(userId);

    // Cache the user data for 5 minutes (300 seconds)
    userCache.put(userId, user, 300);
  }

  return new Response(JSON.stringify(user));
}
```

## Best Practices

- Use descriptive cache names to avoid collisions between different cache
  instances
- Set appropriate TTL values based on your data freshness requirements
- Consider memory usage when caching large objects
- The cache is scoped to the current worker instance and not shared across
  instances

## See Also

- [ZoneCache](./zone-cache.md) - For distributed caching across zones
- [StreamingZoneCache](./streaming-zone-cache.md) - For caching streaming data
- [BackgroundLoader](./background-loader.md) - For automatic cache population
