This policy adds an GCP Issued ID Token to outgoing header allowing the service to be secured with GCP IAM. This is a useful means of securing your origin server so that only your Zuplo gateway can make requests against it.

We recommend reading the `serviceAccountJson` from environment variables (so it is not checked in to source control) using the `$env(ENV_VAR)` syntax.

Using this policy allows you to delegate authentication and authorization to your gateway without writing any code on your origin service. For instructions on how to configure GCP service to service authentication see [Google's documentation](https://cloud.google.com/run/docs/authenticating/service-to-service#use_workload_identity_federation_from_outside).
