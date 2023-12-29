This policy adds a JWT token to the headers, ready for us in an outgoing request when calling a GCP service (e.g. Cloud Endpoints / ESPv2). We recommend reading the `serviceAccountJson` from environment variables (so it is not checked in to source control) using the `$env(ENV_VAR)` syntax.

CAUTION: This policy only works with [certain Google APIs](https://developers.google.com/identity/protocols/oauth2/service-account#jwt-auth)<!-- -->. In most cases, the [Upstream GCP Service Auth](https://zuplo.com/docs/policies/upstream-gcp-service-auth-inbound) should be used.
