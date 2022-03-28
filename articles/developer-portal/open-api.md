---
title: Open API
---

## Overview

Open API is a standard for creating machine-readable documentation for HTTP
APIs. You can learn more about Open API
[here](https://oai.github.io/Documentation/introduction.html). We expose
`open-api.json` in your Zup's `config` folder.

```json
{
  "openapi": "3.1.0",
  "info": {
    "title": "A minimal OpenAPI document",
    "version": "0.0.1"
  },
  "paths": {
    "/v1/hello-world": {
      "get": {
        "summary": "Summary"
      },
      "post": {
        "description": "Description"
      }
    }
  }
}
```

## Usage

Every time you make an update to `open-api.json` we will publish the file to
`<your project url>/__/zuplo/open-api`. You can use this file in one of many
[Open API Documentation Generators](https://nordicapis.com/7-open-source-openapi-documentation-generators/)
or use the [one we provide for you](/developer-portal/doc-portal).
