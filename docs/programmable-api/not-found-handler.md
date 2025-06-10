---
title: Custom Not Found Handler
---

By default, Zuplo will return a 404 (using [problem details](./http-problems))
if no matching `path/method` combination is found. You can override this
behavior by adding code to the `zuplo.runtime.ts` file (see
[runtime extensions](./runtime-extensions)).

For example - a custom not found handler can be used to return a
`405 - Method Not Allowed` if a matching path is found, but no matching METHOD,
here is an example function that would implement this behavior:

```ts
export function runtimeInit(runtime: RuntimeExtensions) {
  //add a custom not found handler
  runtime.notFoundHandler = async (request, context, notFoundOptions) => {
    if (notFoundOptions.routesMatchedByPathOnly.length > 0) {
      // It's required to have an 'Allow' header with a 405 response
      // Generate a string of allowed methods
      const allowedMethods = notFoundOptions.routesMatchedByPathOnly
        .map((route) => route.methods)
        .reduce((acc, val) => acc.concat(val), [])
        .join(", ");

      return HttpProblems.methodNotAllowed(
        request,
        context,
        {},
        { allow: allowedMethods },
      );
    }

    return HttpProblems.notFound(request, context);
  };
}
```

:::warning

An error in your `zuplo.runtime.ts` can break your gateway for all requests. Be
sure to carefully review any custom code in this file and add generous error
handling where appropriate.

:::
