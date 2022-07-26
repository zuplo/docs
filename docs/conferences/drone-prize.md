---
title: Zuplo @ THAT Wisconsin
---

# Win a McLaren Lego Technic

![McLaren!](./mclaren.png)

Now read on to learn how you can win a McLaren Lego Technic and get an **instant** $5 Starbucks gift card. It's easy!

[Zuplo](https://zuplo.com) is a different kind of API gateway. It's programmable, meaning you can customize it in seconds with TypeScript. We make it easy to compose your microservices or share your API. Add API-key management (with key protection - ask us what this is), developer documentation, and rate-limiting for any stack, in under 5 minutes.

[Home](https://zuplo.com) | [Docs](/docs) | [Blog](/blog) | [Follow Us](https://twitter.com/zuplo)

---

## Share an API with Zuplo for your chance to win a drone

:::caution

**We recommend completing the exercise on a laptop.** The Zuplo portal doesn't work on phones. You can also stop by the booth and use one of our computers if that is easier.

This contest is for registered attendees of THAT Wisconsin only.
[Full rules and terms](./drone-prize-terms.md)

:::

# Challenge

Submit by noon on the last day of the conference. Limit of one prize per family.

## Part 1: Proxy an API

### Step 1 - Sign up

Sign up for a zuplo account at [portal.zuplo.com](https://portal.zuplo.com)

### Step 2 - Create a gateway

Create a new gateway (it takes less than a minute)

### Step 3 - Add a new route

See [the documentation about Url Rewrites](../handlers/url-rewrite.md) for more information.

Open **routes.json** and add a third route to the example project.

- It should support `GET` only
- The path should be `/products/:productId`
- Set the URL Rewrite to the legacy e-commerce API as follows
  `https://ecommerce-legacy.zuplo.io/objects?type=products&id=${params.productId}`
- Save your changes (Cmd ⌘ + S or Ctrl + S)

### Step 4 - Show your working gateway to the folks at the Zuplo stand

Open the test client <ApiTestConsoleTabIcon /> in the portal and test your new route

- Set the method to `GET`
- Set the URL to `/products/10000`
- Hit **Test!**
- Have Nate or Josh scan your badge at the booth

<p style={{fontSize:"20pt", fontWeight:600}}>✋ Wait, don’t stop there - earn a $5 Starbucks gift card by completing part 2</p>

## Part 2: Setup Rate Limiting

### Step 1 - Add another route

Open the routes.json file and add a new route

- It should support `GET` only
- The path should be `/hello-zuplo`

### Step 2 - setup rate-limiting to your new route

[Read the docs about rate limiting](../policies/rate-limit-inbound.md) for more information.

Open the policy editor for your new route

- Add a new policy
- Choose rate limiting
- Set a rate limit for IP allowing 3 requests per minute

### Step 3 - Change the request handler

Change the Request Handler of your new route to a custom function.

- Change the Request Handler from **URL Rewrite** to **Function**
- Save your changes to the Route file (CMD + S)
- Edit the custom function by clicking on the Hello World link.
- Change the code to return a message you want to share with Nate or Josh from Zuplo (be nice!), e.g.

```tsx
import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

export default async function (request: ZuploRequest, context: ZuploContext) {
  return "Wow, Zuplo is cool!";
}
```

### Step 4 - Show your working API to the folks at the Zuplo Stand

- You get it already!
- Hit your new route multiple times to test the rate limiting
- Show them your Dev Portal too
