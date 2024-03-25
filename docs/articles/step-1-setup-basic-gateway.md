---
title: Step 1 - Setup a Basic Gateway
---

In this tutorial we'll setup a simple gateway. We'll use a demo API at
[todos.zuplo.io](https://todos.zuplo.io/todos) that acts as a todolist API.

This demo API is protected by an API key (sometimes called a shared secret) that
must be provided in an `api-key` header. Good news - given this is a demo API -
the key is provided in the unauthenticated error message.

To get started, sign in to [portal.zuplo.com](https://portal.zuplo.com) and
create a free account. Create a new **empty** project. Then...

:::tip Local Development

Zuplo also supports building and running your API locally. To learn more
[see the documentation](./local-development.md).

:::

## 1/ Add a route

Inside your new project, choose the `routes.oas.json` file and click **Add
Route**.

![Add Route](../../public/media/step-1-setup-basic-gateway/image.png)

Using the Route Designer, let's configure our first route to handle the
`GET /todos` route.

- Summary: `Get all todos`
- Method: `GET`
- Path: `/todos`
- [URL Forward](/docs/handlers/url-forward): `https://todos.zuplo.io`

![Get all todos](../../public/media/step-1-setup-basic-gateway/image-1.png)

Save your changes (you can click the disk icon next to `routes.oas.json` or
press CMD+S).

You can quickly test this route by clicking the **Test** button next to the
**Path** field. You can use the built in test tool or click the URL to open in a
new tab.

![Test the API](../../public/media/step-1-setup-basic-gateway/image-2.png)

You should receive a 401 Unauthorized that says something similar to

```txt
{
  "status": 401,
  "title": "Unauthorized",
  "detail": "No key or invalid key provided",
  "type": "https://httpproblems.com/http-status/401",
  "instance": "/todos",
  "hint": "This is a demo API that requires authentication. You must add a header 'api-key' with a value '4f0aeaf7-d17f-4b2b-9b71-5177bd194759'"
  ...
}
```

This is expected because you have not provided the required `api-key` header.
Copy the required `api-key` value from that error message to your clipboard
(e.g. `4f0aeaf7-d17f-4b2b-9b71-5177bd194759`).

## 2/ Set the secret header

Open the policies section in your route and click **Add Policy** to the request
pipeline.

![Add policy](../../public/media/step-1-setup-basic-gateway/image-3.png)

Find the **Add or Set Request Header**

![Find set requests headerpolicy](../../public/media/step-1-setup-basic-gateway/image-4.png)

Configure the policy JSON to set header name to `api-key` and the value to
`$env(API_KEY)`. This tells the policy to read the value from our secure vault
used for [Environment Variables](/docs/articles/environment-variables.md).

![Policy Configuration](../../public/media/step-1-setup-basic-gateway/image-10.png)

Save your changes to `routes.oas.json`.

Head over to the Environment Variables screen in settings and click **Add new
variable**.

![Add new Environment Variable](../../public/media/step-1-setup-basic-gateway/image-5.png)

Set the name to `API_KEY` and select **is Secret** (the demo API key is not
really secret but if you use an API key to access your backend, that _is_ an
important secret).

![New environment variable](../../public/media/step-1-setup-basic-gateway/image-6.png)

## 3/ Test your API

Go back to your route in the Route Designer and click the **Test** button next
to the **Path** field. Click the **Test** button in the dialog that opens.

![Test API](../../public/media/step-1-setup-basic-gateway/image-7.png)

Congratulations, your gateway is working 👏👏👏

## 4/ BONUS - put the base URL in an environment variable

When working with Zuplo, you'll eventually want each
[environment](/docs/articles/environments) to use a different backend (e.g. QA,
staging, preview, production etc).

Change the **URL Forward** value to read the base URL from the
[Environment Variables](/docs/articles/environment-variables) system by setting
the value to `${env.BASE_URL}`.

![BASE_URL from Environment](../../public/media/step-1-setup-basic-gateway/image-8.png)

Add another Environment Variable called BASE_URL. This is typically not a
secret, there's no need to hide this from your colleagues.

![BASE_URL Env Variable](../../public/media/step-1-setup-basic-gateway/image-9.png)

Save all your changes and test your route again.

**NEXT** Try
[step 2 - add API key authentication to your API](./step-2-add-api-key-auth.md).
