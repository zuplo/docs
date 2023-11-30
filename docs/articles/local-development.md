---
title: Running your Zuplo Gateway locally
---

For most users, the [Zuplo Portal](https://portal.zuplo.com/) will provide the
best out-of-the-box experience with zero configuration.

However, for advanced users, local development helps speed up your development
time by allowing you to test your changes locally and connect to services
running locally (e.g., on localhost). Some setup is necessary for running the
Zuplo Gateway locally (see below).

## Getting Started

:::tip

Currently, local development only works on Linux, Mac OS X, and Windows
Subsystem for Linux (WSL). We do not support Windows at this time.

:::

Local development is powered by the Zuplo CLI, zup, built using Node.js. It
requires a minimum version of Node.js 18.0.0.

You can download Node.js from [nodejs.org](https://nodejs.org/en/download). If
you need to switch between different versions of Node.js, you can use a version
manager such as [NVM](https://github.com/nvm-sh/nvm).

### Getting started with a new empty project

1. Open up a terminal. If you are on Windows, ensure you use a Windows Subsystem
   for Linux (WSL) terminal. You can find more information about WSL
   [here](https://docs.microsoft.com/en-us/windows/wsl/install-win10).
2. Run `npm create zuplo-api@latest`. Follow the prompts and provide a project
   name.
3. Follow the instructions on the prompt

```bash
cd <your-new-project-directory>
npm install
npm run dev
```

4. You can edit the files in your project directory using your favorite code
   editor. We recommend using [VS Code](https://code.visualstudio.com/).
5. Visit `http://localhost:9000` in your browser. If you have a route configured
   for `/`, you should see the response from your Zuplo Gateway.
6. The Zuplo CLI is running in `watch` mode. Any changes you make will be
   automatically compiled behind the scenes.
7. While you can edit your routes.oas.json files by hand, we also have a Route
   Designer that is started when you run `npm run dev`. You can open the Route
   Designer in your browser at http://localhost:9100. If you are using VS Code,
   you can open it in the Simple Browser to see it side-by-side.
8. Once you are done running your Zuplo Gateway locally, you can press `Ctrl+C`
   to stop the Zuplo CLI.

![Local Development Experience inside VS Code](https://cdn.zuplo.com/assets/3dc00c8f-6536-48d1-b0c1-1d94a29aa4b2.png)

### Getting started with an existing project

1. Check out the source code for your Zuplo Gateway. If you just want to test
   this out, we recommend cloning the
   [samples-todo-list-open-api](https://github.com/zuplo/samples-todo-list-open-api)
   project.
2. Execute the following commands from the _root_ of your Zuplo Gateway. For
   instance, if your project is
   `/Users/me/development/zuplo/samples-todo-list-open-api`, the commands must
   be executed from that directory.
3. If you have an older project you might need to edit your package.json to
   update it. You could run `npx zup update` to update your project.
4. Alternatively, you could also edit it manually so that it looks _like_ the
   following. You might have customized your package.json to add your own
   dependencies. You can keep your dependencies, but you should ensure that you
   only have `"zuplo": "latest"` as the zuplo dependency. Older versions of the
   auto-generated package.json used to add `@zuplo/core`, `@zuplo/runtime`, and
   `@zuplo/test` as dependencies. You should remove those dependencies.

```json
{
  "name": "samples-todo-list",
  "version": "1.0.0",
  "author": "",
  "copyright": "",
  "scripts": {
    "dev": "zup dev",
    "test": "zup test"
  },
  "dependencies": {
    "zuplo": "latest"
  }
}
```

5. Install the necessary dependencies using `npm install`.
6. To start your Zuplo Gateway locally, run `npm run dev`. This runs the dev
   script in the package.json shown above.
7. Visit `http://localhost:9000` in your browser. If you have a route configured
   for `/`, you should see the response from your Zuplo Gateway.
8. The Zuplo CLI is running in `watch` mode. Any changes you make will be
   automatically compiled behind the scenes.
9. While you can edit your routes.oas.json files by hand, we also have a Route
   Designer that is started when you run `npm run dev`. You can open the Route
   Designer in your browser at http://localhost:9100. If you are using VS Code,
   you can open it in the Simple Browser to see it side-by-side.
10. Once you are done running your Zuplo Gateway locally, you can press `Ctrl+C`
    to stop the Zuplo CLI.

# Limitations

While convenient and powerful, not all features of Zuplo are supported while
developing locally. The following features are currently not supported when
running your Zuplo Gateway locally:

- Analytics
- Developer Portal
- Tunnels

## Configuration for Local Development

Some features of the Zuplo Gateway require additional configuration to run
locally.

## Configuring API Keys

:::warning

As the .env.zuplo file could contain sensitive information, it should not be
committed to your version system. Consider adding .env to your .gitignore file.

:::

To use API keys locally, you must have a Zuplo account and an existing project.
You will be using the API keys from the working-copy of your project.

1. Run `npx zup login` to log into your account in your browser. `npx zup login`
   opens a local port (port 57801) on your machine and redirects you to the
   Zuplo login page. Once you have logged in, you can close the browser window.
2. Run `npx zup link` to bring in relevant information from your Zuplo account
   and project. If you have multiple accounts and/or projects, `npx zup link`
   will prompt you to select one.
3. At this point, you will see a file called .env.zuplo containing some
   information about the bucket for you
4. You can run `npm run dev` as normal.
5. You only need to repeat the `npx zup login` and `npx zup link` if you are
   switching projects.

## Configuring Environment variables

:::warning

As the .env file could contain sensitive information, it should not be committed
to your version system. Consider adding .env to your .gitignore file.

:::

1. Create a .env file in the root of your project.
2. Follow the following format

```
KEY1=VALUE1
KEY2=VALUE2
```

## Changing the port number(s)

By default the Zuplo local server runs on port 9000 and route designer runs on
port 9100. To change the port number, you can call
`npx zup dev --port <port number> --editor-port <editor port number>`.

## Troubleshooting

### Updating the Zuplo CLI

During the preview release, we will be updating the Zuplo CLI frequently. To
update, please run in your project directory.

```bash
   npm install zuplo@latest
```

You must include the @latest to ensure you are getting the latest. Otherwise,
you could have an older version cached locally on your machine.

You can compare if you have the latest version by looking at the version number
on [NPM](https://www.npmjs.com/package/zuplo?activeTab=versions)

### Getting help

Please reach out to support@zuplo.com or join our
[Discord server](https://discord.gg/8QbEjr2MgZ).
