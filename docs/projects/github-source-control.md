---
title: Zuplo for Github
---

To enable the Zuplo integration for Github, navigate to <SettingsTabIcon /> **Settings** > <GithubIcon /> **Github Settings**. On the settings page, click the **Connect to Github** button. You will be prompted to authorize Zuplo to your Github account.

![Github Settings](../../static/media/github-settings.png)

Once you have connected Github, you can enter the name of the Github repository you would like to create for your project. Enter the name and click **Create repository**. This will take a few seconds.

![Create Github Repo](../../static/media/github-settings-connected.png)

After the project is connected, all of your code will be committed to the `main` branch.

## Github Production Deployments

To deploy your project from Github you must install the [Zuplo Github App](https://github.com/apps/zuplo/installations/new). Select the organization to install the application and authorize all repositories or specific repositories.

![Github App Permissions](../../static/media/github-app-install-perms.png)

The Zuplo Github app requires the following permissions:

- **Read** access to code and metadata
- **Read** and **write** access to checks and deployments

After the Zuplo app is installed, Zuplo will deploy your app to the production environment. The deployment can be viewed several ways from Github.

To view the deployment of a specific commit hover over the small dot next to the commit hash. Click the **Details** link and you will also see the deployment's URL.

![Github Deployment Status](../../static/media/github-deployment-succeed.png)

Alternatively, all deployments can be viewed by clicking **Environments** on the Github project's side menu.

![Github Deployment Sidebar](../../static/media/github-project-environments.png)

## Limitations

**Renaming or moving projects in Github**

The Zuplo Github integration does not yet handle moving or renaming repositories. As a workaround, you can first disconnect your project from Github and recreate it in another org or with another name. Do do so, go to <SettingsTabIcon /> **Settings** > <GithubIcon /> **Github Settings** and then click **Disconnect** to disconnect your project from Github. Then follow the above instructions to reconnect your project to Github.

**Connecting an Existing Repository**

The Zuplo Github integration does not yet support connecting an existing repository. You can only create new repositories at this time.
