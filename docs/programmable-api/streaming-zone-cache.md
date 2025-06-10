---
title: StreamingZoneCache
---

The `StreamingZoneCache` class provides a distributed caching solution optimized
for streaming data. It allows you to cache `ReadableStream` objects across
Zuplo's edge network.

## Constructor

```ts
new StreamingZoneCache(name: string, context: ZuploContext)
new StreamingZoneCache(name: string, options: CacheOptions)
```

### Parameters

- `name` - A unique identifier for the cache instance
- `context` - The [ZuploContext](./zuplo-context.md) object
- `options` - Cache configuration options (alternative to context)

## Methods

### `get(key: string): Promise<ReadableStream<Uint8Array> | undefined>`

Retrieves a stream from the cache by its key.

- **Parameters:**
  - `key` - The key to look up in the cache
- **Returns:** A promise that resolves to the cached stream or `undefined` if
  not found

### `put(key: string, stream: ReadableStream<Uint8Array>, ttlSeconds: number): Promise<void>`

Stores a stream in the cache with a time-to-live (TTL).

- **Parameters:**
  - `key` - The key to store the stream under
  - `stream` - The readable stream to cache
  - `ttlSeconds` - Time-to-live in seconds before the cached stream expires
- **Returns:** A promise that resolves when the stream is cached

### `delete(key: string): Promise<void>`

Removes a stream from the cache.

- **Parameters:**
  - `key` - The key of the stream to remove
- **Returns:** A promise that resolves when the deletion is complete

## Example

```ts
import { StreamingZoneCache, ZuploContext, ZuploRequest } from "@zuplo/runtime";

export default async function handler(
  request: ZuploRequest,
  context: ZuploContext,
) {
  const cache = new StreamingZoneCache("response-cache", context);
  const cacheKey = `response:${request.url}`;

  // Try to get cached response
  const cachedStream = await cache.get(cacheKey);
  if (cachedStream) {
    return new Response(cachedStream, {
      headers: { "X-Cache": "HIT" },
    });
  }

  // Fetch from origin
  const response = await fetch("https://api.example.com/large-file");

  // Clone the response so we can cache it and return it
  const [streamForCache, streamForResponse] = response.body!.tee();

  // Cache the response for 1 hour (3600 seconds)
  await cache.put(cacheKey, streamForCache, 3600);

  return new Response(streamForResponse, {
    headers: {
      ...response.headers,
      "X-Cache": "MISS",
    },
  });
}
```

## Advanced Example: Caching Large Files

```ts
import { StreamingZoneCache, ZuploContext, ZuploRequest } from "@zuplo/runtime";

export default async function handler(
  request: ZuploRequest,
  context: ZuploContext,
) {
  const cache = new StreamingZoneCache("file-cache", context);
  const fileId = request.params.fileId;
  const cacheKey = `file:${fileId}`;

  // Check cache first
  const cachedFile = await cache.get(cacheKey);
  if (cachedFile) {
    context.log.info(`Cache hit for file ${fileId}`);
    return new Response(cachedFile, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  // Stream from storage service
  const storageResponse = await fetch(
    `https://storage.example.com/files/${fileId}`,
  );

  if (!storageResponse.ok) {
    return new Response("File not found", { status: 404 });
  }

  // Use tee() to create two identical streams
  const [cacheStream, responseStream] = storageResponse.body!.tee();

  // Cache for 24 hours
  context.waitUntil(cache.put(cacheKey, cacheStream, 86400));

  return new Response(responseStream, {
    headers: storageResponse.headers,
  });
}
```

## Best Practices

- Use `tee()` to split streams when you need to both cache and return the same
  stream
- Use `context.waitUntil()` for non-blocking cache writes
- Set appropriate TTL values based on your content update frequency
- Consider the size of streams being cached to avoid memory issues
- The cache is distributed across Zuplo's edge network for optimal performance

## Beta Status

This API is currently in beta and may change in future releases.

## See Also

- [ZoneCache](./zone-cache.md) - For caching JSON and other structured data
- [MemoryZoneReadThroughCache](./memory-zone-read-through-cache.md) - For
  in-memory caching
- [Web Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) -
  MDN documentation on streams
