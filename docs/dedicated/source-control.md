---
title: "Managed Dedicated: Source Control"
sidebar_label: "Source Control"
---

Zuplo supports GitOps workflows for managing your API Gateway configuration.
This means that you can store all of your API Gateway configuration in a Git
repository and use Git to manage changes to your configuration. This allows you
to track changes to your configuration over time, collaborate with others, and
easily roll back changes if needed.

You will use the Zuplo CLI to deploy your API using CI/CD pipelines or using one
of the Zuplo's [Git integrations](../articles/source-control.md).

## Create a Local Project

To begin developing your API, you will need to create a local project. You can
find the full documentation for
[local development here](../articles/local-development.md).

```bash
npx create-zuplo-api@latest
```

This command will prompt you to enter a project name and options for your
project.

## Create a Git Repository

Next, you will need to create a Git repository to store your API Gateway
configuration. You can use a service like GitHub, GitLab, or Bitbucket to create
a new repository.

Your new Zuplo project is already initialized as a git repo, so you just need to
add a remote repository and push your changes.

```bash
git remote add origin https://github.com/my-org/my-repo
git commit -m "Initial commit"
git push -u origin main
```

## Github: Connect Zuplo to your Repository

If you are using GitHub, you can connect your Zuplo project to your GitHub
repository using the Zuplo integration. This will configure Zuplo to
automatically deploy your API Gateway when you push changes to your repository.

For the full instructions on how to connect your Zuplo project to GitHub, see
[GitHub Integration](../articles/source-control-setup-github.md).

## Custom CI: Deploy your API

If you are not using Github, or would like to setup a custom CI/CD pipeline, you
can use the Zuplo CLI to deploy your API Gateway.

```bash
npx zuplo deploy --api-key $ZUPLO_API_KEY --project your-project-name --environment my-env
```

For more information on setting up a CI/CD pipeline, see
[CI/CD](../articles/custom-ci-cd.md) and the
[Zuplo CLI Deployment](../cli/deployments.md) docs.
