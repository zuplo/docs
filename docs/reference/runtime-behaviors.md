---
title: Runtime Behaviors
---

Zuplo's core gateway runtime is built on [open web-standards](./web-standard-apis.md). However, there are some cases where Zuplo either differentiates from the standard or where the standard doesn't apply due to Zuplo running server-side rather than in the browser. There are also some behaviors that are enforced in Zuplo that may be unfamiliar to developers coming from other systems. This document aims to outline behaviors that developers may encounter and suggested ways to handle these behaviors.

Because some legacy APIs may require non-standard behavior, most of these behaviors can be modified for your particular deployment. Contact support@zuplo.com to discuss options.

## Request.body

The [standard](https://developer.mozilla.org/en-US/docs/Web/API/Request/body) for `Request.body` specifies that on `GET` and `HEAD` requests the value must be `null`. Different APIs, networks, and gateways follow this spec to varying degrees. In some cases they allow in others they don't.

By default, Zuplo will return a 500 error in the event that a `GET` or `HEAD` request has a body.
