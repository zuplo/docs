---
title: "Source Control: Setup Github"
sidebar_label: Github Integration
---

This guide will walk you through connecting your GitHub account to Zuplo.

To begin, go to your project in the Zuplo portal and open to the **Settings**
tab, then select **Source Control**. Control. If your project isn't already
connected to GitHub click the **Connect to GitHub** button and follow the auth
flow. You'll need to grant permissions for any GitHub organizations you want to
work with.

![Connect Github](../../public/media/step-4-deploying-to-the-edge/image-1.png)

Next, a dialog will open asking you to authorize Zuplo. Click the **Authorize
Zuplo** button.

![Zuplo github permission](https://cdn.zuplo.com/assets/d6194a80-b6d6-429e-85a6-ae1cb4a3375e.png)

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

![Installing Zuplo app](https://cdn.zuplo.com/assets/eef76bd7-4d26-4f86-96e8-89ebede03beb.png)

Next, you will be asked to select the repositories that you want Zuplo to
access. The easiest thing is to just select **All Repositories**, but if you
want fine-grain control, you can select a specific repo.

![Giving Zuplo repository access](https://cdn.zuplo.com/assets/ff482269-9aa2-44c3-8266-b2682b3d6ea5.png)

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

![Zuplo deployer running](https://cdn.zuplo.com/assets/0a9932eb-7c16-49cf-9720-0beb450724eb.png)

On the deployment page, you will see **Deployment has Completed!!** and below
that is the link to your new environment.

![Zuplo deployer result](https://cdn.zuplo.com/assets/26fa58b6-7a5a-4627-bd9f-246972639f12.png)
