## Overview

This command updates the Zuplo runtime documentation based on the API Extractor
report.

## Steps

1. I have used API Extractor to create a report of the @zuplo/runtime package.
   You can find that report at:
   /Users/ntotten/zuplo/core2/packages/runtime/etc/runtime.api.md

2. Before you start analyzing, copy the above file to the current working
   directory, then read the contents.

3. Update the documentation following these guidelines:

   ### Document Organization

   - Runtime API documentation goes in `docs/programmable-api/`
   - Handler documentation goes in `docs/handlers/`
   - DO NOT document Policies - they are documented separately via automation
   - Each class, interface, or major API should have its own file
   - DO NOT create a single monolithic file for all runtime APIs (i.e. an index
     page)
   - Do not document the following exports: `ContentTypes`, `apiServices`,
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
     compatible with WinterWG (similar to Cloudflare Workers, Deno, etc.).
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

   ### Special Files to Maintain/Update

   - `runtime-api-index.md` - Comprehensive index of all runtime APIs
   - `content-types.md` - ContentTypes constant documentation
   - `http-problems.md` - Should include complete method list and HttpStatusCode
     enum

4. Format all documentation using `npm run format`

5. Important notes:
   - Handlers are already documented in `/docs/handlers` - augment if needed
   - Link to handlers using paths like `/docs/handlers/custom-handler`
   - The runtime API index should exclude all policy documentation
   - Focus on runtime APIs that developers directly use
