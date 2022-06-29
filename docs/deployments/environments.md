---
title: Environments
---

The two types of deployments on Zuplo are: **production** and **development**.

## Development

When editing a project in the Zuplo Portal, every time you save a change your Zup is instantly deployed to your development environment. Each development environment is unique to a user. If you are working with source control, your deployment will be associated with the current branch.

Every development environment will automatically have a URL that looks like: `ivory-dingo-main-244b176.d2.zuplo.dev`. The format of the URL is `project-name-branch-RANDOM.d2.zuplo.dev`. This URL is permanent as long as this instance of your project is deployed.

Development environments are only for development purposes and not for any production or staging situation. They run only a single instance of our runtime and thus have no redundancy. There will be periodic downtime (typically only a few seconds) when we perform upgrades.

## Production

A Zup can have multiple production environments. A production environment means that the environment is running on our highly-reliable and scalable infrastructure. To deploy to production environments, your project must be setup with [source control](../guides/github-source-control.md). When you make a commit and push to your git repo - whether from the portal or directly using the tool of your choice - a production deployment will run.

Production environments will automatically have a URL like `ivory-dingo-main-244b176.zuplo.app`. The format of the URL is `project-name-branch-RANDOM.zuplo.app`. This URL is permanent as long as the branch the deployment was created from exists. If you delete the branch, the deployment will also be deleted. You can also map a [custom domain](custom-domains.md) to any production environment.

All production environments run on our highly scalable and reliable network. Each production deployment automatically and instantly scales to handle any amount of traffic. Enterprise plans can include a 100% uptime SLA on production environments.

## Environment Variables

All environments can have unique environment configurations and secretes.
