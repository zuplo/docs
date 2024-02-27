---
title: Sidebar Configuration
---

You can configure your Developer Portal Sidebar through the `sidebar.json` file.
This file allows you to determine which pages get displayed, their labels, and
their order.

## Configuring sidebar.json

`sidebar.json` consists of items of different `types` either `doc`, `category`,
or `api-ref`. The file is configured in a very similar way to
[Docusaurus' sidebar.js](https://docusaurus.io/docs/sidebar/items#sidebar-item-category).
The `docs` array must contain all the items of the sidebar.

### Customizing Individual OpenAPI Specs

A `specs` array is added as an optional property on `doc` and `category` items.
Not including the `specs` array will automatically include the item in all of
your OpenAPI specs. The entries to `specs` must match the `specId` of the
OpenAPI file (portion of filename preceding `.oas.json`) found in your project's
`config` folder. For `category` types, adding `specs` to an `item` will result
in the page only displaying if it is also found in the `category` item's `specs`
array.

### Sidebar Labels

A `label` property is found on most items. It determines what text appears in
the sidebar navigation. The label can also be provided via
[frontmatter](https://jekyllrb.com/docs/front-matter/) using the `sidebar_label`
property.

:::note

If a label is provided on both the `sidebar.json` item and the markdown
`frontmatter`, the `frontmatter` will take precedence.

:::

## Adding an api-ref

An `api-ref` item dictates the position of your API Reference docs in the
sidebar. You can also relabel the top-level label (the default is API
Reference). The contents of your API Reference are automatically generated from
your `routes.oas.json`.

```typescript
interface APIDocConfig {
  type: "api-ref";
  label: string;
  /**
   * defaultSpec allows you to specify the ID of the spec navigated to upon loading the developer portal. The spec's ID is the filename without the extension (ex. For routes.oas.json, use "routes")
   */
  defaultSpec: string;
}
```

When you create a project, we will automatically populate the following
`api-ref` item in your `sidebar.json`:

```json
{
  "type": "api-ref",
  "label": "API Reference"
}
```

## Adding a doc

A `doc` is a single page that contains content from a markdown file.

```typescript
interface DocConfig {
  type: "doc";
  /**
   * ID Must be unique across all pages and map to a markdown filename in /docs (excluding the extension)
   */
  id: string;
  /**
   * Label Must be unique across doc and category items within this array only
   */
  label: string;
  /**
   * The OpenAPI Spec IDs (filename without the .oas.json extension) you wish to limit this doc to. If set, this page will only be surfaced in the sidebar of listed specs.
   */
  specs?: string[];
  /**
   * When set to true, this page will be navigated to upon loading the developer
   * portal
   */
  defaultPage?: boolean;
} | string // shorthand
```

Here's an example:

```json
{
  "type": "doc",
  "id": "index",
  "label": "Index Page"
}
```

### Shorthand

You can also add a `doc` item via shorthand notation in which you only include
the `id` field in the `sidebar.json`.

```json
{
  "docs": ["index"]
}
```

Note that you will be unable to specify `specs` or `defaultPage`, but you can
[provide a label](#sidebar-labels) in the `frontmatter`

## Adding a category

A `category` is a directory of `doc` items. Within your Sidebar, the `items`
entries will appear nested under the `label` of the `category` item. Each entry
in `items` must contain a unique `id` and `label` within the `items` array.

```typescript
interface CategoryConfig {
  type: "category";
  label: string;
  versions?: string[];
  link?: DocLink | string;
  /**
   * @minItems 1
   */
  items: (DocConfig | string)[];
}

interface DocLink {
  type: "doc";
  /**
   * ID Must be unique across within the docs array
   */
  id: string;
  // label and versions are omitted as they are already included on the CategoryConfig
}
```

A `category` item can act like a `doc` if a `link` property is provided. When
clicked the user will be navigated to the page referenced in the `link`. If no
`link` is provided, then the `category` will not be clickable.

Example:

```json
{
  "docs": [
    {
      "type": "category",
      "label": "Dog Breeds",
      "specs": ["routes-v1", "routes-v2"],
      "link": {
        "type": "doc",
        "id": "dog-breeds"
      },
      "items": [
        "french-bulldog",
        {
          "type": "doc",
          "label": "Poodle",
          "id": "poodle",
          "specs": ["routes-v2"]
        }
      ]
    }
  ]
}
```
