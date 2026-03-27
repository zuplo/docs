---
title: API Keys
---

Zuplo includes a fully managed API key system with global edge validation,
self-serve developer access, and leak detection. This page explains how the
system works.

## Core objects

The API key system has three core objects:

- **Buckets** group consumers for an environment. Each Zuplo project has buckets
  for production, preview, and development. Buckets can be shared across
  projects so consumers can authenticate to multiple APIs with a single key.
- **Consumers** are the identities that own API keys. Each consumer has a unique
  name within its bucket, optional metadata (available at runtime), and optional
  tags (for management queries).
- **API Keys** are the credential strings used to authenticate. Each consumer
  can have multiple keys. All keys for a consumer share the same identity and
  metadata.

See [API Key Management](../articles/api-key-management.mdx) for a full
overview, and [API Key Administration](../articles/api-key-administration.mdx)
for managing consumers in the portal.

## How validation works

When a request includes an API key, the
[API Key Authentication](../policies/api-key-inbound.mdx) policy validates it
against Zuplo's globally distributed key service. Validation happens at the edge
in 300+ data centers, keeping latency low and load off your backend.

Key changes (creation, revocation, deletion) replicate globally in seconds.

After successful validation, the policy populates `request.user`:

- `request.user.sub` is set to the consumer's name
- `request.user.data` contains the consumer's metadata (plan, customerId, etc.)

This lets downstream policies and handlers make authorization decisions, apply
per-consumer [rate limits](./rate-limiting.md), or forward identity to your
backend.

See [Authentication](./authentication.mdx) for how `request.user` works across
all auth methods, and [RequestUser](../programmable-api/request-user.mdx) for
the full type reference.

## Consumer metadata

Metadata is a JSON object stored on each consumer that is available at runtime
when the consumer's key is used. Common uses:

- **Plan/tier**: `{"plan": "gold"}` for per-plan rate limiting or feature gating
- **Customer ID**: `{"customerId": "cust_123"}` for forwarding identity to your
  backend
- **Organization**: `{"orgId": 456}` for multi-tenant routing

Metadata is set when creating a consumer via the
[portal](../articles/api-key-administration.mdx),
[Developer API](../articles/api-key-api.mdx), or
[developer portal self-serve](#self-serve-key-management).

## Tags vs metadata

**Metadata** is sent to the runtime on every request and is used for
authorization and routing. Keep it small.

**Tags** are key-value pairs used only for management (querying, filtering,
organizing consumers via the API). Tags are not sent to the runtime.

## API key format and leak detection

Zuplo API keys use a structured format prefixed with `zpka_` followed by
cryptographically random characters and a signature. This format enables
automatic [leak detection](../articles/api-key-leak-detection.mdx): if one of
your keys appears in a public GitHub repository, Zuplo sends an alert with the
token and the URL where it was found.

Leak detection is enabled automatically for all keys using the standard format.

See [API Key Leak Detection](../articles/api-key-leak-detection.mdx) for
details.

## Self-serve key management

The [Developer Portal](../dev-portal/introduction.mdx) includes built-in
self-serve API key management. Your API consumers can sign in to the portal and
create, view, and delete their own keys without contacting your team.

To enable self-serve access, assign a **manager** to a consumer. Managers are
identified by email and identity provider subject. This can be done in the
portal, via the [Developer API](../articles/api-key-api.mdx), or automatically
when a user signs in using
[Auth0](../dev-portal/dev-portal-create-consumer-on-auth.mdx) or another
identity provider.

You can also embed the key management UI directly in your own application using
the [API Key React Component](../articles/api-key-react-component.mdx).

## Buckets and environments

Each project has separate buckets for production, preview, and working copy
environments. This means API keys created in production don't work in preview,
and vice versa.

For testing, you can specify a custom bucket name on the
[API Key Authentication](../policies/api-key-inbound.mdx) policy to share keys
across environments. Enterprise customers can share buckets across projects or
accounts.

See [API Key Buckets](../articles/api-key-buckets.mdx) for details on bucket
configuration and [Service Limits](../articles/api-key-service-limits.mdx) for
limits on consumers and keys.

## Managing keys programmatically

The [Zuplo Developer API](../articles/api-key-api.mdx) provides full CRUD
operations for buckets, consumers, keys, and managers. Use it to:

- Create consumers and keys as part of your onboarding flow
- Sync consumers with your billing system
- Bulk-create keys for migration
- Query consumers by tags

See the [API Reference](/docs/api) for the complete endpoint documentation.

## Related documentation

- [API Key Management](../articles/api-key-management.mdx) -- Overview and
  getting started
- [API Key Authentication Policy](../policies/api-key-inbound.mdx) -- Policy
  configuration reference
- [API Key Administration](../articles/api-key-administration.mdx) -- Managing
  keys in the portal
- [Using the API Key API](../articles/api-key-api.mdx) -- Programmatic
  management
- [End User Access](../articles/api-key-end-users.mdx) -- Self-serve in the
  developer portal
- [React Component](../articles/api-key-react-component.mdx) -- Embed key
  management in your app
- [Leak Detection](../articles/api-key-leak-detection.mdx) -- GitHub secret
  scanning
- [Buckets](../articles/api-key-buckets.mdx) -- Bucket configuration
- [Service Limits](../articles/api-key-service-limits.mdx) -- Rate limits and
  quotas
