---
title: Source Control / Native GitOps
---

Zuplo is designed to natively support Infrastructure-as-Code (IaC) via GitOps
and integrates seamlessly with GitHub, BitBucket, GitLab and Azure DevOps.
Deploying to 300 data centers around the world takes under 20s with Zuplo, just
via a simple commit. You get unlimited environments too - just commit to a new
branch and we'll set you up with a new environment just as quick - at no charge
to you.

:::info{title="GitLab and Bitbucket Support"}

Zuplo can integrate with Source Control providers like GitHub, BitBucket and
GitLab. GitHub is our primary option - BitBucket and GitLab (including private
instances) are available on an [enterprise plan](https://zuplo.com/pricing).

:::

## GitHub Integration

In this article we'll talk about GitHub integration - which has numerous
benefits, including:

- source control integration in portal.zuplo.com
- ability to deploy an [edge-deployment](../articles/environments.md) just by
  adding a branch or making a commit.

For full instructions on setting up GitHub see
[the quickstart tutorial](../articles/step-4-deploying-to-the-edge.md).

## Connecting Existing Repositories

If you have an existing GitHub repository that contains a Zuplo project, you can
connect to that repository when you create a new project. Select **Import
existing project** then select your GitHub organization and repository.

![Import existing project to Zuplo](/media/source-control/image-1.png)

## Limitations

**Renaming or moving projects in GitHub**

The Zuplo GitHub integration doesn't handle moving or renaming repositories. As
a workaround, you can first disconnect your project from GitHub and recreate it
in another org or with another name. To do so, go to **Settings** > **Source
Control** and then click **Disconnect** to disconnect your project from GitHub.
Then follow the above instructions to reconnect your project to GitHub.
