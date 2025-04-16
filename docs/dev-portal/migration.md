---
title: Dev Portal Migration Guide
sidebar_label: Migration Guide
---

:::warning

This documentation is for the preview version of the Dev Portal. If you aren't
part of the preview program, please refer to the
[current Dev Portal docs](/docs/articles/developer-portal).

:::

This guide is intended to help you migrate your existing documentation from the
current Dev Portal to the new Dev Portal powered by Zudoku.

## Before You Begin

## Setup

The migration to the new Developer Portal powered by Zudoku is currently a
manual process. You will need to clone your existing Zuplo project locally to
perform these steps.

We recommend you try this in a branch and deploy to a preview environment first.

:::caution

Currently, this migration must be done locally. It cannot be done in the Zuplo
Portal at this time.

:::

### Project Structure

There are a few changes to the project structure that you should be aware of:

1. The `dev-portal.json` file in the `config` directory will go away and you
   will migrate to use the new `zudoku.config.ts` file in the `docs` directory.
2. Markdown files are now located in the `docs/pages` directory.
3. There needs to be a `tsconfig.json` and `package.json` file in the `docs`
   directory to build the documentation.

:::caution

It is critical that you delete the `config/dev-portal.json` file after you
complete the migration. If that file is not deleted, the Zuplo build system will
use the legacy dev portal.

:::

Below is an example of the new project structure. The steps below will explain
what's needed for each file.

```txt
my-api/
├─ config/
│  ├─ routes.oas.json
│  ├─ policies.json
├─ docs/
│  ├─ zudoku.config.ts
│  ├─ package.json
│  ├─ tsconfig.json
│  ├─ pages/
│  │  ├─ doc.md # <- Your existing markdown files
│  ├─ public/ # <- Your images and other static assets
├─ .gitignore
├─ package.json
├─ tsconfig.json
├─ README.md
```

### `zudoku.config.ts`

The `dev-portal.json` file in the `config` directory will be replaced with the
new `zudoku.config.ts` file in the `docs` directory. This file will contain the
configuration for the new Dev Portal powered by Zudoku. You can find more
information about the configuration in the
[Dev Portal Configuration](./zudoku/configuration/overview.md) documentation.

Your existing `dev-portal.json` file will look something like this. You will
also have a `sidebar.json` file in the `docs` directory.

```json
{
  "pageTitle": "My API",
  "faviconUrl": "https://www.example.org/favicon.ico",
  "enableAuthentication": true,
  "authentication": {
    "provider": "auth0",
    "authority": "$env(ZUPLO_PUBLIC_AUTH0_AUTHORITY_URL)",
    "jwksUrl": "$env(ZUPLO_PUBLIC_AUTH0_AUTHORITY_URL).well-known/jwks.json",
    "devPortalClient": {
      "clientId": "$env(ZUPLO_PUBLIC_AUTH0_CLIENT_ID)",
      "audience": "$env(ZUPLO_PUBLIC_AUTH0_AUDIENCE_URL)"
    }
  },
  "generateExamples": true
}
```

#### Configuration Mapping

Here's how the fields from the old configuration map to the new format:

| Old (`dev-portal.json`)    | New (`zudoku.config.ts`)                         | Notes                                                               |
| -------------------------- | ------------------------------------------------ | ------------------------------------------------------------------- |
| `pageTitle`                | `site.title`                                     | Now under the `site` object                                         |
| `faviconUrl`               | `site.favicon`                                   | Now under the `site` object                                         |
| `enableAuthentication`     | Implied by presence of `authentication` property | No explicit toggle, just configure or remove                        |
| `authentication.provider`  | `authentication.type`                            | Different naming convention                                         |
| `authentication.authority` | Provider-specific properties                     | See [authentication docs](./zudoku/configuration/authentication.md) |
| (from sidebar.json)        | `sidebar`                                        | New hierarchical format                                             |

Migrated to the new format of configuration, this file would look like the
following.

:::tip

Note that the environment variables are referenced by simply using
`process.env`. See
[environment variables](./zudoku/guides/environment-variables.md)

:::

```ts
import type { ZudokuConfig } from "zudoku";

const config: ZudokuConfig = {
  site: {
    title: "My API", // Was pageTitle in the old format
    favicon: "https://www.example.org/favicon.ico", // Was faviconUrl
  },
  topNavigation: [
    { id: "documentation", label: "Documentation" },
    { id: "api", label: "API Reference" },
  ],
  sidebar: {
    documentation: [
      {
        type: "category",
        label: "Overview",
        items: ["introduction", "other-example"],
      },
    ],
  },
  redirects: [{ from: "/", to: "/introduction" }],
  apis: {
    type: "file",
    input: "../config/routes.oas.json",
    navigationId: "api",
  },
  docs: {
    files: "/pages/**/*.{md,mdx}",
  },
  authentication: {
    type: "auth0", // Was provider in the old format
    domain: process.env.ZUPLO_PUBLIC_AUTH0_DOMAIN,
    clientId: process.env.ZUPLO_PUBLIC_AUTH0_CLIENT_ID,
  },
};

export default config;
```

