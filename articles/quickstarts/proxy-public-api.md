---
title: Proxy a Public API
date: "2022-02-18"
embed: true
---

Zuplo isn't your average gateway. It's a **programmable gateway** that can be
used to protect and share your own API _and_ used as a simple orchestration
layer over SaaS APIs. Choose your getting started guide:

<QuickstartPicker />

Let's proxy the sample e-commerce API at `https://ecommerce-api.zuplo.com` with
a Zuplo gateway in 4 easy steps.

## 1

Open the **routes.json** file and add a new route.

![Untitled](/media/getting-started/add-route.png)

Change the **path** of the new route to be `/products/(.*)` - this uses a
wildcard `(.*)` to match anything after `/products/`.

![Untitled](/media/getting-started/path.png)

## 2

Set the mode of the **Request Handler** to be **URL Rewrite** and the rewrite
path to be `https://ecommerce-api.zuplo.com/products/${params[0]}`. A parameter
`0` matches the wildcard on the incoming URL.

![Untitled](/media/getting-started/rewrite.png)

## 3

Use the route tester at the top of the screen to check your re-write logic. Open
the route tester (top right) and set the path to be `/v1/products/1000`. Verify
that your route was matched and the URL re-written appropriately.

![Untitled](/media/getting-started/route-tester.png)

![Untitled](/media/getting-started/route-matched.png)

## 4

Invoke your API using the Test Console. Click on the lightning tab and select
the first file. Change the path to `/v1/todos/1` and hit **Test**.

![Untitled](/media/getting-started/test-client.png)

## Congratulations

You should see the results of your query. Try it five more times to see if the
results change thanks to your rate limiter.

Why not try one of the other getting started guides (above) or some of the
examples in our documentation:

- [Write your own policies](https://zuplo.notion.site/Policies-d94e7c5ee5444532855e7678effaee42)
- [Archive requests to storage](https://zuplo.notion.site/Archiving-requests-to-storage-608a64672de64f1b94309f68993d26d1)
- [Setting up JWT auth with Auth0](https://zuplo.notion.site/Setting-up-JWT-auth-with-Auth0-9f5ce6ad37f5418aaa781391c1995e00)
