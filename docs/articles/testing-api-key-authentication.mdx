---
title: Testing API Key Authentication
---

When running tests there are several ways you might want to handle API Key
authentication. This document outlines a few strategies for testing with API Key
authentication both locally and in deployed environments.

## Testing Locally

When running API key Authentication locally, if you
[link the project](/docs/cli/local-development) to an project the same API Key
The same bucket will be shared by both your development (working copy)
environment and local development.

## Setting the API Key Bucket Name

Either locally or in CI/CD you can specify any API Key Bucket on the
[API Key Authentication](/docs/policies/api-key-inbound) policy by setting the
`bucketName` property. This allows using a consistent API Key Bucket that's
setup with consumers, etc. as required for testing. You can use the
[Zuplo Developer API](https://dev.zuplo.com) to
[create and manage buckets](/docs/articles/api-key-management), consumers, keys,
etc.

## Selectively Disabling

:::danger

Be extremely careful using this strategy. If configured incorrectly this could
leave your API open to unauthorized access.

:::

Another option is to disable authentication on endpoints for testing purposes.
One way of doing this is to configure the
[API Key Authentication](/docs/policies/api-key-inbound) policy to allow
unauthenticated requests through. This can be done by setting
`allowUnauthenticatedRequests` to true.

In order to enforce authentication with this setting disabled, you can create a
policy that comes after that selectively enforces auth based on some condition.

For example, an environment variable flag could be used to disable auth with the
following policy.

```ts
import {
  ZuploContext,
  ZuploRequest,
  environment,
  HttpProblems,
} from "@zuplo/runtime";

export default async function enforceAuth(
  request: ZuploRequest,
  context: ZuploContext,
) {
  if (environment.DISABLE_AUTH === "AUTH_DISABLED") {
    return request;
  }

  if (!request.user) {
    return HttpProblems.unauthorized(request, context);
  }

  return request;
}
```
