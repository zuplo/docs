---
title: Getting Started
date: "2021-08-01"
---

## Proxy a public API

Let's proxy the sample e-commerce API at [https://ecommerce-api.zuplo.com](https://ecommerce-api.zuplo.com) with a Zuplo gateway.

1. Open the **routes.json** file in the file and change the **path** of the first route to be `/products/(.*)` - this uses a wildcard `(.*)` to match everything.

![Untitled](/media/getting-started/path.png)

1. Set the mode of the **Request Handler** to be **URL Rewrite** and the rewrite path to be `https://ecommerce-api.zuplo.com/products/${params[0]}`. A parameter `0` matches the wildcard on the incoming URL.

![Untitled](/media/getting-started/rewrite.png)

1. Use the route tester at the top of the screen to check your re-write logic. Open the route tester (top right) and set the path to be `/v1/products/1000`. Verify that your route was matched and the URL re-written appropriately.

![Untitled](/media/getting-started/route-tester.png)

![Untitled](/media/getting-started/route-match.png)

1. Add a rate-limiting policy to limit traffic to your new endpoint - expand the Policies section and click Add Policy. Choose Rate Limit policy and Accept the defaults by clicking OK.

![Untitled](/media/getting-started/add-policy.png)

_[josh note - the goal here is to get them to see all the policies we have, triggering future exploration. We will probably ship this before we have the policy designer - we’ll just skip this step]._

1. Invoke your API using the Test Console. Click on the lightning tab and select the first file. Change the path to `/v1/todos/1` and hit **Test**.

![Untitled](/media/getting-started/test-client.png)

**Congratulations**! You should see the results of your query. Try it five more times to see if the results change thanks to your rate limiter.

Now, why not try some of the examples in our documentation:

- [Policies](https://www.notion.so/zuplo/Policies-d94e7c5ee5444532855e7678effaee42)
- [Archive requests to storage](https://zuplo.notion.site/Archiving-requests-to-storage-608a64672de64f1b94309f68993d26d1)
- [Setting up JWT auth with Auth0](https://zuplo.notion.site/Setting-up-JWT-auth-with-Auth0-9f5ce6ad37f5418aaa781391c1995e00)