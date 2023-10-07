---
title: Step 2 - API Key Authentication
---

In this guide we'll add API Key authentication to a route. You can do this for
any Zuplo project but will need a route, consider completing
[step 1](./step-1-setup-basic-gateway.md) first.

API Key authentication is one of our most popular policies as implementing this
authentication method is considered one of the easiest to use by developers but
hard for API developers to get right. We also support JWT tokens and other
authentication methods.

## 1/ Add the API Key authentication policy

Navigate to your route in the **Route Designer** and open the **Policies**
section.

![Add policy](https://cdn.zuplo.com/assets/14b608c1-d95c-4b98-9ae8-16affad90eca.png)

Add the API key authentication policy and click OK to accept the default policy
JSON. Note,

![Add API Key Authentication](https://cdn.zuplo.com/assets/811a8152-9648-4377-a070-be6ec539a4d6.png).

:::tip The API key auth policy should usually be one of the first policies in
your request pipeline, drag it to the top if you have multiple policies.

<Screenshot src="https://cdn.zuplo.com/assets/8f698429-f265-40d9-99d7-156b28b7ef1b.gif" size="sm" />
:::

If you test your route, you should get a 401 Unauthorized response

```
{
  "status": 401,
  "title": "Unauthorized",
  "type": "https://httpproblems.com/http-status/401",
```

## 2/ Set up an API key consumer

In order to call your API, you need to configure an API consumer. Go to
Settings > API Consumers. Click **Add New Consumer**

![API Key Consumers](https://cdn.zuplo.com/assets/a716aeeb-4355-45ff-a8ed-4c20d6644424.png)

Create a name for your identity - this will be the subject (or sub) that
identifies the user when calling Zuplo. Add your own e-mail address to the **Key
managers** field and add some JSON metadata - this is freeform (but must be
valid JSON). This metadata will be made available to the runtime when a key is
used to authenticate.

![New Consumer](https://cdn.zuplo.com/assets/71bee20e-eac7-4067-b1a3-50bc8267b330.png)

## 3/ Go the the Developer Portal to get your key

Find the URL for your Developer Portal - this is available on the Getting
Started page in the Files tab.

![Developer Portal link](https://cdn.zuplo.com/assets/f5b5f82a-4424-43f4-9b8f-2f4e91c4113e.png)

Navigate to your developer portal - you'll see a **Sign In** button. Click it
and sign in, using the same e-mail you specified as the Key manager.

![Dev Portal](https://cdn.zuplo.com/assets/b59f82d1-4e91-4874-a432-a73796fc1632.png)

You should now see a key, ready to be minted, in the **Authentication** section
of your Developer Portal.

![Authentication section](https://cdn.zuplo.com/assets/7dfa4541-bb4b-4e79-88b2-8cffed6c79d7.png)

Create a key for this consumer identity and copy the key to the clipboard.

## 4/ Test out your new key

Since we need to send the key in a header, it's hard to use the browser for this
test. We'll use our built in test client in Zuplo but you could also use Postman
for this part.

Go to the API Test Console and create a new **Manual Test**. Set the **path** to
`/todos` and hit **Test**.

![Test Console](https://cdn.zuplo.com/assets/611050a5-257e-4594-a914-1da68d504371.png)

You should get a 401 Unauthorized response. Add an new `authorization` header
with the value `Bearer YOUR_API_KEY` and insert the API Key you got from the
developer portal.

You should now get a 200 OK.

![200 OK](https://cdn.zuplo.com/assets/82823f9d-62ad-4f18-9e07-bb89dc9ad32d.png)

:::note We also offer an API for our API key service that allows you to
programmatically create consumers and even create your own developer portal or
integrate key management into your existing dashboard. Contact us at
`support@zuplo.com` for access. :::

**NEXT** Try
[step 3 - add Rate Limiting to your API](./step-3-add-rate-limiting.md).
