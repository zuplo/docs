---
title: Source Control
---

import GithubSetup from './\_github-setup.md';

:::infoGitlab and Bitbucket Support

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

<GithubSetup />

## Connecting Existing Repositories

If you have an existing Github repository that contains a Zuplo project, you can
connect to that repository when you create a new project. Select **Advanced**
then select your Github organization and repository.

<Screenshot
src="https://cdn.zuplo.com/assets/f09aa7ac-abc0-4f20-9e41-df42b7761748.png"
size="sm" />

## Limitations

**Renaming or moving projects in GitHub**

The Zuplo GitHub integration does not yet handle moving or renaming
repositories. As a workaround, you can first disconnect your project from GitHub
and recreate it in another org or with another name. To do so, go to
**Settings** > **Source Control** and then click **Disconnect** to disconnect
your project from GitHub. Then follow the above instructions to reconnect your
project to GitHub.
