This policy allows you to delegate authentication and authorization to your
gateway without writing any code on your origin service by adding a GCP Issued
ID Token to outgoing header allowing the service to be secured with GCP IAM.
This is a useful means of securing your origin server so that only your Zuplo
gateway can make requests against it.

This policy works with
[GCP Identity Aware Proxy](https://zuplo.com/docs/articles/gke-with-upstream-auth-policy)
or services like [Cloud Run](https://cloud.google.com/iap/docs/managing-access)
that natively support IAM authorization.

We recommend reading the `serviceAccountJson` from environment variables (so it
is not checked in to source control) using the `$env(ENV_VAR)` syntax.
