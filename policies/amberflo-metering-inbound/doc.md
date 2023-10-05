By default, Zuplo will read the `request.user.sub` property and assign this as
the moesif `user_id` attribute when sending to Moesif. However, this and the
following attributes can be overriden in a
[custom code policy](/policies/custom-code-inbound).

- `api_version`
- `company_id`
- `session_token`
- `user_id`
- `metadata`

Here is some example code that shows how to override two of these attributes

```ts
setMoesifContext(context, {
  userId: "user-1234",
  metadata: {
    some: "arbitrary",
    meta: "data",
  },
});
```
