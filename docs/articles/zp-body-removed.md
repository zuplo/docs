---
title: zp-body-removed
sidebar_label: zp-body-removed
---

Zuplo does not support GET or HEAD requests with bodies. This is because the
product is based on web standards and our stack makes heavy use of
[fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) which
explicitly does not support GET, HEAD requests with a body.

For this reason, any body of a GET/HEAD request is stripped on entry into Zuplo
infrastructure and a header `zp-body-removed` is added to the request.

This allows your origin/backend server to know that a body was removed. If you
want to enforce this and reject such requests it is easy to write a custom
policy that looks for a `zp-body-removed` header and return a response, e.g.

```ts
import { HttpProblems, ZuploContext, ZuploRequest } from "@zuplo/runtime";

export default async function (request: ZuploRequest, context: ZuploContext) {
  const bodyRemoved = request.headers.get("zp-body-removed");

  if (bodyRemoved) {
    return HttpProblems.badRequest(request, context, {
      detail: `GET or HEAD requests cannot have a body.`,
    });
  }

  return request;
}
```
