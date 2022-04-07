---
title: Proxy a request with a body (e.g. POST, PUT)
---

Proxying a request with a body is also simple, but requires a little more setup.
Specifically, you must set the body of the outbound fetch. If the body does not
need to be manipulated, the most efficient method is to set the outbound body to
the `request.body` property.

```ts
import { ZuploRequest, ZuploContext } from "@zuplo/runtime";

// route path = root/posts/:id
export default async function (request: ZuploRequest, context: ZuploContext) {
  const url = `https://jsonplaceholder.typicode.com/posts/${request.params.id}`;

  const result = fetch(url, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
    },
    body: request.body, // most efficient
  });

  return result;
}
```

If you want to modify the body, can either deserialize the body into an object
using `await request.json()` or to text using `await request.text()`.
