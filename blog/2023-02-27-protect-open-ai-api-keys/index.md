---
title: Protect your OpenAI API Keys
authors: josh
tags: [open-ai, api-key, security, rate-limiting]
description: Use Zuplo to protect your Open AI API key and rate-limit-usage
image: https://og-image.zuplo.com?text=Protect%20your%20OpenAI%20API%20Keys
---

OpenAI is all the rage now and developers are rushing to leverage this technology in their apps and SaaS products. But such is the demand for this stuff, you might need to think about how you protect yourself from abuse - here's a post from a colleague I saw on LinkedIn recently:

![LinkedIn comment](https://cdn.zuplo.com/assets/2394894b-3ee3-444e-978e-03e5d5b917ce.png)

You can use a Zuplo gateway to store your API keys and enforce a number of layers of protection to discourage abuse of your OpenAI API keys.

## How it works

![Zuplo Gateway for OpenAI](https://cdn.zuplo.com/assets/4a286924-393f-4e38-bb78-e4c3d0d42f4d.png)

Zuplo allows you to easily perform authentication translation, that is, change the authentication method your clients use. For example you might require your clients to use

- [JWT tokens](/docs/policies/open-id-jwt-auth-inbound)
- [API Keys](/docs/policies/api-key-auth-inbound) issued to each of _your_ customers (different to your OpenAI key, so you can identify each individual customer)
- **Anonymously** in a web browser — but ensure the call is coming from the right origin, enforce CORS and rate-limit by IP etc.

## Setting up Zuplo to send the API Key

This is a CURL command to call the OpenAI API directly, note the need for an API KEY

```bash
curl https://api.openai.com/v1/completions \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_API_KEY_HERE' \
  -d '{
  "model": "babbage",
  "prompt": "Say this is a test",
  "max_tokens": 7,
  "temperature": 0
}'
```

To get started we'll create a simple Zuplo gateway that removes the need to specify the API key.

Create a new project and add a route:

- Summary: `My OpenAI Completions`
- Path: `/v1/my-completions`
- Method: `POST`
- CORS: `No CORS`
- Handler: **URL Rewrite** - `https://api.openai.com/v1/completions`

Next, we need to add a policy that will set the `authorization` header when calling OpenAI. Open the **Policies** section and click **Add Policy**.

![Add or Set Request Headers](https://cdn.zuplo.com/assets/8ab3d754-b3b1-45ec-9c7b-f932b8c08bd7.png)

Choose the **Add or Set Request Headers** policy. Set the policy configuration as follows

```json
{
  "export": "SetHeadersInboundPolicy",
  "module": "$import(@zuplo/runtime)",
  "options": {
    "headers": [
      {
        "name": "authorization",
        "value": "Bearer $env(OPEN_AI_API_KEY)",
        "overwrite": true
      }
    ]
  }
}
```

Note that we will read the API Key from a secure secret stored as an [environment variable](/docs/articles/environment-variables) - go setup your `OPEN_AI_API_KEY` env var.

Save your changes, and we're ready.

Take the above `curl` command and remove the authorization header and change the URL to your project URL:

```bash
curl https://open-ai-main-298dc8d.d2.zuplo.dev/v1/my-completions \
  -H 'Content-Type: application/json' \
  -d '{
  "model": "babbage",
  "prompt": "Say this is a test",
  "max_tokens": 7,
  "temperature": 0
}'
```

Look no API key 👏 - but your request should work fine as Zuplo will add the key on the way out.

## Securing Zuplo

You now have several choices to secure Zuplo.

1. Require your users to login (with a service like Auth0) and then use an [Auth0 JWT with Zuplo](/docs/policies/auth0-jwt-auth-inbound).
2. Issue API Keys to all your users using [Zuplo's API Key Service](/docs/policies/api-key-auth-inbound).
3. Host anonymously but add additional safe guards, including requiring a specific Origin and strict CORS using [custom CORS policies](/docs/articles/custom-cors-policy).

Make sure to add [rate limiting](/docs/articles/step-3-add-rate-limiting) - based on user or maybe IP (for anonymous use case).

## Event Streaming (data-only server-sent events)

OpenAI supports event streaming, this is easy to get working with Zuplo and works out of the box. You can try this by adding a `stream: true` property to your POST to OpenAI:

```bash
curl https://open-ai-main-298dc8d.d2.zuplo.dev/v1/my-completions \
  -H 'Content-Type: application/json' \
  -d '{
  "model": "babbage",
  "prompt": "Say this is a test",
  "max_tokens": 7,
  "temperature": 0,
  "stream": true
}'
```

However, what if you want to support EventSource in the browser? That is easy to accomplish with Zuplo also by taking the incoming GET request created by EventSource and translating it into a POST request, with the appropriate headers and body inside Zuplo.

:::tip
Event streaming doesn't work fully on 'working-copy' but works great on your
'edge deployments'. Read more about [environments](https://zuplo.com/docs/articles/environments) to promote to an edge deployment.
:::

Create a new route:

- Summary: `My OpenAI Completions for Browser Event Source`
- Path: `/v1/my-browser-completions`
- Method: `GET`
- CORS: `Anything Goes`
- Handler: **URL Rewrite** - `https://api.openai.com/v1/completions`

Add the following policies

- Reuse your Set Header policy that sets the authorization key above.
- Add a [Change Method](/docs/policies/change-method-inbound) policy to update the request to be a `POST`
- Add another [Set Header](/docs/policies/set-headers-inbound) policy to set the `content-type` header to `application/json`
- Finally, add a [Set Body](/docs/policies/set-body-inbound) policy with the following configuration.

![Policies](https://cdn.zuplo.com/assets/88a26721-d314-4df6-acbe-dc04be865bb5.png)

```json
{
  "export": "SetBodyInboundPolicy",
  "module": "$import(@zuplo/runtime)",
  "options": {
    "body": "{  \"model\": \"babbage\",  \"prompt\": \"Say this is a test\", \"max_tokens\": 7, \"temperature\": 0, \"stream\": true }"
  }
}
```

You can now use an EventSource in a browser and call Zuplo as follows

```js
const evtSource = new EventSource(
  "open-ai-main-298dc8d.d2.zuplo.dev/v1/my-browser-completions"
);

evtSource.onmessage = (evt) => {
  if (evt.data === "[DONE]") {
    console.log("end of event stream...");
    return;
  }
  console.log(JSON.parse(evt.data));
};
```

You could also make the POST body dynamic, based on a querystring in the EventSource - you would then read the querystring values in a [custom policy](/docs/policies/custom-code-inbound) and set the body based on values in the querystring (you would no longer need the **Set Body** policy in this case).

The custom code (inbound policy) might look like this

```ts
import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

export default async function (
  request: ZuploRequest,
  context: ZuploContext,
  options: never,
  policyName: string
) {
  const prompt = request.query.prompt;

  // perform any appropriate validation on `prompt` here

  const data = {
    model: "babbage",
    prompt, // pass the query value in here
    max_tokens: 7,
    temperature: 0,
  };

  return new ZuploRequest(request, {
    body: JSON.stringify(data),
  });
}
```
