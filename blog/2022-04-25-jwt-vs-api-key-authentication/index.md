---
title: JWT vs API Key Auth for Machine to Machine APIs
authors: nate
tags: [apis, authentication, code]
date: 2022-04-25
---

Authorizing other services (i.e. "machines") to call your API is typically done with either JWT tokens or API Keys. The reason to use one or the other varies by your use. This post will explain the pros and cons of each and suggest when each one is a good fit for securing your API.

## JWT Based Machine to Machine Authentication

JWT authentication typically uses an OAuth 2.0 identity provider such as Auth0, AWS Cognito, etc. The identity provider issues tokens after validating the clients are who they say they are.

[![Client Credentials sequence](./auth-sequence-client-credentials.png)](https://auth0.com/docs/get-started/authentication-and-authorization-flow/client-credentials-flow)

When the client sends a request to the API it includes the JWT in the request's `Authorization` header. The API then validates the JWT to be authentic and can then use the information in the JWT to identify the client. Typically the JWT contains a `sub` parameter that identifies the client. The token also includes a `aud` parameter that specifies which API the token can call.

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

JWT-based API auth is a good choice for securing microservices, implementing services within an organization, or sharing APIs with certain types of external clients.

- JWT tokens are typically not revokable. In order to prevent a JWT token from calling an API, you must roll the secrets of that client - this will disable ALL JWT tokens currently issued.
- Permissions with JWT tokens are managed at the identity provider level, meaning that all tokens issued for the same client will have the same permissions.
- JWT tokens are static; permissions, expiration time, or other properties cannot change once the token is issued.
- JWT tokens should be kept relatively small in size (i.e., you don't want to put a list of all resources the client is authorized to access in the JTW token itself).
- When JWT tokens expire, the consumer must request a new token using the Client ID and Secret value.
- Identity Providers often charge based on the number of tokens issued.

## API Key Authentication

With API authentication, each client receives a unique secret key. Unlike JWT tokens, the key itself doesn't contain any actual data, it is simply a unique string associated with the client. Furthermore, there is no standard protocol for API Key authentication like OAuth, etc., so each implementation can differ.

The simplest example of API token authentication is an environment variable that is checked against each API request.

```js
function myApiHandler(request) {
  if (request.headers.get("API-Key") !== process.env.API_KEY) {
    throw new Error("Not authorized");
  }
  // ...
}
```

However, most API Key authentication systems offer more advanced management of keys. For example, an API Gateway could offer a self-serve portal where end-users issue tokens based on permissions and configuration that the API developer has set. Tokens can be issued with various permissions and with custom expirations times.

A typical API Key authentication system will validate each key as it comes in with a request. If the key is valid, then data is returned with that key. This data could be identity information, permissions, and even details about their allowed use of the API, such as rate limits or IP restrictions.

```
function myApiHandler(request) {
  const apiKey = request.headers.get("API-Key");
  const apiKeyInfo = apiKeyService.validate(apiKey);

  // Check various properties of the api key info
  if (clientInfo?.accountId) {
    // ...
  }
}
```

### Layered Permissions

One of the most powerful capabilities of API Key authentication is the ability to build "layered" permission capabilities into your API. For example, you, as the API owner, could authorize a customer to create API Keys with permissions like `read:products` and `write:products`. The customer could go into their self-serve portal and issue a token with both permissions, but they could also issue a token with a sub-set of permissions. The benefit of this layered approach is that each token has only the permissions needed for its specific function.

![Token Scopes](./token_scopes.gif)

### Considerations of API Key Auth

The main difference between API Key auth and JWT token auth is that the JWT Token is self-contained - the information asserted by the token is in the token. Whereas with an API Key the asserted information is stored in an external system. The externalization of assertion data makes API Keys more flexible for certain scenarios.

- Simpler for end-users to use and understand.
- Individual keys can be revoked.
- Permissions and expiration times of keys can be changed even after they are issued.
- Permissions can be layered/customized at different levels
- Because the key doesn't contain any information, the associated data for each key can effectively be limitless. For example, an API Key Authentication system could also assert that a particular token is allowed to access a particular account.
- API Keys can be issued without expirations and revoked only when needed (i.e., a customer cancels their account).

## Summary

Both JWT authentication and API Key authentication are helpful tools when building a secure API. Each one has benefits and drawbacks. API Key authentication tends to be extremely simple for end-users to understand and get started using your API. Still, it is not a standardized protocol and can be more challenging to implement. JWT tends to be more difficult for end-users, but because it is standards-based and so common, it is likely already supported by the framework in which you build your APIs.

## About Zuplo

Zuplo is the Programmable API Gateway. With Zuplo you can quickly secure your API with API Keys, add rate limiting, and more in minutes. And because you can write code that runs on the Gateway - you can customize Zuplo for any possible business case you face. [Give Zuplo a try](https://portal.zuplo.com)
