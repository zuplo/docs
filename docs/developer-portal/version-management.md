---
title: Version Management
---

The `versions` section of your `routes.json` allows you to configure the different versions of your API. Each one of these versions will have its own Open API Spec generated. Users will have the ability to navigate between multiple versions from within the developer portal

## Configuring a Version

We embedded the Open API `Info Object` into the `version` so each version's spec can have its own `title`, `description`, and `tags`. Specifying a tag generate a subsection within the developer portal, displaying the tag name, description, and the endpoints belonging to it. Order is determined by the order within the `tags` array.

```json
"versions": [
  {
    "name": "v1",
    "pathPrefix": "/v1",
    "info": {
      "title": "Friendbook",
      "description": "Friendbook API, powered by Zuplo. [Learn More](https://www.friendbook.com/)",
      "version": "1.0.0"
    },
    "tags": [
      {
        "name": "Friends",
        "description": "These endpoints help you manage your friends on friendbook."
      },
      {
        "name": "Messaging",
        "description": "These endpoints help you manage your messages on friendbook."
      }
    ]
  }
]
```

## Previewing Changes

You can preview changes right after a build is completed from within the Portal. Only once it is deployed to production will it be publicly accessible.

## Excluding a Version

To exclude all routes belonging to a certain version from your developer portal, set the `excludeFromOpenApi` property to `true`.
