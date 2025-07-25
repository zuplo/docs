---
title: Dev Portal Migration Guide
sidebar_label: Migration Guide
description:
  Instruction for migrating from the legacy developer portal to Zudoku.
---

This guide walks you through migrating your existing documentation from the
current Dev Portal to the new Dev Portal powered by Zudoku. Follow these steps
sequentially for a smooth transition.

## Quick Migration with CLI

For most projects, you can use the Zuplo CLI to automate the migration process:

```bash
npx zuplo source migrate dev-portal
```

This command will automatically:

- Create the required directory structure
- Generate necessary configuration files
- Migrate your existing dev portal configuration
- Move markdown files to the correct location

See the [Source Commands](../cli/source.md) documentation for more details and
options.

If you prefer to understand each step or need more control over the migration
process, continue with the manual migration steps below.

## Manual Migration Process

<Stepper>

1. **Prepare Your Environment**

   Clone your existing Zuplo project locally. We recommend trying this in a
   branch and deploying to a preview environment first.

   ```bash
   git clone https://github.com/my-org/my-api
   cd my-api
   git checkout -b dev-portal-migration
   ```

   :::caution

   Currently, this migration must be done locally. It cannot be done in the
   Zuplo Portal.

   :::

1. **Create Directory Structure**

   Set up your new directory structure by creating the following files and
   folders:
   - Create `docs/zudoku.config.ts` as an empty file, the contents will be added
     later.
   - Create `docs/package.json` as an empty file, the contents will be added
     later.
   - Create `docs/tsconfig.json` as an empty file, the contents will be added
     later.
   - Create a directory `docs/pages` for your markdown files
   - Create a directory `docs/public` for images and other static assets

   Once these files are created your directory structure should look like this.
   Note, that the old dev portal files are still in place. You will delete them
   later.

   ```txt
   my-api/
   ├─ config/
   │  ├─ dev-portal.json # <- Your existing dev-portal.json
   │  ├─ routes.oas.json
   │  ├─ policies.json
   ├─ docs/
   │  ├─ sidebar.json # <- Your existing sidebar.json
   │  ├─ theme.css # <- Your existing theme.css
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

1. **Update Typescript Configuration File**

   If you haven't already, create a `tsconfig.json` file in the `docs` folder
   and update the file with the following content.

   ```json title="docs/tsconfig.json"
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

1. Update `package.json`File

   If you haven't already, create a `package.json` file in the `docs` folder and
   update the file with the following content.

   ```json title="docs/package.json"
   {
     "name": "docs",
     "version": "0.1.0",
     "type": "module",
     "private": true,
     "scripts": {
       "dev": "zudoku dev --zuplo",
       "build": "zudoku build --zuplo"
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

1. **Update Root Package.json**

   Add the `workspaces` configuration to your root `package.json` file.
   Optionally, add a new script `docs` to run the dev portal.

   ```json title="package.json"
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

1. **Migrate Dev Portal Configuration**

   If you haven't already done so, create a new `zudoku.config.ts` file in the
   `docs` directory to replace your existing `dev-portal.json`.

   Here's how several fields map from old to new format. See the
   [configuration](./zudoku/configuration/overview.md) documentation for a
   complete list of options.

   | Old (`dev-portal.json`)    | New (`zudoku.config.ts`)                         |
   | -------------------------- | ------------------------------------------------ |
   | `pageTitle`                | `site.title`                                     |
   | `faviconUrl`               | `metadata.favicon`                               |
   | `enableAuthentication`     | Implied by presence of `authentication` property |
   | `authentication.provider`  | `authentication.type`                            |
   | `authentication.authority` | Provider-specific properties                     |
   | (from sidebar.json)        | `navigation` array                               |

   Example configuration:

   ```ts title="docs/zudoku.config.ts"
   import type { ZudokuConfig } from "zudoku";

   const config: ZudokuConfig = {
     site: {
       title: "My API", // Was pageTitle in the old format
     },
     metadata: {
       favicon: "https://www.example.org/favicon.ico", // Was faviconUrl
     },
     navigation: [
       {
         type: "category",
         label: "Documentation",
         items: [
           "introduction", // Using shorthand for docs
           "other-example",
         ],
       },
       { type: "link", to: "/api", label: "API Reference" },
     ],
     redirects: [{ from: "/", to: "/introduction" }],
     apis: [
       {
         type: "file",
         input: "../config/routes.oas.json",
         path: "/api",
       },
     ],
     apiKeys: {
       // Enable API Key Management, disabled by default
       enabled: true,
     },
     authentication: {
       type: "auth0", // Was provider in the old format
       domain: process.env.ZUPLO_PUBLIC_AUTH0_DOMAIN,
       clientId: process.env.ZUPLO_PUBLIC_AUTH0_CLIENT_ID,
     },
   };

   export default config;
   ```

   :::tip

   Environment variables are now referenced using `process.env` instead of
   `$env()`.

   :::

