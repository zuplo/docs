---
title: Cache - KeyValueStore
sidebar_label: Caching
---

Zuplo has a high performance cache, called `KeyValueStore` that can be used inside projects. When running in developer mode (e.g. in the portal at portal.zuplo.com) your cache will reset with each build. When running in production mode at the edge the cache will support edge distribution - it can take up to ~1 minute for writes to sync across all nodes globally (though is usually much quicker).

### Constructing the KeyValueStore

```ts
import { ZuploContext, ZuploRequest, KeyValueStore } from "@zuplo/runtime";

export default async function (request: ZuploRequest, context: ZuploContext) {
  // This creates a new instance of the KeyValueStore. This should be performed inside the lifecycle of a request (it's an inexpensive operation that just creates a reference to the real store)
  const cache = new KeyValueStore(context);
}
```

### Writing to the KeyValueStore

```ts
import { ZuploContext, ZuploRequest, KeyValueStore } from "@zuplo/runtime";

export default async function (request: ZuploRequest, context: ZuploContext) {
  const cache = new KeyValueStore(context);
  // This cache entry will expire in 60s
  await cache.put("string-key", "some-value", { expirationSecondsTtl: 60 });
}
```

### Reading from the KeyValueStore

```ts
import { ZuploContext, ZuploRequest, KeyValueStore } from "@zuplo/runtime";

export default async function (request: ZuploRequest, context: ZuploContext) {
  const cache = new KeyValueStore(context);
  const data = await cache.get("string-key");
  return data;
}
```

### Deleting from the KeyValueStore

```ts
import { ZuploContext, ZuploRequest, KeyValueStore } from "@zuplo/runtime";

export default async function (request: ZuploRequest, context: ZuploContext) {
  const cache = new KeyValueStore(context);
  const data = await cache.delete("string-key");
  return data;
}
```
