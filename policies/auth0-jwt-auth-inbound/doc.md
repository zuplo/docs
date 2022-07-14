## Tutorial

We will start with the hello-world sample you get when you create a new Zup. So you routes file should look like this:

```json
{
  "routes": [
    {
      "label": "What zup?",
      "path": "hello-world",
      "handler": {
        "export": "default",
        "module": "$import(./modules/hello-world)"
      },
      "methods": ["GET", "POST"],
      "corsPolicy": "anything-goes",
      "version": "v1",
      "policies": {
        "inbound": []
      }
    }
  ],
  "versions": [
    {
      "name": "none",
      "pathPrefix": ""
    },
    {
      "name": "v1",
      "pathPrefix": "v1.0/"
    }
  ]
}
```

And your hello-world module (request handler) should look like this

```ts
import { ZuploRequest, ZuploContext } from "@zuplo/runtime";

export default async function (request: ZuploRequest, context: ZuploContext) {
  // Use the built in logging infrastructure available
  // on the request object for extra logging magic
  // when testing your API
  context.log.info(`Hello from inside your Zup`);

  // Zuplo wants to make it easy to build great APIs
  // You can return an instance of Response or, if
  // you return another primitive, we'll do our best
  // to convert it to JSON for you
  return "What zup?";
}
```

You should already have a test setup in the test client, like this

![Untitled](/media/guides/setup-jwt-auth-with-auth0/Untitled.png)

The next step is to enforce authentication on this API using Auth0 and JWT tokens.

## Setting up Auth0

