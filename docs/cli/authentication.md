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

1. Navigate to [portal.zuplo.com](https://portal.zuplo.com) and log in.
2. Select the project that you want to work on.
3. Click on the "Settings" tab and navigate to the "Zuplo API Keys" section.

All commands take an `--api-key` argument. For example, to list your zups, run:

```bash
zup list --api-key zpka_d67b7e241bb948758f415b79aa8exxxx_2efbxxxx
```

If you do not wish to pass your API Key to every command, you can set it as an
environment variable:

```bash
export ZUPLO_API_KEY=zpka_d67b7e241bb948758f415b79aa8exxxx_2efbxxxx
zup list --api-key
```
