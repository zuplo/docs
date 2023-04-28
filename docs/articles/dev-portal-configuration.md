---
title: OpenAPI Specifications
---

Zuplo natively uses the OpenAPI specification to power both the gateway routing
and Developer Portal documentation. Your OpenAPI file (contained within your
project's `config` folder and ending in `.oas.json`) is used to automatically
generate stripe-quality API Reference documentation. By enriching your OpenAPI
file with additional properties, you directly enable more content show up in the
Developer Portal.

Read more about OpenAPI and all the possibilities
[here](https://oai.github.io/Documentation/specification).

## Handling Multiple OpenAPI Files

Your project may utilize multiple OpenAPI files to power your gateway. The
Developer Portal is equipped to handle this - allowing users to navigate between
documentation for each OpenAPI spec. You can even
[customize the content](./dev-portal-configuring-sidebar.md#customizing-individual-openapi-specs)
displayed on each OpenAPI spec.
