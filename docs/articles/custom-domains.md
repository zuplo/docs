---
title: Custom Domains
---

This guide will walk you through the process of setting up a custom domain for
your project's edge deployment environment. You can manage all domain settings
related to a project in the Custom Domains section of the Settings tab of your
project. Custom Domains are available on
[Builder plans and above](https://zuplo.com/pricing).

:::note

Custom domains can only be added to edge deployed environments. You can tell if
an environment is edge deployed if the domain ends with `zuplo.app`.
Environments with domains ending with `zuplo.dev` are for development only and
do not support custom domains.

:::

## Adding a new custom domain

The following steps will guide you on how to add and configure a custom domain
for your Zuplo project.

### 1. Navigate to your project's Custom Domain Settings

Go to your project in the Zuplo portal and open to the <SettingsTabIcon />
**Settings** tab (1), then select **Custom Domain** (2) and click on the
`Add New Custom Domain` button to open the `New Custom Domain` configuration
modal.

![](https://cdn.zuplo.com/assets/4b34e012-447b-49c8-8df1-cd5e0e6ec5a7.png)

### 2. Add your domain

Then, pick the edge deployed environment you want to assign the domain to and
enter your apex domain (e.g. example.com) or subdomain (e.g. api.example.com)

![](https://cdn.zuplo.com/assets/cac30cc7-511a-4e88-926b-2e0504105719.png)

Once saved, you will be provided with a `CNAME` configuration that will look
something like the one below that you'll use in the next step.

```txt
CNAME   api.example.com                       cname.zuplo.app
```

### 3. Configure your DNS

Once you have added your custom domain to your Zuplo project, you will need to
configure the DNS records of your domain with your registrar.

Using the CNAME configuration provided at the end of the previous step, you will
create that record on your DNS registrar. Cloudflare will then query your domain
[periodically](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/start/hostname-verification-backoff-schedule/)
until it can verify everything. If everything is configured correctly, it should
take a few minutes for your production Zup to start responding to traffic on
your custom domain. On the other hand, if a misconfiguration (typo) occurs and
you need to make changes, Cloudflare could take up to 4 hours to retry the
verification. Please be patient if this happens.

By default, you can also use the url on `zuploapp.com` although, if you prefer
that to be removed contact support and we can disable it for you.

:::caution

If you use Cloudflare as your DNS provider, you MUST enable Cloudflare Proxy on
your custom domain.

![](https://cdn.zuplo.com/assets/a40beef2-9eed-44fd-a41e-3f337afbaee2.png)

:::

### 4. Redeploy

Some changes, like the domain set in your developer portal, only get picked up
on the deployment. After you set a custom domain it is a good idea to redeploy
your environment to ensure everything is applied correctly.

## Cloudflare Customers

Zuplo uses Cloudflare for routing custom domain traffic to our servers. If you
use Cloudflare on your domain, there are a few limitations to be aware of. In
general, these shouldn't be a problem as we handle all the complexities for you.

For host names managed by Zuplo, you cannot control some Cloudflare settings for
your Zuplo subdomain (i.e. `api.example.com`). Examples include:

- Wildcard DNS
- Spectrum
- Argo
- Page Shield

See
[Cloudflare's documentation](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/#limitations)
for more details.

Other Cloudflare features that are configured on your Cloudflare Account such as
Firewall or WAF rules will function normally.

At this time, to use a wildcard domain or other complex custom domain for your
environment you will need to contact
[support@zuplo.com](mailto:support@zuplo.com).

## CAA Records

:::info

In most cases this isn't required. You only need to modify CAA records if you
already have them set on your DNS.

:::

If you have a CAA DNS record set on your domain, you must add either Google
Trust Services or Let's Encrypt as an authorized certificate authority.

You don't need to add both of these, just add one. The Google Trust Services
(pki.goog) is the recommended Authority as it has slightly better compatibility
with clients. Zuplo will use Google Trust Services by default unless only the
Let's Encrypt record is set.

```txt
CAA 0 issue "pki.goog"
CAA 0 issue "letsencrypt.org"
```
