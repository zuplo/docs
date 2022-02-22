## Salesforce OAuth 2.0 Bearer JWT flow setup

The recommended way of establishing a secure connection between Salesforce and other services, like Zuplo, is by using a [OAuth 2.0 Bearer JWT flow](https://help.salesforce.com/s/articleView?id=sf.remoteaccess_oauth_jwt_flow.htm&type=5) enabled by a Salesforce Connected App. We will use this configuration to sign requests from Zuplo to Salesforce APIs.

We'll walk you through the next 3 steps to setup your Salesforce Org.
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
