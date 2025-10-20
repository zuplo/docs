# CLI Documentation Generation

This system automatically generates CLI documentation from the Zuplo CLI
metadata published to CDN, with support for custom content via partial files.

## How It Works

### 1. CDN Download

The script downloads the latest `cli.json` from
`https://cdn.zuplo.com/cli/cli.json` before generating documentation. This
ensures docs are always in sync with the latest CLI release.

### 2. The Component

The `<CliCommand>` component generates:

- Command help output (bash code blocks)
- Examples section with descriptions and code blocks
- Individual option sections (Vercel-style) with metadata
- Global options section with links
- Filtering of hidden and deprecated items

### 3. Partial Files for Custom Content

Create `.partial.mdx` files to add custom content that gets merged into the
generated docs. Partial files contain plain markdown (no special components
needed).

**Example: `docs/cli/deploy.partial.mdx`**

```mdx
Your introductory text here. This appears after the help block and before
examples.

See [Custom CI/CD](../articles/custom-ci-cd.mdx) for examples.

## Common Use Cases

Add detailed documentation, examples, tips, etc.

### Deploying your Gateway

The deploy command pushes your changes to production.
```

### 4. The Generation Script

Run `npm run cli:generate` to:

1. Download latest `cli.json` from CDN
2. Save to local `cli.json` file
3. Flatten nested subcommands recursively
4. Filter out hidden and deprecated commands
5. Generate MDX files for each command
6. Merge partial content if available
7. Update `sidebar.cli.json` with all commands

## Generated Structure

Each command gets its own page with this structure:

```mdx
---
title: "Zuplo CLI: Deploy"
sidebar_label: deploy
---

<CliCommand
  command="deploy"
  description="Deploy your API to production"
  options={[...]}
  examples={[...]}
>

Custom markdown content from deploy.partial.mdx appears here

</CliCommand>

# Global options

The following global options are available for all commands:

- [`--help`](./global-options.mdx#help)
- [`--api-key`](./global-options.mdx#api-key)
```

## Features

### Nested Subcommands

The script recursively flattens nested subcommands. For example:

- `tunnel` → `tunnel services` → `tunnel services update`
- Generates: `docs/cli/tunnel-services-update.mdx`
- Sidebar label: `tunnel services update`

### Hidden and Deprecated Items

- Commands/options marked as `hidden` or `deprecated` are filtered out
- `deprecated` can be boolean or string (with deprecation message)
- Filtering happens at generation time for commands, runtime for options

### Examples Display

When commands have examples in cli.json:

```typescript
examples: [
  ["$0 deploy --project my-project", "Deploy to a specific project"],
  ["$0 deploy --env production", "Deploy to production environment"],
];
```

The component renders:

- Description text
- Bash code block with command
- `$0` replaced with `zuplo`

### Vercel-Style Options

Each option gets its own section with:

- H3 heading with option name
- Description
- Bash code block example
- Metadata display (type, default, choices, alias, conflicts, envVar, required,
  deprecated)

### Global Options

The `--help` and `--api-key` options are:

- Filtered from detailed options display on each page
- Listed in the Global Options section with links to `global-options.mdx`

### Option Properties

All option properties are supported:

- `name` - Option name
- `type` - string, boolean, or number
- `description` - Help text
- `default` - Default value
- `required` - Whether required
- `deprecated` - Boolean or string with message
- `hidden` - Whether to hide from docs
- `alias` - Short flags (e.g., `-i` for `--input`)
- `choices` - Valid values for the option
- `conflicts` - Options that conflict with this one
- `envVar` - Environment variable name
- `normalize` - Path normalization flag

## File Naming

### Commands

- Single commands: `docs/cli/deploy.mdx` → sidebar: `deploy`
- Subcommands: `docs/cli/tunnel-create.mdx` → sidebar: `tunnel create`
- Nested: `docs/cli/tunnel-services-update.mdx` → sidebar:
  `tunnel services update`

### Partial Files

- Custom content: `docs/cli/deploy.partial.mdx` (edit this)
- Main docs: `docs/cli/deploy.mdx` (generated, don't edit)
- Partial files excluded from site via `zudoku.config.tsx` glob pattern

## Special Cases

### OpenAPI Capitalization

Commands containing "openapi" are capitalized as "OpenAPI" in titles:

- `openapi convert` → title: "Zuplo CLI: OpenAPI Convert"

### Frontmatter Format

```yaml
---
title: "Zuplo CLI: Command Name"
sidebar_label: command name
---
```

## Workflow

1. **Update CLI**: Publish new CLI version to CDN
2. **Generate Docs**: Run `npm run cli:generate`
3. **Add Custom Content**: Create/edit `.partial.mdx` files as needed
4. **Regenerate**: Run `npm run cli:generate` again to merge partial content
5. **Review**: Check generated files and sidebar

## File Locations

- **Generation Script**: `scripts/generate-cli-docs.ts`
- **Component**: `src/CliCommand.tsx`
- **Component Registry**: `src/components.tsx`
- **CLI Data**: `cli.json` (downloaded from CDN)
- **Generated Docs**: `docs/cli/*.mdx`
- **Partial Content**: `docs/cli/*.partial.mdx`
- **Sidebar**: `sidebar.cli.json` (auto-generated)
- **Config**: `zudoku.config.tsx` (excludes partials)

## Tips

- The `.partial.mdx` files are the source of truth for custom content
- Generated `.mdx` files should not be edited directly (changes will be
  overwritten)
- Use standard MDX features (code blocks, links, lists, etc.) in partial files
- The script runs automatically in CI when publishing new CLI versions
- The sidebar is automatically sorted alphabetically
- Run `npm run cli:generate` locally to preview docs before committing

## Example Output

See any file in `docs/cli/` for complete examples showing:

- Command help block (auto-generated)
- Examples section (if available)
- Custom content from partial files
- Individual option sections with metadata
- Global options section with links
