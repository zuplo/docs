---
title: Gateway over Salesforce APIs
date: "2021-02-21"
embed: true
---

Zuplo isn't your average gateway. It's a **programmable gateway** that can be
used to protect and share your own API _and_ used as a simple orchestration
layer over SaaS APIs. Choose your getting started guide:

<QuickstartPicker />

Because Zuplo is programmable you can easily use it with Salesforce APIs. In 
this quickstart we'll use Accounts but it can be modified to support any other 
Salesforce API. 

You'll need a 'Connected App' in order to authenticate. If you don't already
have one set up, [follow this guide](/guides/setup-jwt-auth-with-salesforce). 
Once you have a connected app configured and have your `consumer key`, 
`consumer secret` and `privatekey.pem` file you're ready to get started.

## 1

From the file explorer, create a new **Empty Module** named `auth.ts`. 
Add the following code which takes care of Salesforce authentication.

```ts
import env from "@app/environment";
import {
  ZuploContext,
  ZuploRequest,
  importPKCS8,
  SignJWT,
} from "@zuplo/runtime";

export const SFDC_INSTANCE_URL = env.SFDC_INSTANCE_URL;
const SFDC_CONSUMER_KEY = env.SFDC_CONSUMER_KEY;
const SFDC_USERNAME = env.SFDC_USERNAME;
const AUDIENCE = env.AUDIENCE;
const PRIVATE_KEY = env.PRIVATE_KEY;

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

## 2

Let's create another empty module called `query.ts` and populate it with the following
code, which is hopefully fairly self explanatory. 

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


## 3

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

## 4

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
- [Archive requests to storage](/guides/archiving-requests-to-storage)
- [Setting up JWT auth with Auth0](/guides/setup-jwt-auth-with-auth0)
