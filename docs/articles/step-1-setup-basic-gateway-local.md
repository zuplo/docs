---
title: Step 1 - Setup a Basic Gateway (Local)
---

In this tutorial we'll setup a simple gateway using Zuplo's local development.
We'll use a simple origin API at [echo.zuplo.io](https://echo.zuplo.io). In
later steps, we'll setup a Zuplo project and deploy it to the cloud.

## Requirements

- [Node.js](https://nodejs.org/en/download) 20.0.0 or higher

## Getting Started

### Create a new project from scratch

<Stepper>

1. Create a new project using

   ```bash
   npx create-zuplo-api@latest --empty
   ```

   The [create-zuplo-api](../cli/create-zuplo-api.md) tool supports creating
   projects from templates. This tutorial creates an empty project, but you can
   use other [templates](https://zuplo.com/examples) by specifying the
   `--example` flag.

1. Start your local gateway

   ```bash
   cd <your-new-project-directory>
   npm run dev
   ```

1. Use the [local Route Designer](./local-development-routes-designer.md) to
   create your first route. You can open the Route Designer by clicking the link
   in the terminal after you run `npm run dev`.

   ```bash
   Started local development setup
   Ctrl+C to exit

   🚀 Zuplo Gateway: http://localhost:9000
   📘 Route Designer: http://localhost:9100 # <-- Your local route designer
   ```

1. Add your first **Route**

   Inside of the Route Designer, click the **Add Route** button.

   ![Add Route](../../public/media/step-1-setup-basic-gateway-local/image.png)

   Your API's first route will appear, with many options. First we'll configure
   the route to match specific incoming requests to the gateway:
   - **Summary**: Enter a summary, e.g. `Example Endpoint`.
   - **Method**: Leave as `GET`.
   - **Path**: Enter `path-1`.

   Then we'll specify how the route will invoke the backend origin API, using a
   forward handler:
   - **Request Handler**: We'll use the
     [URL Forward Handler](../handlers/url-forward.md) which proxies requests by
     "Forwarding to" the same path on specified URL. In this case, enter
     `https://echo.zuplo.io`

     ![Your First Route](../../public/media/step-1-setup-basic-gateway-local/image-1.png)

   **Save your changes** - click **Save All** at in the top right, or press
   **CMD+S**

1. **Test** your route.

   You can test this route by using your favorite HTTP client (e.g. Postman,
   HTTPie, curl, etc).

   ```bash
   curl http://localhost:9000/path-1

   {
     "url": "https://echo.zuplo.io/path-1",
     "method": "GET",
     "query": {},
     "headers": {
       "accept-encoding": "gzip, br",
       "connection": "Keep-Alive",
       "host": "echo.zuplo.io",
       "true-client-ip": "2a06:98c0:3600::103",
       "x-forwarded-proto": "https",
       "x-real-ip": "2a06:98c0:3600::103",
       "zp-rid": "b9822e0f-af32-4002-a6ba-3a899c7f2669",
       "zuplo-request-id": "b9822e0f-af32-4002-a6ba-3a899c7f2669"
     }
   }
   ```

1. Now that you have a simple gateway running, we can deploy it to the cloud
   using the [Zuplo CLI](../cli/overview.md). When you run this command, you
   will be prompted to login if you haven't already.

   If you haven't already created a Zuplo project, you will be prompted to do
   so. If you do have a project, you can choose to deploy to it or you can
   specify the `--project` flag to specify the project you want to deploy to.

   ```bash
   npx zuplo deploy
   ```

   You should see output similar to this:

   ```bash
   ? You don't have any projects configured for this account.
     Enter the name of the new project: my-tutorial
   ✔ Project my-tutorial created successfully.
   ✔ Deployed to https://my-tutorial-main-11686c3.zuplo.app (93/150)
   ```

   Your project is now deployed to the cloud and you can access it at the URL
   provided in the output.

</Stepper>

**NEXT** Try
[Step 2 - Add Rate Limiting to your API](./step-2-add-rate-limiting.md).
