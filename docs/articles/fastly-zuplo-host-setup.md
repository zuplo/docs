---
title: Using Zuplo as a Fastly Host
---

This document outlines how to use Zuplo as a host (i.e. origin) for Fastly.
While this is not a necessary setup for most people as Zuplo already runs at the
edge and can be used for CDN like caching. However, there are some scenarios
where you may want to put Zuplo behind Fastly. For example, if you are using
Fastly's WAF or DDoS protection and want to ensure that all traffic goes through
Fastly before hitting your Zuplo API Gateway.

## Configuring Zuplo as a Fastly Host

The following settings will allow you to run Zuplo as a host behind Fastly.

### Zuplo Configuration

It is recommended that you use a custom domain for your Zuplo API Gateway. This
will allow you to more easily configure your Fastly host as well as ensure that
your domain is stable regardless of your Zuplo configuration.

### Fastly Configuration

1. Create a new Fastly CDN service or use an existing one.
2. Create a new Origin and name it whatever you like.
3. Set the **Address** to your Zuplo API Gateway domain. For example,
   `api.example.com` if using a custom domain, or
   `my-project-main-021839d.zuplo.app` without a custom domain.
4. Enable TLS and keep the port as `443`.
5. Select Yes on Verify the Certificate.
6. If using a custom domain, set the _Certificate Hostname_ to your custom
   domain. If using a `zuplo.app` domain, set the set the _Certificate Hostname_
   to `zuplo.app`.
7. Set the **SNI hostname** to your custom domain or full `zuplo.app` domain
   (i.e. `my-project-main-021839d.zuplo.app`)

Additional settings like mTLS are also supported. Please refer to the Fastly
documentation for more information.
