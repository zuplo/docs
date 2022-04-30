---
title: Gateway over Salesforce APIs
date: "2021-02-21"
embed: true
---

It's easy to use Zuplo with Salesforce APIs. In this quickstart we'll work with
the Accounts API, but it can be modified to support any other Salesforce API.

To get started even quicker you can Zup It! Just click the button below and
we'll instantly create a new project for you with most of the code you need.

[Zup It!](https://portal.zuplo.com/clone?sourceRepoUrl=https://github.com/zuplo/samples-gateway-over-salesforce.git)

You'll need a 'Connected App' in Salesforce to authenticate. If you don't
already have one set up,
[follow this guide](/docs/advanced/setup-jwt-auth-with-salesforce). Once you have
your app's `consumer key`, `consumer secret` and `privatekey.pem` file, you're
ready to go!

## 1: Authorize Salesforce

From the file explorer, create a new **Empty Module** named `auth.ts`.

![New Module](/media/quickstarts/create-new-empty-module.gif)

Add the following code which takes care of Salesforce authentication.

```ts
import env from "@app/environment";
import { importPKCS8, SignJWT } from "@zuplo/runtime";

const SFDC_CONSUMER_KEY = env.SFDC_CONSUMER_KEY;
const SFDC_USERNAME = env.SFDC_USERNAME;
const SFDC_AUDIENCE = env.SFDC_AUDIENCE;
const SFDC_PRIVATE_KEY = env.SFDC_PRIVATE_KEY;

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
  const ecPrivateKey = await importPKCS8(SFDC_PRIVATE_KEY, ALG);

  // Create the JWT assertion
  const token = await new SignJWT({ scope: "api refresh_token" })
    .setProtectedHeader({ alg: ALG, typ: "JWT" })
    .setAudience(SFDC_AUDIENCE)
    .setIssuer(SFDC_CONSUMER_KEY)
    .setSubject(SFDC_USERNAME)
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRATION_TIME)
    .sign(ecPrivateKey);

  const res = await fetch(`${SFDC_AUDIENCE}/services/oauth2/token`, {
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

## 2: Environment Variables

We need to setup your environment. Open the **environment.json** file and delete
any example config or secret entries. Create the following environment
variables:

- `SFDC_INSTANCE_URL` (config) - your Salesforce mydomain e.g.
  `https://ORG_NAME.my.salesforce.com`
- `SFDC_AUDIENCE` (config) - either `https://login.salesforce.com` or
  `https://test.salesforce.com`
- `SFDC_USERNAME` (config) - Salesforce username (often your e-mail)
- `SFDC_CONSUMER_KEY` (config) - The consumer key from your connected app
- `SFDC_PRIVATE_KEY` (secret) - The contents of your privatekey.pem

![Environment Variables](/media/quickstarts/gateway-over-salesforce/environment-variables.png)

## 3: Query Module

Let's create another empty module called `query.ts` and populate it with the
following code, which is hopefully fairly self explanatory.

```ts
import { ZuploRequest, ZuploContext } from "@zuplo/runtime";
import { getAccessToken } from "./auth";
import env from "@app/environment";

export default async function (request: ZuploRequest, context: ZuploContext) {
  const { access_token } = await getAccessToken();

  const queryRes = await fetch(
    `${env.SFDC_INSTANCE_URL}/services/data/v54.0/query/?q=Select Id, Name from Account`,
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

## 4: Routes Setup

Open the **routes.json** file and change the first route's path to `/query`. Use
the function picker to select your new `default` export on the `query` module.

![Route Path](/media/quickstarts/gateway-over-salesforce/function-picker.png)

## 5: Test

Invoke your API using the Test Console. Add the new `/v1/query` configuration
and hit the Test button to invoke your API!

![Test Route](/media/quickstarts/gateway-over-salesforce/test-route.png)

## Congratulations

Your API is now live! BTW - you can see the URL in settings. Next, try posting
to your API from curl or using `fetch` in the browser.

![Project URL](/media/getting-started-hello-world/project-url.png)

Why not try one of the other getting started guides (above) or some of the
examples in our documentation:

- [Write your own policies](/docs/policies)
- [Archive requests to storage](/docs/examples/archiving-requests-to-storage)
- [Setting up JWT auth with Auth0](/docs/policies/auth0-jwt-auth)
