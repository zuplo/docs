---
title: Policies
---

Policies are modules that can intercept an incoming request. You can have
multiple policies and apply them to multiple routes. There are built-in policies
but of course, being a developer-focused platform you can easily create custom
policies.

## Built-in Policies

[Rate-Limit Policy](/policies/rate-limit)

[Open ID JWT Authentication Policy](/policies/open-id-jwt)

[Validate JSON Schema Policy](/policies/json-schema-validation)

[Basic Authentication Policy](/policies/basic-auth)

## How policies work

![How Policies Work](/media/policies/Untitled.png)

A policy can intercept a request and modify the request before it reaches the
request handler (and the next policy). It can also short-circuit the whole
request lifecycle and immediately respond to the client.

Policies have a similar but subtly different signature to a request handler.
They also accept a `ZuploRequest` parameter but they must return either a
`ZuploRequest` or a `Response`. Returning a `ZuploRequest` is a signal to
continue the request pipeline and what you return will be passed to the next
policy, and finally the request handler.

If you return a `Response` that tells Zuplo to short-circuit this request and
immediately respond to the client.

```ts
export type InboundPolicyHandler<TOptions = any> = (
  request: ZuploRequest,
  context: ZuploContext,
  options: TOptions,
  policyName: string
) => Promise<ZuploRequest | Response>;
```

A common use case for policies is authentication. In the following example we'll
create a simple auth policy that checks for an `api-key` header:

## A simple auth policy

```ts
// my-first-policy.ts
import { ZuploRequest } from "@zuplo/runtime";

export default async function(
	request: ZuploRequest,
	context: ZuploContext
	options: any,
	policyName: string) {
  	const apiKeyHeader = request.headers.get("api-key");
	if (!apiKeyHeader) {
		return new Response(`No api-key header`, { status: 401});
	}
	if (apiKeyHeader !== `magic-password`) {
		return new Response(`Incorrect API Key`, { status: 401});
	}
	// TODO - lets set the user property on the request for
	// downstream consumption
	return request;
}
```

This policy checks for an `api-key` header and rejects requests that don't have
one. If such a header is found, it then checks the content of the header for a
magic password\*.

> - this is not a best-practice implementation of a security policy - just an
>   example of the power of policies.

## Wiring up the policy on routes

Policies are activated by specifying them on routes in the route.json file
(designer support for this is coming soon). Here's how we could wire up our new
auth route:

```json
{
  "routes": [
    {
      "label": "What zup?",
      "path": "hello-world",
      "handler": {
        "export": "default",
        "module": "$import(./modules/hello-world)"
      },
      "methods": ["GET", "POST"],
      "corsPolicy": "AnythingGoes",
      "version": "none",
      "policies": {
        "inbound": [
          "my-first-policy" // ⬅ Note we specify the policy here
        ]
      }
    }
  ],
  "versions": [
    {
      "name": "none",
      "pathPrefix": ""
    }
  ],
  "policies": [
    {
      "name": "my-first-policy",
      "policyType": "custom-code",
      "handler": {
        "export": "default",
        "module": "$import(./modules/my-first-policy)"
      }
    }
  ]
}
```

See the gif below to see the flow end-to-end:

![](/media/policies/2021-11-21_21.32.35.gif)

## Policy Options

In your policy configuration you can specify additional information to configure
your policy on the options property. In the example below we set an example
object with some properties of type string and number. Note these objects can be
as complicated as you like.

```json
{
  "name": "my-first-policy",
  "policyType": "custom-code",
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
  request: ZuploRequest,
  context: ZuploContext,
  options: MyPolicyOptionsType,
  policyName: string
) {
  // your policy code goes here, and can use the options to perform any
  // configuration
  context.log.info(options.you);
}
```

You can also use the `any` type if you prefer not to create a type.

## Setting the user property

When building a policy it's common to modify the request object in some way
before passing control downstream. The `ZuploRequest` type has a `user` property
that is not set for unauthenticated requests. Authenticated requests should have
a valid `user` property. Since this an authentication policy, we should set that
property before passing control to the next in line.

The user object should have a `sub` property which is a unique user id. Let's
use Zuplo's policy `options` to extend our example.

You can pass options to a policy from the routes.json file. In this case we'll
create a dictionary of api keys to `sub` ids.

```json
"policies": [
    {
      "name": "my-first-policy",
      "policyType": "custom-code",
      "handler": {
        "export": "default",
        "module": "$import(./modules/my-first-policy)",
				// some options that will be passed to our Policy
				"options": {
					"123" : "sub-1",
					"abc" : "sub-2"
				}
      }
    }
  ]
```

Now let's update the policy to read these options and use the dictionary keys as
the `api-key` and to map the sub identifier.

```ts
import { ZuploRequest, ZuploContext, ResponseFactory } from "@zuplo/runtime";

export default async function (
  request: ZuploRequest,
  context: ZuploContext,
  options: any,
  policyName: string
) {
  const apiKeyHeader = request.headers.get("api-key");
  if (!apiKeyHeader) {
    return new Response(`No api-key header`, { status: 401 });
  }

  const matchedKey = options[apiKeyHeader];

  if (matchedKey === undefined) {
    return new Response(`Incorrect API Key`, { status: 401 });
  }

  request.user = { sub: matchedKey };

  return request;
}
```

We can then use this user object in the request handler

```ts
import { ZuploRequest } from "@zuplo/runtime";

export default async function (request: ZuploRequest) {
  // let's return the user sub to the client as proof it's working
  return `User sub ${request.user.sub}`;
}
```

Here is this example working as a gif

![](/media/policies/2021-11-21_21.44.35.gif)

![](/media/policies/policy-diagram1.png)

## Limitations of policies today

1. You cannot create an outbound policy today, inbound only. Recommendation -
   use a request handler to modify your response etc.
2. You cannot create a completely new request in an inbound policy today, only
   change the current one. We need to update this capability ASAP.
