---
title: Environment Variables
---

Each deployment of your project has its own unique set of environmental variables. This allows you to have different configuration for your development, test, and production environments. Environment variables are edited by first selecting the environment to work on, then navigating to the **Environment** file in <CodeEditorTabIcon /> **Code Editor**.

![Environment Editor](https://cdn.zuplo.com/assets/e60e0717-b390-4494-9e44-a89a71342a36.png)

Environment variables are created as either config or secrets. Config is for settings that are not private like icon URLs, or oauth Client IDs. Config values can be viewed after they are set. Secrets are for storing private or sensitive data. Secrets are write-only, meaning that after the value is set it cannot be read again through the portal.
