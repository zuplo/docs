---
title: Adding Custom Pages
---

You can add custom pages to your developer portal to provide more documentation to your API users. You are in full control of the content and how users will navigate to it.

## 1/ Writing Your First Custom Page

Within your project in the Zuplo Portal, you will notice a `Docs` directory, with an `index.md` and `sidebar.json` file. `index.md` is a custom page we created to get you started.

![Docs Folder](../../static/media/developer-portal/adding-pages/docs-folder.png)

Navigate to `index.md`, and make some changes to the markdown. If you are unfamiliar with Markdown, check out [this guide](https://www.markdownguide.org/) to get started. You can also create a new docs page via the new file button.

## 2/ Previewing Your Changes

You can preview what your page will look like in the developer portal by clicking the 'Markdown Preview' tab above the editor.

![Markdown Preview](../../static/media/developer-portal/adding-pages/style-preview.png)

## 3/ Configuring the Sidebar

Next, you will configure where your new page will be displayed in the developer portal's sidebar navigation. Open `sidebar.json`. All pages you wish to display should go under the `docs` folder in the order you want them displayed in the navigation. A typical sidebar entry consists of the following:

```json
{
  "type": "Type of documentation. Simply use 'doc' for now to add a page",
  "id": "Name of the file you wish to display, not including the extension",
  "label": "Label for the page in the sidebar navigation"
}
```

Open your developer portal after saving your changes, and you should see your new page in the sidebar!

## 4/ Optional: Select a Version

Your page may only apply to a certain version of your API. You can configure which versions of your API the custom page will be displayed through the `versions` property.

```json
{
  "type": "doc",
  "id": "index",
  "label": "Index",
  "versions": ["versionOneName"]
}
```

By default, a custom page will display on all versions of your API unless the `versions` field is specified.

## Congratulations, you have added a custom page!

You can add as many custom pages as you like to create an awesome developer experience.
