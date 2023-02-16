---
title: Handling Multiple Authentication Policies
sidebar_label: Multiple Auth Policies
---

Sometimes multiple types of authentication are needed on an API. For example, an API could support JWT Authentication and API Key authentication or two different OAuth providers (i.e. Azure AD for employees and Auth0 for partners). Configuring multiple policies in Zuplo can be done in several ways.

## JWT and API Key Authentication

JWT and API Key authentication can be handled by adding three policies to a route (or using [composite policies](../policies/composite-inbound.md) to keep everything organized). The three policies required are:

1. [API Key Authentication Policy](../policies/api-key-auth-inbound.md)
1. [Any JWT Authentication Policy](../policies/open-id-jwt-auth-inbound.md)
1. [A Custom Policy](../policies/custom-code-inbound.md)

:::warning

The order of these policies is critical. Placing them in the wrong order can cause errors or lead to security issues.

:::

All of the Zuplo built-in authentication policies have an option called `allowUnauthenticatedRequests`. This option is `true` by default, meaning for an anonymous request, the policy will immediately return a response with a 401: Unauthorized status. **In the case of multiple policies, this setting must be `false`.** This means that even if the request is NOT authenticated, the policy will still let the request through.

:::tip

The option `allowUnauthenticatedRequests` can also be used to make a route work for both authenticated and anonymous users. Allowing unauthenticated requests on a public API allows modifying behaviors based on the type of user. For example, rate limits could be set higher for authenticated users.

:::

In the route that handles multiple authentication policies, add the API Key Authentication policy and the JWT Authentication policy of your choice (i.e. Auth0, Okta, Cognito, etc.). For both policies, set the option `allowUnauthenticatedRequests` to `true`.

Configure the other options as usual.

Finally, if the route **requires** authentication, a third policy is necessary to enforce that after both authentication policies run, the request has been authenticated. Generally, this policy would come immediately **after** the two authentication policies.

To enforce authentication, check that the value of `request.user.sub` is as expected. Additional checks can be added as your API requires. Below is an example of a simple authentication check policy.

```ts
import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

export default async function (request: ZuploRequest, context: ZuploContext) {
  if (!request.user.sub) {
    return new Response("Unauthorized", { status: 401 });
  }
}
```

### Multiple JWT Authentication Policies

Multiple JWT authentication policies is slightly more challenging than adding JWT and API key authentication because JWT authentication performs validation on the token value. In some cases, the easiest approach is to write a custom policy that checks the issuer of the token first then applies validation appropriate for each issuer.
