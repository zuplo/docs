## Overview

This command updates the Zuplo runtime documentation based on the API Extractor
report. It ensures proper organization between API reference documentation and
conceptual guides while maintaining cross-references.

## Steps

1. Download this file to the root of this project:
   https://cdn.zuplo.com/types/@zuplo/runtime/latest/out/types/index.d.ts

2. Analyze the typescript file (`index.d.ts`) and update the documentation
   following these guidelines:

   ### Document Organization
   - Runtime API documentation goes in `docs/programmable-api/`
   - Handler documentation goes in `docs/handlers/`
   - Create an index.md file in programmable-api that provides an overview
   - DO NOT!!! document Policies - they are documented separately via automation
   - Each class, interface, or major API should have its own file
   - DO NOT!!! document the following exports: `ContentTypes`, `apiServices`,
     `ApiAuthKeyInboundPolicy`, `ValidateJsonSchemaInbound`,
     `SchemaBasedRequestValidation`, `CryptoBeta`

   ### What to Document
   - All public (@public) and beta (@beta) APIs from the runtime
   - Classes: MemoryZoneReadThroughCache, StreamingZoneCache, ZoneCache,
     BackgroundLoader, BackgroundDispatcher, ContextData, Logger, RuntimeError,
     ConfigurationError, HttpProblems, etc.
   - Interfaces: ZuploRequest, ZuploContext, RequestUser, etc.
   - Functions: apiServices, environment constant, etc.
   - Constants: ContentTypes, HttpStatusCode enum, etc.
   - Plugins: AuditLogPlugin, logging plugins, metrics plugins, storage plugins
   - DO NOT document individual policy classes
   - The Zuplo environment is NOT nodejs. It is a custom v8 runtime that is
     compatible with WinterCG (similar to Cloudflare Workers, Deno, etc.).
   - Do not show examples of doing things like connecting to services using
     native or TCP protocols. Zuplo interacts with databases or other services
     using fetch.

   ### Documentation Strategy
   - Preserve existing good content from current docs
   - Augment existing docs with missing information from the API report
   - Create new docs for undocumented APIs
   - Use the API Extractor report as the source of truth for API signatures
   - If there are conflicts between existing docs and the API report, prefer the
     API report unless the existing docs have important context/examples

   ### Documentation Requirements
   - Write in markdown format
   - Use American English with present tense
   - Avoid passive voice and first-person pronouns
   - Include practical examples with TypeScript
   - Show imports and proper usage patterns
   - Add cross-references to related documentation
   - Include "See Also" sections where appropriate
   - Do NOT use `process.env` - use `environment` from "@zuplo/runtime"
   - Do NOT reference `NODE_ENV` - Zuplo is not Node.js
   - It is also important you follow the guidelines in the CLAUDE.md file (i.e.
     admonitions, etc.)

### Content Separation

- Keep API reference documentation in `docs/programmable-api/`
- Keep conceptual/how-to guides in `docs/articles/`
- Avoid duplicating content between the two locations
- Add cross-references between related API docs and articles
- API docs should focus on technical details, signatures, and code examples
- Articles should focus on configuration, best practices, and concepts

### Special Files to Maintain/Update

- `programmable-api/index.md` - Comprehensive index of all runtime APIs
- `programmable-api/content-types.md` - ContentTypes constant documentation
- `programmable-api/http-problems.md` - Should include complete method list and
  HttpStatusCode enum
- `programmable-api/environment.md` - Environment variables API reference
- `articles/environment-variables.md` - Configuration guide for env vars

3. Update sidebar.ts to include all new documentation in appropriate sections

4. Fix broken links:
   - Update references to moved files (e.g., `./compatibility-dates.md` →
     `../programmable-api/compatibility-dates.md`)
   - Update references from handlers to programmable-api docs
   - Remove references to non-existent articles
   - Ensure all cross-references use correct relative paths

5. Handle duplicated content:
   - If content is duplicated between programmable-api and articles:
     - Keep technical API details in programmable-api
     - Keep configuration/setup guides in articles
     - Add cross-references between them
   - Common duplications to check:
     - Environment variables (environment.md vs environment-variables.mdx)
     - Logging (logger.md vs logging.mdx)
     - Caching (cache/zone-cache vs caching articles)

6. Format all documentation using `npm run format`

7. Important notes:
   - Handlers are already documented in `/docs/handlers` - augment if needed
   - Link to handlers using paths like `../handlers/custom-handler.md`
   - The runtime API index should exclude all policy documentation
   - Focus on runtime APIs that developers directly use
   - Ensure all examples show correct imports from "@zuplo/runtime"
   - Add appropriate frontmatter (title, sidebar_label) to all docs
