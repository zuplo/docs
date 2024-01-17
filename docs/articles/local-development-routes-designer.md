---
title: "Local dev: Routes Designer"
sidebar_label: Routes Designer
---

The Routes Designer is a visual tool that allows you to create and edit routes,
as well as adding [policies](../policies), for your Zuplo Gateway without having
to manually edit the OpenAPI `routes.oas.json` file manually.

When you run `npm run dev`, the Routes Designer is automatically started in
port 9100. You can access it by visiting http://localhost:9100 in your browser.

```sh
$ npm run dev

Started local development setup
Ctrl+C to exit

🚀 Zuplo Gateway: http://localhost:9000
📘 Route Designer: http://localhost:9100 # <-- Your local route designer
```

![Routes Designer](https://cdn.zuplo.com/assets/8108441d-5d60-4ff6-9b1b-2791f9a971f5.png)

If you are using VS Code, you can open it in the Simple Browser extension to see
it side-by-side as follows.

![VS Code with Simple Browser](https://cdn.zuplo.com/assets/1a3594c1-18a1-4416-b7c7-05585b253dca.png)
