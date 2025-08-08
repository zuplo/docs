---
title: Cache
sidebar_label: Cache
draft: true
---

The [Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache) provides
a persistent storage mechanism for Request / Response object pairs that are
cached in long lived memory.

:::tip

Only a subset of the standard Cache API is supported. Below are the interfaces
and methods that are supported and known limitations.

:::

## CacheStorage

The `CacheStorage` is exposed as the `caches` global object. This object allows
you to open instances of a `Cache`. When calling `caches.open` if the named
cache doesn't exist it will be created, otherwise the existing cache will be
returned.

**Definition**

```ts
interface CacheStorage {
  open(cacheName: string): Promise<Cache>;
}
```

**Example**

```ts
const cache = await caches.open("MY_CACHE");
```

## Cache

The `Cache` object stores `Request` and `Response` objects based on header
values.

**Definition**

```ts
interface Cache {
  put(request: RequestInfo, response: Response): Promise<void>;
  match(
    request: RequestInfo,
    options?: CacheQueryOptions,
  ): Promise<Response | undefined>;
  delete(request: RequestInfo, options?: CacheQueryOptions): Promise<boolean>;
}

interface CacheQueryOptions {
  /**
   * Not supported in development environments
   */
  ignoreMethod: boolean;
  /**
   * Always ignored
   */
  ignoreSearch: boolean;
  /**
   * Always ignored
   */
  ignoreVary: boolean;
}
```

:::warning

At this time, the `options` parameter will be ignored entirely when running on
in a developer environment (for example working copy). In non-developer
environments, the `ignoreMethod` property is supported. All other properties
will be ignored.

:::

### Put

```ts
await cache.put(request, response);
```

The `put()` method of the `Cache` interface allows key/value pairs to be added
to the current Cache object.

### Match

```ts
const response = await cache.match(request);
```

The `match()` method of the `Cache` interface returns a Promise that resolves to
the Response associated with the first matching request in the Cache object. If
no match is found, the Promise resolves to `undefined`.

### Delete

```ts
await cache.delete(request);
```

The delete() method of the Cache interface finds the Cache entry whose key is
the request, and if found, deletes the Cache entry and returns a Promise that
resolves to true. If no Cache entry is found, it resolves to false.

## Headers

The following headers can be used to control the cache when adding a response
using the `put()` method.

- `Cache-Control`: Controls caching directives.
  [More info](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)
- `ETag`: Allows cache.match() to evaluate conditional requests with
  If-None-Match.
- `Expires`: A string that specifies when the resource becomes invalid.
- `Last-Modified`: Allows cache.match() to evaluate conditional requests with
  If-Modified-Since.

## Examples

The below example shows how to use a cached response and populate the cache in
the event there is no response already cached.

```ts
const request = new Request(`https://echo.zuplo.io`);
const cache = await caches.open("MY_CACHE");
let response = await cache.match(request);
if (!response) {
  response = await fetch(request);
  await cache.put(request, response);
}

const data = await response.json();
```

If you just want to store the value, just create a new simple Response and set
the `Cache-Control` header.

```ts
const request = new Request(`https://echo.zuplo.io`);
const cache = await caches.open("MY_CACHE");
const response = await fetch(request);

// Create a new response and set new headers
const cachedResponse = new Response(response, {
  headers: {
    "Cache-Control": "max-age=604800",
  },
});

// Add the response to the cache
await cache.put(request, cachedResponse);
```

When adding to the cache, headers are used to control how long resources are
stored. If you are reusing the response headers, make sure to account for
additional cache headers that may have been sent.

```ts
const request = new Request(`https://echo.zuplo.io`);
const cache = await caches.open("MY_CACHE");
const response = await fetch(request);

// Create a new Headers object and add existing response headers
const headers = new Headers(response.headers);

// Set the cache max age
headers.set("Cache-Control", "max-age=604800");

// Just in case the original response included other cache
// headers, remove them
headers.delete("Expires");
headers.delete("ETag");
headers.delete("Last-Modified");

// Create a new request with the cache headers
const cachedResponse = new Response(response, {
  headers,
});

// Add the response to the cache
await cache.put(request, cachedResponse);
```