### Sidebar Configuration

Your existing `sidebar.json` file will need to be migrated to the new format in
`zudoku.config.ts`. The new format is more flexible and supports multiple
navigation sections.

**Old format (`sidebar.json`):**

```json
[
  {
    "type": "category",
    "label": "Getting Started",
    "items": ["introduction", "quickstart"]
  },
  {
    "type": "doc",
    "id": "api-reference"
  }
]
```

**New format (in `zudoku.config.ts`):**

```ts
sidebar: {
  documentation: [
    {
      type: "category",
      label: "Getting Started",
      items: ["introduction", "quickstart"]
    },
    {
      type: "doc",
      id: "api-reference"
    }
  ],
  // You can add additional sidebar sections here
}
```

### Markdown Files

Markdown files should be moved to the `docs/pages` directory. You can use
subdirectories under this as needed.

#### Front Matter Changes

The front matter format remains largely the same, but there are some new options
available:

```md
---
title: Introduction
sidebar_label: Intro
description: Introduction to our API
---
```

#### Handling Images and Assets

1. Create a `docs/public` directory for your images and other static assets
2. Update image references in your markdown files to point to the new location
3. Use relative paths for images in your markdown files

Old format:

```md
![My Image](/images/my-image.png)
```

New format:

```md
![My Image](/public/images/my-image.png)
```

### `tsconfig.json` and `package.json`

You will need to create a `tsconfig.json` and `package.json` file in the `docs`
folder. You can copy these two files below.

**`tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ESNext", "DOM", "DOM.Iterable", "WebWorker"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "useDefineForClassFields": true,
    "skipLibCheck": true,
    "skipDefaultLibCheck": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "useUnknownInCatchVariables": false,
    "types": ["zudoku/client"],
    "jsx": "react-jsx"
  }
}
```

**`package.json`**

```json
{
  "name": "docs",
  "version": "0.1.0",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "ZUPLO=1 zudoku dev",
    "build": "ZUPLO=1 zudoku build"
  },
  "dependencies": {
    "react": ">19.0.0",
    "react-dom": ">19.0.0",
    "zudoku": "^0.39"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^22",
    "@types/react": "^19",
    "@types/react-dom": "^19"
  }
}
```

### Root `package.json`

You will also need to add a `workspace` configuration to your root
`package.json` in order to install the dependencies for the new dev portal.

You also might want add a `docs` script to your root `package.json` to run the
dev portal in development mode. This will allow you to run the dev portal in
development mode from the root of your project.

```json
{
  "name": "my-api",
  "version": "0.1.0",
  "scripts": {
    "dev": "zuplo dev",
    "test": "zuplo test",
    "docs": "npm run dev --workspace docs"
  },
  "workspaces": {
    "packages": ["docs"]
  }
}
```

### Theme

For instructions on theming the dev portal, see
[Colors & Theme](./zudoku/customization/colors-theme.md) and
[Fonts](./zudoku/customization/fonts.md).

Additional theming is possible. More documentation is coming soon.

## Testing Your Migration

Before finalizing your migration, it's important to test your new dev portal
locally:

1. Install dependencies: `npm install` (from your project root)
2. Start the dev portal locally: `npm run docs` (using the script we added
   earlier)
3. Verify all pages load correctly
4. Check that authentication works if you're using it
5. Confirm all links work between pages
6. Test the API reference section to ensure it loads your OpenAPI definitions

## Cleanup

Make sure to delete the following files after you are done with the migration:

- `/config/dev-portal.json`
- `/docs/sidebar.json`
- `/docs/theme.css`

## Troubleshooting

### Common Migration Issues

- **Missing dependencies**: If you see errors about missing dependencies, make
  sure you've run `npm install` from the project root.
- **Authentication not working**: Check your environment variables are correctly
  set and that you've properly configured the authentication in the new format.
- **Sidebar not showing**: Ensure your sidebar configuration in
  `zudoku.config.ts` is correct and that the file IDs match your markdown files.
- **Images not loading**: Verify your image paths have been updated to point to
  the new location.
- **Environment variables not working**: The format for accessing environment
  variables has changed. Use `process.env.VARIABLE_NAME` instead of
  `$env(VARIABLE_NAME)`.

## Post-Migration Verification

After deploying your migrated dev portal, perform these verification steps:

1. Test all site navigation paths
2. Verify authentication flows work correctly
3. Check API reference documentation renders properly
4. Test across different browsers and devices
5. Verify custom styling and theming is applied correctly
6. Ensure any custom components function as expected
