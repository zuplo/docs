The Set Body policy allows you to set or override the incoming request body.
[GET or HEAD requests do not support bodies on Zuplo](/docs/articles/zp-body-removed),
so be sure to use the [Change Method](/docs/policies/change-method-inbound)
policy to update the method to a `POST` or whatever is appropriate. You might
also need to use the [Set Header](/docs/policies/set-headers-inbound) policy to
set a `content-type`.
