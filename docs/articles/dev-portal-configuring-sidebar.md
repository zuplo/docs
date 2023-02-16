---
title: Configuring Your Sidebar
---

You can configure your Developer Portal Sidebar through the `sidebar.json` file. This file allows you to determine which pages get displayed, their labels, and their order.

## Configuring sidebar.json

`sidebar.json` consists of items of different `types` either `doc`, `category`, or `api-ref`. The file is configured in a very similar way to [Docusaurus' sidebar.js](https://docusaurus.io/docs/sidebar/items#sidebar-item-category). The `docs` array must contain all the items of the sidebar.

### Versioning

A `versions` array is added as an optional property on `doc` and `category` items. Not including the `versions` array will automatically include the item in all versions of your API. The entries to `versions` must match the version names found in your `routes.json`. For `category` types, adding a version to an `item` will result in the page only displaying if it is also found in the `category` item's version array.

### Sidebar Labels

A `label` property is found on most items. It determines what text appears in the sidebar navigation. The label can also be provided via [frontmatter](https://jekyllrb.com/docs/front-matter/) using the `sidebar_label` property.

:::note

If a label is provided on both the `sidebar.json` item and the markdown `frontmatter`, the `frontmatter` will take precedence.

:::

## Adding an api-ref

An `api-ref` item dictates the position of your API Reference docs in the sidebar. You can also relabel the top-level label (the default is API Reference). The contents of your API Reference are automatically generated from your `routes.json`.

```typescript
interface APIDocConfig {
  type: "api-ref";
  label: string;
}
```

When you create a project, we will automatically populate the following `api-ref` item in your `sidebar.json`:

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
   * ID Must be unique across all pages and map to a markdown filename in /docs
   */
  id: string;
  /**
   * Label Must be unique across doc and category items within this array only
   */
  label: string;
  versions?: VersionsConfig;
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

You can also add a `doc` item via shorthand notation in which you only include the `id` field in the `sidebar.json`.

```json
{
  "docs": ["index"]
}
```

Note that you will be unable to provide versioning, but you can [provide a label](#sidebar-labels) in the `frontmatter`

## Adding a category

A `category` is a directory of `doc` items. Within your Sidebar, the `items` entries will appear nested under the `label` of the `category` item. Each entry in `items` must contain a unique `id` and `label` within the `items` array.

```typescript
interface CategoryConfig {
  type: "category";
  label: string;
  versions?: VersionsConfig;
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

A `category` item can act like a `doc` if a `link` property is provided. When clicked the user will be navigated to the page referenced in the `link`. If no `link` is provided, then the `category` will not be clickable.

Example:

```json
{
  "docs": [
    {
      "type": "category",
      "label": "Dog Breeds",
      "versions": ["v1", "v2"],
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
          "versions": ["v2"]
        }
      ]
    }
  ]
}
```
