By default, Zuplo will read the `request.user.sub` property and assign this as
the moesif `user_id` attribute when sending to Moesif. However, this and the
following attributes can be overriden in a
[custom code policy](/docs/policies/custom-code-inbound).

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

## Execute on every route

If you want to execute this policy on every route, you can add a hook in your
[runtime extensions](/docs/articles/runtime-extensions) file `zuplo.runtime.ts`:

```ts
import { RuntimeExtensions } from "@zuplo/runtime";

export function runtimeInit(runtime: RuntimeExtensions) {
  runtime.addRequestHook((request, context) => {
    return context.invokeInboundPolicy("moesif-inbound", request);
  });
}
```

Note you can add a guard clause around the context.invokeInboundPolicy if you
want to exclude a few routes.
