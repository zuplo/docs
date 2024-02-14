---
title: "Troubleshooting"
---

## Changing the port number(s)

By default the Zuplo local server runs on port 9000 and route designer runs on
port 9100. To change the port number, you can call

```sh
npx zup dev --port <port number> --editor-port <editor port number>
```

## Updating the Zuplo CLI

During the preview release, we will be updating the Zuplo CLI frequently. To
update, please run in your project directory.

```bash
   npm install zuplo@latest
```

You must include the @latest to ensure you are getting the latest. Otherwise,
you could have an older version cached locally on your machine.

You can compare if you have the latest version by looking at the version number
on [NPM](https://www.npmjs.com/package/zuplo?activeTab=versions)

## Getting help

Please reach out to support@zuplo.com or join our
[Discord server](https://discord.gg/8QbEjr2MgZ).
