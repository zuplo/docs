The Request Validation policy is used to validate incoming requests based on
schemas in OpenAPI specifications.

When configured, any requests that do not conform to your OpenAPI schema will be
rejected with a `400: Bad Request` response containing a detailed error message
(in JSON) explaining why the body was not accepted.

**NOTICE**: This policy is not compatible with legacy projects that use
routes.json. In order to use this policy, migrate your project to OpenAPI.
[See docs](https://zuplo.com/docs/cli/convert).
