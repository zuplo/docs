# Share code across request handlers and policies with modules

Sharing code across your request handlers and policies is easy with modules.
Simply create a new module with exports and import them to your other files.
Here's a module called `util.ts`:

```tsx
//util.ts
export function increment(n: number) {
  return n + 1;
}
```

Now in our request handler we can import this and reuse this code

```tsx
import { ZuploRequest, ZuploContext } from "@zuplo/runtime";
import { increment } from "./util";

export default async function (request: ZuploRequest, context: ZuploContext) {
  return increment(1);
}
```
