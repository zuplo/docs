---
title: Default API Key
---

When you create a new Zuplo account, a default API key is automatically
generated for you. This key provides full access to your Zuplo account and is
intended to help you get started quickly. However, as you build your API and
deploy to production, you likely want to delete this key and create a new one
with more restricted permissions (if your plan supports fine-grained
permissions).

## Deleting the Default API Key

:::caution{title="Legacy Developer Portal"}

When using the legacy developer portal, the default API Key is used by the
developer portal backend to authenticate to your Zuplo services. If you delete
the default API key, your legacy developer portal will IMMEDIATELY stop working.

:::

To delete the default API key, follow these steps:

<Stepper>
1. Navigate to your Zuplo account settings.
2. Click on the **API Keys** section.
3. Locate the default API key in the list. It will be labeled "Default consumer for account-name" and have a "default" tag.
4. Click the **Delete** button next to the default API key.
5. Confirm the deletion when prompted.
</Stepper>
