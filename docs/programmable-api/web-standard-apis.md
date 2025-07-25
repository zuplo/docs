---
title: Web Standard APIs
sidebar_label: Web Standard APIs
---

Zuplo's runtime supports the standards
[Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API).
This means that you can rely on the same set of JavaScript APIs you would find
in a browser environment.

## Built-In Objects

All of the
[standard built-in objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference)
supported by the current Google Chrome stable release are supported, with a few
notable exceptions:

- `eval()` isn't allowed for security reasons.
- `new Function` isn't allowed for security reasons.
- `Date.now()` returns the time of the last I/O; it doesn't advance during code
  execution.

## ​​Compression Streams

The CompressionStream and DecompressionStream classes support gzip and deflate
compression methods.

[Refer to the MDN documentation for more information](https://developer.mozilla.org/en-US/docs/Web/API/Compression_Streams_API)

## Cryptography

The
[Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
enables the use cryptographic primitives in order to build systems using
cryptography.

For more details see the [Web Crypto documentation](./web-crypto-apis.md)

## Encoding API

Both `TextEncoder` and `TextDecoder` support UTF-8 encoding/decoding.

[Refer to the MDN documentation for more information.](https://developer.mozilla.org/en-US/docs/Web/API/Encoding_API)

## Encoding: Base64

- [`atob()`](https://developer.mozilla.org/en-US/docs/web/api/atob): Decodes a
  string of data which has been encoded using base-64 encoding.
- [`btoa()`](https://developer.mozilla.org/en-US/docs/web/api/btoa): Creates a
  base-64 encoded ASCII string from a string of binary data.

## Fetch

The [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
provides an interface for fetching resources (including across the network).

[Refer to the MDN documentation for more information](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

```ts
const response = await fetch("https://echo.zuplo.io");
const body = await response.json();
```

The Fetch API includes standard objects like
[`Headers`](https://developer.mozilla.org/en-US/docs/Web/API/Headers),
[`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request), and
[`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response).

See Also: [`ZuploRequest`](./zuplo-request.md)

## Streams API

The Streams API allows JavaScript to programmatically access streams of data
received over the network and process them as desired by the developer.

- [`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)
- [`ReadableStream BYOBReader`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStreamBYOBReader)
- [`ReadableStream DefaultReader`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStreamDefaultReader)
- [`TransformStream`](https://developer.mozilla.org/en-US/docs/Web/API/TransformStream)
- [`WritableStream`](https://developer.mozilla.org/en-US/docs/Web/API/WritableStream)
- [`WritableStream DefaultWriter`](https://developer.mozilla.org/en-US/docs/Web/API/WritableStreamDefaultWriter)

## ​​Timers

- [`setInterval()`](https://developer.mozilla.org/en-US/docs/web/api/setinterval):
  Schedules a function to execute every time a given number of milliseconds
  elapses.
- [`clearInterval()`](https://developer.mozilla.org/en-US/docs/web/api/clearinterval):
  Cancels the repeated execution set using setInterval().
- [`setTimeout()`](https://developer.mozilla.org/en-US/docs/web/api/settimeout):
  Schedules a function to execute in a given amount of time.
- [`clearTimeout()`](https://developer.mozilla.org/en-US/docs/web/api/cleartimeout):
  Cancels the delayed execution set using setTimeout().

## URL

The [URL](https://developer.mozilla.org/en-US/docs/Web/API/URL) interface is
used to parse, construct, normalize, and encode URLs. It works by providing
properties which allow you to easily read and modify the components of a URL.

[Refer to the MDN documentation for more information](https://developer.mozilla.org/en-US/docs/Web/API/URL)

## URLPattern API

The
[URLPattern API](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern)
provides a mechanism for matching URLs based on a convenient pattern syntax.

[Refer to the MDN documentation for more information.](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern)
