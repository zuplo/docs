---
title: Step 4 - Deploying to the Edge
sidebar_label: "Step 4 - Deploy"
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
  [Step 2](./step-2-add-rate-limiting.md) and
  [Step 3](./step-3-add-api-key-auth.md) for a great start!
- to install the
  [Zuplo GitHub deployer](https://github.com/apps/zuplo/installations/new) to
  GitHub - you can
  [follow these instructions](https://github.com/apps/zuplo/installations/new)

## 1/ Authorize to GitHub

Next, go to your project in the Zuplo portal and open to the **Settings** tab,
then select **Source Control**. Control. If your project isn't already connected
to GitHub click the **Connect to GitHub** button and follow the auth flow.
You'll need to grant permissions for any GitHub organizations you want to work
with.

![Connect Github](../../public/media/step-4-deploying-to-the-edge/image-1.png)

Next, a dialog will open asking you to authorize Zuplo. Click the **Authorize
Zuplo** button.

![](https://cdn.zuplo.com/assets/d6194a80-b6d6-429e-85a6-ae1cb4a3375e.png)

<Callout type="tip" title="GitHub Permissions" >

The permission "Act on your behalf" sounds a bit scary - however, this is a
standard GitHub permission and by default Zuplo can't actually do anything with
this. In order to perform actions on your behalf you must grant Zuplo access to
a specific repository (shown in the next steps.).

You can
[read more about this permission on GitHub's docs](https://docs.github.com/en/apps/using-github-apps/authorizing-github-apps#about-github-apps-acting-on-your-behalf).

</Callout>

After you have connected the GitHub app, it needs to be granted permission to
edit a repository. If this is your first time connecting Zuplo, you will be
immediately asked to select a GitHub Org to install Zuplo. Select the org you
want to use.

![](https://cdn.zuplo.com/assets/eef76bd7-4d26-4f86-96e8-89ebede03beb.png)

Next, you will be asked to select the repositories that you want Zuplo to
access. The easiest thing is to just select **All Repositories**, but if you
want fine-grain control, you can select a specific repo.

![](https://cdn.zuplo.com/assets/ff482269-9aa2-44c3-8266-b2682b3d6ea5.png)

<Callout type="caution" title="Existing Installation" >

The next step is only if you already have Zuplo installed in a GitHub org and
need to add another organization.

</Callout>

If you weren't prompted to select a GitHub org, it is likely that you are
already a member of an an account that has authorized Zuplo. To add Zuplo to a
new organization click **Add GitHub Account** in the org picker list.

![Connect Org](../../public/media/step-4-deploying-to-the-edge/image-2.png)

## 2/ Connect GitHub to your Project

With your GitHub App configured, you can now return to the Zuplo portal. In the
**Source Control** settings you should now see a list of GitHub repositories.
Create a new repository by clicking the **Create new repository** button. You
will be prompted that this will open Github. Click to continue.

![Create Repo](../../public/media/step-4-deploying-to-the-edge/image-3.png)

In the Github UI, you can rename your repository if you want. Click the **Create
repository** button at the bottom of the page and return to the Zuplo Portal.

The portal will reload and you will see your new repository listed. Click
**Connect** to connect Zuplo to that repository.

![Connect](../../public/media/step-4-deploying-to-the-edge/image-4.png)

After the connection succeeds you will see a link to your GitHub repository.

![Connected Repository](../../public/media/step-4-deploying-to-the-edge/image-5.png)

Click the link to return to GitHub. You should see a green check next to the
commit hash (1). When you hover your mouse over that you'll see the Zuplo
deployment was successful. Click **Details** (2) to open the deployment info.

![](https://cdn.zuplo.com/assets/0a9932eb-7c16-49cf-9720-0beb450724eb.png)

On the deployment page, you will see **Deployment has Completed!!** and below
that is the link to your new environment.

![](https://cdn.zuplo.com/assets/26fa58b6-7a5a-4627-bd9f-246972639f12.png)

## 3/ Deploy another Environment

Zuplo makes it easy for teams to collaborate by allowing teams to create many
preview environments. To create a new environment, simple go to your repo in
GitHub and create a new branch.

Let's create a branch called `development`

![Create new branch](https://cdn.zuplo.com/assets/60cdeb36-ab7d-42f9-a8c2-1f7931f80ca6.png)

Wait about 20s and head back to Zuplo - you should see a new entry in the
environment dropdown called `development`.

## 4/ Push a Change to 'development'

Let's make a simple change to our `working-copy` environment. Let's do something
simple like capitalize the **Summary** field from 'Get all todos' to 'Get All
Todos'. It doesn't really matter what the change is.

![Changes Summary](../../public/media/step-4-deploying-to-the-edge/image-6.png)

Save your changes. Click the GitHub button at bottom left and choose **Commit &
Push**.

![Commit & Push](../../public/media/step-4-deploying-to-the-edge/image-7.png)

Enter a description of your change in the dialog that pops up:

![Change Summary](../../public/media/step-4-deploying-to-the-edge/image-8.png)

Click **Commit & Push** will create a new temporary branch in GitHub with a name
`zup-...`. On the next dialog, click **Create Pull Request**.

![Create PR](../../public/media/step-4-deploying-to-the-edge/image-9.png)

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

![Navigating Environments](../../public/media/step-4-deploying-to-the-edge/image.png)

This shows how you can use widely recognized GitOps practices to manage how code
flows through your environments using Pull Requests and protected branches.

## Troubleshooting

I don't see my repository listed in Zuplo project settings.

- Make sure you've granted access to the project with the Zuplo GitHub App, you
  can
  [check that configuration here](https://github.com/apps/zuplo/installations/new)

I've connected my Zuplo project to a GitHub repository but get access errors
when running commits, pulls or try to open a pull request.

- If you are the owner of the project, make sure you've granted access to the
  project with the Zuplo GitHub App, you can
  [check that configuration here](https://github.com/apps/zuplo/installations/new)
- If this Zuplo project was shared with you, make sure you are a GitHub
  collaborator. This can be verified by going to the GitHub repository >
  Settings > Collaborators section. You'll need admin permissions to the
  repository.
- If the GitHub repository has been renamed or moved to a different
  organization, try disconnecting and reconnecting to it. You can do this by
  going to your Zuplo project's settings > Source Control section
