---
title: Typescript Configuration (tsconfig.json)
sidebar_label: Typescript Config
---

Zuplo projects use Typescript for custom code. At the root of every project is a
`tsconfig.json` file that specifies the configuration for the Typescript
compiler. This file is used by the Typescript compiler to compile the Typescript
code into JavaScript.

This file is automatically generated by Zuplo and shouldn't be modified. If you
do modify the file, you will receive build warnings indicating the settings that
have been changed.

When developing in the Zuplo Portal or running the `zuplo dev` command locally,
the build will automatically fix this file for you. If you were using
unsupported settings, the modifications to this file may cause the build to
fail. If this happens, we recommend that you fix your code instead of reverting
the changes to the `tsconfig.json` file.

The recommended `tsconfig.json` file is shown below.

```json
{
  "include": ["modules/**/*", ".zuplo/**/*", "tests/**/*"],
  "exclude": ["./node_modules", "./dist"],
  "compilerOptions": {
    "module": "ESNext",
    "target": "ES2022",
    "lib": ["ESNext", "WebWorker", "Webworker.Iterable"],
    "preserveConstEnums": true,
    "moduleResolution": "Bundler",
    "useUnknownInCatchVariables": false,
    "forceConsistentCasingInFileNames": true,
    "importHelpers": true,
    "removeComments": true,
    "esModuleInterop": true,
    "noEmit": true,
    "strictNullChecks": true,
    "experimentalDecorators": true
  }
}
```

## Updating the tsconfig.json File

The `tsconfig.json` file isn't shown in the Zuplo Portal. If you need to update
it you can do so connecting your project to
[Source Control](./source-control.md) and editing the file in your source
control provider or locally.

## Troubleshooting

This section contains common issues that you may encounter if you have used
unsupported settings in the `tsconfig.json` file and are migrating to the
recommended configuration.

### Build Warning: This project's tsconfig.json was not set to the recommended settings. Custom settings may cause build issues.

![Build Warning](../../public/media/tsconfig/image.png)

This warning is shown when the `tsconfig.json` file isn't set to the recommended
settings. If you see this warning, but your build is successful, then you aren't
required to do anything. However, we still encourage you to update your
`tsconfig.json` file to the recommended settings. This will ensure that your
build continues to work in the future and that you don't encounter any issues.

:::info{title="Note"}

Depending on when your project was created, you might see this warning even if
you never edited the `tsconfig.json` file. Older project templates used various
different configurations in the tsconfig.json. This warning is just telling you
that your settings are different from the **current** recommended settings.

:::

### Build Error: Could not resolve "modules/my-module"

If you have a module that isn't being resolved and the module doesn't start with
a path indicator like `./` or `../`, you either need to change the import to use
the path indicator or add a `paths` setting to your `tsconfig.json` file.

For example, if you have the following import:

```typescript
import { myFunction } from "modules/my-module";
```

You can either change the import to:

```typescript
import { myFunction } from "./modules/my-module";
```

Or add the `baseUrl` and `paths` setting to your `tsconfig.json` file:

```json
{
  "compilerOptions": {
    "paths": {
      "modules/*": ["./modules/*"]
    }
  }
}
```
