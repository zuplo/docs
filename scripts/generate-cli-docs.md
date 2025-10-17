# CLI Documentation Generation

This system automatically generates CLI documentation from `cli.json` with
support for custom content via partial files.

## How It Works

### 1. The Component

The `<CliCommand>` component generates:

- Command help output (bash code blocks)
- Subcommand sections with their help output
- Proper formatting for options, defaults, and flags
- Custom intro and documentation sections

### 2. Partial Files for Custom Content

Create `.partial.mdx` files to add custom content that gets merged into the
generated docs:

**Example: `docs/cli/deploy.partial.mdx`**

```mdx
<CliIntro command="deploy">

Your introductory text here. This appears right after the command help block.

See [Custom CI/CD](../articles/custom-ci-cd.mdx) for examples.

</CliIntro>

<CliDoc command="deploy">

## Common Use Cases

Add detailed documentation, examples, tips, etc.

### Deploying your Gateway

\`\`\`bash zuplo deploy --project my-project \`\`\`

</CliDoc>
```

### 3. The Generation Script

Run `npm run cli:generate` to:

- Read `cli.json` and generate MDX files for each command
- Read `.partial.mdx` files and extract `<CliIntro>` and `<CliDoc>` content
- Merge partial content into the generated files
- Update command data while preserving custom content

## Generated Structure

The generated file looks like:

```mdx
---
title: Deploy
---

<CliCommand
  command="deploy"
  description="..."
  options={[...]}
>
  <CliIntro command="deploy">
    Custom intro content from partial file
  </CliIntro>

  <CliDoc command="deploy">
    Custom documentation from partial file
  </CliDoc>
</CliCommand>
```

## Workflow

1. **Initial Generation**: Run `npm run cli:generate` to create all MDX files
2. **Add Custom Content**: Create `.partial.mdx` files with `<CliIntro>` and
   `<CliDoc>` components
3. **Regenerate**: Run `npm run cli:generate` again to merge the partial content
4. **Update**: When `cli.json` changes, just run the script again - custom
   content is preserved

## File Naming

- Main docs: `docs/cli/deploy.mdx` (generated, don't edit directly)
- Custom content: `docs/cli/deploy.partial.mdx` (edit this to add custom docs)
- Partial files are excluded from the site (via glob pattern in
  zudoku.config.tsx)

## Components

### `<CliIntro command="commandName">`

Appears right after the command help block. Use for:

- Overview and introduction
- Prerequisites or requirements
- Links to related documentation

### `<CliDoc command="commandName">`

Appears after the intro section. Use for:

- Detailed documentation
- Usage examples
- Common use cases
- Tips and best practices
- Troubleshooting

## Example Output

See `docs/cli/deploy.mdx` for a complete example showing:

- Command help block (auto-generated)
- Intro section (from partial)
- Detailed docs with examples (from partial)
- All formatted beautifully

## Tips

- The `.partial.mdx` files are the source of truth for custom content
- Generated `.mdx` files should not be edited directly (changes will be
  overwritten)
- Use standard MDX features (code blocks, links, lists, etc.) in partial files
- The `command` prop must match the filename (e.g., `command="deploy"` in
  `deploy.partial.mdx`)
