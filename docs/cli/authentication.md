---
title: Authentication
---

The Zuplo CLI, `zup`, uses API Keys to authenticate.

1. Contact [support](mailto:support@zuplo.com) to enable API keys for your Zuplo
   project.
2. Navigate to [dev.zuplo.com/docs](https://dev.zuplo.com/docs) and click on
   "Sign in" on the top right corner.
3. Navigate to [authentication](https://dev.zuplo.com/docs/v1/#authentication)
   and generate some API keys. You will use these keys to authenticate with the
   Zuplo CLI.

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
