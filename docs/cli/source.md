---
title: Source Commands
---

```bash
zuplo source --help
zuplo source <command>

Commands:
  zuplo source migrate dev-portal    Migrates legacy dev portal configuration to the new dev portal format
```

The source commands help you manage and migrate your Zuplo project source code
and configuration files.

## Dev Portal Migration

```bash
zuplo source migrate dev-portal --help
zuplo source migrate dev-portal

Migrates legacy dev portal configuration to the new dev portal format

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
  --dir      The directory containing your Zuplo project and dev portal config
                                                         [string] [default: "."]
  --force    Force overwrite of existing files        [boolean] [default: false]
```

This command automates the migration process from the legacy Developer Portal to
the new Zudoku-powered [Developer Portal](../dev-portal/introduction).

It handles the creation of necessary files, directory structure, and
configuration migration.

### What it does:

- Creates the required directory structure (`docs/pages`, `docs/public`)
- Generates `docs/package.json`, `docs/tsconfig.json`, and
  `docs/zudoku.config.ts` files
- Migrates configuration from `config/dev-portal.json` and `docs/sidebar.json`
  to the new format
- Moves existing markdown files to the correct location
- Updates the root `package.json` with workspace configuration

### Usage Examples:

**Basic migration:**

```bash
zuplo source migrate dev-portal
```

**Migrate from a specific directory:**

```bash
zuplo source migrate dev-portal --dir ./my-zuplo-project
```

**Force overwrite existing files:**

```bash
zuplo source migrate dev-portal --force
```

:::tip

For a complete step-by-step migration guide including manual steps and
post-migration tasks, see the
[Dev Portal Migration Guide](../dev-portal/migration.md).

:::

### Requirements:

- Must be run from within a Zuplo project directory or specify `--dir`
- Requires existing `config/dev-portal.json` file
- Node.js and npm must be installed

### After Migration:

1. Run `npm install` to install dependencies
2. Test locally with `npm run docs`
3. Delete legacy files manually (recommended, to avoid future confusion)
4. Deploy your changes by running `zuplo deploy`
