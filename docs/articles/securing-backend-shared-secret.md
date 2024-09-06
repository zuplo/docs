---
title: Securing your Backend with a Shared Secret
---

When using a gateway, it's important to ensure that your backend API only
accepts traffic from the gateway. This ensures that policies and security are
applied to all traffic. Zuplo offers
[multiple options for securing your backend](./securing-your-backend.md) API.
This article will show you the simplest option, which is using a shared secret
via a header.

## 1/ Set an Environment Variable

The first step is to set an
[environment variable](https://zuplo.com/docs/articles/environment-variables) in
your Zuplo project. This variable will be a secret that only your Zuplo project
and your backend know. This secret will be sent as a header on every request to
your backend API.

Open the _Settings_ section of your project and select _Environment Variables_.
Create a new variable and name it `BACKEND_SECRET`. Set the value to a secure,
random value. Ensure that the value is marked as a secret.

![Set Environment Variable](../../public/media/securing-backend-shared-secret/image.png)

## 2/ Create a Set Header Policy

The next step is to create a policy that sets the `BACKEND_SECRET` as a header
on the request to your backend API. This policy will be an outbound policy that
runs before the request is sent to your backend.

Navigate to the route you want to secure and add a new policy. Select the **Add
or Set Request Headers** policy type and configure it as follows:

![Set Header Policy](../../public/media/securing-backend-shared-secret/image-1.png)

The configuration uses the environment variable via the `$env(BACKEND_SECRET)`
selector as shown below.

```json
{
  "name": "set-backend-secret",
  "policyType": "set-headers-inbound",
  "handler": {
    "export": "SetHeadersInboundPolicy",
    "module": "$import(@zuplo/runtime)",
    "options": {
      "headers": [
        {
          "name": "backend-secret",
          "value": "$env(BACKEND_SECRET)"
        }
      ]
    }
  }
}
```

Add this policy to any of the routes in your API that are calling your secure
backend.

## 3/ Verify the Secret on your Backend

Finally, you need to verify the secret on your backend. The way you implement
this depends on the framework and language you are using, but the typical
pattern is to use a middleware to check the header value. If the header does not
match the secret, you would typically return a 401 Unauthorized response.

An example of this using a Node.js connect middleware is shown below.

```js
const express = require("express");
const app = express();

app.use((req, res, next) => {
  if (req.headers["backend-secret"] !== process.env.BACKEND_SECRET) {
    return res.status(401).send("Unauthorized");
  }
  next();
});
```
