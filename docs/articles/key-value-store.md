---
title: Key Value Store
sidebar_label: Key Value Store
---

Zuplo has a globally distributed key-value store called `KeyValueStore`. When
running in developer mode (e.g. in the portal at portal.zuplo.com) your cache
will reset with each build. When running in production mode at the edge the
cache will support edge distribution - it can take up to ~1 minute for writes to
sync across all nodes globally (though is usually much quicker).

<EnterpriseFeature />

## Example

```ts
import { ZuploContext, ZuploRequest, KeyValueStore } from "@zuplo/runtime";

export async function setCache(request: ZuploRequest, context: ZuploContext) {
  const cache = new KeyValueStore(context);
  // This cache entry will expire in 60s
  await cache.put("string-key", "some-value", { expirationSecondsTtl: 60 });
  return "OK";
}

export async function getCache(request: ZuploRequest, context: ZuploContext) {
  const cache = new KeyValueStore(context);
  const value = await cache.get("string-key");
  return value;
}
```

## Constructing the KeyValueStore

```ts
// This creates a new instance of the KeyValueStore. This should be performed inside the lifecycle of a request (it's an inexpensive operation that just creates a reference to the real store)
const cache = new KeyValueStore(context);
```

## Writing to the KeyValueStore

```ts
// This cache entry will expire in 60s
await cache.put("string-key", "some-value", { expirationSecondsTtl: 60 });
```

## Reading from the KeyValueStore

```ts
const data = await cache.get("string-key");
```

## Deleting from the KeyValueStore

```ts
await cache.delete("string-key");
```
