---
title: OAuth Authentication
---

Zuplo comes with build-in and extensible OAuth policies out of the box. These
policies allow you to easily authenticate requests using popular services like
Auth0, AWS Cognito, and more.

Some of the built-in policies are listed below.

- [OpenId JWT Authentication Policy](../policies/open-id-jwt-auth-inbound.md)
- [Auth0 JWT Authentication Policy](../policies/auth0-jwt-auth-inbound.md)
- [Okta JWT Authentication Policy](../policies/okta-jwt-auth-inbound.md)
- [AWS Cognito JWT Authentication Policy](../policies/cognito-jwt-auth-inbound.md)

## Request User

The OAuth policies will validate and decode the incoming JWT and add the data
from the JWT. If the user is successfully authenticated the claims of their JWT
`access_token` will be available on the `request.user` object.

The user's identifier (also known as the `sub` or subject) is available on the
`request.user.sub` property. Other claims can be found on the
`request.user.data` object as demonstrated below.

```ts
async function (request: ZuploRequest, context: ZuploContext) {
  // Log the user's sub
  context.log.debug(`User ${request.user.sub} is authenticated`)

  // Check a custom claim
  if (request.user.data["orgId"] === "1234") {
    // do something
  }
}
```

## Authorization Header

The built-in policies will validate the incoming JWT on the Authorization
header. By default, the Authorization header will be left on the request and
forwarded on to your backend.

It isn't recommended to validate the Access Token on both the gateway and the
backend. However, by forwarding the header to the backend you can transition
your API from doing authentication on your backend to authorizing at the
Gateway. See
[this blog post](https://zuplo.com/blog/2023/07/16/zero-downtime-api-auth-migration)
for more details.

If you would like to remove the authorization header after you use one of the
authorization policies, simply add the
[Remove Request Headers](/docs/policies/remove-headers-inbound) policy after the
authorization policy and set it to remove the `Authorization` header.
