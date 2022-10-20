---
title: Using Cloudflare Workers to Optimize Auth0 Universal Login
authors: nate
tags: [code, auth0, cloudflare, cloudflare workers]
description: Use Cloudflare Workers to force Auth0 to use a single connection for every authorization request.
---

Auth0 is still one of the best ways to add authorization to your app. However, one minor annoyance I have found is that there is no way to force every login to use a single identity provider (i.e. connection) without configuring each client with the `connection` [parameter](https://auth0.com/docs/get-started/authentication-and-authorization-flow/add-login-auth-code-flow#:~:text=connection,of%20your%20application.). So even for an app that only allows users to login with a single social connection (i.e. Google) users will still see the Auth0 login picker by default.

![](https://cdn.zuplo.com/assets/36dd7e7f-3347-4894-9d6a-3bd98a70c040.png)

With Cloudflare Workers and an Auth0 custom domain it is easy to fix this issue. After you setup your custom domain, you need to make sure you are [proxying the `CNAME` through Cloudflare](https://developers.cloudflare.com/dns/manage-dns-records/reference/proxied-dns-records/).

![](https://cdn.zuplo.com/assets/846189d3-7e55-4ad2-a25d-416fceaffdbe.png)

Next, create a simple Cloudflare Worker with the following code.

```ts
export default {
  async fetch(request, env) {
    return await handleRequest(request);
  },
};

const AUTH0_CONNECTION = "my-connection";

async function handleRequest(request) {
  const url = new URL(request.url);
  // Checking path just in case, but this
  // worker should only run on this path
  if (url.pathname === "/authorize") {
    if (url.searchParams.get("connection")) {
      return fetch(request);
    } else {
      url.searchParams.set("connection", AUTH0_CONNECTION);
      const newRequest = new Request(url.toString(), new Request(request));
      return fetch(newRequest);
    }
  }
  return fetch(request);
}
```

Finally, configure a Route for the Cloudflare worker to run on the `/authorize` path. The route should look like this: `my-cname.example.com/authorize*`. Make sure to put the `*` at the end; otherwise, requests with the query parameters will not be sent to the worker.

![](https://cdn.zuplo.com/assets/5d209496-6256-4d5a-aec2-a942d858c894.png)

When a request comes to the regular `/authorize` URL to start an OAuth flow, the `connection` query parameter is added automatically. Every user will skip the Auth0 login page and immediately go to the login page of the specified connection.

One word of caution, I am unsure if Auth0 supports this configuration. It works for me, but Auth0 could make changes that break this at some point.

Hopefully, this helps solve a minor annoyance you might have with Auth0.
