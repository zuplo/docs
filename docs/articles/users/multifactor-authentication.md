---
title: Multifactor Authentication
sidebar_label: Multifactor Auth
---

Zuplo supports multifactor authentication (MFA) to help keep your account
secure. MFA adds an extra layer of security by requiring a second form of
verification in addition to your password. This can be done using an
authenticator app or security keys.

## Enabling Multifactor Authentication

To enable multifactor authentication for your account, follow these steps:

<Stepper>

1. Go to your user profile by clicking on your avatar in the top right corner of
   the Zuplo Portal and selecting **Profile**.
1. Find the **Multifactor Authentication** section and click **Enroll** on the
   type of multifactor authentication you want to use.
1. Follow the instructions to set up your chosen method of multifactor
   authentication.
1. The next time you log in, you will be prompted to enter your second form of
   verification in addition.

</Stepper>

## Disabling Multifactor Authentication

To disable multifactor authentication for your account, simply navigate to the
**Multifactor Authentication** section of your user profile and click
**Disable** next to the multifactor authentication method you want to remove.

## Enforcing Multifactor Authentication for Tenant Members

If you are an admin with MFA enabled on your account is part of a tenant, you
can enforce all members of your tenant to use multifactor authentication. This
adds an additional layer of security for your entire organization.

### Enabling MFA Enforcement

To enforce multifactor authentication for all tenant members:

<Stepper>

1. Navigate to **Settings** → **Members** in the Zuplo Portal.
1. Find the **Multi-Factor Authentication** section.
1. Toggle the enforcement setting to **On**.

</Stepper>

### What Happens When MFA is Enforced

When MFA enforcement is enabled:

- All existing tenant members who do not have MFA set up will be redirected to
  the MFA enrollment page when they next log in
- New members joining the tenant will be required to set up MFA before they can
  access the portal
- Members cannot bypass or skip the MFA setup process

Members will need to complete the MFA enrollment process using either an
authenticator app or security keys before they can continue using the Zuplo
Portal.
