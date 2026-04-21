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

## When to use API keys

API keys are the right authentication method when you need to identify an
organization, system, or service calling your API. Companies like Stripe,
Twilio, and SendGrid use API keys because they offer a simple developer
experience — a single string in a header, easy to test with curl, and no token
refresh flow.

Use API keys when:

- Your API consumers are developers integrating server-to-server
- You want simple, low-friction authentication (no OAuth dance)
- You need to identify and rate-limit individual consumers
- You want instant revocation capability (unlike JWTs, which are valid until
  expiry)

Use OAuth or JWT when:

- You need to authenticate on behalf of an individual end-user
- Your use case requires delegated authorization with scoped permissions
- You are building a user-facing login flow

API keys and JWT/OAuth are not mutually exclusive. Many APIs use API keys for
system-level access and OAuth for user-level actions.

## API key format

Zuplo API keys use a structured three-part format:

```
zpka_<random>_<checksum>
```

Each part serves a specific purpose:

- **`zpka_` prefix** — identifies the string as a Zuplo API key. This enables
  automated [leak detection](../articles/api-key-leak-detection.mdx) via GitHub
  secret scanning (scanners match the prefix pattern), helps support teams
  identify key types during debugging, and distinguishes Zuplo keys from other
  credentials in logs and config files.
- **Random body** — a cryptographically random string that serves as the actual
  credential. This portion is generated using a secure random source and
  provides the entropy that makes each key unique.
- **Checksum signature** — a suffix that allows instant format validation. When
  a request arrives, Zuplo can verify the checksum mathematically in
  microseconds to confirm the key is structurally valid before making any
  network call. This rejects typos, truncated keys, and garbage strings without
  touching the database.

The underscore separators are also intentional — they ensure that a double-click
on the key in most text editors and terminals selects the entire string,
reducing the chance of accidentally copying a partial key.

### Leak detection

This key format is what makes Zuplo an official
[GitHub secret scanning partner](https://github.blog/changelog/2022-07-13-zuplo-is-now-a-github-secret-scanning-partner/).
If a Zuplo API key is committed to any GitHub repository, GitHub detects it,
verifies the checksum, and notifies Zuplo. You receive an alert with the token
and the repository URL where it was found. Leak detection is enabled
automatically for all keys using the standard format and is available to all
customers, including free.

See [API Key Leak Detection](../articles/api-key-leak-detection.mdx) for the
full scan flow and recommended response actions.

:::note

Enterprise customers can use custom key formats, but custom formats do not
support leak detection.

:::

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
