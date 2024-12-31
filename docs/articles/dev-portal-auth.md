---
title: Dev Portal Authentication
sidebar_label: Overview
---

The Zuplo Developer Portal supports authenticating with any standard-compliant
OpenID Connect identity provider such as [Auth0](https://auth0.com),
[Okta](https://okta.com), [AWS Cognito](https://aws.amazon.com/cognito/),
[Clerk](https://clerk.com), etc. The developer portal also supports external
auth sources like [Supabase](https://supabase.com).

Below are instructions on how to configure some of the common providers.

:::caution{title="Production Authentication"}

Production Developer Portals must setup custom authentication.

Out of the box, authentication to your developer portal uses Zuplo's test Auth0
account. The test Auth0 account can't be used in production (it will fail on
custom domains) and is limited to a small number of users per month per project.

:::

- [Auth0](./dev-portal-auth0-auth.md)
- [Clerk](./dev-portal-clerk-auth.md)
- [Supabase](./dev-portal-supabase-auth.md)
