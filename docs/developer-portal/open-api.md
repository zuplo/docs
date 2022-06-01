---
title: Open API
draft: true
---

Open API is a standard for creating machine-readable documentation for HTTP
APIs. You can learn more about Open API
[here](https://oai.github.io/Documentation/introduction.html). We will generate an Open API file for each version of your API based on the contents of your `routes.json`.

## Usage

Every time you rebuild your project we will publish the newly generated Open API file to
`<your project url>/__/zuplo/open-api/<version>/3.1`. You can use this file in one of many
[Open API Documentation Generators](https://nordicapis.com/7-open-source-openapi-documentation-generators/)
or simply use our provided developer portal.
