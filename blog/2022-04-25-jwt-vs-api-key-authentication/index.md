---
title: JWT vs API Key Auth for Machine to Machine APIs
authors: nate
tags: [apis, authentication, code]
date: 2022-04-25
---

Authorizing other services (i.e. "machines") - sometimes called M2M - to call your API is typically done with either JWT tokens or API Keys. The reason to use one or the other varies by use case. This post will explain the pros and cons of each and suggest when each one is a good fit for securing your API.

## JWT Based Machine to Machine (M2M) Authentication

JWT authentication typically uses an OAuth 2.0 identity provider such as Auth0, AWS Cognito, etc. The identity provider issues tokens after validating the clients are who they say they are.

[![Client Credentials sequence](./auth-sequence-client-credentials.png)](https://auth0.com/docs/get-started/authentication-and-authorization-flow/client-credentials-flow)

When the client sends a request to the API it includes the JWT in the request's `Authorization` header. The API then validates the JWT to be authentic and uses the information in the JWT to identify the client. Typically the JWT contains a `sub` parameter that identifies the client. The token also includes a `aud` parameter that specifies which API the token can call.

JWT tokens can be issued with any length of expiration time, but it is typical for tokens to expire in a short period, such as one hour.

JWT auth with OAuth uses the [Client Credentials](https://auth0.com/docs/get-started/authentication-and-authorization-flow/client-credentials-flow) flow on the identity server. Each client that will call the API is issued a `Client Id` and a `Client Secret` - think of these values like a username and password. The client uses these values to request an access token they use to call the API. In code, the client credentials flow looks like the following example.

**Request**

```bash
curl --request POST \
  --url 'https://YOUR_DOMAIN/oauth/token' \
  --header 'content-type: application/x-www-form-urlencoded' \
  --data grant_type=client_credentials \
  --data client_id=YOUR_CLIENT_ID \
  --data client_secret=YOUR_CLIENT_SECRET \
  --data audience=YOUR_API_IDENTIFIER
```

**Response**

```json
{
  "access_token": "eyJz93a...k4laUWw",
  "token_type": "Bearer",
  "expires_in": 86400
}
```

### Considerations of Machine-to-Machine JWT Auth

JWT-based API auth is a good choice for securing microservices within an organization, or sharing APIs with certain types of external clients.

- JWT tokens are typically not revokable. To revoke a JWT token you typically have to roll the secrets of that client - this will disable ALL JWT tokens currently issued.
- Permissions with JWT tokens are managed at the identity provider level, meaning that all tokens issued for the same client will have the same permissions.
- JWT tokens are static; permissions, expiration time, or other properties cannot change once the token is issued.
- When JWT tokens expire, the consumer must request a new token using the Client ID and Secret value.
- Identity Providers often charge based on the number of tokens issued.
- The contents of a JWT token are visible to anyone, they can be decoded using public tools like [jwt.io](https://jwt.io)

## API Key Authentication

With API Key authentication, each client receives a unique secret key. Unlike JWT tokens, the key itself doesn't contain any actual data, it is simply an opaque unique string associated with the client. Furthermore, there is no standard protocol for API Key authentication like OAuth, etc., so each implementation can differ.

Ideally, an API using key-based authentication offers the API consumer the ability to manage their keys. For example, an API Gateway could offer a self-serve portal where end-users issue their own tokens and critically can revoke old, and create replacement keys on demand. Tokens can be issued with various permissions and with custom expirations times.

A typical API Key authentication system will validate each key as it comes in with a request. If the key is valid, then data is returned with that key - typically information about their identity and permissions.

```js
// pseudo-code to check key and get metadata
function myApiHandler(request) {
  const apiKey = request.headers.get("API-Key");
  const apiKeyInfo = apiKeyService.validate(apiKey);

  if (!apiKeyInfo.isValid) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  // Check various properties of the api key info
  if (apiKeyInfo.accountId) {
    // ...
  }
}
```

Or, when using Zuplo's API Key system:

```ts
export default async function (request: ZuploRequest) {
  // policy has already enforced that user must
  // be authenticated
  if (request.user.data.accountId) {
    // ...
  }
}
```

### Considerations of API Key Auth

The main difference between API Key auth and JWT token auth is that the JWT Token is self-contained - the information asserted by the token is in the token. Whereas with an API Key the asserted information is stored in an external system. The externalization of assertion data makes API Keys more flexible for certain scenarios.

- API Keys tend to be easier to work with for your partners, that's one of the reasons why businesses like Stripe, Twilio and Airtable use API Keys for their public API.
- Individual API Keys can be revoked - rather than resetting a whole client/customer.
- Permissions and expiration times of keys can be changed even after they are issued.
- API keys are opaque, so no details of your implementation or scoping system are visible externally.
- Because the key doesn't contain any information, the associated data for each key can effectively be limitless. For example, an API Key Authentication system could also assert that a particular token is allowed to access a particular account.
- API Keys can be issued without expirations and revoked only when needed (i.e., a customer cancels their account).

## Summary

Both JWT authentication and API Key authentication are good options when building a secure API. Each has benefits and drawbacks. JWT authentication is standardized and there are libraries you can use to implement API key authentication quickly. However it is typically more complex for your API consumers.

API Key authentication, on the other hand, tends to be extremely simple for developers to understand and implement and is popular with B2B SaaS businesses.

However, it can be non-trivial to implement an API Key management solution. You need to securely store (or hash) the API Keys, have a developer-facing UI where consumers can self-serve and roll keys on demand.

## About Zuplo

Zuplo is the Programmable API Gateway. With Zuplo you can quickly secure your API with API Keys, add rate limiting, get developer documentation and more in minutes. And because you can write code that runs on the Gateway - you can customize Zuplo for any possible business case you face. [Give Zuplo a try](https://portal.zuplo.com)
