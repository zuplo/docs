---
title: Gateway over Salesforce APIs
embedTitle: Getting Started
date: "2021-02-21"
embed: true
---

Zuplo isn't your average gateway. It's a **programmable gateway** that can be
used to protect and share your own API _and_ used as a simple orchestration
layer over SaaS APIs. Choose your getting started guide:

<QuickstartPicker />

# Gateway over Salesforce APIs

The recommended way of establishing a secure connection between Salesforce and other services, like Zuplo, is by using a [OAuth 2.0 Bearer JWT flow](https://help.salesforce.com/s/articleView?id=sf.remoteaccess_oauth_jwt_flow.htm&type=5) enabled by a Salesforce Connected App. We will use this configuration to sign requests from Zuplo to Salesforce APIs.

## Prerequisites: Salesforce Configuration

- Step 1: Create a private key and X509 certificate
- Step 2: Create a connected app
- Step 3: Approve the connected app

### Step 1: Create a private key and X509 certificate
Using `openssl` we will create a private key (`privatekey.pem`), that will be used to sign the JWT claim, and a certificate (`certificate.pem`) that will be uploaded to the Salesforce connected app to validate the signed JWT assertions.

```
 $ openssl req -x509 -sha256 -nodes -days 365000 -newkey rsa:2048 -keyout privatekey.pem -out certificate.pem
 .. <follow the prompts>
```

### Step 2: Create a connected app
Log in to your Salesforce organization and go to Settings > Build > Create > Apps > New (connected app)
 - Fill out the required fields in the `Basic Information` section. These are for book keeping only.
 - In the `API (Enable OAuth Settings)` section do the following:
    - Check `Enable OAuth Settings`
    - `Callback URL` is not used in the JWT flow but we need it for Step 3. Use `http://localhost:3000/callback` or similar.
    - Check `Use digital signatures` and upload the `certificate.pem` file we generated in Step 1.
    - In `Selected OAuth Scopes` pick options `Manage user data via APIs (api)` and `Perform requests at any time (refresh_token, offline_access)`
- Click `Save`.
- You should now be able to see a `Consumer Key` (also known as `client_id`) and `Consumer Secret` (also known as `client_secret`) fields in `API (Enable OAuth Settings)` section. We will use these two in the following steps.

### Step 3: Approve the connected app
Salesforce relies on a previously granted refresh token before using the JWT flow. Because of this we'll create a POST request using the data we obtained in the previous steps.

NOTE: This needs to be ran once per user or profile being used.

```
// Without this step we will get an `invalid_grant` error response from Salesforce
{"error":"invalid_grant","error_description":"user hasn't approved this consumer"}
```

Using an HTTP client like Postman or curl we will run two requests. The first one will give us an authorization code which we will use in the second request, together with client id & client secret, to get a refresh token.

#### Getting a Authorization Code
Based on the values we used to configure the connected app we will create a `GET` request that will grant us the authorization code. We can use a browser tab for this.

- Authorization URL : `https://login.salesforce.com/services/oauth2/authorize` or `https://test.salesforce.com/services/oauth2/authorize` if you are using a non-production Org.
- Redirect URL: `http://localhost:3000/callback` (must be URL encoded)
- Client Id : `Consumer Key` from the connected app
- Response type: `code`

The url will look like this :
```
https://login.salesforce.com/services/oauth2/authorize?client_id=<Consumer Key from Connected app>redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback&response_type=code
```

#### Getting the Refresh Token
Once we get the authorization code, we will use Postman or curl we will run the following `POST` request:

```
https://login.salesforce.com/services/oauth2/token?grant_type=authorization_code&code=<previously acquired code>&client_id=<Consumer Key from Connected app>&client_secret=<Consumer Secret from Connected app>&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback
```

Now we are ready to use the connected app in Zuplo!

## Query Salesforce Data

Because Zuplo is programmable you can easily use it to query Salesforce APIs. Below, we will show you how to query for data in Salesforce. In this example we will use Accounts but you can modify it to use any other SObject in your Org that you have access to.

## 1

Let's start by creating a new module called `query.ts`. In the Zuplo portal. go to `Files` then click the `plus` sign in `Modules`, select `New Empty Module` and name it `query.ts`.

## 2

Paste the following code and update lines 4 to 8 with your Salesforce connected app configuration details.

```ts
import { ZuploContext, ZuploRequest } from "@zuplo/runtime";
import { importPKCS8, SignJWT } from "jose";

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