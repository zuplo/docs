---
title: Gateway over Salesforce APIs
date: "2021-02-21"
embed: true
---

Zuplo isn't your average gateway. It's a **programmable gateway** that can be
used to protect and share your own API _and_ used as a simple orchestration
layer over SaaS APIs. Choose your getting started guide:

<QuickstartPicker />

Because Zuplo is programmable you can easily use it to query Salesforce APIs. Below, we will show you how to query for data in Salesforce. In this quickstart we will use Accounts but you can modify it to use any other SObject and operation supported by the Salesforce APIs.

The recommended way of establishing a secure connection between Salesforce and other services, like Zuplo, is by using a [OAuth 2.0 Bearer JWT flow](https://help.salesforce.com/s/articleView?id=sf.remoteaccess_oauth_jwt_flow.htm&type=5) enabled by a Salesforce Connected App. Follow the [Salesforce OAuth 2.0 Bearer JWT flow setup](../guides/setup-jwt-auth-with-salesforce.md) guide to get the details needed to send requests from Zuplo.

## 1

Let's start by creating a new module called `query.ts`. In the Zuplo portal. go to `Files` then click the `plus` sign in `Modules`, select `New Empty Module` and name it `query.ts`.

## 2

Paste the following code and update lines 4 to 8 with your Salesforce connected app configuration details.

```ts
import { ZuploContext, ZuploRequest, importPKCS8, SignJWT } from "@zuplo/runtime";

const SFDC_INSTANCE_URL = "https://<org name>.my.salesforce.com"; // Your org's URL
const SFDC_CONSUMER_KEY = ""; // Connected app Consumer Key
const SFDC_USERNAME = "my@username.com"; // Salesforce username to be used in this integration
const AUDIENCE = "https://login.salesforce.com"; // Either login.salesforce or test.salesforce urls
const PRIVATE_KEY = ""; // Set the value from privatekey.pem

interface RefreshTokenResponse {
  id: string;
  instance_url: string;
  access_token: string;
  scope: string;
  token_type: string;
}

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

async function getAccessToken(
): Promise<RefreshTokenResponse> {
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

Make sure to press Save - **note** ⌘+S or CTRL+S works, depending on your OS.

## 3

Open your **routes.json** file. We will now add a new route with a path of `/v1/query` that uses the `query.ts` module we previously created.

```
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

Invoke your API using the Test Console. Add the new `/v1/query` configuration and hit the Test button to invoke your API!
