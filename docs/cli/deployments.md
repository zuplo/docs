---
title: Deployment Commands
---

```bash
zup --help
zup <command>

Commands:
  zup delete    Deletes the zup at the URL
  zup deploy    Deploys current Git branch of the current directory
  zup list      Lists all deployed zups
  zup test      Runs the tests under /tests against an endpoint
```

Use these commands to help your manage your deployed zups. They must be run from
the root of your Zuplo project. And, they assume that you already have Git setup
for the project.

See more examples at [Custom CI/CD](../articles/custom-ci-cd.md).
