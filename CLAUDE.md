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
