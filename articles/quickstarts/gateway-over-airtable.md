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

To start, create a new Request Handler and name it `attendees.ts`. This will be
where we write the custom code.

![Route Path](/media/quickstarts/gateway-over-airtable/new-request-handler.png)

## 2

Open the new module `attendees.ts` and replace the body of the function to the
code below.

```ts
const API_KEY = "YOUR_API_KEY";

const url = "AIRTABLE_ATTENDEES_URL";

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

Replac the values for `YOUR_API_KEY` with your
[AirTable API Key](https://support.airtable.com/hc/en-us/articles/219046777-How-do-I-get-my-API-key-).
Save the file.

> NOTE: Don't use production values just yet, real secret management is coming
> very soon.

## 3

Create a new AirTable workspace from the
[Event Planning](https://www.airtable.com/templates/featured/exppdJtYjEgfmd6Sq/event-planning)
template. After it's created, navigate to
[https://airtable.com/api](https://airtable.com/api) and select your new
workspace. On the side-menu select, **Attendees Table** > **Create Records**.
You will see an example request like below, **copy the URL from that example**
and replace it with the `AIRTABLE_ATTENDEES_URL` value from the previous step.

```
curl -v -X POST https://api.airtable.com/v0/applKxZKvlZPu3nh6/%F0%9F%AA%91%20Attendees \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
```

## 4

Open the **routes.json** file and change the **path** of the existing route to
be `/attendees` and set the **method** to `POST`. Save the file.

![Route Path](/media/quickstarts/gateway-over-airtable/route-path.png)

Switch to the `routes.json` tab and edit the JSON so that the `/attendees`
`handler.module` and `handler.export` matches the code below.

> UI for selecting the module and export is coming soon.

```json
{
  "path": "/attendees",
  "corsPolicy": "anything-goes",
  "label": "",
  "methods": ["POST"],
  "handler": {
    "module": "$import(./modules/attendees)",
    "export": "default"
  },
  "policies": {
    "inbound": []
  },
  "version": "none"
}
```

## 5

Open the Route Tester <RouteTesterIcon />. Set the **path** to `/v1/attendees`
and the **method** to `POST`. Add JSON to the body as shown.

![Test Route](/media/quickstarts/gateway-over-airtable/test-route.png)

## Congratulations

Your API is now live! BTW - you can see the URL in settings. Next, try posting
to your API from curl or using `fetch` in the browser.

![Project URL](/media/getting-started-hello-world/project-url.png)

Why not try one of the other getting started guides (above) or some of the
examples in our documentation:

- [Write your own policies](/policies)
- [Archive requests to storage](/guides/archiving-requests-to-storage)
- [Setting up JWT auth with Auth0](/guides/setup-jwt-auth-with-auth0)
