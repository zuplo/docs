---
title: Using Policies
---

Policies are modules that can intercept an incoming request. You can have
multiple policies and apply them to multiple routes. There are built-in policies
but of course, being a developer-focused platform you can easily create custom
policies.

Here's a [list and reference guide for policies](/docs/policies/).

## How policies work

![How policies work](https://cdn.zuplo.com/assets/665f904f-ee6d-418d-8de5-7da2a621cecd.png)

Zuplo policies follow the 'Command Chain' pattern. A policy can intercept a request and modify the request before it reaches the
request handler (and the next policy). It can also short-circuit the whole
request lifecycle and immediately respond to the client.

## Built-In Policies

Zuplo includes many built-in policies that make it easy to handle things like authentication, validation, and request modification. You can see the [full catalog of policies here](/docs/policies/).

## Custom Policies

The ability to write custom policies that run in-process of your Gateway is at the core of what makes Zuplo the Programmable API Gateway. You can write policies to handle virtually any task. To learn more about [writing custom policies see the documentation](/docs/policies/custom-code-inbound.md).
