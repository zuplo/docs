---
title: Redirect Handler
sidebar_label: Redirect
---

The Redirect Handler sends a redirect HTTP response to the client. You can specify whether this is 301 (Permanent) or 302 (Temporary), or specify a custom status in routes.json.

## Setup via Portal

The Redirect Handler can be added to any route using the Route Designer. Open the **Route Designer** by navigating to the <CodeEditorTabIcon /> **Code Editor** tab then click **Route Designer**. Inside any route, select **Redirect** from the **Request Handlers** drop-down.

In the text box enter the URL location for the redirect.

## Setup in routes.json

You can also configure the Redirect Handler directly in the **routes.json** file, e.g. as in the route below (which is redirecting requests at the root of your domain to your docs page at /docs).

```json
{
  "path": "/",
  "methods": ["GET"],
  "handler": {
    "module": "$import(@zuplo/runtime)",
    "export": "redirectHandler",
    "options": {
      "location": "/docs"
    }
  },
  "version": "none",
  "corsPolicy": "none"
}
```
