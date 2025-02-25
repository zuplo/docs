---
title: "Source Control: Setup BitBucket"
sidebar_label: BitBucket Integration
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

- **BitBucket Server URL** - This would be something like
  `https://bitbucket.example.com`
- **Client ID** - This is the value of the client ID of the BitBucket app you
  created.
- **Client Secret** - This is the value of the client secret of the BitBucket
  app you created.

When configuring your app you will need to set the following values:

- **Callback URL** - `https://portal.zuplo.com`
- **Permissions** - `repo user read:org`

## Limiting Access

BitBucket doesn't support scoping access to an OAuth app to a specific
repository or repositories. This is a limitation of BitBucket, not Zuplo. If you
want to limit the access that Zuplo has to your BitBucket repositories there are
two options:

1. Create a new workspace and install the Zuplo app only in that workspace.
2. Create a new service account user and use that user to connect BitBucket to
   Zuplo. BitBucket apps are limited to the permissions of the user who
   installed the app so if the service account user only has access to a single
   repository, Zuplo will only have access to that same single repository.
