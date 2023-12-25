The Supabase JWT Authentication policy allows you to authenticate incoming requests using a token created by [supabase.com](https://supabase.com)<!-- -->.

When configured, you can have Zuplo check incoming requests for a JWT token and automatically populate the `ZuploRequest`<!-- -->'s `user` property with a user object.

This `user` object will have a `sub` property - taking the `sub` id from the JWT token. It will also have a `data` property populated by other data returned in the JWT token - including all your claims, `user_metadata` and `app_metadata`<!-- -->.

You can also require specific claims to have specific values to allow authentication to complete, providing a layer of authorization.
