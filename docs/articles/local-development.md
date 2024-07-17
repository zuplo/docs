---
title: Running your Zuplo Gateway locally
sidebar_label: Quickstart
---

You can configure and run your Zuplo Gateway locally on your machine for
development purposes using your favorite code editor.

## Requirements

- [Node.js](https://nodejs.org/en/download) 18.0.0 or higher
- Linux, Mac OS X, or Windows Subsystem for Linux (WSL)

## Getting Started

### Create a new project from scratch

1. Create a new project using

```bash
npm create zuplo-api@latest
```

```bash title="Expected output: "
cd <your-new-project-directory>
npm install
npm run dev
```

3. Start your local gateway using `npm run dev`.

4. Use the [local Route Designer](./local-development-routes-designer.md) to
   create your first route.

### Import your existing project

If you have been using Zuplo using the _Zuplo Web Portal_, you can import your
project into your local machine.

1. Connect your project to a Git repository from the _Zuplo Web Portal_.

![](https://cdn.zuplo.com/assets/3bd6b736-20d7-4ac4-805c-d7fd810dea28.png)

2. Clone your project from your Git provider to your local machine.

3. Convert your project to use the Zuplo CLI

```bash
npx @zuplo/cli project update
```

4. Install the necessary dependencies:

```sh
npm install
```

5. Start your Zuplo Gateway locally;

```sh
npm run dev
```

6. Use the [local Route Designer](./local-development-routes-designer.md) to
   create your first route.

## Limitations

While convenient and powerful, not all features of Zuplo are supported while
developing locally. The following features are currently not supported when
running your Zuplo Gateway locally:

- Analytics
- Developer Portal

## Next steps

- Use the [local Route Designer](./local-development-routes-designer) to create
  your first route.
- Install [packages](/docs/articles/node-modules) to extend your Zuplo Gateway.
- Use the [API keys](./local-development-api-keys) service locally to secure
  your routes.
- Add [environment variables](./local-development-env-variables) to your
  project.
