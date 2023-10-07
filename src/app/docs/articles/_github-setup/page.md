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
