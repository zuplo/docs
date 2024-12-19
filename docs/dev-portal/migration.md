---
title: Dev Portal Migration Guide
sidebar_label: Migration Guide
---

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

Below is an example of the new project structure. The steps below will explain
what is needed for each file.

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

```ts
import type { ZudokuConfig } from "zudoku";
import withZuplo from "zudoku/with-zuplo";

const config: ZudokuConfig = {
  basePath: "/docs",
  topNavigation: [
    { id: "documentation", label: "Documentation" },
    { id: "api", label: "API Reference" },
  ],
  sidebar: {
    documentation: [
      {
        type: "category",
        label: "Overview",
        items: ["example", "other-example"],
      },
    ],
  },
  redirects: [{ from: "/", to: "/documentation" }],
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

```json
// tsconfig.json
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
    "jsx": "react-jsx"
  }
}
```

```json
// package.json
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
    "react": ">18.0.0",
    "react-dom": ">18.0.0",
    "zudoku": "^0.20"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18"
  }
}
```
