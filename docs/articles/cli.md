---
title: Zuplo CLI
draft: true
---

The Zuplo CLI can be used to automate and manage aspects of your Zuplo Gateway.

To install the Zuplo CLI:

```bash
npm install @zuplo/cli -g
```

Upgrading to the lastest version can be done by running:

```bash
npm install @zuplo/cli@latest -g
```

To access help, just append `--help` to any command in the CLI

```bash
zup --help
zup deploy --help
```

## Commands

### deploy

Deploys current Git branch of the current directory

```bash
zup deploy
```

Options:
--version Show version number [boolean]
--help Show help [boolean]
--api-key The API Key from Zuplo [string] [required]
--verify-remote Verify that this Git repository matches the one configured on
Zuplo. Use --no-verify-remote to disable.
[boolean] [default: true]
