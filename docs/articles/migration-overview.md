---
title: Migrate to Zuplo from Other API Gateways
sidebar_label: Migration Overview
---

Moving to Zuplo from another API gateway is straightforward. Zuplo is
OpenAPI-native, so you can import your existing API definitions and start
configuring policies in minutes. This section provides migration guides for the
most common API gateways.

## Why teams migrate to Zuplo

Teams migrate to Zuplo from legacy API gateways for several common reasons:

- **Reduce operational complexity** — Eliminate self-hosted infrastructure,
  database management, and Kubernetes overhead with a fully managed platform.
- **Lower total cost of ownership** — Replace expensive enterprise licensing and
  hidden infrastructure costs with transparent, usage-based pricing.
- **Accelerate development velocity** — Deploy globally in under 20 seconds with
  GitOps workflows, TypeScript policies, and instant preview environments.
- **Modernize the developer experience** — Replace XML configs, Lua plugins, or
  CloudFormation templates with TypeScript and OpenAPI-native configuration.
- **Go multi-cloud** — Deploy to 300+ edge locations worldwide without
  single-cloud lock-in.

## Migration guides by platform

| Source platform                                      | Common migration triggers                                                   |
| ---------------------------------------------------- | --------------------------------------------------------------------------- |
| [Kong Gateway](./migrate-from-kong.md)               | Community Edition stagnation, Kubernetes complexity, Lua plugin limitations |
| [Google Apigee](./migrate-from-apigee.md)            | Apigee Edge EOL, GCP lock-in, XML policy complexity, high costs             |
| [AWS API Gateway](./migrate-from-aws-api-gateway.md) | AWS lock-in, limited customization, no built-in developer portal            |
| [Azure API Management](./migrate-from-azure-apim.md) | Slow deployments, expensive per-environment pricing, poor GitOps support    |

## General migration approach

Regardless of your source platform, the migration process follows a similar
pattern:

1. **Export your API definitions** — Extract OpenAPI specs from your current
   gateway. If you don't have OpenAPI specs, create them from your existing
   route configuration.
2. **Import into Zuplo** — Import your OpenAPI spec through the Zuplo Portal or
   by adding the file to your project repository.
3. **Map policies** — Translate your existing gateway policies (authentication,
   rate limiting, transformation) to Zuplo's built-in
   [policy library](./policies.md).
4. **Configure backend connectivity** — Set up
   [URL forwarding](../handlers/url-forward.md) or
   [URL rewriting](../handlers/url-rewrite.md) to route traffic to your existing
   backends.
5. **Test in a preview environment** — Use Zuplo's
   [branch-based deployments](./branch-based-deployments.md) to validate your
   configuration before going live.
6. **Migrate traffic incrementally** — Route a subset of traffic through Zuplo
   first, then gradually shift all traffic once you've validated the
   configuration.

## Concept mapping

The following table maps common API gateway concepts to their Zuplo equivalents:

| Concept          | Kong                 | Apigee              | AWS API Gateway      | Azure APIM            | Zuplo                                                  |
| ---------------- | -------------------- | ------------------- | -------------------- | --------------------- | ------------------------------------------------------ |
| Route definition | Service + Route      | API Proxy           | Resource + Method    | API + Operation       | [OpenAPI route](./openapi.md)                          |
| Request policy   | Plugin (Lua)         | Policy (XML)        | Lambda authorizer    | Policy (XML)          | [Inbound policy](./policies.md) (TypeScript)           |
| Response policy  | Plugin (Lua)         | PostFlow (XML)      | Response mapping     | Outbound policy (XML) | [Outbound policy](./policies.md) (TypeScript)          |
| Authentication   | Plugin               | VerifyAPIKey policy | API key / Authorizer | Subscription key      | [API key](./api-key-authentication.md) or JWT policy   |
| Rate limiting    | Rate Limiting plugin | SpikeArrest / Quota | Usage plan           | rate-limit policy     | [Rate limit policy](../policies/rate-limit-inbound.md) |
| Developer portal | Kong Dev Portal      | Drupal portal       | N/A (self-build)     | Built-in portal       | [Developer Portal](../dev-portal/introduction.md)      |
| Environment      | Workspace            | Environment         | Stage                | Service               | [Environment](./environments.md)                       |
| Deployment       | Deck / Admin API     | API deploy          | CloudFormation / SAM | ARM / Bicep           | `git push` with [GitOps](./source-control.md)          |

## Get migration support

Need help planning your migration? Zuplo's team can assist with migration
planning, policy translation, and architecture review.

- [Book a demo](https://zuplo.com/meeting)
- [Contact support](https://zuplo.com/support)
- [Join the Discord community](https://discord.gg/W4mQqNnfSq)
