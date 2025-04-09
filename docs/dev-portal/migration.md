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

## Setup

The migration to the new Developer Portal powered by Zudoku is currently a
manual process. You will need to clone your existing Zuplo project locally to
perform these steps.

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

Migrated to the new format of configuration, this file would look like the
following.

:::tip

Note that the environment variables are referenced by simply using
`process.env`. See [environment variables](./zudoku/environment-variables.md)

:::

```ts
import type { ZudokuConfig } from "zudoku";
import withZuplo from "zudoku/with-zuplo";

const config: ZudokuConfig = {
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
    type: "auth0",
    domain: process.env.ZUPLO_PUBLIC_AUTH0_DOMAIN,
    clientId: process.env.ZUPLO_PUBLIC_AUTH0_CLIENT_ID,
  },
};

export default withZuplo(config);
```

### Markdown Files

Markdown files should be moved to the `docs/pages` directory. You can use
subdirectories under this as needed.

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
    "dev": "zudoku dev",
    "build": "zudoku build"
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
[customizing](./zudoku/configuration/customization.md).

Additional theming is possible. More documentation is coming soon.

## Cleanup

Make sure to delete the following files after you are done with the migration:

- `/config/dev-portal.json`
- `/docs/sidebar.json`
- `/docs/theme.css`
