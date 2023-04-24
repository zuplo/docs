---
title: Zuplo CLI
draft: true
---

The Zuplo CLI can be used to automate and manage aspects of your Zuplo Gateway.

To install the Zuplo CLI:

```bash
npm install @zuplo/cli -g
```

Upgrading to the latest version can be done by running:

```bash
npm install @zuplo/cli@latest -g
```

To access help, just append `--help` to any command in the CLI

```bash
zup --help
zup deploy --help
```

## Commands

```
zup <command>

Commands:
  zup convert  Converts routes.json to routes.oas.json
  zup delete   Deletes the zup at the URL
  zup deploy   Deploys current Git branch of the current directory
  zup list     Lists all deployed zups
  zup test     Runs the tests under /tests against an endpoint
  zup tunnel   Tunnel commands
  zup variable Environment Variable commands

zup tunnel

Tunnel commands

Commands:
  zup tunnel create        Creates a new tunnel in your account
  zup tunnel delete        Deletes a tunnel in your account
  zup tunnel describe      Describes a tunnel in your account
  zup tunnel list          Lists the tunnels in your account
  zup tunnel rotate-token  Rotates the token for a tunnel in your account
  zup tunnel services      Tunnel services commands

zup tunnel services

Tunnel services commands

Commands:
  zup tunnel services describe  Describes the services for this tunnel
  zup tunnel services update    Updates the services for this tunnel


zup variable

Variable commands

Commands:
  zup variable create      Creates a new variable for a branch
  zup variable update      Updates an existing variable for a branch
```
