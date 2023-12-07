## Using the Policy

Adding the Curity Phantom Token Pattern to your route is trivial. Before 
getting started, make sure that you have an instance of the [Curity Identity 
Server](https://curity.io/) up and running.

### Setup the Curity Identity Server

Getting the Curity Identity Server up and running is quick. Follow the 
[Getting Started Guide ](https://curity.io/resources/getting-started/) to 
install and configure the server.

#### Introspection
In addition to the instructions outlined in the Getting Started Guide a client 
that enable introspection is needed. Typical recommendation for this is to create 
a new separate client that only enables the introspection capability.

![img](../../static/media/curity-phantom-token-auth/curity-introspection-conf.png)

#### Exposing the runtime
Depending on where the Curity Identity Server is deployed you might have to 
expose the runtime node using a reverse proxy. One option is to use 
[ngrok](https://curity.io/resources/learn/expose-local-curity-ngrok/) but 
other solutions could also be used. 

#### OAuth Tools
With the server up and running and available you can use [OAuth Tools](https://oauth.tools/) to test 
the configuration and make sure that you are able to obtain a token.

### Set Environment Variables

Before adding the policy, there are a few environment variables that will need
to be set that will be used in the Curity Phantom Token Policy.

1. In the [Zuplo Portal](https://portal.zuplo.com) open the **Environment
   Variables** section in the <SettingsTabIcon /> **Settings** tab.

2. Click **Add new Variable** and enter the name `INTROSPECTION_URL` in the name
   field. Set the value to URL endpoint of the Curity Identity Server that handles introspection. Ex. 
   `https://idsvr.example.com/oauth/v2/oauth-introspect`

3. Click **Add new Variable** again and enter the name `CLIENT_ID` in the
   name field. Set the value to ID of the client that you added the introspection capability to.

4. Click **Add new Variable** again and enter the name `CLIENT_SECRET` in the
   name field. Set the value to the secret of the client that you added the introspection capability to.

### Create the module

In the [Zuplo Portal](https://portal.zuplo.com) open the **Route Designer**
   in the <CodeEditorTabIcon /> **Files** tab then click `+` next to **Modules**, choose **Empty Module** to add a new module. 
   Name the module `curity-phantom-token.ts`. Next paste the below code into the editor.

```js
/* curity-phantom-token.ts
Implement the Phantom Token Pattern https://curity.io/resources/learn/phantom-token-pattern/

Introspects incoming opaque access token to retrieve a signed JWT and replaces 
the upstream Authorization header to send the JWT instead of the incoming 
opaque token.
*/

import { ZuploRequest, ZuploContext, environment } from "@zuplo/runtime";

export default async function (
  request: ZuploRequest,
  context: ZuploContext) {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader) {
    return new Response(`No Authorization header`, { status: 401 });
  }

  var token = getToken(authHeader);

  if (!token) {
    return new Response(`Failed to parse token from Authorization header`, { status: 401 });
  }

  function getJwt(): Promise<string> {
    return (fetch(environment.INTROSPECTION_URL, {
      headers: {
        'Authorization': 'Basic ' + btoa(`${environment.CLIENT_ID}:${environment.CLIENT_SECRET}`),
        'Accept': 'application/jwt',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      body: 'token=' + token + '&token_type_hint=access_token',
    }).then(function (response) {
      return response.text();
    }))
    //TODO: Catch introspection error
  };

  context.waitUntil(getJwt());

  var jwt = await (getJwt());

  if (!jwt) {
    return new Response(`Introspection failed`, { status: 401 });
  }

  request.headers.set('Authorization', jwt)

  return request;
}

function getToken(authHeader) {
  if (authHeader.split(" ")[0] === "Bearer") {
    return authHeader.split(" ")[1];
  }
  return null;
}
```
### Add the Curity Phantom Token Policy

The next step is to add the Curity Phantom Token Auth policy to a route in your project.

1. In the [Zuplo Portal](https://portal.zuplo.com) open the **Route Designer**
   in the <CodeEditorTabIcon /> **Files** tab then click **routes.oas.json**.

2. Select or create a route that you want to authenticate with the Curity Phantom Token Pattern. Expand the
   **Policies** section and click **Add Policy**. Search for and select the
   Phantom Token policy.
 
3. Click **OK** to save the policy.

### Test the Policy

Finally, you'll make two API requests to your route to test that authentication
is working as expected.

1. In the route designer on the route you added the policy, click the **Test**
   button. In the dialog that opens, click **Test** to make a request.

2. The API Gateway should respond with a **401 Unauthorized** response.

  <Screenshot src="https://cdn.zuplo.com/assets/626e10a2-2350-439a-9081-1ccf1fe90cad.png" size="md" />

3. Now to make an authenticated request, add a header to the request called
   `Authorization`. Set the value of the header to `Bearer YOUR_ACCESS_TOKEN`
   replacing `YOUR_ACCESS_TOKEN` with the opaque token issued by Curity.

  <Screenshot src="https://cdn.zuplo.com/assets/1486821b-cade-4041-b05b-80d3366327a5.png" size="lg" />

4. Click the **Test** button and a **200 OK** response should be returned.

  <Screenshot src="https://cdn.zuplo.com/assets/8182f932-8db6-4456-842f-f65158b174c0.png" size="md" />

You have now setup the Curity Phantom Token Pattern for Authentication on your API Gateway.

See [this document](/docs/articles/oauth-authentication) for more information
about OAuth authorization in Zuplo.
