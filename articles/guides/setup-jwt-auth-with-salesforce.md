---
title: Salesforce OAuth 2.0 Bearer JWT flow setup
---

The recommended way of establishing a secure connection between Salesforce and
other services is to use a
[OAuth 2.0 Bearer JWT flow](https://help.salesforce.com/s/articleView?id=sf.remoteaccess_oauth_jwt_flow.htm&type=5)
enabled by a Salesforce Connected App. We will use this configuration to sign
requests from Zuplo to Salesforce APIs.

If you don't have a Salesforce instance, you can get one for free at https://developer.salesforce.com/signup.

We'll walk you through the next 3 steps to setup your Salesforce Org.

- Step 1: Create a private key and X509 certificate
- Step 2: Create a connected app
- Step 3: Warm up (approve) the connected app

### Step 1: Create a private key and X509 certificate

Using `openssl` we will create a private key `privatekey.pem`, that will be
used to sign the JWT claim, and a certificate `certificate.pem` that will be
uploaded to the Salesforce connected app to validate the signed JWT assertions.

`$ openssl req -x509 -sha256 -nodes -days 365000 -newkey rsa:2048 -keyout privatekey.pem -out certificate.pem`

And follow the prompts...

### Step 2: Create a connected app

Log in to your Salesforce organization and within **Setup** go to 
**PLATFORM TOOLS > Apps > App Manager**  and click **New Connected App** (you can also come back to 
this screen to view the consumer key and secret for existing apps.)

- Fill out the required fields in the `Basic Information` section. These are for
  book keeping only.
- In the **API (Enable OAuth Settings)** section do the following:
  - Check **Enable OAuth Settings**
  - **Callback URL** is not used in the JWT flow but we need it for Step 3. If you don't have
  a real callback URL, you can use our helper callback page `https://callback.zuplo.io`.
  - Check **Use digital signatures** and upload the `certificate.pem` file we
    generated in Step 1.
  - In **Selected OAuth Scopes** pick options **Manage user data via APIs (api)**
    and **Perform requests at any time (refresh_token, offline_access)**
- Click **Save**.
- You should now be able to see a **Consumer Key** (also known as `client_id`) and
  **Consumer Secret** (also known as `client_secret`) fields in
  **API (Enable OAuth Settings)** section. We will use these two in the following
  steps.

Go to **PLATFORM TOOLS > Apps > Connected Apps > Manage Connected Apps**. Click the **Edit** 
action next to your new app. 

- Set **Permitted Users** to **All users may self-authorize**

### Step 3: Warm up (approve) the connected app

You now have everything you need to connect to Salesforce using JWT (consumer key, 
consumer secret and privatekey.pem) but there's one more important thing to complete. 

Before you can use the JWT flow and create an access token, you must have already 
been granted a refresh token. We'll do that manually below. 

It's important that this is performed once per user or profile being used, otherwise
you'll get an `Invalid Grant` - `user hasn't approved this consumer` error. 

#### Getting a Authorization Code

Based on the values we used to configure the connected app we will create a
`GET` request that will grant us the authorization code. We can use a browser
tab for this.

- Authorization URL : `https://login.salesforce.com/services/oauth2/authorize`
  or `https://test.salesforce.com/services/oauth2/authorize` if you are using a
  non-production Org.
- Redirect URL: your redirect url or `https://callback.zuplo.io`
- Client Id : The **Consumer Key** from the connected app
- Response type: `code`

The url will look like this - open it in your browser.

```
https://login.salesforce.com/services/oauth2/authorize?client_id=<Consumer Key from Connected app>&redirect_uri=https%3A%2F%2Fcallback.zuplo.io&response_type=code
```

It should redirect to `https://callback.zuplo.io` where your Authorization code will be displayed.

#### Getting the Refresh Token

Once we get the authorization code, we will use Postman or curl we will run the
following `POST` request:

```
curl -X POST https://login.salesforce.com/services/oauth2/token?grant_type=authorization_code&code=<previously acquired code>&client_id=<Consumer Key from Connected app>&client_secret=<Consumer Secret from Connected app>&redirect_uri=https%3A%2F%2Fcallback.zuplo.io
```

Now we are ready to use the connected app in Zuplo!
