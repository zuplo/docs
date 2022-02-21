---
title: Gateway over AirTable APIs
date: "2021-02-21"
embed: true
---

Zuplo isn't your average gateway. It's a **programmable gateway** that can be
used to protect and share your own API _and_ used as a simple orchestration
layer over SaaS APIs. Choose your getting started guide:

<QuickstartPicker />

Let's proxy the AirTable Event Planning base in just 4 quick steps.

## 1

Create a new Airtable base by selecting **Start from Template** > **Event
Planning** from the AirTable app homepage. Navigate to
[https://airtable.com/api](https://airtable.com/api) and select your new
Workspace. On the side-menu select, **Attendees Table** > **Create Records**.
You will see an example request like below, **copy and save the URL from that
example**.

```
curl -v -X POST https://api.airtable.com/v0/applKxZKvlZPu3nh6/%F0%9F%AA%91%20Attendees \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
```

## 2

Open the module called `hello-world.ts` and replace the body of the function to
the code below. Replace the values for `YOUR_API_KEY` and `YOUR_BASE_URL`.
[See here to get your AirTable API key](https://support.airtable.com/hc/en-us/articles/219046777-How-do-I-get-my-API-key-).
Save the file.

> NOTE: Don't use production values just yet, real secret management is coming
> very soon.

```ts
const API_KEY = "YOUR_API_KEY";

const url = "YOUR_BASE_URL";

const body = await request.json();

const data = {
  records: [
    {
      fields: {
        Name: body.name,
        Email: body.email,
      },
    },
  ],
};

const response = await fetch(url, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(data),
});

if (!response.ok) {
  return new Response("Error calling AirTable!", {
    status: 500,
  });
}
return new Response("Success", {
  status: 200,
});
```

## 3

Open the **routes.json** file and change the **path** of the existing route to
be `/attendees` and set the **method** to `POST`. Save the file.

![Route Path](/media/quickstarts/gateway-over-airtable/route-path.png)

## 4

Open the Route Tester :lightning-bolt:. Set the **path** to `/v1/attendees` and
the **method** to `POST`. Add JSON to the body as shown.

![Test Route](/media/quickstarts/gateway-over-airtable/test-route.png)

## Congratulations

Your API is now live! BTW - you can see the URL in settings. Next, try posting
to your API from curl or using `fetch` in the browser.

![Project URL](/media/getting-started-hello-world/project-url.png)

Why not try one of the other getting started guides (above) or some of the
examples in our documentation:

- [Write your own policies](https://zuplo.notion.site/Policies-d94e7c5ee5444532855e7678effaee42)
- [Archive requests to storage](https://zuplo.notion.site/Archiving-requests-to-storage-608a64672de64f1b94309f68993d26d1)
- [Setting up JWT auth with Auth0](https://zuplo.notion.site/Setting-up-JWT-auth-with-Auth0-9f5ce6ad37f5418aaa781391c1995e00)
