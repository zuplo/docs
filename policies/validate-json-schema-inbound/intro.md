**This policy is deprecated.** Use the new [Request Validation Policy](https://zuplo.com/docs/policies/request-validation-inbound)<!-- -->. The new policy validates JSON bodies like this policy, but also supports validation of parameters, query strings, etc.

The Validate JSON Schema policy is used to validate the body of incoming requests. It works using JSON Schemas defined in the `Schemas` folder of your project.

When configured, any requests that do not have a body conforming to your JSON schema will be rejected with a `400: Bad Request` response containing a detailed error message (in JSON) explaining why the body was not accepted.
