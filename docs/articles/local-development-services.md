---
title: "Connecting to Zuplo Services Locally"
sidebar_label: Zuplo Services
---

To use Zuplo services such as API keys and rate limiting locally, you must have
a Zuplo account and an existing project. You will be using the connections from
your remote gateway.

1. Run `npx zuplo link` to bring in relevant information from your Zuplo account
   and project. Follow the prompt to select the right environment. For local
   development, we recommend selecting the development environment.
2. At this point, you will see a file called `.env.zuplo` containing some
   information about the account, project, and environment that your local
   gateway is linked to.

:::warning

As the .env.zuplo file could contain sensitive information, it shouldn't be
committed to your version system. Consider adding .env.zuplo to your .gitignore
file.

:::

4. You can run `npm run dev` as normal. The Zuplo CLI will automatically pick up
   the relevant services from the `.env.zuplo` file.
5. If you want to switch environments (e.g., from development to preview), run
   `npx zuplo link` again and select the new environment. You can see which
   environment you are connected to by looking at the .env.zuplo file.

```bash title="Contents of .env.zuplo "
# This file is auto-generated from zuplo link. Please don't edit it manually.
# It will be auto-generated afresh the next time you run zuplo link.
# If you wish to add your own environment variables, create a separate .env file.

ZUPLO_ACCOUNT_NAME=your-account-name
ZUPLO_PROJECT_NAME=your-project-name
ZUPLO_ENVIRONMENT_TYPE=your-environment

```
