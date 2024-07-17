---
title: "Configuring Environment Variables"
sidebar_label: Environment variables
---

For security reasons, your local development does not have access to the
environment variables that you have configured on the Zuplo Portal. Instead,
your local Zuplo API Gateway will load environment variables from a .env file.

1. Create a .env file in the root of your project.
2. Follow the following format

:::warning

As the `.env` file could contain sensitive information, it should not be
committed to your version system. Consider adding .env to your .gitignore file.

:::

```txt
KEY1=VALUE1
KEY2=VALUE2
```
