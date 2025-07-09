---
title: Release v6.56.0
tags:
  - runtime
  - dev-portal
---

This release introduces configurable memory sizing for the
MemoryZoneReadThroughCache, improves runtime OpenAPI path handling, and fixes
environment variable support for Zudoku dev portals.

### New Features 🎉

- **Configurable memory size for MemoryZoneReadThroughCache** - The runtime's
  [MemoryZoneReadThroughCache](https://zuplo.com/docs/programmable-api/memory-zone-read-through-cache)
  now supports configurable memory size limits. This enhancement provides
  developers with greater control over memory allocation for cached data,
  helping to optimize performance while avoiding out-of-memory errors in
  memory-constrained environments.

### Bug Fixes 🐛

- **Support for `ZUDOKU_PUBLIC_` environment variables** - Fixed an issue
  preventing the use of `ZUDOKU_PUBLIC_` prefixed
  [environment variables](https://zuplo.com/docs/dev-portal/zudoku/guides/environment-variables)
  in Zudoku dev portals. These variables can now be properly exposed to the
  client-side for use in configuration and React components.

- **Ignore non-method properties on OpenAPI operations** - The runtime now
  properly ignores properties on OpenAPI opertations that are not methods.
  Perviously this could cause build errors.
