---
title: Setup Azure Active Directory SSO
---

Zuplo uses Auth0 to enable SSO for enterprise accounts who have purchased
single-sign-on. Below you will find instructions on how to setup a new Azure AD
client to be used with Zuplo.

1. Register a new Application in Azure Active Directory. For instructions on
   this process, see
   [Microsoft's quickstart](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app).
   Record the client ID value to share with Zuplo.

   - The application type should be "web".
   - The **Redirect URI** value should be set to
     `https://auth.zuplo.com/login/callback`
   - No special permissions are needed. Zuplo only requires basic profile
     information (name and email).

2. Create a client secret for you application. To create a client secret, see
   Microsoft's Quickstart:
   [Configure a client application to access web APIs - Add Credentials to your web application](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app#add-credentials).
   Record this value. You will need to share this securely with Zuplo.

   :::tip

   If you configure an expiring secret, make sure to record the expiration date;
   you will need to renew the key before that day to avoid a service
   interruption.

   :::

3. Securely the following values with Zuplo.

| Field           | Description                                                                                                                                                   |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Client ID       | Unique identifier for your registered Azure AD application. Enter the saved value of the Application (client) ID for the app you just registered in Azure AD. |
| Client Secret   | String used to gain access to your registered Azure AD application. Enter the saved value of the Client secret for the app you just registered in Azure AD.   |
| Azure AD Domain | Your Azure AD domain name. You can find this on your Azure AD directory's overview page in the Microsoft Azure portal.                                        |

A few options for securely sharing secrets with Zuplo:

- [Using 1Password to share passwords with people outside your team ](https://1password.com/resources/guides/sharing-passwords-with-guests/)
- [Using Bitwarden to share files and sensitive information securely](https://bitwarden.com/blog/how-to-share-files-and-sensitive-information-securely/)
- [Securely sharing information with PGP](https://medium.com/slalom-build/how-to-use-gpg-to-securely-share-secrets-with-your-team-c09c50fe77e3)

:::note

You can find Zuplo support's PGP public key at:
https://zuplo.com/.well-known/support-key.txt

:::
