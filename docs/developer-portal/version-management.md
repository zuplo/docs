---
title: Version Management
draft: true
---

The `versions` section of your `routes.json` allows you to configure the different versions of your API. Each one of these versions will have its own Open API Spec generated. Users will have the ability to navigate between multiple versions from within the developer portal

## Configuring a Version

We embedded the Open API `Info Object` into the `version` so each version's spec can have its own `title`, `description`, and `tags`. Specifying a tag generate a subsection within the developer portal, displaying the tag name, description, and the endpoints belonging to it. Order is determined by the order within the `tags` array.

## Previewing Changes

You can preview changes right after a build is completed from within the Portal. Only once it is deployed to production will it be publicly accessible.
