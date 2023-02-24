---
title: Custom Domains
---

At this time, to add a custom domain to your environment you will need to contact [support@zuplo.com](mailto:support@zuplo.com).

We will need to know

1. The custom domain (e.g. api.contoso.io)
2. The URL of your [edge deployment](./environments.md) that you want to map to this URL. This typically ends in `.zuplo.app`.

Please include this information when contacting us. After we setup your custom domain we'll provide you with some records to configure on your DNS. Follow the instructions outlined below.

Setting up a custom domain to point to your Zup takes just a few DNS configurations.

You will be provided with two `TXT` records and a `CNAME`. They will look something like the ones below.

```txt
TXT     _acme-challenge.api.example.com       RANDOM-STRING
TXT     _cf-custom-hostname.api.example.com   RANDOM-STRING
CNAME   api.example.com                       cname.zuplo.app
```

At your DNS host, you create all three records. Cloudflare will then query your domain [periodically](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/start/hostname-verification-backoff-schedule/) until it can verify everything. If everything is configured correctly, it should take a few minutes for your production Zup to start responding to traffic on your custom domain. On the other hand, if a misconfiguration (typo) occurs and you need to make changes, Cloudflare could take up to 4 hours to retry the verification. Please be patient if this happens.

By default, you can also use the url on `zuploapp.com` although, if you prefer that to be removed contact support and we can disable it for you.

## Cloudflare Customers

Zuplo uses Cloudflare for routing custom domain traffic to our servers. If you use Cloudflare on your domain, there are a few limitations to be aware of. In general, these shouldn't be a problem as we handle all the complexities for you.

For host names managed by Zuplo, you cannot control some Cloudflare settings for your Zuplo subdomain (i.e. `api.example.com`). Examples include:

- Wildcard DNS
- Spectrum
- Argo
- Page Shield

See [Cloudflare's documentation](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/#limitations) for more details.

Other Cloudflare features that are configured on your Cloudflare Account such as Firewall or WAF rules will function normally.
