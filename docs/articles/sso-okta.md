---
title: Setup Okta SSO
sidebar_label: Okta Setup
---

Zuplo uses Auth0 to enable Okta SSO for enterprise accounts who have purchased
single-sign-on. Below you will find instructions on how to setup Okta to be used
with Zuplo.

1. Log in to the [Okta Developer Console](https://developer.okta.com/).

2. Go to Create App Integration and choose SAML 2.0 from the options. Record the
   client ID and client secret values to share with Zuplo.
   - The application type should be "Web application".
   - The **Redirect URI** value should be set to
     `https://auth.zuplo.com/login/callback`
   - The trusted origin should be set to `https://auth.zuplo.com`
   - No special permissions are needed. Zuplo only requires basic profile
     information (name and email).

3. Securely share the following values with Zuplo.

| Field                     | Description                                                                                                                                                              |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Client ID                 | Unique identifier for your registered Okta application.                                                                                                                  |
| Client Secret             | String used to gain access to your registered Okta application.                                                                                                          |
| Okta Domain               | Okta's domain name for your organization.                                                                                                                                |
| Identity Provider Domains | A list of the domains that can be authenticated in the Identify Provider. For most companies this will be a single domain, but some companies may have multiple domains. |

A few options for securely sharing secrets with Zuplo:

- [Using 1Password to share passwords with people outside your team ](https://1password.com/resources/guides/sharing-passwords-with-guests/)
- [Using Bitwarden to share files and sensitive information securely](https://bitwarden.com/blog/how-to-share-files-and-sensitive-information-securely/)
- [Securely sharing information with PGP](https://medium.com/slalom-build/how-to-use-gpg-to-securely-share-secrets-with-your-team-c09c50fe77e3)

:::note

You can find Zuplo support's PGP public key at:
https://keys.openpgp.org/vks/v1/by-fingerprint/53A66C757B3F88908D395F9E0237A8212358D92C

:::

3. Once you have shared the required information with Zuplo, we'll configure
   your account to use Okta for SSO. We'll notify you once the configuration is
   complete.
