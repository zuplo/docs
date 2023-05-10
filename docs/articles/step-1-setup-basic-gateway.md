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

## 1/ Add a route

Inside your new project, choose the `routes.oas.json` file and click **Add
Route**.

![ADd Route](https://cdn.zuplo.com/assets/8cfa5b7b-6ead-4dd0-9339-dbcdc21b6299.png)

Using the Route Designer, let's configure our first route to handle the
`GET /todos` route.

- Summary: `Get all todos`
- Method: `GET`
- Path: `/todos`
- [URL Forward](/docs/handlers/url-forward): `https://todos.zuplo.com`

![Get all todos](https://cdn.zuplo.com/assets/f2bcc7ad-027f-4f5e-8764-c802079dacdb.png)

Save your changes (you can click the disk icon next to `routes.oas.json` or
press CMD+S).

You can quickly test this route by clicking the **Test** button next to the
**Path** field and clicking the URL in the dialog that opens.

![Test](https://cdn.zuplo.com/assets/cd094b3c-efbe-4c2b-995c-60ce0302704a.png)

You should receive a 401 Unauthorized that says something similar to

```
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

![Add policy](https://cdn.zuplo.com/assets/8eab7f3e-3d24-411d-8a4f-7cde11fe6ccf.png)

Find the **Add or Set Request Header**

![Find policy](https://cdn.zuplo.com/assets/67937c50-598d-433a-945a-17787841f036.png)

Configure the policy JSON to set header name to `api-key` and the value to
`$env(API_KEY)`. This tells the policy to read the value from our secure vault
used for [Environment Variables](/docs/articles/environment-variables.md).

![Policy Configuration](https://cdn.zuplo.com/assets/e29a3c79-aeee-48e9-8c40-d1131c10f33a.png)

Save you changes to `routes.oas.json`.

Head over to the Environment Variables screen in settings and click **Add new
variable**.

![Add new Environment Variable](https://cdn.zuplo.com/assets/e9119f6a-e3e0-4d71-8739-62155e23d2da.png)

Set the name to `API_KEY` and select **is Secret** (the demo API key is not
really secret but if you use an API key to access your backend, that _is_ an
important secret).

![New environment variable](https://cdn.zuplo.com/assets/70fdd686-641a-4792-8a55-dafb952c0178.png)

## 3/ Test your API

Go back to your route in the Route Designer and click the **Test** button next
to the **Path** field. Open the URL in the browser and you should see a list of
todoitems.

```
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
  {
    "userId": 1,
    "id": 3,

```

Congratulations, your gateway is working 👏👏👏

## 4/ BONUS - put the base URL in an environment variable

When working with Zuplo, you'll eventually want each
[environment](/docs/articles/environments) to use a different backend (e.g. QA,
staging, preview, production etc).

Change the **URL Forward** value to read the base URL from the
[Environment Variables](/docs/articles/environment-variables) system by setting
the value to `${env.BASE_URL}`.

![BASE_URL from Environment](https://cdn.zuplo.com/assets/b52a04bd-b4d2-4e70-88e7-b32b1a7cba7d.png)

Add another Environment Variable called BASE_URL. This is typically not a
secret, there's no need to hide this from your colleagues.

![BASE_URL Env Variable](https://cdn.zuplo.com/assets/068841d1-6554-448b-a869-62aa4076c85d.png)

Save all your changes and test your route again.

**NEXT** Try
[step 2 - add API key authentication to your API](./step-2-add-api-key-auth.md).
