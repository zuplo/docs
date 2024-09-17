---
title: Non-Standard Ports
---

Zuplo supports making requests to non-standard ports when your runtime is
configured with a
[compatibility date](https://zuplo.com/docs/articles/zuplo-json#compatibility-date)
of [2024-09-02](/docs/articles/zuplo-json#2024-09-02) or later.

## Making a Request to a Non-Supported Port

Making requests to non-standard ports can be done using the built in handlers or
`fetch` api. Simply set the url to use the port, for example
`http://example.com:8080`.

```ts
const response = await fetch("http://example.com:8080");
```

## Older Compatibility Dates

Before [2024-09-02](/docs/articles/zuplo-json#2024-09-02), Zuplo did not support
making requests to non-standard ports. If you make a request to a non-standard
port on an older runtime, the port will be ignored.
