---
title: Running your Zuplo Gateway locally (Preview)
sidebar_label: Running your Zuplo Gateway locally (Preview)
---

As of August 2023, we are pleased to announce a preview version of the Zuplo
Gateway that can be run locally.

For advanced users, local development speeds up your development time by
allowing you to test your changes locally and to connect to services that are
running locally (e.g., on localhost). Some setup is necessary for running the
Zuplo Gateway locally. So, for most users, the
[Zuplo Portal](https://portal.zuplo.com/) will provide the best out-of-the-box
experience with zero configuration.

:::warning

Running your Zuplo Gateway locally is a preview feature. There may be bugs and
other issues. Please use a version control system to manage your source code.
You can report any issues to `support@zuplo.com`.

:::

## Getting Started

Local development is powered by a preview version of the Zuplo CLI, `zup`, which
is built using Node.js. It requires a minimum version of Node.js 18.0.0.

Currently, local development only works on Linux and Mac OS X. We do not support
Windows at this time.

1. Install Node.js 18.0.0 or later. You can download it from
   [nodejs.org](https://nodejs.org/en/download).
2. Check out the source code for your Zuplo Gateway. If you just want to test
   this out, we recommend cloning the
   [samples-todo-list-open-api](https://github.com/zuplo/samples-todo-list-open-api)
   project.
3. Execute the following commands from the _root_ of your Zuplo Gateway. For
   instance, if your project is
   `/Users/me/development/zuplo/samples-todo-list-open-api`, then the commands
   need to be executed from that directory. If you have multiple projects that
   you want to try, then these commands need to be repeated for each project.
   The reason is that we are isolating the preview version of the CLI to each
   project.
4. Edit your package.json so that it looks _like_ the following. You might have
   customized your package.json to add your own dependencies. You can keep your
   dependencies but you should ensure that you only have
   `"zuplo": "latest" as the zuplo dependency. Older versions of the auto-generated package.json used to add `@zuplo/core`, `@zuplo/runtime`, and `@zuplo/test`
   as dependencies. You should remove those dependencies.

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

5. To start your Zuplo Gateway locally, execute the following command from the
   root of your Zuplo Gateway.

```bash
   npm run dev
```

6. Visit `http://localhost:9000` in your browser. If you have a route configured
   for `/`, you should see the response from your Zuplo Gateway.
7. The Zuplo CLI is running in `watch` mode. Any changes that you make will be
   automatically compiled behind the scenes for you.
8. Once you are done running your Zuplo Gateway locally, you can press `Ctrl+C`
   to stop the Zuplo CLI.

## Configuration for Local Development

Some features of the Zuplo Gateway require additional configuration to run
locally.

## Limitations

The following features are not currently supported when running your Zuplo
Gateway locally:

- Analytics
- API Keys
- Developer Portal
- Rate Limiting
- Tunnels

## Environment variables

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

## Changing the port number

By default the Zuplo CLI runs on port 9000. To change the port number, you can
call `npx zup dev --port <port number>`.

## Troubleshooting

### Updating the Zuplo CLI

During the preview release, we will be updating the Zuplo CLI frequently. To
update, please run

```bash
   npm install @zuplo/cli@latest
```
