:::tip The outbound policy will only execute if the response status code is 'ok'
(e.g. `response.ok === true` or the status code is 200-299) - see
[response.ok on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Response/ok).
:::

### Writing A Policy

Custom policies can be written to extend the functionality of your gateway. This
document is about outbound policies that can intercept the request and, if
required, modify it before passing down the chain.

The outbound custom policy is similar to the inbound custom policy but also
accepts a `Response` parameter. The outbound policy must return a valid
`Response` (or throw an error, which will result in a 500 Internal Server Error
for your consumer, not recommended).

:::tip

Note that both `ZuploRequest` and `Response` are based on the web standards
[Request](https://developer.mozilla.org/en-US/docs/Web/API/request) and
[Response](https://developer.mozilla.org/en-US/docs/Web/API/Response).
ZuploRequest adds a few additional properties for convenience, like `user` and
`params`.

:::

```ts
export type OutboundPolicyHandler<TOptions = any> = (
  response: Response,
  request: ZuploRequest,
  context: ZuploContext,
  options: TOptions,
  policyName: string,
) => Promise<ZuploRequest | Response>;
```

A common use case for outbound policies is to change the body of the response.
In this example, we'll imagine we are proxying the `/todos` example api at
[https://jsonplaceholder.typicode.com/todos](https://jsonplaceholder.typicode.com/todos).

The format of the /todos response looks like this

```json
[
  {
    "userId": 1,
    "id": 1,
    "title": "delectus aut autem",
    "completed": false
  },
  {
    "userId": 1,
    "id": 2,
    "title": "quis ut nam facilis et officia qui",
    "completed": false
  },
```

We will write an outbound policy that does two things

1. Removes the `userId` property
2. Adds a new outbound header called `color`

Here's the code:

```ts
// /modules/my-first-policy.ts
export default async function (
  response: Response,
  request: ZuploRequest,
  context: ZuploContext,
  options: any,
  policyName: string,
) {
  if (response.status !== 200) {
    // if we get an unexpected response code, something went wrong, just let the response flow
    return response;
  }

  const data = (await response.json()) as any[]; // we know this is JSON and an array
  data.forEach((item) => {
    delete item.userId;
  });

  // create a new response
  const newResponse = new Response(JSON.stringify(data), {
    status: response.status,
    headers: response.headers,
  });

  // let's add an additional header as an example, for good measure
  newResponse.headers.set("color", "yellow");

  return newResponse;
}
```

:::tip

Note, that because we're not using the original response here (we just use the
new one called `newResponse`) we didn't need to `clone` the original response
before reading the body with `.json()`. If you need to read the body and use
that same instance you must first `clone()` to avoid runtime errors such as
"Body is unusable".

:::

## Wiring up the policy on routes

Policies are activated by specifying them on routes in the route.oas.json file.
Here's how we could wire up our new route:

```json
// /config/policies.json
{
  "policies": [
    {
      "name": "my-first-policy",
      "policyType": "custom-code-outbound",
      "handler": {
        "export": "default",
        "module": "$import(./modules/my-first-policy)"
      }
    }
  ]
}
```

```json
// /config/routes.oas.json
{
  ...
  "paths": {
  "x-zuplo-path": {
    "pathMode": "open-api"
  },
  "get": {
    "summary": "New Route",
    "description": "",
    "x-zuplo-route": {
      "corsPolicy": "none",
      "handler": {
        "export": "urlForwardHandler",
        "module": "$import(@zuplo/runtime)",
        "options": {
          "baseUrl": "https://getting-started.zuplo.io"
        }
      },
      "policies": {
        "inbound": [],
        "outbound": [
          "my-first-policy",
        ]
      }
    },
}

}
```

### Policy Options

In your policy configuration, you can specify additional information to
configure your policy on the options property. In the example below we set an
example object with some properties of type string and number. Note these
objects can be as complicated as you like.

```json
{
  "name": "my-first-policy",
  "policyType": "custom-code-outbound",
  "handler": {
    "export": "default",
    "module": "$import(./modules/my-first-policy)",
    "options": {
      "you": "can",
      "specify": "anything",
      "here": 0
    }
  }
}
```

The value of this property will be passed to your policy's handler as the
`options` parameter. Sometimes it's useful to create a type as shown below.

```ts
type MyPolicyOptionsType = {
  you: string;
  specify: string;
  here: number;
};
export default async function (
  response: Response,
  request: ZuploRequest,
  context: ZuploContext,
  options: MyPolicyOptionsType,
  policyName: string,
) {
  // your policy code goes here, and can use the options to perform any
  // configuration
  context.log.info(options.you);
}
```

You can also use the `any` type if you prefer not to create a type.

## Adding headers

Note if you just need to add headers, it more efficient not read the body stream
and reuse it, e.g.

```ts
export default async function (
  response: Response,
  request: ZuploRequest,
  context: ZuploContext,
  options: any,
  policyName: string,
) {
  // create a new response
  const newResponse = new Response(response.body, {
    status: response.status,
    headers: response.headers,
  });

  // let's add an additional header as an example, for good measure
  newResponse.headers.set("color", "yellow");

  return newResponse;
}
```
