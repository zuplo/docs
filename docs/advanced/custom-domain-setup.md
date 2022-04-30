---
title: Custom Domain Setup
---

Setting up a custom domain to point to your Zup takes just a few DNS configurations.

You will be provided with two `TXT` records and a `CNAME`. They will look something like the below.

```txt
TXT     api.example.com                       ca3-RANDOM-NUBER
TXT     _cf-custom-hostname.api.example.com   RANDOM-NUMBER
CNAME   api.example.com                       example.zuploapp.com
```

At your DNS host, you create all three records. After you do so it should take a few minutes for your production Zup to start responding to traffic on your custom domain. By default, you can also use the url on `zuploapp.com` although, if you prefer that to be removed contact support and we can disable it for you.

## Cloudflare Customers

Zuplo uses Cloudflare for routing custom domain traffic to our servers. If you use Cloudflare on your domain, there are a few limitations to be aware of. In general these shouldn't be a problem as we handle all the complexities for you.

For host names managed by Zuplo, you cannot control some Cloudflare settings for your Zuplo subdomain (i.e. `api.example.com`). Examples include:

- Page Rules
- Firewall Settings
- Web Application Firewall (WAF)
- SSL settings

This won't interfere with your ability to use all Cloudflare features on the rest of your domain.

Additionally, when you setup your CNAME to point to Zuplo, you can enable Cloudflare proxy or not. Based on our usage and testing this setting doesn't seem to make any difference (as we already have this configured ourselves). Our current recommendation is to **disable Cloudflare Proxy**.
