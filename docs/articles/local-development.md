---
title: Local Development
---

Most of the time using the [Zuplo Portal](https://portal.zuplo.com) is the
easiest way to configure your Zuplo Gateway, but sometimes it's nice to use your
own IDE like VS Code. Zuplo doesn't (yet) officially support running your
application fully locally, but you can edit your code locally.

To make local development easier, you can install the Zuplo node modules to
enable code completion in Typescript and use the JSON schemas to provide tooling
in your JSON files.

## Typescript Code Completion

The Zuplo node modules include Typescript type definitions to assist with
writing code in your handlers and plugins. To install these locally, simply run
`npm install` in your Zuplo project directly.

If you get an error installing the modules, it might be because your project is
referencing an old version of the NPM modules. To upgrade your types to the
latest version run:

```
npm install zuplo@latest
```

With the types installed, you should get code completion inside of any `.ts`
file in your project.

## JSON Schemas

JSON Schemas can be used for validation and code completion in your project. How
these are configured will depend on what editor you are using.

Zuplo publishes the following JSON Schemas:

- [Policies Config - config/policies.json](https://cdn.zuplo.com/schemas/policies.json)
- [Custom OpenAPI 3.1 - config/\*.oas.json](https://cdn.zuplo.com/schemas/openapi-v3.1-zuplo.json)
- [Custom OpenAPI 3.0 - config/\*.oas.json](https://cdn.zuplo.com/schemas/openapi-v3.0-zuplo.json)
- [Dev Portal Config - config/dev-portal.json](https://cdn.zuplo.com/schemas/dev-portal.json)
- [Dev Portal Sidebar Config - docs/sidebar.json](https://cdn.zuplo.com/schemas/sidebar.json)
- [Legacy Routes Config - config/routes.json](https://cdn.zuplo.com/schemas/routes.json)

To configure these files for validation and code completion in VS Code you can
set the following in your `.vscode/settings.json` file.

```json
{
  "json.schemas": [
    {
      "fileMatch": ["config/*.oas.json"],
      // If you use OpenAPI 3.0 change this to https://cdn.zuplo.com/schemas/openapi-v3.0-zuplo.json
      "url": "https://cdn.zuplo.com/schemas/openapi-v3.1-zuplo.json"
    },
    {
      "fileMatch": ["config/policies.json"],
      "url": "https://cdn.zuplo.com/schemas/policies.json"
    },
    {
      "fileMatch": ["config/routes.json"],
      "url": "https://cdn.zuplo.com/schemas/routes.json"
    },
    {
      "fileMatch": ["config/dev-portal.json"],
      "url": "https://cdn.zuplo.com/schemas/dev-portal.json"
    },
    {
      "fileMatch": ["docs/sidebar.json"],
      "url": "https://cdn.zuplo.com/schemas/sidebar.json"
    }
  ]
}
```
