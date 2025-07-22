---
title: MCP - Quick Start Guide
sidebar_label: "MCP - Quick start"
---

Zuplo allows you to instantly add a managed MCP Server to your existing API,
powered by OpenAPI.

If you're not familiar with Zuplo, it's recommended to go through the
[Step 1](/docs/articles/step-1-setup-basic-gateway) first.

<Stepper>

1. Create a **new project**

   Sign in to [portal.zuplo.com](https://portal.zuplo.com) and create a new
   project.

1. **Import** an **OpenAPI** document

   Let's import an OpenAPI document. You can download this one here
   [todo-openapi.json](https://download-open-api-main-fae215f.d2.zuplo.dev/todo-openapi).

   ![Import OpenAPI](../../public/media/mcp-quickstart/import-openapi.png)

   Select the **Code** tab (1), then choose the `routes.oas.json` file (2) and
   choose **Import OpenAPI** (3).

   <ModalScreenshot size="sm">

   ![Complete Import](../../public/media/mcp-quickstart/complete-import.png)

   </ModalScreenshot>

   Click **Complete Import** to import the routes.

   Now save your changes (press **Save** at bottom left of **CMD+S**).

1. Test the **Get all todos** route

   The first route you imported is called `Get all todos`. Select it and click
   the **Test** button next to the **Path** field.

   A test dialog will open, click **Test** and you should see a `200 OK`
   response with a few todos.

   This is the basic API we're going to turn into a fully functioning MCP
   Server.

1. Create an **MCP Server**

   On your `routes.oas.json` file, choose **Add Route** (3)

   ![Add Route](../../public/media/mcp-quickstart/add-mcp-route.png)

   A new route will appear. Enter the following values
   - **Summary**: enter `MCP Server`
   - **Method**: choose `POST`
   - **Path**: enter `/mcp` (the path can be anything, but /mcp is common)

   Now change the **Request Handler** section, choosing the MCP Server option.

   ![MCP Server](../../public/media/mcp-quickstart/configure-mcp-server.png)

   Save you changes and 💥 ... you just made your first MCP Server.

   Let's try it out.

1. Connect your MCP Client

   You can use any MCP client you like. We like the OpenAPI platform's
   playground.

   Go to
   [platform.openai.com/playground](https://platform.openai.com/playground)
   (you'll need an OpenAPI account).

   ![Add tool](../../public/media/mcp-quickstart/openai-add-tool.png)

   Click `Create...` next to the **Tools** label and choose **MCP Server**.

   Click **Add new** to register your custom MCP Server with the playground.

   You'll need the URL of your MCP server - you can get this by going back to
   Zuplo, clicking on your MCP Server route and then clicking **Test**. At the
   top you'll see a button to copy the URL to your clipboard.

   ![Copy MCP Server URL](../../public/media/mcp-quickstart/copy-mcp-server-url.png)

   Back to the OpenAPI playground...

   <ModalScreenshot size="sm">

   ![Connect MCP Server](../../public/media/mcp-quickstart/connect-mcp-server.png)

   </ModalScreenshot>
   1. Enter the URL of your MCP Server
   2. Enter a label, try `todos`
   3. Choose **None** for Authentication as we didn't add auth to our API
   4. Click **Connect**

   If successfully connected, you'll see your 'tools' listed in the playground.

   <ModalScreenshot size="sm">

   ![Add tools](../../public/media/mcp-quickstart/add-tools.png)

   </ModalScreenshot>

   No need to deselect any tools, let's add them all!

1. Test your MCP Server via the playground

   Let's prompt the LLM in the playground. Ask the model to

   `list out all the todos`

   The model should recognize that it needs to call the todos MCP Server and
   will ask for your approval.

   Click **Approve** and you should see the todos listed 👏

   ![The prompt](../../public/media/mcp-quickstart/the-prompt.png)

</Stepper>

Congratulations! Now go read more about the
[MCP Server handler](/docs/handlers/mcp-server).
