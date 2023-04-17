---
title: Securing your backend
---

When using a gateway, it's important to ensure that your backend API is only receiving traffic via the gateway to be confident that your policies are being correctly applied to all traffic.

![](https://cdn.zuplo.com/assets/b7290dd1-43fa-49f8-8629-6b4899e2e9f3.png)

To do this, we need to secure the communication between Zuplo and your backend APIs (origin). There are several options to do this securely.

## 1/ Shared secret / API Key

This is the most popular option and is used by companies like Supabase, Firebase, and Stripe to secure their own APIs. In this solution the backend requires a secret that is known only by the gateway. This is usually an opaque key sent as a header on every request to the origin. Zuplo adds this to the request - the client is never aware of the secret. An example of how to set this up, including using [Environment Variables](./environment-variables.md) to store the secret is included in [Step 1 - Setup a Basic Gateway](./step-1-setup-basic-gateway.md).

## 2/ Federated Authentication

This is a new option where you can configure your cloud service (e.g. GCP or AWS) to trust a JWT token created by the Zuplo runtime. If you're interested in using this option please contact us at `support@zuplo.com`.

## 3/ Upstream Service Authentication

Utilize the IAM controls provided by your Cloud host to secure inbound requests and allow only authorized service principals access to your service.

- For Azure users, you can user our [Upstream Azure AD Service Auth](../policies/upstream-azure-ad-service-auth-inbound-policy.md) policy. This uses Azure AD App registrations to create a token that Zuplo will send to requests to Azure.

- For GCP users, you can use our [Upstream GCP Service AUth](../policies/upstream-gcp-service-auth-inbound-policy.md) or [Upstream GCP JWT](../policies/upstream-gcp-jwt-inbound.md) policies. These use a service.json credential to create or issue JWT tokens that Zuplo will send to requests to GCP.

## 4/ mTLS Authentication

Mutual Certificate authentication allows the configuration of a trust relationship between your Zuplo gateway and your backend API using certificates. If you're interested in using this option please contact us at `support@zuplo.com`.

## 5/ Secure Tunneling

Used by some of our larger customers, our [secure tunnels](./secure-tunnel.md) allow you to create a WireGuard based tunnel from your VPC or private data-center that connects directly to your Zuplo gateway. In this solution, your backend API does not need to be exposed to the internet at all. This is a more complex setup and is only available on our [enterprise plan](https://zuplo.com/pricing).

To discuss security and connectivity options, our [discord channel](https://discord.gg/8QbEjr2MgZ) is a great community, with active participation from the Zuplo team.
