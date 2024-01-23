---
title: "Source Control: Setup BitBucket"
---

In order to setup source control for BitBucket, you will need to
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
