---
title: ZoneCache
sidebar_label: ZoneCache
---

The ZoneCache is used to store data in a shared cache, typically local to the Zone your gateway is running (for example, the same data center). This can be used to store small, simple objects. It's excellent for improving the latency of your gateway if you need to access remote data in your policies, such as calling another API in a policy.

There's an demonstration of ZoneCache use in the [Per User Rate Limits Using a Database](/docs/articles/per-user-rate-limits-using-db) example.

## Constructing the Cache

```ts
// create a new cache by specifying a name and
// passing current ZuploContext
const cache = new ZoneCache("name-of-your-cache", context);
```

## Reading from the Cache

```ts
// read from the cache using the key
const data = await cache.get("key");
```

## Writing to the Cache

```ts
// write to the cache - and keep for 60 seconds
await cache.put("key", data, 60);
```

When writing to the cache the `data` parameters will be JSON serialized. If your data does not serialize cleanly to JSON (like the `Headers` object does not) you won't be able to read your data back/

## Deleting from the Cache

```ts
await cache.delete("key");
```

**TIP** On some code paths you may not want to `await` the cache to wait for the operation to complete. For example, when writing data you may choose to write asynchronously. However, we recommend catching errors if you do this, for example:

```ts
cache.put("key", data, 60).catch((err) => context.log.error(err));
```
