---
title: Developer Portal Setup
sidebar_label: Setup
description:
  Learn how to set up and customize your LEGACY Zuplo Developer Portal,
  including an overview of key configuration files and tips for managing your
  API documentation effectively.
---

:::danger

This documentation is for the legacy version of the Dev Portal. If you are
looking for the new preview developer portal, please refer to the
[docs](/docs/dev-portal/introduction).

:::

Customization of your developer portal can be done in either the Zuplo Portal or
by editing source files using your preferred editor. Before you start
customizing the developer portal, its a good idea to understand the structure
and files that are used to generate the site.

Every Zuplo project includes the following directories and files that are used
to generate the developer portal. Note, files that aren't directly part of this
tutorial have been left out.

```txt
my-project/
├── config/
│   ├── dev-portal.json
│   └── routes.oas.json
├── modules/
└── docs/
    ├── index.md
    ├── sidebar.json
    └── theme.css
```

- **config/routes.oas.json** - This is your Open API specification that contains
  the full structure of your API project.
  [Documentation](./dev-portal-configuration.md)
- **docs/index.md** - Markdown files are used to include additional
  documentation in your developer portal. By default an `index.md` file is
  created. [Documentation](./dev-portal-adding-pages.md)
- **docs/sidebar.json** - This file contains the configuration for your sidebar
  and menus on the developer portal.
  [Documentation](./dev-portal-configuring-sidebar.md)
- **docs/theme.css** - The developer portal theme can be customized with CSS
  variables (or even custom CSS) in order to match your branding.
  [Documentation](./dev-portal-theme.md)
- **docs/dev-portal.json** - This is the primary configuration for your
  developer portal with customization for the favicon, authentication settings,
  etc. [Documentation](./dev-portal-json.md)
- **ZUPLO_LOG_LEVEL** - This environment variable configures the log level in
  your Zuplo portal to control which logs display. To show only errors or
  warnings, set ZUPLO_LOG_LEVEL to error or warn in the Settings tab under the
  Environment Variables section.

:::caution

At the time of writing this document, the `docs/dev-portal.json` file is
currently under the `config` folder. This will be addressed shortly.

:::
