---
title: Authentication
---

Zuplo supports multiple authentication methods through inbound policies. All
authentication policies follow the same pattern: validate credentials, then
populate `request.user` with the authenticated identity.

## How authentication works

Authentication policies are inbound policies that run before your handler. When
a request arrives:

1. The auth policy extracts credentials (API key, JWT token, etc.)
2. It validates the credentials against the configured provider
3. On success, it populates `request.user` with the identity
4. On failure, it returns a 401 Unauthorized response (short-circuiting the
   pipeline)

After authentication, all downstream policies and handlers can access
`request.user` to make authorization decisions, apply per-user rate limits, or
forward identity to your backend.

## The `request.user` object

All authentication methods populate the same interface:

```ts
interface RequestUser {
  sub: string; // Unique subject identifier
  data: Record<string, unknown>; // Provider-specific claims or metadata
}
```

For **JWT/OAuth** authentication, `sub` comes from the token's `sub` claim and
`data` contains the remaining token claims (email, roles, org, etc.).

For **API key** authentication, `sub` is the consumer identifier and `data`
contains the metadata you set when creating the consumer (plan, customerId,
etc.).

See [RequestUser](../programmable-api/request-user.mdx) for the full type
reference.

## Supported methods

### API key authentication

Zuplo's built-in [API key management](../articles/api-key-management.mdx)
provides a complete system for issuing, managing, and validating API keys.
Consumers (API key holders) can be created via the portal, API, or developer
portal self-serve.

Best for: B2B APIs, developer platforms, and any API where you manage consumer
access.

### JWT / OAuth authentication

Zuplo validates JWTs from any OpenID Connect-compatible identity provider.
Built-in policies exist for common providers:

- [Auth0](../policies/auth0-jwt-auth-inbound.mdx)
- [Clerk](../policies/clerk-jwt-auth-inbound.mdx)
- [Okta](../policies/okta-jwt-auth-inbound.mdx)
- [AWS Cognito](../policies/cognito-jwt-auth-inbound.mdx)
- [Firebase](../policies/firebase-jwt-inbound.mdx)
- [Supabase](../policies/supabase-jwt-auth-inbound.mdx)
- [PropelAuth](../policies/propel-auth-jwt-inbound.mdx)
- [OpenID Connect (generic)](../policies/open-id-jwt-auth-inbound.mdx)

Best for: APIs consumed by your own frontend, mobile apps, or services where
users already authenticate with an identity provider.

### Other methods

- [Basic Auth](../policies/basic-auth-inbound.mdx) - Username/password
  authentication
- [mTLS](../policies/mtls-auth-inbound.mdx) - Mutual TLS certificate
  authentication
- [LDAP](../policies/ldap-auth-inbound.mdx) - LDAP directory authentication
- [HMAC](../policies/hmac-auth-inbound.mdx) - Hash-based message authentication

## Combining authentication methods

You can support multiple auth methods on the same route (e.g., both API keys and
JWT tokens). The pattern is:

1. Add each auth policy to the route's inbound policies
2. Set `allowUnauthenticatedRequests: true` on each so they don't immediately
   return 401
3. Add a custom policy after them that checks `request.user` and returns 401 if
   no method succeeded

See [Multiple Auth Policies](../articles/multiple-auth-policies.mdx) for a
detailed walkthrough.

## Choosing an authentication method

| Method                   | Use Case                                       |
| ------------------------ | ---------------------------------------------- |
| API Keys                 | B2B APIs, developer platforms, metered access  |
| JWT (Auth0, Clerk, etc.) | User-facing APIs, SPAs, mobile apps            |
| mTLS                     | Service-to-service, high-security environments |
| Basic Auth               | Internal APIs, simple integrations             |
| HMAC                     | Webhook verification, signed requests          |

For most API products, **API key authentication** is the recommended starting
point. It provides self-serve key management, per-consumer rate limiting, and
usage tracking out of the box.
