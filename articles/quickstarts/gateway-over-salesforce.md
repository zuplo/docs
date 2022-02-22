---
title: Gateway over Salesforce APIs
date: "2021-02-21"
embed: true
---

Zuplo isn't your average gateway. It's a **programmable gateway** that can be
used to protect and share your own API _and_ used as a simple orchestration
layer over SaaS APIs. Choose your getting started guide:

<QuickstartPicker />

Because Zuplo is programmable you can easily use it to query Salesforce APIs.
Below, we will show you how to query for data in Salesforce. In this quickstart
we will use Accounts but you can modify it to use any other SObject and
operation supported by the Salesforce APIs.

## 1

Authenticating with Salesforce can be a little complicated. First, you need to
setup a Salesforce Connected App in order to authenticate. If you don't already
have an App setup, [follow this guide](/guides/setup-jwt-auth-with-salesforce)
guide to get the details needed to send requests from Zuplo.

After you have the Connected App configured. From the file explorer menu, create
a new **Empty Module** named `auth.ts`. Add the following code which takes care
of Salesforce authentication.

## 2

Let's start by creating a new module called `query.ts`. In the Zuplo portal. go
to `Files` then click the `plus` sign in `Modules`, select `New Empty Module`
and name it `query.ts`. Paste the following code into `query.ts` and update
lines 4 to 8 with your Salesforce connected app configuration details.

```ts
import {
  ZuploContext,
  ZuploRequest,
  importPKCS8,
  SignJWT,
} from "@zuplo/runtime";

const SFDC_INSTANCE_URL = "https://<org name>.my.salesforce.com"; // Your org's URL
const SFDC_CONSUMER_KEY = ""; // Connected app Consumer Key
const SFDC_USERNAME = "my@username.com"; // Salesforce username to be used in this integration
const AUDIENCE = "https://login.salesforce.com"; // Either login.salesforce or test.salesforce urls
const PRIVATE_KEY = ""; // Set the value from privatekey.pem

export interface RefreshTokenResponse {
  id: string;
  instance_url: string;
  access_token: string;
  scope: string;
  token_type: string;
}

export async function getAccessToken(): Promise<RefreshTokenResponse> {
  const ALG = "RS256";
  const JWT_EXPIRATION_TIME = "1h";
  const ecPrivateKey = await importPKCS8(PRIVATE_KEY, ALG);

  // Create the JWT assertion
  const token = await new SignJWT({ scope: "api refresh_token" })
    .setProtectedHeader({ alg: ALG, typ: "JWT" })
    .setAudience(AUDIENCE)
    .setIssuer(SFDC_CONSUMER_KEY)
    .setSubject(SFDC_USERNAME)
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRATION_TIME)
    .sign(ecPrivateKey);

  const res = await fetch(`${AUDIENCE}/services/oauth2/token`, {
    method: "POST",
    body: new URLSearchParams({
      assertion: token,
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    }),
  });

  const resJSON: RefreshTokenResponse = await res.json();
  return resJSON;
}
```

## 3

Now that we can generate an access token, calling the Salesforce API with
`fetch` is simple. Create another module called `query.ts` and add the following
code to that file.

```ts
import { getAccessToken } from "./auth";

export default async function (request: ZuploRequest, context: ZuploContext) {
  const { access_token } = await getAccessToken();

  const queryRes = await fetch(
    `${SFDC_INSTANCE_URL}/services/data/v54.0/query/?q=Select Id, Name from Account`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "content-type": "application/json;charset=UTF-8",
      },
    }
  );

  return queryRes;
}
```

Make sure to press Save - **note** ⌘+S or CTRL+S works, depending on your OS.

## 4

Open the **routes.json** file and change the **path** of the existing route to
be `/attendees` and set the **method** to `POST`. Save the file.

![Route Path](/media/quickstarts/gateway-over-salesforce/route-path.png)

Switch to the `routes.json` tab and edit the JSON so that the `/query`
`handler.module` and `handler.export` matches the code below.

> UI for selecting the module and export is coming soon.

```json
"routes": [
    {
      "label": "Query for Salesforce Accounts",
      "path": "/query",
      "handler": {
        "export": "default",
        "module": "$import(./modules/query)"
      },
      "methods": ["GET"],
      "corsPolicy": "anything-goes",
      "version": "v1",
      "policies": {
        "inbound": []
      }
    }
]
```

## 5

Invoke your API using the Test Console. Add the new `/v1/query` configuration
and hit the Test button to invoke your API!

![Test Route](/media/quickstarts/gateway-over-salesforce/test-route.png)

## Congratulations

Your API is now live! BTW - you can see the URL in settings. Next, try posting
to your API from curl or using `fetch` in the browser.

![Project URL](/media/getting-started-hello-world/project-url.png)

Why not try one of the other getting started guides (above) or some of the
examples in our documentation:

- [Write your own policies](/policies)
- [Archive requests to storage](/guides/archving-requests-to-storage)
- [Setting up JWT auth with Auth0](/guides/setup-jwt-auth-with-auth0)
