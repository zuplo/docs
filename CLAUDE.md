# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Commands

- Build: `npm run build` - Generate static content
- Development: `npm run dev` - Start local development server
- Lint (links): `npm run check` - Check assets and external links
- Lint (text): `make lint` - Run Vale for style and errors
- Format: `npm run format` - Run prettier
- Typecheck: `npm run typecheck` - Run TypeScript checks

## Style Guidelines

- Use American English with present tense
- Follow Microsoft's Writing Style Guide
- Avoid passive voice and first-person pronouns
- Use React 19 with modern TypeScript features
- Format with Prettier (prose wrapping for .md files)
- Use strict TypeScript mode with explicit types
- Product documentation is in `./docs/`
- Error pages should be created in `./docs/errors/`
- Write clear, concise documentation
- Use ES modules (type: "module" in package.json)

## Admonitions

- Use `:::note`, `:::tip`, `:::warning`, `:::caution`, and `:::danger` for
  admonitions
- Use `:::caution{title="Title"}` for titles
- IMPORTANT!!! Make sure to include a line break after and before the inside of
  the admonition block so that it formats correctly with prettier. For example:

  ```
  :::note

  This is a note admonition.

  :::
  ```

## Additional Guidelines

- Run as much in parallel as possible. If you have multiple tasks, run them in
  parallel to save time. Do not wait for one task to finish before starting the
  next one.
- Optimize to complete tasks quickly and correctly.

## URLs

- When writing urls to internal pages, use relative paths with the .md or .mdx
  extension.
- When linking to internal pages, check that the page actually exists before
  making up a link. ONLY USE REAL LINKS.

## Zuplo Docs Content

When writing or editing documentation, always use the
`mcp__docs__search-zuplo-docs`, `mcp__docs__ask-question-about-zuplo` tool first
to:

- Match existing terminology and style
- Avoid duplicating content
- Find related docs to cross-reference
