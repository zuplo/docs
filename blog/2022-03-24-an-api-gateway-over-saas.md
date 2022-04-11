---
title: An API gateway over SaaS?
authors: josh
tags: [videos, code]
---

import YouTubeVideo from "@site/src/components/YouTubeVideo";

<YouTubeVideo url="https://www.youtube-nocookie.com/embed/6hvkH-hB384" />

Length: 2 minutes

This one's a little extra. Zuplo is so programmable you can use it in ways you've never considered for a gateway... a gateway over SaaS APIs - like AirTable.

In this example we use the [Event Planning Template](https://www.airtable.com/templates/featured/exppdJtYjEgfmd6Sq/event-planning).

And here's the code in our **request handler**

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

  const response = await fetch(env.ATTENDEES_URL, {
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