1. **Migrate Sidebar Configuration**

   Move your [sidebar configuration](./zudoku/configuration/navigation.mdx) from
   `sidebar.json` to the `navigation` array in `zudoku.config.ts`:

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
   navigation: [
     {
       type: "category",
       label: "Documentation",
       items: [
         {
           type: "category",
           label: "Getting Started",
           items: [
             {
               type: "doc",
               file: "introduction", // Note: no path prefix needed
             },
             {
               type: "doc",
               file: "quickstart",
             },
           ],
         },
         "authentication", // Directly reference doc files
       ],
     },
     {
       type: "link",
       to: "/api",
       label: "API Reference",
     },
   ];
   ```

1. **Move Markdown Files**

   Move your markdown files to the `docs/pages` directory. The front matter
   format remains largely the same:

   ```md
   ---
   title: Introduction
   sidebar_label: Intro
   description: Introduction to our API
   ---
   ```

1. **Set Up Images and Assets**

   Create a `docs/public` directory for your images and other static assets. See
   the [documenation](./zudoku/guides/static-files.md) for more information on
   how to use static files in the new dev portal.

1. **Install Dependencies**

   Run `npm install` from your project root to install all dependencies for both
   your API and documentation.

1. **Test Locally**

   Start the dev portal locally with `npm run docs` and verify that:
   - All pages load correctly
   - Authentication works (if using it)
   - All links between pages work
   - API reference section loads your OpenAPI definitions
   - Images and assets display properly

1. **Delete Legacy Files**

   After confirming everything works, delete these files:
   - `/config/dev-portal.json`
   - `/docs/sidebar.json`
   - `/docs/theme.css`

   :::caution

   It is critical that you delete the `config/dev-portal.json` file after
   completing the migration. If that file is not deleted, the Zuplo build system
   will use the legacy dev portal.

   :::

1. **Deploy and Verify**

   Deploy your changes by either pushing to a git branch or by running
   [`npx zuplo deploy`](../cli/deployments.md). After the deployment has
   completed, perform these final checks:
   - Test all site navigation paths
   - Verify authentication flows work correctly
   - Check API reference documentation renders properly
   - Test across different browsers and devices
   - Verify custom styling and theming is applied correctly

</Stepper>

## Theming

For instructions on theming the dev portal, see
[Colors & Theme](./zudoku/customization/colors-theme.mdx) and
[Fonts](./zudoku/customization/fonts.md).

## Redirect Legacy URLs

The previous Dev Portal was hosted on a path on the same domains your Zuplo API
(i.e. `https://api.example.com/docs`). The new Dev Portal is hosted on its own
domain and can have its own custom domain (i.e. `https://docs.example.com`).

If you were using the previous Dev Portal, you can redirect all requests from
the legacy path to the new domain using a Zuplo route. This allows you to
maintain backwards compatibility for users who may have bookmarked or linked to
the old Dev Portal URL.

### Setup Instructions

1. **Create a New Routes File**: In your Zuplo project, create a new OpenAPI
   file called `legacy.oas.json` (or any name you prefer).

2. **Add a Route**: Inside this file, add a route that matches the legacy path
   and redirects to the new Dev Portal domain. You must set the path to the path
   used by the previous Dev Portal, such as `/docs(.*)`. It is important not to
   make the route `/docs(.*)` not `/docs/(.*)` in order to also match the root
   path `/docs`.

   For example:

   ```json
   {
     "openapi": "3.1.0",
     "info": {
       "version": "1.0.0",
       "title": "Dev Portal Redirect"
     },
     "paths": {
       "/docs(.*)": {
         "x-zuplo-path": {
           "pathMode": "url-pattern"
         },
         "get": {
           "summary": "Redirect",
           "description": "Redirect to the new Dev Portal domain",
           "x-zuplo-route": {
             "corsPolicy": "none",
             "handler": {
               "export": "redirectLegacyDevPortal",
               "module": "$import(@zuplo/runtime)"
             },
             "policies": {
               "inbound": []
             }
           },
           "operationId": "dev-portal-redirect"
         }
       }
     }
   }
   ```

After you redeploy you Zuplo project, whenever the user navigates to the legacy
developer portal paths, they will be redirected to the new Dev Portal domain.

### Additional Redirects

Your new developer portal may also change other paths. To create redirects for
specific docs or other path in your new Dev Portal, we recommend using the
`redirects` configuration in the `zudoku.config.ts` file. This allows you to
specify multiple redirects easily. For more information, see the
[Redirects section in the configuration docs](/docs/dev-portal/zudoku/configuration/overview#redirects)

## Troubleshooting

If you encounter issues during migration, check these common problems:

- **Missing dependencies**: Ensure you've run `npm install` from the project
  root.
- **Authentication issues**: Verify your environment variables are correctly set
  and authentication is properly configured.
- **Sidebar not showing**: Check your sidebar configuration in
  `zudoku.config.ts` and make sure file IDs match your markdown files.
- **Images not loading**: Confirm image paths have been updated to point to the
  new location.
- **Environment variables not working**: Use `process.env.VARIABLE_NAME` instead
  of `$env(VARIABLE_NAME)`.
