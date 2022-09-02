---
title: Configuring Your Sidebar
---

You can configure your Developer Portal Sidebar through the `sidebar.json` file. This file allows you to determine which pages get displayed, their labels, and their order.

## Configuring sidebar.json

`sidebar.json` is consists of items of different `types` either `doc` or `category`. The file is configured in a very similar way to [Docusaurus' sidebar.js](https://docusaurus.io/docs/sidebar/items#sidebar-item-category). The `docs` array must contain all the items of the sidebar.

### Versioning

A `versions` array is added as an optional property on `doc` and `category` items. Not including the `versions` array will automatically include the item in all versions of your API. The entries to `versions` must match the version names found in your `routes.json`. For `category` types, adding a version to an `item` will result in the page only displaying if it is also found in the `category` item's version array.

### Sidebar Labels

A `label` property is found on most items. It determines what text appears in the sidebar navigation. The label can also be provided via [frontmatter](https://jekyllrb.com/docs/front-matter/) using the `sidebar_label` property.

:::note

If a label is provided on both the `sidebar.json` item and the markdown `frontmatter`, the `frontmatter` will take precedence.

:::

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

Note that your will be unable to provide versioning, but you can [provide a label](#sidebar-labels) in the `frontmatter`
