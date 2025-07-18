---
title: OpenAPI Server URLs in Zuplo
sidebar_label: OpenAPI Server URLs
---

When working with OpenAPI specifications in Zuplo, it's important to understand
how server URLs are handled across different environments.

## Automatic Server URL Overwriting

Zuplo automatically overwrites the server URLs in your OpenAPI specification
files with the URL of the current environment. This automatic behavior ensures
that:

- You don't need to manually update server URLs when creating new branches
- Each environment uses its correct API endpoint
- The developer portal always displays the appropriate URL for that environment

## Default Behavior

By default, every Zuplo environment receives its own unique API URL in the
format:

```
https://[environment-name].zuplo.app
```

This URL is automatically reflected in:

- The OpenAPI specification file
- The developer portal for that environment
- All API documentation

## Custom Domains

If you need to use a [custom domain](./custom-domains.md) instead of the default
Zuplo URL, you can configure one on a per-environment basis. When a custom
domain is configured:

- The OpenAPI server URL will show your custom domain (e.g.,
  `developer-dev.accuweather.com`)
- The developer portal will display the custom domain
- All documentation will reflect the custom domain URL

## Important Considerations

- The server URL specified in your original OpenAPI file is never used directly
- Each environment maintains its own server URL configuration
- Changes to custom domains require configuration through Zuplo support or the
  API
- Cache invalidation may be needed when switching from direct Zuplo URLs to
  custom domains served through CDNs

For assistance with custom domain configuration, please contact Zuplo support.
