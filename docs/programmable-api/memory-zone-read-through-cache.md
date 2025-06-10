---
title: MemoryZoneReadThroughCache
---

The `MemoryZoneReadThroughCache` class provides an in-memory caching solution
with automatic read-through capabilities. This cache stores data in memory for
fast access and automatically handles cache misses.

## Constructor

```ts
new MemoryZoneReadThroughCache<T = unknown>(name: string, context: ZuploContext)
```

### Parameters

- `name` - A unique identifier for the cache instance
- `context` - The [ZuploContext](./zuplo-context.md) object

### Type Parameters

- `T` - The type of data stored in the cache (defaults to `unknown`)

## Methods

### `get(key: string): Promise<T | undefined>`

Retrieves a value from the cache by its key.

- **Parameters:**
  - `key` - The key to look up in the cache
- **Returns:** A promise that resolves to the cached value or `undefined` if not
  found

### `put(key: string, data: T, ttlSeconds: number): void`

Stores a value in the cache with a time-to-live (TTL).

- **Parameters:**
  - `key` - The key to store the value under
  - `data` - The value to cache
  - `ttlSeconds` - Time-to-live in seconds before the cached value expires

### `delete(key: string): Promise<void>`

Removes a value from the cache.

- **Parameters:**
  - `key` - The key of the value to remove
- **Returns:** A promise that resolves when the deletion is complete

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
