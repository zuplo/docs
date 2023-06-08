---
title: Authentication
---

:::tip

The API key is scoped to your account. So you can use the same one for all
projects under the same account. If you are a member of multiple accounts, be
sure to select the right one.

:::

The Zuplo CLI, `zup`, uses API Keys to authenticate. You can find your API Key
by following these steps:

1. Navigate to [portal.zuplo.com](portal.zuplo.com) and log in.
2. Select the project that you want to work on.
3. Click on the "Settings" tab and navigate to the "Zuplo API Keys" section.

![Zuplo API Keys](../../static/media/api-keys/zuplo-api-keys.png)

All commands take an `--api-key` argument. For example, to list your zups, run:

```bash
zup list --api-key zpka_79192455000204849918945812060565_517xxxx
```

If you do not wish to pass your API Key to every command, you can set it as an
environment variable:

```bash
export ZUPLO_API_KEY=zpka_79192455000204849918945812060565_517xxxx
zup list --api-key
```
