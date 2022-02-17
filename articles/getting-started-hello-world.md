---
title: Getting Started 
date: "2021-08-01"
---

Zuplo isn't your average gateway. It's a **programmable gateway** that can be used to protect and share your own API _and_ used as a simple orchestration layer over SaaS APIs. Choose your getting started guide:

1. [Proxy a public API](getting-started)
2. **Hello World API**
3. [Gateway over AirTable](getting-started-airtable)
4. [Gateway over MongoDB](getting-started-mongo-db)

## Hello World API

Because Zuplo is programmable you can easily use it to create an API - with built-in gateway features - that can be deployed to the edge. 

## 1

Open your **routes.json** file. You'll see you already have a route with a path `/v1/hello-world` configured.

![Untitled](/media/getting-started-hello-world/default-route.png)

## 2

Notice how the Request Handler is set to **Function** - and configured to use the `default` export of the `hello-world` module. To see the module you can click on that link. This should open the `hello-world.ts` file in your modules folder. 

![Untitled](/media/getting-started-hello-world/request-handler-link.png)

## 3

You'll see the file contains a function that returns `"What zup?"` (that's how we say "Hello World" at Zuplo). Change this code to return anything you like, maybe actually "Hello world!"

```
import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

export default async function (request: ZuploRequest, context: ZuploContext) {

    context.log.info(`Hi, from inside your zup!`);
    return "Hello World?";
}
```

Make sure to press Save - **note** ⌘+S or CTRL+S works, depending on your OS.

## 4

Invoke your API using the Test Console. Click on the lightning tab and select the `hello-world.json` file. It should already have the correct Path configured for you `/v1/hello-world`. Hit the Test button to invoke your API!

![Untitled](/media/getting-started-hello-world/test-client.png)

Notice how you can see your response in the body. Also notice how you can see the 'Hi, from inside your zup' log entry below the body. 

## Congratulations
Your API is now live btw - you can see the URL in settings. Why not try getting that "Hello World" response from your browser. 

![Untitled](/media/getting-started-hello-world/project-url.png)


Why not try one of the other getting started guides (above) or some of the examples in our documentation:

- [Write your own policies](https://zuplo.notion.site/Policies-d94e7c5ee5444532855e7678effaee42)
- [Archive requests to storage](https://zuplo.notion.site/Archiving-requests-to-storage-608a64672de64f1b94309f68993d26d1)
- [Setting up JWT auth with Auth0](https://zuplo.notion.site/Setting-up-JWT-auth-with-Auth0-9f5ce6ad37f5418aaa781391c1995e00)

[Zuplo Alpha Documentation Home](https://zuplo.notion.site/Zuplo-Docs-Alpha-f6d20ce45d4140859c1c5823fc721a1e)