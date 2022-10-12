---
title: Zuplo and Cloudflare Settings
sidebar_label: Cloudflare Settings
---

All Zuplo environments are deployed behind Cloudflare's Web Application Firewall, DDoS protection, Bot Detection, and SSL termination. The combination of Cloudflare's network infrastructure and Zuplo's API Gateway help provide critical security and performance capabilities to your API all with zero custom configuration.

## Web Application Firewall Rules

By default, Zuplo has enabled Cloudflare's [OWASP Core Rule Set](https://owasp.org/www-project-modsecurity-core-rule-set/) and [Cloudflare Managed Ruleset](https://developers.cloudflare.com/waf/managed-rulesets/reference/cloudflare-managed-ruleset/) for every API Gateway deployed to Zuplo. These rules provide a high level of protection with a low likely hood of causing false positives for API transactions.

For most customers, the default set of rules provides a high level of protection without any interruption to services. However, custom WAF rules can be modified as needed for your API running on Zuplo. Rules can be applied to your entire API or based on [custom rule filters](https://developers.cloudflare.com/ruleset-engine/rules-language/).

## DDos Protection

DDoS protection is provided for every Zuplo API through [Cloudflare's DDoS protection service](https://support.cloudflare.com/hc/en-us/articles/200172676-Understanding-Cloudflare-DDoS-protection). The **rule sensitivy** setting is set to **default**. This setting can be modified for your API as needed.

## Security Level

Cloudflare uses a blanket [security protection setting](https://support.cloudflare.com/hc/en-us/articles/200170056-Understanding-the-Cloudflare-Security-Level) that uses the IP reputation of a visitor to decide if the request should be blocked. By default, Zuplo uses the setting of **Low** on APIs. As many of our APIs have a high level of automated traffic, the low setting is used to block only the most abusive IP addresses. This setting can be customized as needed for your API.

## Caching

Cloudflare's global CDN enables your API Gateway to set cache headers in order to reduce the number of requests that hit your origin API. By default, all APIs deployed to Zuplo are configured on Cloudflare to respect existing cache headers. The means that if you want content cached, simply set the [appropriate headers](https://developers.cloudflare.com/cache/about/cache-control/) and Cloudflare's global CDN will cache responses at the edge.

## Developer Environments

Generally, developer environments (i.e. any API running on the domain `zuplo.dev`) has similar security configurations as "production" environments (i.e. any API running on the domain `zuplo.app` or your own custom domain). There are some exceptions where we have slightly more security measures in place to prevent abuse of developer resources. If you see any issues or have requests blocked to your developer instance please contact [support@zuplo.com](mailto:support@zuplo.com) and we can assist with adjusting rules to ensure you can test your API as needed.
