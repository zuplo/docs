```json
{
  "export": "SetHeaderOutbound",
  "module": "$import(@zuplo/runtime)",
  "options": {
    "audience": "your_gcp_service.endpoint.com",
    "serviceAccountJson": "$env(SERVICE_ACCOUNT_JSON)"
  }
}
```

This policy adds a JWT token to the headers, ready for us in an outgoing request when calling a GCP service (e.g. Cloud Endpoints / ESPv2). We recommend reading the `serviceAccountJson` from environment variables (so it is not checked in to source control) using the `$env(ENV_VAR)` syntax.
