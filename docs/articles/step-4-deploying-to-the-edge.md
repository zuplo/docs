---
title: Step 4 - Deploying to the Edge
---

import GithubSetup from './\_github-setup.md';

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

<GithubSetup />

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
