---
title: Deployment Commands
---

```bash
zuplo --help
zuplo <command>

Commands:
  zuplo delete    Deletes the environment at the URL
  zuplo deploy    Deploys current Git branch of the current directory
  zuplo list      Lists all deployed environments
  zuplo test      Runs the tests under /tests against an endpoint
```

Use these commands to help your manage your deployed Zuplo projects. They must
be run from the root of your Zuplo project. And, they assume that you already
have Git setup for the project.

See concrete end-to-end examples of how to use this in your CI/CD job at
[Custom CI/CD](../articles/custom-ci-cd.md).

## Common Use Cases

The following examples assume that you are passing in your `--api-key` either as
an argument or through the `ZUPLO_API_KEY` environment variable.

### Deploying your Gateway

```bash
# The following will use the current Git branch as the name of the environment

git checkout -b my-new-branch
zuplo deploy --project my-project
```

```bash
# If you don't wish to use the current Git branch as the name of the
# environment, you can specify one using --environment

zuplo deploy --project my-project --environment my-env-name
```

## Polling Timeout

By default, the deploy command will poll the status of the deployment every
second for 150 seconds. For most deployments this is enough time for the build
and deploy process to complete. However, if you have a large project, this may
not be enough time. You can increase the timeout by setting the following
environment variables.

- `POLL_INTERVAL` - The interval in seconds between each poll. Default is 1
  second.
- `MAX_POLL_RETRIES` - The maximum number of retries before the command times
  out. Default is 150.

```bash
POLL_INTERVAL=5000 MAX_POLL_RETRIES=300 zuplo deploy
```

Note, that even if the CLI times out, the deployment will continue. You can
check the status of the deployment in the Zuplo portal.
