---
title: Zero Downtime migration of API Authentication
authors: nate
tags: [api, auth, migrate]
description: |
  Learn how Zuplo's API Gateway helps build the right abstraction of your services in order to allow zero-downtime migration of authentication providers.
image: https://og-image.zuplo.com/?text=Migrating%20API%20Auth%20with%20Zero%20Downtime
---

One of the biggest benefits of an API Gateway is that it provides an abstraction
layer between your clients and your implementation. This layer allows your
backend to be unaware of various API implementations and configurations,
including authentication, authorization, and rate limits. This separation of
concerns also makes it possible to swap out specific implementations in a single
place - your gateway - without having to rewrite a large amount of backend code.

We have assisted Zuplo customers with migrating to new authorization providers,
such as switching from AWS Cognito to Auth0, or to an entirely new authorization
system, such as moving from JWT to API Keys. Typically, this type of migration
would require changes to your API implementation. In the simple case where you
have a single service, this might be fairly straightforward. However, in
practice, customers often have many services, each of which needs to implement
the same authentication service. Regardless, an API gateway can greatly simplify
the migration process.

## Separation of Concerns

When migrating authorization providers, the first step is to ensure a clean
separation of concerns. This means that only the API gateway should handle
client-facing authorization. By cleanly separating the layers, future changes
will be much easier to make.

A pattern we often recommend to customers who are migrating to an API gateway is
to pass authorization information to the backend via an HTTP header. This model
means that your backend trusts the API gateway to have already authenticated the
client - this is referred to as a trusted subsystem design.

What this means is that instead of the backend service receiving say the
`Authorization` header directly from the client, it would receive something like
a `custom-user-id` header that would contain the user’s ID (or sub, etc.). Your
service would be setup to trust that the request from the gateway is
pre-authorized. Of course this requires the establishment of a trusted
relationship between the gateway and your service. Setting that up is beyond the
scope of this article, but you can see
[options supported with Zuplo in our documentation](https://zuplo.com/docs/articles/securing-your-backend).

![Auth Diagram](auth-diagram.png)

## Authorization at the Gateway

With the backend service setup to trust the user information from the gateway,
the next step is to actually perform the authorization for your current
authorization provider. With Zuplo this is typically done using one of our
built-in policies like
[Auth0](http://localhost:3002/docs/policies/auth0-jwt-auth-inbound) or
[AWS Cognito](http://localhost:3002/docs/policies/cognito-jwt-auth-inbound) JWT
authentication.

![AWS Cognito Policy](cognit-auth-policy.png)

With authorization handled, the gateway next needs to be configured to pass the
user information to the backend. In Zuplo this can be done by adding a
[Custom Code Inbound](https://zuplo.com/docs/policies/custom-code-inbound)
policy. This policy is configured to take the `user.sub` value that was
extracted from the JWT token and add it to the `custom-user-id` header. The
policy's code is shown below.

```ts
import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

export default async function (request: ZuploRequest, context: ZuploContext) {
  const headers = new Headers(request.headers);
  headers.set("custom-user-id", request.user.sub);
  return new ZuploRequest(request, { headers });
}
```

With these steps in place the current authentication provider is now running on
the gateway and the backend receives the authorization information via headers.

## Multiple Authorization Providers

In order to migrate clients to the new authentication provider with zero
downtime, it is necessary to support multiple authentication providers for a
period of time. With Zuplo this is extremely easy. By default, the authorization
policies in Zuplo are configured to return unauthorized responses if the request
doesn’t contain valid authorization credentials (i.e. a JWT on the
`Authorization` header). However, each provider can be configured to allow
unauthenticated requests, thus allowing multiple providers to attempt to
authenticate the request.

To change the first authentication policy set the the
`allowUnauthenticatedRequests` property on the policy to `true`.

```json
{
  "name": "my-cognito-jwt-auth-inbound-policy",
  "policyType": "cognito-jwt-auth-inbound",
  "handler": {
    "export": "CognitoJwtInboundPolicy",
    "module": "$import(@zuplo/runtime)",
    "options": {
      "allowUnauthenticatedRequests": true,
      "region": "$env(AWS_REGION)",
      "userPoolId": "$env(AWS_COGNITO_USER_POOL_ID)"
    }
  }
}
```

Next, add a second authentication policy. This policy will also have the
`allowUnathenticatedRequests` property set to `true`.

```json
{
  "name": "my-auth0-jwt-auth-inbound-policy",
  "policyType": "auth0-jwt-auth-inbound",
  "handler": {
    "export": "Auth0JwtInboundPolicy",
    "module": "$import(@zuplo/runtime)",
    "options": {
      "allowUnauthenticatedRequests": true,
      "auth0Domain": "$env(AUTH0_DOMAIN)",
      "audience": "$env(AUTH0_AUDIENCE)"
    }
  }
}
```

Now with both of these policies set to allow unauthenticated requests, the API
is left unsecured - both policies will allow requests even if the user is not
authenticated. In order to require that each request is authenticated, we need
to add a third policy that runs after both of these policies that enforces
authentication. This can be done with a second
[Custom Code Inbound](https://zuplo.com/docs/policies/custom-code-inbound)
policy. The below example custom policy checks if the user sub is set, if it
isn’t it means neither auth policy succeeded so we return unauthorized.

```ts
import { ZuploRequest, HttpProblems } from "@zuplo/runtime";

export default async function (request: ZuploRequest, context: ZuploContext) {
  if (!request.user.sub) {
    return HttpProblems.unauthorized(request, context);
  }
  return request;
}
```

:::note

For more information about the `HttpProblems` helper see
[documentation](https://zuplo.com/docs/articles/http-problems)

:::

## Migrating Clients + Cleanup

With your API gateway now supporting both authentication providers, clients can
be migrated to use the new provider. Once all the clients are migrated, the old
provider can be removed. You can also remove the custom authorization policy and
set the one authentication policy’s property `allowUnauthenticatedRequests` to
`false`.

If you need to encourage your clients to migrate to the new authentication
policy see our
[post on versioning an API for some helpful tips](https://zuplo.com/blog/2022/05/25/how-to-get-clients-to-move-off-old-version-of-api).
