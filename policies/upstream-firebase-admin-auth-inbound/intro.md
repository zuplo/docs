This policy adds a Firebase Admin token to the outgoing `Authentication` header
allowing requests to Firebase using Service Account admin permissions. This can
be useful for calling Firebase services such as Firestore through a Zuplo
endpoint that is secured with other means of Authentication such as API keys.
Additionally, this policy can be useful for service content to all API users
(for example serving a specific Firestore document containing configuration
data)

We recommend reading the `serviceAccountJson` from environment variables (so it
is not checked in to source control) using the `$env(ENV_VAR)` syntax.
