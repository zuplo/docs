---
title: Add API Key Authentication to any API
sidebar_label: Add API Key Authentication
---

We [recommend API key authentication](/blog/2022/05/03/you-should-be-using-api-keys/) in most API sharing scenarios, but there’s a lot to implement to use API keys successfully. Let us take away all the pain. Follow this guide to get it working in less than 5 minutes.

For this tutorial, we’ll use a [public API based on the popular Rick and Morty show](https://rickandmortyapi.com/). We’ll quickly proxy this API and add API-Key authentication.

> Note - if you’re adding authentication to an API, the origin API should also be secured so traffic can’t simply go around your gateway. We have multiple options to secure the gateway-to-origin. For this example, using a public API is easier :)

Before we start, create a new project in [portal.zuplo.com](https://portal.zuplo.com) - this project will be the gateway that sits between your client and the Rick and Morty API

![Untitled](add-api-key-auth-media/Untitled.png)

## 1/ Add a route to your gateway to proxy the character API

In the portal, select the **Files** tab and choose the **Routes** file. Click **Add Route.**

![Untitled](add-api-key-auth-media/Untitled%201.png)

In the new route set the following properties

- **Method**: `GET`
- **Path**: `/characters`
- **Label**: `Get all characters`
- **Version**: `v1`
- **CORS**: `No CORS`
- **URL** **Rewrite**: [`https://rickandmortyapi.com/api/character`](https://rickandmortyapi.com/api/character)

![Untitled](add-api-key-auth-media/Untitled%202.png)

> **Note** - most people follow the practice of using plurals for resources. The Rick and Morty API doesn’t do this so in this demo we’re highlighting the ability for you to transform the shape of the API. Note that the gateway path `/characters` maps (via the URL Rewrite) to `/api/character` (not plural)

## 2/ Add the API Key policy

In your new route, expand the **Policies** section. Click **Add Policy** and choose the API Key authentication policy.

![Untitled](add-api-key-auth-media/Untitled%203.png)

Your route is now secured and will reject all requests that don’t present a valid API Key. Next, you’ll set up the API Consumer.

Be sure to save your changes to the Routes file (tip: you can press CMD/CTRL + S)

## 3/ Create an API Key Consumer

![Untitled](add-api-key-auth-media/Untitled%204.png)

Navigate to the **Settings** tab and choose **API Key Consumers**. Click **Add new consumer**. In the new consumer form, enter the following data:

- **Subject**: `test-subject`
- **Key managers**: enter your e-mail that you will use to sign in to your developer portal (so you can access your own key!)
- **Metadata**: `{}`

and click Save.

## 4/ Access your API Key

To get an API key you’ll need to use our developer portal (where developers come to learn about your API And get their keys). You can access your Developer Portal on the **Files** tab’s **Getting Started** file (see below).

![Untitled](add-api-key-auth-media/Untitled%205.png)

This will open your developer portal which should look like the screenshot below. Sign in using the e-mail you entered as a “**Key manager**” previously.

![Untitled](add-api-key-auth-media/Untitled%206.png)

Once signed-in, you should see an **API Keys** section under **Authentication**:

![Untitled](add-api-key-auth-media/Untitled%207.png)

You’ll see your test-subject, and notice that there are no keys. Click **Create Key** to create your first key 👏.

![Untitled](add-api-key-auth-media/Untitled%208.png)

Note your consumers can create multiple keys to support flexible rolling of keys.

Scroll down to the route you created called **Get all characters method** and select your key in the **Choose a key** dropdown.

![Untitled](add-api-key-auth-media/Untitled%209.png)

You’ll notice that the code sample on the right automatically updates to use the key you selected! You can copy it to the clipboard and `curl` the request using your terminal.

You can also try using the built-in test client (shown below) setup your request as shown and add a header of the form `authorization: Bearer <API_KEY>`.

![Untitled](add-api-key-auth-media/Untitled%2010.png)

### 🎉 Congratulations, you added API key authentication to an API 🥳

**Related Docs**

- [API Key Authentication Policy](../policies/api-key-auth-inbound.md)

**Next Steps**

- [Add rate-limiting to your API](../quickstarts/per-customer-rate-limits.md)
