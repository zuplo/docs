---
title: GitHub Integration
---

GitHub can integrate with Source Control providers like GitHub, BitBucket and GitLab. GitHub is our primary option but contact us if you use BitBucket, GitLab and we can get you set up.

In this article we'll talk about GitHub integration - which has numerous benefits, including:

- source control integration in portal.zuplo.com
- ability to deploy an [edge-deployment](../deployments/environments.md) just by adding a branch or making a commit.

## Setting it up

To enable the Zuplo integration for GitHub, navigate to <SettingsTabIcon /> **Settings** > <GitHubIcon /> **GitHub Settings**. On the settings page, click the **Connect to GitHub** button. You will be prompted to authorize Zuplo to your GitHub account.

![GitHub Settings](../../static/media/github-settings.png)

Once you have connected GitHub, you can enter the name of the GitHub repository you would like to create for your project. Enter the name and click **Create repository**. This will take a few seconds.

![Create GitHub Repo](../../static/media/github-settings-connected.png)

After the project is connected, all of your code will be committed to the `main` branch.

## GitHub Edge Deployments

For deployments to work you'll need to install the [Zuplo GitHub App](https://github.com/apps/zuplo/installations/new).

Select the organization to install the application and authorize all repositories or specific repositories.

![GitHub App Permissions](../../static/media/github-app-install-perms.png)

The Zuplo GitHub app requires the following permissions:

- **Read** access to code and metadata
- **Read** and **write** access to checks, deployments and pull requests

After the Zuplo app is installed, Zuplo will deploy your app to the production environment. The deployment can be viewed in several ways from GitHub.

To view the deployment of a specific commit hover over the small dot next to the commit hash. Click the **Details** link and you will also see the deployment's URL.

![GitHub Deployment Status](../../static/media/github-deployment-succeed.png)

Alternatively, all deployments can be viewed by clicking **Environments** on the GitHub project's side menu.

![GitHub Deployment Sidebar](../../static/media/github-project-environments.png)

## Limitations

**Renaming or moving projects in GitHub**

The Zuplo GitHub integration does not yet handle moving or renaming repositories. As a workaround, you can first disconnect your project from GitHub and recreate it in another org or with another name. To do so, go to <SettingsTabIcon /> **Settings** > <GitHubIcon /> **GitHub Settings** and then click **Disconnect** to disconnect your project from GitHub. Then follow the above instructions to reconnect your project to GitHub.

**Connecting an Existing Repository**

The Zuplo GitHub integration does not yet support connecting an existing repository. You can only create new repositories at this time.
