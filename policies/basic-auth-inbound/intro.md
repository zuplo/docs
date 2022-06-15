The Basic Authentication policy allows you to authenticate incoming requests
using the Basic authentication standard. You can configure multiple accounts
with different passwords and a different bucket of user 'data'.

The API will expect a Basic Auth header (you can generate samples
[here](https://www.debugbear.com/basic-auth-header-generator)). Requests with
invalid credentials (or no header) will not be authenticated. Authenticated
requests will populate the `user` property of the `ZuploRequest` parameter on
your RequestHandler.
