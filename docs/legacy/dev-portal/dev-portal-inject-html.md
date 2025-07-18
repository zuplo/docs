---
title: Developer Portal Inject Custom Html
sidebar_label: Inject Custom Html
description:
  Learn how to inject custom HTML and handle authentication events in the LEGACY
  Zuplo Developer Portal, including practical examples for adding scripts and
  listening to user identification.
---

<LegacyDevPortal />

The Zuplo Developer Portal allows you to inject custom HTML into the portal.
This is typically used to inject custom analytics scripts.

### Injecting Custom HTML

To inject custom HTML into the developer portal, add a file in your project's
`/docs` folder called `_inject.html`.

The contents of this file will be injected just before the closing `</body>`
tag.

```html title="_inject.html"
<script>
  console.log("Hello from Zuplo!");
</script>
```

### Events

You can also listen to events emitted by the developer portal. The following
events are available:

#### Identify

This event is emitted when a user is authenticated. The event data is shown
below.

```ts
interface IdentifyEvent {
  sub: string;
  name?: string;
  email: string;
  email_verified: boolean;
  picture?: string;
  id_token?: string;
}
```

To listen to this event, add the following code to your `_inject.html` file.

```html title="_inject.html"
<script>
  window.zuploEvents.on("identify", (e) => {
    console.log("user identified", e);
  });
</script>
```
