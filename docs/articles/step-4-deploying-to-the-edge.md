---
title: Step 4 - Deploying to the Edge
---

In this guide we'll show you how to deploy your gateway to the edge, at over 200
data-centers around the world. The act of deployment creates new
[environments](./environments) and it's worth familiarizing yourself with
[how environments work](./environments).

In this tutorial we'll show the default workflow via GitHub, but note that we
also support GitLab, BitBucket
([enterprise plan only](https://zuplo.com/pricing)) and
[custom CI/CD](./custom-ci-cd).

To follow this tutorial you'll need

- a GitHub account (it's free, sign up at [github.com](https://github.com)).
- a zuplo project - complete [Step 1](./step-1-setup-basic-gateway.md),
  [Step 2](./step-2-add-api-key-auth.md) and
  [Step 3](./step-3-add-rate-limiting.md) for a great start!
- to install the
  [Zuplo GitHub deployer](https://github.com/apps/zuplo/installations/new) to
  GitHub - you can do that
  [here](https://github.com/apps/zuplo/installations/new)

## 1/ Authorize to GitHub

Before you begin, it is best to create an empty Github Repo to use for your
Zuplo project. Click the button below to go to Github and create a new
repository. Select the organization where you'd like to create the repository.

<GithubButton text="Create Github Repo" href="https://github.com/new" />

Next, go to your project in the Zuplo portal and open to the <SettingsTabIcon />
**Settings** tab (1), then select **Source Control** (2). Control. If your
project isn't already connected to GitHub click the **Connect to GitHub** button
and follow the auth flow. You'll need to grant permissions for any GitHub
organizations you want to work with.

<Screenshot src="https://cdn.zuplo.com/assets/2594e74e-ada4-4f63-ab23-e3c6eeb72219.png" />

Next, a dialog will open asking you to authorize Zuplo. Click the **Authorize
Zuplo** button.

<Screenshot
src="https://cdn.zuplo.com/assets/d6194a80-b6d6-429e-85a6-ae1cb4a3375e.png"
size="xs" />

:::tip Github Permissions

The permission "Act on your behalf" sounds a bit scary - however, this is a
standard Github permission and by default Zuplo can't actually do anything with
this. In order to perform actions on your behalf you must grant Zuplo access to
a specific repository (shown in the next steps.).

You can
[read more about this permission on Github's docs](https://docs.github.com/en/apps/using-github-apps/authorizing-github-apps#about-github-apps-acting-on-your-behalf).

:::

After you have connected the Github app, it needs to be granted permission to
edit a repository. If this is your first time connecting Zuplo, you will be
immediately asked to select a Github Org to install Zuplo. Select the org you
want to use.

<Screenshot
src="https://cdn.zuplo.com/assets/eef76bd7-4d26-4f86-96e8-89ebede03beb.png" size="xs" />

Next, you will be asked to select the repositories that you want Zuplo to
access. The easiest thing is to just select **All Repositories**, but if you
want fine-grain control, you can select a specific repo.

<Screenshot src="https://cdn.zuplo.com/assets/ff482269-9aa2-44c3-8266-b2682b3d6ea5.png" size="xs" />

:::caution Existing Installation

The next step is only if you already have Zuplo installed in a Github org and
need to add another organization.

:::

If you weren't prompted to select a Github org, it is likely that you are
already a member of an an account that has authorized Zuplo. To add Zuplo to a
new organization click **Add Github Account** in the org picker list.

<Screenshot src="https://cdn.zuplo.com/assets/fa11f143-e646-4cf5-9dfd-6a1ba64b8a13.png" />

## 2/ Connect Github to your Project

With your Github App configured, you can now return to the Zuplo portal. In the
**Source Control** settings you should now see a list of Github repositories -
if you just created your project, it should be listed on the top. If not, just
type the name in the search box. Once you have located your repository click the
**Connect** button.

<Screenshot src="https://cdn.zuplo.com/assets/f7247c52-47e0-4661-8551-aa6061256d1f.png" />

After the connection succeeds you will see a link to your Github repository.

<Screenshot src="https://cdn.zuplo.com/assets/4bc3cbd4-8e94-4eb5-a5ed-8f528e018ad8.png" />

Click the link to return to Github. You should see a green check next to the
commit hash (1). When you hover your mouse over that you'll see the Zuplo
deployment was successful. Click **Details** (2) to open the deployment info.

<Screenshot src="https://cdn.zuplo.com/assets/0a9932eb-7c16-49cf-9720-0beb450724eb.png" />

On the deployment page, you will see **Deployment has Completed!!** and below
that is the link to your new environment.

<Screenshot src="https://cdn.zuplo.com/assets/26fa58b6-7a5a-4627-bd9f-246972639f12.png" />

## 3/ Deploy another environment

Zuplo makes it easy for teams to collaborate by allowing teams to create many
preview environments. To create a new environment, simple go to your repo in
GitHub and create a new branch.

Let's create a branch called `development`

![Create new branch](https://cdn.zuplo.com/assets/60cdeb36-ab7d-42f9-a8c2-1f7931f80ca6.png)

Wait about 20s and head back to Zuplo - you should see a new entry in the
environment dropdown called `development`.

## 4/ Push a change to 'development'

Let's make a simple change to our `working-copy` environment. Let's do something
simple like capitalize the **Summary** field from 'Get all todos' to 'Get All
Todos'. It doesn't really matter what the change is.

![Change of Summary](https://cdn.zuplo.com/assets/e915ea82-8980-4629-b2b0-b595ac65cc37.png)

Save your changes. Click the GitHub button at bottom left and choose **Commit &
Push**. Enter a description of your change in the dialog that pops up:

![Commit Dialog](https://cdn.zuplo.com/assets/6a713c7f-c40a-4556-859f-a9befebeac82.png)

Click **Commit & Push** will create a new temporary branch in GitHub with a name
`zup-...`. On the next dialog, click **Create Pull Request**.

![Create PR](https://cdn.zuplo.com/assets/01d01c6f-49dd-413f-ba48-79356d872a0f.png)

This will navigate you to the screen in GitHub that allows you to create a Pull
Request. Change the **base** branch to `development` (since that is the
environment we want to update first). Click **Create pull request**.

![GitHub PR](https://cdn.zuplo.com/assets/875b164d-b7ef-4f46-9cdb-8d59354b5b93.png)

When ready, click **Merge pull request**

![Merge PR](https://cdn.zuplo.com/assets/e8c68072-35dc-462a-8161-7a44e40fa1df.png)

Once merged, you'll want to delete that temporary branch.

![Delete branch](https://cdn.zuplo.com/assets/51a25aa0-cdce-4112-ba2e-e56f42a9044d.png)

The successful merge will trigger a rebuild and deployment of `development` with
your change. You can check this by choosing the environment `development` in
Zuplo and navigating to the **readonly** Route Designer.

![Readonly view of changes](https://cdn.zuplo.com/assets/3bc451b2-8422-4807-98cc-eee907c46021.png)

This shows how you can use widely recognized GitOps practices to manage how code
flows through your environments using Pull Requests and protected branches.

## Troubleshooting

I don't see my repository listed in Zuplo project settings.

- Make sure you've granted access to the project with the Zuplo GitHub App, you
  can check that configuration
  [here](https://github.com/apps/zuplo/installations/new)

I've connected my Zuplo project to a GitHub repository but get access errors
when running commits, pulls or try to open a pull request.

- If you are the owner of the project, make sure you've granted access to the
  project with the Zuplo GitHub App, you can check that configuration
  [here](https://github.com/apps/zuplo/installations/new)
- If this Zuplo project was shared with you, make sure you are a GitHub
  collaborator. This can be verified by going to the GitHub repository >
  Settings > Collaborators section. You'll need admin permissions to the
  repository.
- If the GitHub repository has been renamed or moved to a different
  organization, try disconnecting and reconnecting to it. You can do this by
  going to your Zuplo project's settings > Source Control section
