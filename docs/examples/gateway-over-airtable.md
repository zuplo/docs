---
sidebar_position: 0
title: Gateway over AirTable APIs
date: "2021-02-21"
publish: false
---

Zuplo isn't your average gateway. It's a **programmable gateway** that can be
used to share your own API _and_ used as a simple orchestration layer over SaaS
APIs. Choose your getting started guide:

<QuickstartPicker />

Let's put a gateway over the AirTable Event Planning example in just a 5 quick
steps. We'll start by showing you how you can create a new API which inserts
data into the Attendees table.

## 1

Let's setup our environment variables. Open **environment.json** and delete any
example variables. Add two new variables - one config and one secret:

- `ATTENDEES_TABLE_URL` (config)
- `API_KEY` (secret)

![Environment Variables](/media/quickstarts/gateway-over-airtable/environment-variables.png)

## 2

Create a new AirTable workspace from the
[Event Planning Template](https://www.airtable.com/templates/featured/exppdJtYjEgfmd6Sq/event-planning).
When done, navigate to [https://airtable.com/api](https://airtable.com/api) and
select your new workspace. On the side-menu select, **Attendees Table** >
**Create Records**. You will see an example request like below, **copy the URL
from that example** and paste it in to your `ATTENDEES_TABLE_URL` environment
config.

![AirTable Curl](/media/quickstarts/gateway-over-airtable/airtable-curl.png)

Get your
[AirTable API Key](https://support.airtable.com/hc/en-us/articles/219046777-How-do-I-get-my-API-key-)
and paste it into you `API_KEY` environment secret.

Be sure to press Save (you can also use CTRL+S or ⌘+S).

## 3

Create a new Empty Module and name it `attendees.ts`. This will be where we
write some custom code to call AirTable

![Route Path](/media/quickstarts/create-new-empty-module.gif)

Copy the following code into that file.

```ts
import { ZuploContext, ZuploRequest } from "@zuplo/runtime";
import env from "@app/environment";

export default async function (request: ZuploRequest, context: ZuploContext) {
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

  const response = await fetch(env.ATTENDEES_TABLE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.API_KEY}`,
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
}
```

## 4

Open the **routes.json** file and change the **path** of the existing route to
be `/attendees`, set the **method** to `POST` and save the file.

![Route Path](/media/quickstarts/gateway-over-airtable/route-path.png)

Use the function picker [...] and use it to select the `attendees` module and
`default` export as the request handler.

## 5

Open the Route Tester <RouteTesterIcon />. Set the **path** to `/v1/attendees`
and the **method** to `POST` and set the body as follows

```
{
  "name" : "Your Name",
  "email": "you@yourdomain.com"
}
```

![Test Route](/media/quickstarts/gateway-over-airtable/test-route.png)

## Congratulations

Your API is now live! BTW - you can see the URL in settings. Next, try posting
to your API from curl.

Also, why not try creating a schema and using a policy to
[validate the incoming body](https://docs.zuplo.com/articles/docs/policies/json-schema-validation)?

![Project URL](/media/getting-started-hello-world/project-url.png)

Why not try one of the other getting started guides (above) or some of the
examples in our documentation:

- [Write your own policies](/docs/policies)
- [Archive requests to storage](/docs/examples/archiving-requests-to-storage)
- [Setting up JWT auth with Auth0](/docs/policies/auth0-jwt-auth)
