**This policy is deprecated. Use the new
[API Key Authentication policy instead](https://zuplo.com/docs/policies/api-key-inbound)**

This policy uses the managed API key storage provided by Zuplo.
`allowUnauthenticatedRequests` defaults to false and rejects any request without
a valid API key (returning a `401 - Unauthorized` response). You can override
(set `"allowUnauthenticatedRequests" : true`) this to support multiple
authentication methods or support both authenticated and anonymous requests.
