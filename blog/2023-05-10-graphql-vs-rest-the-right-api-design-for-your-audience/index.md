---
title: "GraphQL vs REST: Choosing the Right API Design for Your Audience"
authors: nate
tags: [developers, api, graphql]
description: |
  Choosing REST APIs for your external users can provide a quicker onboarding experience to your API. Learn how to translate your existing GraphQL API into a simplified REST API.
image: https://og-image.zuplo.com/?text=GraphQL%20vs%20REST:%20Choosing%20the%20Right%20API%20Design%20for%20Your%20Audience
---

If your business provides and API to your customers and partners (which it
almost always should!) it is important to build your API in a way that helps
developers be successful. While there are many elements to API design, this post
will discuss the choice between GraphQL and REST. GraphQL is often an excellent
choice for internal APIs but might not always be the right fit for
customer-facing or partner APIs due to its complexity. This post will discuss
some of the tradeoffs between GraphQL and REST as well as offer some ideas on
how this doesn’t have to be an OR decision, but rather how you can relatively
easily support both GraphQL and REST.

## GraphQL: Powerful and Complex

GraphQL, a query language for APIs, was developed by Facebook in 2012 to address
the limitations of traditional REST APIs. A GraphQL API can make your frontend
more performant by allowing fine-grain queries that allow fetching exactly the
data needed for your app. This makes a lot of sense for certain apps (especially
super complex one’s like Facebook). Some additional benefits of GraphQL are:

1. **Flexibility**: GraphQL allows clients to request the exact data they need,
   without over-fetching or under-fetching. This enables faster and more
   efficient communication between services.
2. **Strong Typing**: GraphQL's type system enables API developers to define the
   types of data that can be requested, making it easier to maintain and debug
   applications.
3. **Schema Introspection**: GraphQL provides built-in tools for exploring and
   understanding the API, making it easier for developers to work with and build
   upon.

Despite its numerous benefits, GraphQL's complexity can be a challenge when it
comes to external APIs shared with customers or partners. Here's why:

1. **Steeper Learning Curve**: GraphQL's query language and type system can be
   daunting for developers who are new to the technology. This can lead to
   increased onboarding time and difficulty when it comes to integrating with
   external systems.
2. **Security Concerns**: GraphQL's flexibility can also lead to potential
   security issues, such as exposing sensitive data or allowing clients to
   perform costly operations that could impact server performance. This requires
   careful implementation of access controls and query validation.
3. **Resource Intensive**: The flexibility of GraphQL means that queries can
   becoming extremely complex and taxing on your backend. For example, a request
   might end up requesting data from multiple tables in your database over a
   large timespan. You must be extremely careful when implementing your API to
   ensure customers are generating queries that tax your systems.

## REST: A Simpler Choice for External APIs

Considering the challenges posed by GraphQL's complexity, REST is often a better
choice for APIs shared with customers or partners. Here's why:

1. **Simplicity**: REST is based on standard HTTP verbs (GET, POST, PUT, DELETE)
   and status codes, making it intuitive and easy to use for developers who are
   already familiar with HTTP.
2. **Compatibility**: REST APIs can be easily consumed by various clients,
   including web browsers, mobile apps, and other servers, without the need for
   specialized libraries or tools.
3. **Caching**: REST APIs support built-in HTTP caching mechanisms that are easy
   to implement and will improve performance and reduces server load.
4. **Mature Ecosystem**: REST has been the dominant API design style for years,
   resulting in a mature ecosystem with extensive documentation, tooling, and
   libraries. Everybody developer, on any platform, with any language can use a
   REST API.

## Making the Choice (or not)

So say you really want to use GraphQL (or maybe you already built a GraphQL
API), but now you want to share your API with customers or partners. For the
vast majority of scenarios, REST is a better choice for an external API.
Developers will onboard faster, you will spend less time supporting your
external API program - it’s just easier. Fortunately, you don’t have to choose.
There a several great libraries out there that make it easy to proxy a REST API
to a GraphQL backend.

One such library is called [SOFA](https://github.com/Urigo/SOFA). This is a
Javascript library that is compatible with Node, Deno, and standard fetch APIs.
It doesn’t have a dependency on any specific framework so it can basically be
plugged into any web server.

## Building a REST to GraphQL Proxy

In this next section, we’ll explore how to build expose a GraphQL API with REST
using SOFA and expressjs.

You can see the
[full source of this example on Github](https://github.com/zuplo/graphql-over-rest-sample),
but lets go through the important parts below. First, install create a new
project and install the dependencies.

```bash
npm init -y
npm install express sofa-api @graphql-tools/schema
```

For this sample, we’ll use ESM modules so open your `package.json` and add the
property `"type": "module"`.

Next, create a `index.mjs` (make sure to use mjs for ESM) file with a simple
express server. Add the sofa module to the `/api` route.

```js
import { useSofa } from "sofa-api";
import { makeExecutableSchema } from "@graphql-tools/schema";
import express from "express";
import { resolvers } from "./resolvers.mjs";
import { typeDefs } from "./schema.mjs";

const app = express();

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

app.use(
  "/api",
  useSofa({
    basePath: "/api",
    schema,
  })
);

app.listen(3000, () => {
  console.log(`Example app listening on port 3000`);
});
```

Next, add your schema. There are several ways to do this, but to keep it simple
here it will just be a string. Create the file schema.mjs and add the schema.
The full file can be found in the example.

```js
export const typeDefs = `
  type Pizza {
    dough: String!
    toppings: [String!]
  }

  type Salad {
    ingredients: [String!]!
  }
  ...
`;
```

Finally, create a mock resolver in resolver.mjs that just returns data from
fixed collections. In a real app this would be your GraphQL resolver.

```js
export const resolvers = {
  Query: {
    me() {
      return UsersCollection.get(1);
    },
    user(_, { id }) {
      return UsersCollection.get(id);
    },
    ...
  }
}
```

Run npm start in the project directory and query the server. Try navigating to
https://localhost:3000/api/users or using your
[favorite API client](https://httpie.io/desktop) to fetch the list of users.

![REST API users response](./http-response.png)

## Wrapping Up

While GraphQL is a powerful and flexible choice for building internal APIs, its
complexity can make it less suitable for customer-facing or partner APIs. REST,
with its simplicity and ease of use, is often a better choice for external APIs.
Ultimately, the decision between GraphQL and REST should be based on your
specific use case, the needs of your developers, and the requirements of your
customers or partners. Or if you find yourself in a position of not wanting to
choose, you can use a few great open source libraries to expose your existing
GraphQL API to your external users as a REST API.
