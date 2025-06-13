# AGENT.md

Commands:

- Dev: `npm run dev` - Start local development server
- Build: `npm run build` - Generate static content with Zudoku
- Test: No automated tests found
- Typecheck: `npm run typecheck` - Run TypeScript checks
- Lint (links): `npm run check` - Check assets and external links
- Lint (text): `make lint` - Run Vale for style and errors
- Format: `npm run format` - Run Prettier

Architecture:

- Zudoku-based documentation site with React 19 and TypeScript
- Main docs in `/docs/`, generated content in `/generated/`
- Policies auto-generated in `/policies/`, errors in `/docs/errors/`
- Components in `/src/`, configuration in `zudoku.config.tsx`
- PostHog analytics, Inkeep search, API docs from `api.json`

Style Guidelines:

- Use ES modules (type: "module"), React 19, strict TypeScript
- Target audience: software developers building APIs
- American English, present tense, avoid passive voice/first-person
- Follow Microsoft Writing Style Guide, format with Prettier
- Admonitions: Use `:::note`, `:::tip`, `:::warning`, `:::caution`, `:::danger`
- Ensure line breaks before/after `:::` blocks for proper formatting
- Friendly, professional, informative tone with clear structure
