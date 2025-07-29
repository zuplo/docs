---
title: Zuplo and Cloudflare Settings
sidebar_label: Cloudflare Settings
---

Zuplo managed edge environments are deployed behind Cloudflare's Web Application
Firewall, DDoS protection, Bot Detection, and SSL termination. The combination
of Cloudflare's network infrastructure and Zuplo's API Gateway help provide
critical security and performance capabilities to your API all with zero custom
configuration.

## Web Application Firewall Rules

By default, Zuplo does not enable any Web Application Firewall rules. This means
that no request should be blocked by the Web Application Firewall.

You can choose to enable some preconfigured default rulesets to protect your API
Gateway. Our default rules provide a high level of protection with a low
likelihood of causing false positives for API transactions. For enterprise
customers, Zuplo offers the ability to customize WAF rules to suite your
specific needs.

## DDos Protection

DDoS protection is available for every Zuplo API through
[Cloudflare's DDoS protection service](https://developers.cloudflare.com/ddos-protection/about/).
By default, the **rule sensitivy** setting is set to **Essentially Off** meaning
almost no requests will be blocked.

## Security Level

Cloudflare uses a blanket
[security protection setting](https://developers.cloudflare.com/waf/tools/security-level/)
that uses the IP reputation of a visitor to decide if the request should be
blocked. By default, Zuplo this security setting is **Off** for all Zuplo APIs.
For paying customers, this setting can be customized as needed for your API.

## Caching

Cloudflare's global CDN enables your API Gateway to set cache headers in order
to reduce the number of requests that hit your origin API. By default, all APIs
deployed to Zuplo are configured on Cloudflare to respect existing cache
headers. The means that if you want content cached, simply set the
[appropriate headers](https://developers.cloudflare.com/cache/about/cache-control/)
and Cloudflare's global CDN will cache responses at the edge.
