---
title: Proxy a simple GET request
---

## Test it out by proxying a web page

The most common use-case for Zuplo is to proxy an existing API to add security,
rate-limiting and shape your API to be more friendly to your clients.

Proxying an API is easy, in this case we'll proxy the simple HTML page at
https://www.example.com

> **Note** - this sample is available as a Zup It on GitHub - just click ZupIt!
> to deploy to your Zuplo account: https://github.com/zuplo/samples-simple-proxy

Create a simple Request Handler as follows:

```ts
export async function fetchHtml(request: ZuploRequest, context: ZuploContext) {
  return await fetch("https://www.example.com/");
}
```

> Note - this export is not the 'default' export, it has the name `fetchHtml` so
> in the routes.json file it should be specified as follows:

> Note - look how we return the full response in the example above, not just the
> body. That works great.

Let's create a new route that maps to that Request Handler.

```json
{
  "path": "simple-fetch",
  "methods": ["GET", "POST"],
  "handler": {
    "module": "$import(./modules/your-module)",
    "export": "fetchHtml" // use the export name
  },
  "version": "none",
  "corsPolicy": "AnythingGoes"
}
```

You can now test this in the test client, as shown in the gif below:

![2021-11-21 20.12.10.gif](/media/docs/guides/proxy-a-simple-get-request/2021-11-21_20.12.10.gif)

## Forwarding headers

It’s often important to forward headers to downstream clients. However, some
incoming headers should be stripped to avoid issues, like `host`.Here’s an
example:

```ts
function headersAsRecord(headers: Headers, ...removeKeys: string[]) {
  const newHeaders: Record<string, string> = {};
  for (const [key, value] of headers.entries()) {
    if (!removeKeys.includes(key)) {
      newHeaders[key] = value;
    }
  }
  return newHeaders;
}

export async function fetchHtml(request: ZuploRequest, context: ZuploContext) {

	const headers = headersAsRecord(request.headers, "host");

  return await fetch("https://www.example.com/", {
		headers: headers;
	});
}

```

## Proxying and shaping an API

We can do much more complex work in Zuplo - using the full power of
TypeScript/JavaScript to modify an API.

In this exercise we're going to take two API requests and join their responses
into a single body.

To do this, we're going to use a sample API calls JSONPlaceHolder - this is a
free API that has canned responses and is handy for testing and experimentation.

We'll use two of JSONPlaceholder's APIS: `/posts` and `/users` - you can see
them here, example data shown too:

[https://jsonplaceholder.typicode.com/posts](https://jsonplaceholder.typicode.com/posts)

```json
[
  {
    "userId": 1,
    "id": 1,
    "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
    "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
  },
```

[https://jsonplaceholder.typicode.com/users](https://jsonplaceholder.typicode.com/users)

```json
[
  {
    "id": 1,
    "name": "Leanne Graham",
    "username": "Bret",
    "email": "Sincere@april.biz",
    "address": {
      "street": "Kulas Light",
      "suite": "Apt. 556",
      "city": "Gwenborough",
      "zipcode": "92998-3874",
      "geo": {
        "lat": "-37.3159",
        "lng": "81.1496"
      }
    },
```

We'll use Zuplo to change these into a single API call that expands the user
property on each post object, with the following Request Handler:

```ts
import { ZuploRequest, ZuploContext } from "@zuplo/runtime";

export default async function (request: ZuploRequest, context: ZuploContext) {
  const userResponse = await fetch(
    "https://jsonplaceholder.typicode.com/users"
  );
  const postResponse = await fetch(
    "https://jsonplaceholder.typicode.com/posts"
  );

  // read the JSON bodies
  const users = await userResponse.json();
  const posts = await postResponse.json();

  // join the two responses using JavaScript's map function
  const joined = posts.map((p) => {
    const user = users.find((u) => u.id === p.userId);
    // delete the userId property from the post
    delete p.userId;
    p.user = user;
    return p;
  });

  return joined;
}
```

As shown in the gif below:

![2021-11-21 20.34.38.gif](/media/docs/guides/proxy-a-simple-get-request/2021-11-21_20.34.38.gif)

For more advanced proxy capabilities, like adding security to APIs or more,
check out [Policies](/policies).