You can create a free Auth0 account at [auth0.com](http://auth0.com). Once
logged in you can create your first API in Auth0.

![CleanShot 2021-11-29 at 16.23.56@2x.png](/media/guides/setup-jwt-auth-with-auth0/CleanShot_2021-11-29_at_16.23.562x.png)

Click `+ Create API` to create a new API.

![Untitled](/media/guides/setup-jwt-auth-with-auth0/Untitled_1.png)

The `Identifier` should be a URL but it doesn't have to be an accessible
endpoint. Here I'm just using the same string as the name with a https://
protocol and trailing /. We'll need these values later so don't forget them.

Inside the settings for your new API you should see a Test tab

![CleanShot 2021-11-29 at 16.30.40@2x.png](/media/guides/setup-jwt-auth-with-auth0/CleanShot_2021-11-29_at_16.30.402x.png)

We'll need this cURL script shortly to get an access token to test against our API.

## Configuring the Zuplo Policy

Next we will configure our Open ID JWT Policy - more documentation on this
[here](./open-id-jwt-auth-inbound.md). Add a `policies` array to your routes.json as shown below.

![CleanShot 2021-11-29 at 16.35.43@2x.png](/media/guides/setup-jwt-auth-with-auth0/CleanShot_2021-11-29_at_16.35.432x.png)

> **Hint** - press _option+shift+F_ to automatically format your code, including JSON in the editor.

Now add the following policy inside the `policies` array:

```json
{
  "name": "auth-policy",
  "policyType": "open-id-jwt-inbound",
  "handler": {
    "export": "OpenIdJwtInboundPolicy",
    "module": "$import(@zuplo/runtime)",
    "options": {
      "issuer": "$env(AUTH_ISSUER)",
      "audience": "$env(AUTH_AUDIENCE)",
      "jwkUrl": "$env(AUTH_JWKS)",
      "allowUnauthenticatedRequests": false
    }
  }
}
```

- The `audience` property in options should exactly match the `Identifier` we created in Auth0 earlier, so `https://zuplo-auth-sample/` in this case.
- The `issuer` field will be the URL for your Auth0 tenant, e.g.
  `https://zuplo-demo.us.auth0.com/`.
- The `jwkUrl` is the public URL of your JWK set.

:::tip

If you're not sure where to find the issuer or jwkUrl you can easily find it in the Node.JS QuickStart for your API as shown below.

:::

![CleanShot 2021-11-29 at 16.47.24@2x.png](/media/guides/setup-jwt-auth-with-auth0/CleanShot_2021-11-29_at_16.47.242x.png)

## Adding the policy to your route(s)

Finally, we need to add this policy to our route as follows

![CleanShot 2021-11-29 at 16.51.59@2x.png](/media/guides/setup-jwt-auth-with-auth0/CleanShot_2021-11-29_at_16.51.592x.png)

## Testing the policy

In the test client, you can now verify that your API has been secured. You
should get a `401: Unauthorized` response from your API.

![CleanShot 2021-11-29 at 16.55.43@2x.png](/media/guides/setup-jwt-auth-with-auth0/CleanShot_2021-11-29_at_16.55.432x.png)

Next, let's get a valid token using the cURL script from earlier in this
tutorial. Copy the cURL script from the test tab and execute it in a terminal window:

![CleanShot 2021-11-29 at 17.03.34@2x.png](/media/guides/setup-jwt-auth-with-auth0/CleanShot_2021-11-29_at_17.03.342x.png)

Carefully extract the access_token only and copy to the clipboard. Paste into a header in the test client called `authorization`. Note that the value of the header should be `Bearer <access_token>` replacing `<access_token>` with the token you got back from cURL.

![CleanShot 2021-11-29 at 17.06.08@2x.png](/media/guides/setup-jwt-auth-with-auth0/CleanShot_2021-11-29_at_17.06.082x.png)

💥 You are now authenticated with the Zuplo API

## Accessing the user object

Now let's update our script to explore the values inside the user object. Add the following line to the middle of your request handler:

```tsx
export default async function (request: ZuploRequest, context: ZuploContext) {
  context.log.info(request.user); // add this line

  return "What zup?";
}
```

Execute the test again and you'll see the following JSON output in the **Request Logs** window:

```json
{
  "sub": "B7IE--redacted--nts",
  "data": {
    "iss": "https://zuplo-demo.us.auth0.com/",
    "sub": "B7IE--redacted--nts",
    "aud": "https://zuplo-auth-sample/",
    "iat": 1638233933,
    "exp": 1638320333,
    "azp": "B7IE--redacted--",
    "gty": "client-credentials"
  }
}
```

## Adding additional claims in Auth0

Navigate to `Actions > Flows` and choose `Machine to Machine`.

![CleanShot 2021-11-29 at 17.17.07@2x.png](/media/guides/setup-jwt-auth-with-auth0/CleanShot_2021-11-29_at_17.17.072x.png)

Choose `Add Action > Build Custom`

![CleanShot 2021-11-29 at 17.39.35@2x.png](/media/guides/setup-jwt-auth-with-auth0/CleanShot_2021-11-29_at_17.39.352x.png)

Give your custom action a name - we chose 'Set-Claim':

![CleanShot 2021-11-29 at 17.41.04@2x.png](/media/guides/setup-jwt-auth-with-auth0/CleanShot_2021-11-29_at_17.41.042x.png)

Add two claims to your M2M tokens using the following code:

![CleanShot 2021-11-29 at 17.44.55@2x.png](/media/guides/setup-jwt-auth-with-auth0/CleanShot_2021-11-29_at_17.44.552x.png)

And, critically, remember to click `Deploy`. Also, note that the claims MUST be URLs (again, they do not need to be live URLs, just valid in structure).

```ts
exports.onExecuteCredentialsExchange = async (event, api) => {
  api.accessToken.setCustomClaim(
    "https://example.com/claim1/",
    `this-is-a-claim`
  );
  api.accessToken.setCustomClaim(
    "https://example.com/claim2/",
    `here-is-another-claim`
  );
};
```

## Re-test your API

Get a fresh token using cURL (same approach as above, it's important to get a fresh token so that it contains these new claims).

Paste the token into the test client and re-execute the API.

You should see the following in the **Request Logs**:

```json
{
  "sub": "B7IE--redacted--nts",
  "data": {
    "https://example.com/claim1/": "this-is-a-claim", //💥
    "https://example.com/claim2/": "here-is-another-claim", //🤯
    "iss": "https://zuplo-demo.us.auth0.com/",
    "sub": "B7IE--redacted--nts",
    "aud": "https://zuplo-auth-sample/",
    "iat": 1638236905,
    "exp": 1638323305,
    "azp": "B7IE--redacted--",
    "gty": "client-credentials"
  }
}
```

Note the two additional claims that can be used in your code, e.g.

```ts
if (request.user.data["https://example.com/claim1/"] === "this-is-a-claim") {
  // do something
}
```

Or you could even do smart routing based on a claim for this user.

```ts
const onwardUrl = request.user.data["https://example.com/onward-url"];

const result = fetch(onwardUrl);

return result;
```

Stay secure out there folks!
