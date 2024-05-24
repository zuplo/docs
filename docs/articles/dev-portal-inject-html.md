---
title: Dev Portal Inject Custom Html
sidebar_label: Inject Custom Html
---

:::info Enterprise Feature

This feature is only available as as part of our enterprise plans. It is free to
try only any plan for development only purposes. If you would like to use this
in production reach out to us: [sales@zuplo.com](mailto:sales@zuplo.com)

:::

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
