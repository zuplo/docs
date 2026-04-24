---
title: When to Use API Keys
sidebar_label: When to Use API Keys
---

Choosing the right authentication method is one of the first decisions you make
when building an API. This guide explains when API keys are the right choice,
when they are not, and how they compare to JWT and OAuth.

## API keys vs JWT vs OAuth

API keys, JWTs, and OAuth solve different problems. Picking the wrong one
creates friction for your consumers or security gaps in your API.

|                          | API Keys                                                        | JWT (self-issued)                                                  | OAuth 2.0                                                        |
| ------------------------ | --------------------------------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------- |
| **Identifies**           | An organization, system, or service                             | A user or service (claims embedded in token)                       | A user acting through a third-party app                          |
| **Credential format**    | Opaque string — no embedded data                                | Encoded JSON with claims (readable by anyone)                      | Access token issued by an authorization server                   |
| **Revocation**           | Instant — delete the key and it stops working                   | Not instant — valid until expiry (unless you maintain a blocklist) | Depends on token lifetime and refresh flow                       |
| **Developer experience** | Single string in a header, works in curl                        | Requires token generation, sometimes a signing key                 | Requires redirect flow, client registration, token exchange      |
| **Best for**             | Server-to-server integrations, developer platforms, public APIs | Internal service-to-service auth, short-lived sessions             | User-facing apps that need delegated access ("act on behalf of") |

:::note

API key authentication, like all bearer token authentication, requires HTTPS in
production. Without TLS, keys are transmitted in plaintext and can be
intercepted in transit.

:::

### When to use API keys

API keys are the right choice when your API consumers are **organizations,
services, or developers integrating server-to-server** — not individual
end-users acting on their own behalf.

This is why the most successful API-first companies use API keys:

- **Stripe** — every API call uses an API key scoped to the organization
- **Twilio** — Account SID + Auth Token (functionally an API key pair)
- **SendGrid** — API keys with scoped permissions per key
- **Datadog, Cloudflare, PagerDuty** — all use API keys for their public APIs

Use API keys when:

- Your consumers are developers integrating with your API from their backend
- You want the simplest possible developer experience — a single string, no
  token refresh, works in curl
- You need to identify and rate-limit individual consumers or organizations
- You want the ability to revoke access instantly (unlike JWTs, which remain
  valid until they expire)
- You are building a developer platform, partner API, or public API

:::warning

Do not embed API keys in frontend JavaScript, mobile apps, or any client-side
code. Keys in client bundles are trivially extractable and cannot be scoped to a
user session. Use OAuth for scenarios where individual end-users authenticate
from a browser or device.

:::

### When to use JWT or OAuth

Use JWT or OAuth when:

- You need to authenticate **on behalf of an individual end-user** (the redirect
  and consent flow — often called the "OAuth dance" — exists for this reason)
- Your use case requires **delegated authorization with scoped permissions**
  (e.g., "this app can read my repos but not delete them")
- You are building a **user-facing login flow** where the user interacts with
  your auth provider directly

### Quick decision checklist

| Question                                                 | If yes                                 | If no                                         |
| -------------------------------------------------------- | -------------------------------------- | --------------------------------------------- |
| Are your consumers machines or backend services?         | API keys are a strong fit              | Consider OAuth for human users                |
| Do you need delegated user consent ("act on behalf of")? | Use OAuth                              | API keys work well                            |
| Do consumers need to refresh credentials periodically?   | OAuth handles this with refresh tokens | API keys are simpler — no refresh flow needed |

## Why API keys over JWTs for public APIs

Developers sometimes default to JWTs for everything because they are a
"standard." But for public and partner APIs, API keys have concrete advantages:

### Simpler developer experience

An API key is a single string. Your consumer puts it in a header and makes a
request:

```bash
curl https://api.example.com/v1/orders \
  -H "Authorization: Bearer zpka_d67b7e241bb948758f415b79..."
```

