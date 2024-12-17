---
title: "Managed Dedicated: Getting Started"
sidebar_label: "Getting Started"
---

Developing a project that is deployed to a Zuplo Dedicated Managed instance is
largely the same as developing for any other Zuplo deployment model. As you
build your API, all of the same features and policies are available to you. The
primary differences with a Zuplo Dedicated Managed instance are:

1. You have a dedicated instance of Zuplo running on the cloud provider of your
   choice.
2. You have the ability to customize networking - for example, your API Gateway
   may be configured to not be accessable to the public internet.
3. Dedicated managed instances of Zuplo do not have Working Copy environments.
   So instead of developing your API inside of the Zuplo portal, you will use
   Zuplo's [local development experience](/docs/articles/local-development).

## Prerequisites

To begin deploying to your Zuplo Dedicated Managed instance, you will need to
have a project created and configured to deploy to your Dedicated Managed
instance. This is something your account manager will help you with.

To run the Zuplo CLI, you will need to have Node.js installed. You can download
Node.js from [nodejs.org](https://nodejs.org/) or you can use a version manager
like [asdf](https://asdf-vm.com/).

## Create a Local Project

To begin developing your API, you will need to create a local project. You can
do this by running the `create-zuplo-api` command in your terminal:

```bash
npx create-zuplo-api
```

This command will prompt you to enter a project name as well as options for your
project.

## Configure Your Project

Next, you must configure your `zuplo.jsonc` file to point to the Zuplo Dedicated
Managed project. You can do this by editing the `zuplo.jsonc` file in the root
of your project directory. Set the `project` property equal to the name of your
project.

```json
{
  "version": 1,
  "project": "your-project-name",
  "compatibilityDate": "2024-09-02"
}
```

## Build Your API

Once you have created your project, you can open it in your favorite code editor
and begin editing your API and Developer Portal. For more information on local
development, see the
[local development guide](/docs/articles/local-development).

## Deploy Your Project

When you are ready to deploy your project to your Zuplo Dedicated Managed
instance, you can run the following command inside your project directory:

```bash
npx zuplo deploy --api-key $ZUPLO_API_KEY
```

:::tip

For instructions on how to create an API key, see the
[API keys](/docs/articles/accounts/zuplo-api-keys) documentation.

:::

This command will deploy your API and Developer Portal to your Zuplo Dedicated
Managed instance.
