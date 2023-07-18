## Using the Policy

Adding Auth0 to your route takes just a few steps, but before you can add the
policy you'll need to have Auth0 setup for API Authentication.

### Setup Auth0

To use Auth0 as an API authentication provider, you'll need to create both an
Application and an API in the Auth0 dashboard. The steps below cover the basics,
but if you need more details see the Auth0 links throughout this document.

1. Create the Auth0 API
   ([Auth0 Doc](https://auth0.com/docs/get-started/auth0-overview/set-up-apis))

   In the Auth0 dashboard, select **APIs** on the sidebar, then click the **+
   Create API** button.

   Enter the **Name** and **Identifier** of your application. The identifier is
   usually a URI such as `https://api.example.com/`. The URL used in the
   identifier does NOT have to be the URL of your actual API. A common practice
   is to use the URL of your production API. Save this value, you'll use it in
   the next section.

2. Get the Auth0 Domain

   On your newly created Auth0 API, click the **Test** tab. This tabs shows how
   to create a
   [Machine-to-Machine](https://auth0.com/docs/get-started/authentication-and-authorization-flow/call-your-api-using-the-client-credentials-flow)
   access token from a test application that Auth0 automatically created for
   your API.

   From the first code block on this page, find the URL value as shown below.
   Copy the **hostname** portion (outlined in red) of this URL (not the
   `https://` or the trailing `/oauth/token` parts). For example
   `your-account.us.auth0.com`. Save this value, you'll use it in the next
   section.

   <Screenshot src="https://cdn.zuplo.com/assets/53f91f6d-17c2-469d-9e23-ac3beb9a804b.png" alt="Auth0 Access Token" />

3. Get an Access Token

   Find the code block that contains the `access_token` and copy the **entire**
   token value (without the quotes) and save it. You'll use this later to test
   your Auth0 JWT policy in Zuplo.

   <Screenshot src="https://cdn.zuplo.com/assets/991dbd66-2bb9-4bc1-8ae0-8d928b5dcb7e.png" alt="Auth0 Access Token" />

### Set Environment Variables

Before adding the policy, there are a few environment variables that will need
to be set that will be used in the Auth0 JWT Policy.

:::caution

It is very important in the next steps that the values match **EXACTLY** as they
are found in Auth0.

:::

1. In the [Zuplo Portal](https://portal.zuplo.com) open the **Environment
   Variables** section in the <SettingsTabIcon /> **Settings** tab.

2. Click **Add new Variable** and enter the name `AUTH0_DOMAIN` in the name
   field. Set the value to

3. Click **Add new Variable** again and enter the name `AUTH0_AUDIENCE` in the
   name field. Set the value to the **identifier** URI you used when creating
   the Auth0 API in the section above (i.e. `https://api.example.com/`).

### Add the Auth0 Policy

The next step is to add the Auth0 JWT Auth policy to a route in your project.

1. In the [Zuplo Portal](https://portal.zuplo.com) open the **Route Designer**
   in the <CodeEditorTabIcon /> **Files** tab then click **routes.oas.json**.

2. Select or create a route that you want to authenticate with Auth0. Expand the
   **Policies** section and click **Add Policy**. Search for and select the
   Auth0 JWT Auth policy.

   <Screenshot src="https://cdn.zuplo.com/assets/40c72bc5-be30-4246-809c-58d4ecb18f9e.png" />

3. With the policy selected, notice that there are two properties, `auth0Domain`
   and `audience` that are pre-populated with environment variable names that
   you set in the previous section.

  <Screenshot src="https://cdn.zuplo.com/assets/2aa3fc6a-0e9c-47f6-b08d-c1cc446e54b9.png" maxWidth="60%" />
 
4. Click **OK** to save the policy.

### Test the Policy

Finnally, you'll make two API requests to your route to test that authorization
is working as expected.

1. In the route designer on the route you added the policy, click the **Test**
   button. In the dialog that opens, click **Test** to make a request.

2. The API Gateway should respond with a **401 Unauthorized** response.

  <Screenshot src="https://cdn.zuplo.com/assets/626e10a2-2350-439a-9081-1ccf1fe90cad.png" maxWidth="60%" />

3. Now to make an authenticated request, add a header to the request called
   `Authorization`. Set the value of the header to `Bearer YOUR_ACCESS_TOKEN`
   replacing `YOUR_ACCESS_TOKEN` with the value of the Auth0 access token you
   saved from the first section of this tutorial.

  <Screenshot src="https://cdn.zuplo.com/assets/1486821b-cade-4041-b05b-80d3366327a5.png" maxWidth="80%" />

4. Click the **Test** button and a **200 OK** response should be returned.

  <Screenshot src="https://cdn.zuplo.com/assets/8182f932-8db6-4456-842f-f65158b174c0.png" maxWidth="60%" />

You have now setup Auth0 JWT Authentication on your API Gateway.
