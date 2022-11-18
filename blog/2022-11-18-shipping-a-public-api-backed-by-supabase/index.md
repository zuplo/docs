---
title: Shipping a public API backed by Supabase
authors: josh
tags: [code, supabase, backend, public, api-first, auth, api-key]
description: How to use Zuplo to take your supabase backend and make it a developer friendly, public API.
---

Supabase is an incredible open-source alternative to Firebase and other BaaS (Backend-as-a-service) options. The design is somewhat optimized for consumption by first-party clients like your own website or mobile app. But what if you wanted to take all that supa-ness and make an API-first product — that is a developer-friendly public API?

There is an accompanying video for this post: [https://www.youtube.com/watch?v=GJSkbxMnWxE](https://www.youtube.com/watch?v=GJSkbxMnWxE)

This is where Zuplo can help. Zuplo is the fastest way to get your API to market and get a Stripe-quality experience with the [three critical pillars of any API program](https://zuplo.com/blog/2022/05/11/the-three-pillars-of-an-API-program/):

- authentication
- protection (rate-limiting, firewall)
- documentation

![zuplo layout](arch.png)

In this example I'm going to work with a simple table that allows people to
read and write entries to a supabase table that contains some reviews of skis (yes, I love to ski). Because this is an API for developers, they may be calling it from some backend service and can't login using the standard supabase method. This is where API keys are a much better choice - see [Wait, you're not using API keys?](https://zuplo.com/blog/2022/05/03/you-should-be-using-api-keys/).

We'll allow people, with a valid API key, to read data from the ski results table and to create new records. Hopefully it's obvious that there are many ways you can extend this example to add more behavior like roles based access, with custom policies, custom handlers and more. Come [join us on Discord](https://discord.gg/8QbEjr2MgZ) if you have questions or need inspiration.

## Setting up Supabase

If you haven't already, create a new project in supabase and create a table called ski-reviews with the following columns (feel free to use another domain and invent your own example):

- id (int8)
- created_at (timestamptz)
- make (varchar)
- model (varchar)
- year (int8)
- rating (int2)
- author (varchar)

Manually enter a couple of rows of data - so we have something to read from the DB.

## The read all reviews route in Zuplo

Create a new project in Zuplo - I went with `supabase-ski-reviews`.

Select the **File** tab and choose **Routes**. Add your first route with the following settings:

- method: `GET`
- path: `/reviews`
- summary: `Get all reviews`
- version: `v1`
- CORS: `Anything goes`

And in the request handler section, paste the `READ ALL ROWS` URL of your supabase backend (you can get to this in the \*\*API docs section of Supabase)

- URL Rewrite: `https://YOUR_SUPABASE_URL.supabase.co/rest/v1/ski-reviews?select=*`
- Forward Search: `unchecked`

In order to call the supabase backend I need to add some authentication headers to the request before we call supabase.

Expand the **Policies** section of your route. Click **Add policy** on the **Request** pipeline.

First, we don't want to forward any old headers that the client sends us to Supabase so find the **Clear Headers Policy** and add that to your inbound pipeline. Note, that we will allow the `content-type` header to flow through, so this should be your policy config.

```json
{
  "export": "ClearHeadersInboundPolicy",
  "module": "$import(@zuplo/runtime)",
  "options": {
    "exclude": ["content-type"]
  }
}
```

Next, we need to add the credentials to the outgoing request. We'll need to get the JWT token from supabase - you'll find it in **Settings** > **API** as shown below:

![secret_role jwt](secret-role.png)

Once you've got your service_role JWT, click **Add Policy** again on the **Request** pipeline and choose the **Add/Set Headers Policy** and configure it as follows:

```json
{
  "export": "SetHeadersInboundPolicy",
  "module": "$import(@zuplo/runtime)",
  "options": {
    "headers": [
      {
        "name": "apikey",
        "value": "$env(SUPABASE_API_KEY)",
        "overwrite": true
      },
      {
        "name": "authorization",
        "value": "$env(SUPABASE_AUTHZ_HEADER)",
        "overwrite": true
      }
    ]
  }
}
```

Save your changes.

Next, create two secret [environment variables](https://zuplo.com/docs/deployments/environment-variables) as follows:

- SUPABASE_API_KEY: `"YOUR_SUPABASE_SECRET_ROLE_JWT"`
- SUPABASE_AUTHZ_HEADER: `"Bearer YOUR_SUPABASE_SECRET_ROLE_JWT"`

Obviously, in both instances replace `YOUR_SUPABASE_SECRET_ROLE_JWT` with your service_role JWT from supabase.

You are now ready to invoke your API gateway and see data flow through from Supabase!

Click on the **open in browser** button shown below and you should see the JSON, flowing from supabase in your browser 👏.

![open in browser](open-in-browser.png)

## Adding authentication

At this point, that route is wide open to the world so we need to secure it. We'll do this using API keys. You can follow this guide [Add API key Authentication](https://zuplo.com/docs/quickstarts/add-api-key-auth). Be sure to drag the API Key authentication policy to the very top of your **Request** pipeline. Come back here when you're done.

Welcome back! You've now learned how to secure your API with API-Keys.

## Adding a Create route

Next we'll add a route that allows somebody to create a review. Add another route with the following settings

- method: `POST`
- path: `/reviews`
- summary: `Create a new review`
- version: `v1`
- CORS: `Anything goes`

And the request handler as follows:

- URL Rewrite: `https://YOUR_SUPABASE_URL.supabase.co/rest/v1/ski-reviews`
- Forward Search: `unchecked`

Expand the policies section and add the same policies (note you can reuse policies by picking from the existing policies at the top of the library)

![existing policies](existing-policies.png)

- api-key-auth-inbound
- clear-headers-inbound
- set-headers-inbound

Now your **create** route is secured, will automatically set the right headers before calling supabase. That was easy.

You can test this out by using the **API Test Console** to invoke your new endpoint. Go to the **API Test Console** and create a new test called `create-review.json`.

- Method: `POST`
- Path: `/v1/reviews`
- Headers:
  - `content-type`: `application/json`
  - `authorization`: `Bearer YOUR_ZUPLO_API_KEY`
- Body:

```json
{
  "make": "Rossignol",
  "model": "Soul HD7",
  "rating": 5,
  "year": 2019
}
```

![Test console](test-console.png)

If you invoke your API by clicking `Test` you should see that you get a **201 Created** - congratulations!

## Add validation to your post

To make your API more usable and more secure it is good practice to validate incoming requests. In this case we will add a JSON Schema document and use it to validate the incoming body to our POST.

Create a new schema document called `new-review.json`.

![new schema](new-schema.png)

This example fits the ski-reviews table we described above

```json
{
  "$id": "http://example.com/example.json",
  "type": "object",
  "default": {},
  "title": "Root Schema",
  "required": ["make", "model", "rating", "year"],
  "additionalProperties": false,
  "properties": {
    "make": {
      "type": "string",
      "default": "",
      "title": "The make Schema",
      "examples": ["DPS"]
    },
    "model": {
      "type": "string",
      "default": "",
      "title": "The model Schema",
      "examples": ["Pagoda"]
    },
    "rating": {
      "type": "integer",
      "default": 0,
      "title": "The rating Schema",
      "examples": [5]
    },
    "year": {
      "type": "integer",
      "default": 0,
      "title": "The year Schema",
      "examples": [2018]
    }
  },
  "examples": [
    {
      "make": "DPS",
      "model": "Pagoda",
      "rating": 5,
      "year": 2018,
      "author": "Josh"
    }
  ]
}
```

Now add a new policy to **request** pipeline for your `Create new review` route. Choose the **JSON Body Validation** policy and configure it to use your newly created JSON schema document:

```json
{
  "export": "ValidateJsonSchemaInbound",
  "module": "$import(@zuplo/runtime)",
  "options": {
    "validator": "$import(./schemas/new-review.json)"
  }
}
```

This policy can be dragged to the first position in your pipeline.

Now to test this is working, go back to your API test console and change the body of your `create-review.json` test to be invalid (add a new property for example). You should find that you get a `400 Bad Request` response.

![400 Bad Request](400-bad.png)

Finally, lean back and marvel at your beautiful Developer Portal that took almost zero effort to get this far, wow! Hopefully you already found the link for this when adding API key support :)

![Developer Portal](dev-portal.png)
