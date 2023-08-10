## Using the Policy

Adding API Key authentication to your Zuplo API takes only a few minutes. This
document shows you how to add the policy to your routes, create an API key, and
make a request using the API Key.

## Add the API Key Policy

The first step to setting up API Key authentication is to add the API
Authentication policy to a route in your project.

1. In the [Zuplo Portal](https://portal.zuplo.com) open the **Route Designer**
   in the <CodeEditorTabIcon /> **Files** tab then click **routes.oas.json**.

2. Select or create a route that you want to authenticate with API Keys. Expand
   the **Policies** section and click **Add Policy**. Search for and select the
   Auth0 JWT Auth policy.

   <Screenshot src="https://cdn.zuplo.com/assets/1a35f4e6-9309-4f22-89da-2e2c25e68403.png" />

3. With the policy selected, you will see the configuration and information
   about the options. For this tutorial just leave the options as they are and
   click **OK** to save the policy.

   <Screenshot src="https://cdn.zuplo.com/assets/736fad78-37c8-4f12-9e58-8e697a14284c.png" />

## Create an API Key

In order to make a request to the route, you'll need an API Key.

1. In the [Zuplo Portal](https://portal.zuplo.com) open the **API Key
   Consumers** section in the <SettingsTabIcon /> **Settings** tab.

2. Click the button **Add New Consumer**.

3. In the form that appears, enter a value for the **Subject** such as
   `my-test`. You can leave the other fields empty. Click **OK** to create the
   consumer.

  <Screenshot src="https://cdn.zuplo.com/assets/68b4571d-fcbc-4c92-977f-7612cd0cfb32.png" size="md" />

4. Now you can see the newly created consumer and its default API key. Select
   the <CopyIcon /> **Copy** button to copy the API Key. You will use this value
   in the next section.

  <Screenshot src="https://cdn.zuplo.com/assets/98a3d62f-1b61-4f41-8bac-665e0b02309e.png" size="lg" />

### Test the Policy

Finally, you'll make two API requests to your route to test that authentication
is working as expected.

1. In the route designer on the route you added the policy, click the **Test**
   button. In the dialog that opens, click **Test** to make a request.

2. The API Gateway should respond with a **401 Unauthorized** response.

  <Screenshot src="https://cdn.zuplo.com/assets/626e10a2-2350-439a-9081-1ccf1fe90cad.png" size="md" />

3. Now to make an authenticated request, add a header to the request called
   `Authorization`. Set the value of the header to `Bearer YOUR_API_KEY`
   replacing `YOUR_API_KEY` with the value of the API Key you copied in the
   previous section.

  <Screenshot src="https://cdn.zuplo.com/assets/11a3f88a-8613-43c9-9429-4c82e1f1ab4d.png" size="lg" />

4. Click the **Test** button and a **200 OK** response should be returned.

  <Screenshot src="https://cdn.zuplo.com/assets/8182f932-8db6-4456-842f-f65158b174c0.png" size="md" />

You have now setup API Key Authentication on your API Gateway.

See [this document](/docs/articles/api-key-management) for more information
about API Keys and API Key Management with Zuplo.
