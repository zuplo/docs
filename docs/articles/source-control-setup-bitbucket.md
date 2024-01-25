---
title: "Source Control: Setup BitBucket"
---

## BitBucket.org

If you are using the SaaS Bitbucket hosted at bitbucket.org, all you need to do
is have Zuplo support (support@zuplo.com) enable BitBucket on your account.

You will need to provide support with your BitBucket Workspace ID. This value
can be found on your Workspace Settings page.

## Self-Hosted BitBucket

In order to setup source control for self-hosted BitBucket, you will need to
[setup a custom BitBucket OAuth App](https://support.atlassian.com/bitbucket-cloud/docs/integrate-another-application-through-oauth/)
and then provide Zuplo support with the following values:

- **BitBucket Server Url** - This would be something like
  `https://bitbucekt.example.com`
- **Client ID** - This is the value of the client ID of the BitBucket app you
  created.
- **Client Secret** - This is the value of the client secret of the BitBucket
  app you created.

When configuring your app you will need to set the following values:

- **Callback URL** - `https://portal.zuplo.com`
- **Permissions** - `repo user read:org`
