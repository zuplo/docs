---
title: Zuplo @ API Conference Berlin
---

# Win a McLaren Lego Technic

disp
![McLaren!](./mclaren.png)

Read on to learn how you can win a McLaren Lego Technic.

[Zuplo](https://zuplo.com) is a different kind of API gateway. We believe you make better APIs with tools engineers LOVE to use and can collaborate with, vs creating top-down Governance that you **force** on your engineering teams.

With Zuplo, teams can create unlimited live environments and each takes less than 30 seconds to deploy. Have some fun with this exercise and ask the team for more information!

It's programmable and gitops enabled. We make it easy for you to ship better APIs that other developers love.

The draw will be at 3:15pm (during the break) on October 19 - you'll need to be present to win your prize.

[Home](https://zuplo.com) | [Docs](/docs) | [Blog](/blog) | [Follow Us](https://twitter.com/zuplo)

---

## Share an example API using Zuplo to win!

:::caution

**We recommend completing the exercise on a laptop.** The Zuplo portal isn't designed to work on phones. You can also stop by the booth and use one of our computers if that is easier.

This contest is for registered attendees of API Conference, Berlin only.
[Full rules and terms](./conference-prize-terms.md)

:::

# Challenge

Submit by 3:15pm on the last day of the conference. Limit of one prize per person.

## Part 1: Proxy an API

We're going to setup a gateway for an example API that could be your backend. And in just a few minutes we'll add API key authentication, rate-limiting and a developer portal!

### Step 1 - Sign up

Sign up for a zuplo account at [portal.zuplo.com](https://portal.zuplo.com)

### Step 2 - Create a gateway

Create a new gateway (it takes less than a minute)

### Step 3 - Add a new route

See [the documentation about Url Rewrites](../handlers/url-rewrite.md) for more information.

Open **Routes** and add a route to the example project.

- It should support `GET` only
- The path should be `/todos`
- Set the URL Rewrite to the legacy e-commerce API as follows
  `https://jsonplaceholder.typicode.com/todos`
- Save your changes (Cmd ⌘ + S or Ctrl + S)

### Step 4 - Show your working gateway to the folks at the Zuplo stand

Open the test client <ApiTestConsoleTabIcon /> in the portal and test your new route

- Set the method to `GET`
- Set the URL to `/todos`
- Hit **Test!**

Congratulations, you have successfully proxied your first API call!

### Step 5 - Check out your Developer Portal

Open the "Files" tab (top left) and choose "Getting Started". You should see a section called "Your API Gateway is LIVE"

### Step 6 - Show your working API to the folks at the Zuplo Stand

- Show them your rate limited API and developer portal and they will take your details to enter you into the prize draw.

- There'll be a new exercise tomorrow so be sure to come back and try again!
