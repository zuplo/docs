---
title: Step 3 - Create a simple Zuplo API
---

In this step, we will create a simple API using Zuplo. The backend will be the
ToDo API from [JSONPlaceholder](https://jsonplaceholder.typicode.com). We will
create a simple wrapper around this API to demonstrate how to monetize your
backend API, but you can connect your own backend if you want throughout this
tutorial.

## 1/ Create a new Zuplo project

First, [create a new Zuplo project](https://portal.zuplo.com) and choose the
Monetization template as the starting point.

![Monetization template](https://cdn.zuplo.com/assets/d97c6b00-7c14-4898-a774-4c5dad33e8d4.png)

For this example, let's create two endpoints for the API, `/v1/todos` and
`/v1/todos/:todoId`. The first will return a list of ToDos, and the second will
return a single ToDo item.

## 2/ Create your API endpoints

In your Zuplo project, go to **Code > routes.oas.json** file and update the
`/path-0` with `/v1/todos` using the endpoint
`https://jsonplaceholder.typicode.com/todos`:

::: note

Make sure to change the handler from **URL Forward** the **URL Rewrite** option
when adding the endpoint.

:::

![/v1/todos path](https://cdn.zuplo.com/assets/5ba77117-0095-4415-b4ce-516499a51971.png)

Description of the elements in the image above:

1. This is the path in your public API endpoint. Your users will access this
   endpoint by making a request to `https://yourapidomain.com/v1/todos`.
2. You can add multiple policies to your endpoint. For this example, we are
   using the pre-built `monetization` policy. Without this, the endpoint will be
   accessible without any restrictions.
3. The _Handler_ tells Zuplo which backend to connect to. For this example, we
   are using the [URL Rewrite handler](/docs/handlers/url-rewrite.md) to rewrite
   the request. In this case, a request to `https://yourapidomain.com/v1/todos`
   will be hitting the URL you set here.
4. The URL that the request will be rewritten to.

Now add a new route `/v1/todos/:todosId` endpoint using the following details:

- **Description**: Get all blogs
- **Path**: /v1/todos/:todoId
- **Method**: GET
- **Handler**: URL Rewrite
- **URL**: `https://jsonplaceholder.typicode.com/todos/${params.todoId}`
- **Request Policy**: add the existing request policy "monetization" as seen in
  the image below

![](https://cdn.zuplo.com/assets/a2767cd0-7a28-4827-b8eb-cc3ffbf42e83.gif)

Finally, make sure to **Save** the changes.

## 3/ Test your API

Zuplo generates an API documentation that you can use to test your API.

Open your generated API documentation by opening the URL which you can find in
toolbar in the bottom of the page.

![](https://cdn.zuplo.com/assets/d0dc0e7e-f4d8-402c-8b38-211a3695a2c8.png)

In your Developer Portal, open the API Playground by clicking on **Test** for
the "Get all ToDos" endpoint.

![](https://cdn.zuplo.com/assets/47b8b1f5-f318-4182-88e6-8f7c4406092e.png)

You will receive a `401 Unauthorized` error because you don't have an API key
that allows you to access the endpoint.

In the next step, we will create the Zuplo plans and connect them to the Stripe
products, so we can subscribe to this API and get an API key to access the API.
