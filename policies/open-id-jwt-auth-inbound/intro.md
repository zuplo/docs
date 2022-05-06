The Open ID JWT Authentication policy allows you to authenticate incoming
requests using an Open ID compliant bearer token. It works with common
authentication services like Auth0 (sample here) but should also work with any valid Open ID JWT token.

When configured, you can have Zuplo check incoming requests for a JWT token and automatically populate the `ZuploRequest` 's `user` property with a user object. This `user` object will have a `sub` property - taking the `sub` id from the JWT token. It will also have a `data` property populated by other data returned in the JWT token (including any claims).