No token endpoint, no client credentials, no refresh flow, no clock skew issues.
The time from "I got my API key" to "I made my first successful request" is
measured in seconds.

### Opaque by design

A JWT is a base64url-encoded JSON object. Anyone can decode it and see the
claims inside — user IDs, email addresses, roles, org names. This is a feature
when you need claims on the client side, but it is a liability when you are
issuing credentials to third parties. Leaking a JWT leaks its contents.

API keys are opaque strings. They contain no embedded data. The consumer's
identity and metadata are stored server-side and resolved at validation time.
Nothing is leaked if the key is intercepted, beyond the key itself.

### Instant revocation

When you revoke a JWT, it remains valid until it expires. The only way to
force-invalidate a JWT before expiry is to maintain a server-side blocklist —
which eliminates the main advantage of JWTs (stateless validation).

When you delete or expire an API key in Zuplo, the change propagates globally in
seconds. A revoked key stops working as soon as edge caches refresh — within the
configured `cacheTtlSeconds` (default 60 seconds). Compare this to a JWT with a
15-minute or 1-hour expiry: there is no equivalent long expiry window to wait
out.

### Per-consumer identity without token management

With API keys, the identity is the key itself. Zuplo resolves the consumer on
every request and populates `request.user` with the consumer's name and
metadata. There is no token to decode, validate, or refresh.

This makes downstream logic simpler — your handlers and policies always have a
consistent `request.user.sub` and `request.user.data` regardless of which API
key the consumer used.

Once you decide that API keys are the right fit, the next question is how keys
are stored and surfaced to consumers.

## Retrievable vs irretrievable keys

One architectural decision in API key systems is whether keys are
**retrievable** (the consumer can view the key again after creation) or
**irretrievable** (the key is shown once at creation time and then stored as a
hash).

|                    | Retrievable                                            | Irretrievable                                            |
| ------------------ | ------------------------------------------------------ | -------------------------------------------------------- |
| **Examples**       | Twilio, Airtable                                       | Stripe, AWS                                              |
| **After creation** | Consumer can view the key again in the portal          | Key is shown once — consumer must copy it immediately    |
| **Storage**        | Key can be returned to authorized users                | Only a hash is stored — original key cannot be recovered |
| **Trade-off**      | More convenient; reduces support burden from lost keys | Forces immediate key storage discipline                  |

The conventional wisdom is that irretrievable keys are more secure because they
are never stored in plaintext. But this has a counterintuitive downside:
**irretrievable keys force consumers to copy the key somewhere else** — often a
password manager, a `.env` file, a Slack message, or a sticky note. The key
still exists in plaintext, just in a location you don't control.

Retrievable keys let consumers go back to the portal when they need the key
again, reducing the pressure to store it in an insecure location. For teams with
less rigorous secret management practices, this can actually be the safer
option.

**Zuplo keys are retrievable.** Consumers can view their keys in the developer
portal or through the API using the `key-format=visible` parameter. This
balances security with the reality of how most development teams actually manage
secrets.

## They are not mutually exclusive

Many APIs use both. A common pattern:

- **API keys** for system-level access — your customers' backends call your API
  with an API key that identifies their organization
- **OAuth** for user-level access — end-users authorize a third-party app to act
  on their behalf through your API

Zuplo supports both patterns. You can apply
[API Key Authentication](../policies/api-key-inbound.mdx) and
[JWT Authentication](../policies/open-id-jwt-auth-inbound.mdx) to different
routes in the same project, or even
[combine multiple auth methods](./multiple-auth-policies.mdx) on a single route.

## Next steps

- [API Key Management Overview](./api-key-management.mdx) — set up API key
  authentication in minutes
- [API Key Best Practices](./api-key-best-practices.mdx) — the 8 practices that
  define a well-designed API key system
- [API Key Authentication policy](../policies/api-key-inbound.mdx) — configure
  the policy on your routes
- [Authentication concepts](../concepts/authentication.mdx) — how all
  authentication methods work in Zuplo
