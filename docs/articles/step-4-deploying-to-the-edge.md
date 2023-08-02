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

## 1/ Connect to GitHub

First, we'll need to connect your project to GitHub. Go to Settings > Source
Control. If your project isn't already connected to GitHub click the **Connect
to GitHub** button and follow the auth flow. You'll need to grant permissions
for any GitHub organizations you want to work with.

![Connect to Source Control](https://cdn.zuplo.com/assets/54589329-ad98-4fac-9788-74a47a6e5aee.png)

## 2/ Create the repo and connect the project

Once connected, you'll have the option to connect your project to source control
by creating a new repo or connecting to an existing one.

![Create Repo](https://cdn.zuplo.com/assets/64270bdb-fb05-4718-b1c0-a70baf59629a.png)

You can choose the organization in the dropdown and choose a repo name (it
doesn't have to be the same as the project name, but that is a good practice).
Make sure the repo you select is either an empty one or one that hosts a Zuplo
project.

If you've already installed the
[Zuplo GitHub App](https://github.com/apps/zuplo/installations/new) your project
will already be deploying to the edge.

You can check this by looking at your repo (click the link shown below)

![Repo Link](https://cdn.zuplo.com/assets/12454344-f507-4d4f-8402-c7b463223648.png)

You can see your deployment status in GitHub by looking for the (little) green
check or orange dot by the last commit hash

![Commit Hash](https://cdn.zuplo.com/assets/2908e45b-7133-410d-9275-10312d8cd642.png)

If you click on the **details** link you'll see the deployment output from the
Zuplo GitHub app. Including, how long it took (6s!) and the URL.

![Deployment](https://cdn.zuplo.com/assets/bafa809e-d9ed-4124-9c73-b4a6ed602ff9.png)

You can also see all your environments in Zuplo - head back to Zuplo and click
the `working-copy` link at the top left.

![Environment Selector](https://cdn.zuplo.com/assets/9616d94a-6167-46f2-8887-11cdb5f0a244.png)

You should see a new `main` environment which maps to your `main` branch. This
is typically your **Production** environment.

## 3/ Deploy another environment

Zuplo makes it easy for teams to collaborate by allowing teams to create many
preview environments. To create a new environment, simple go to your repo in
GitHub and create a new branch.

:::note branch names `dev` and `prod` are keywords and not supported at this
time. :::

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
