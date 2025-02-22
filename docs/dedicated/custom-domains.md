---
title: Managed Dedicated Custom Domains
sidebar_label: Custom Domains
---

Configuration of custom domains with your managed dedicated instance of Zuplo
varies depending on how your
[instance networking is configured](./networking.md). For customers using their
Zuplo API Gateway as the ingress the bulk of the configuration is managed by
Zuplo. You will be provided an IP address or CNAME to point your DNS to.
Normally, Zuplo manages the SSL certificates in this type of configuration as
well.

Custom configurations are supported with Zuplo Managed Dedicated instances. For
example, you can use your own SSL certificates, or if you are using your own VPC
as the ingress, you can even use your own IP addresses.

For the full details on how to configure custom domains with your managed
dedicated instance of Zuplo, please contact your account manager.

## Preview environments

By default, preview environments are deployed to a wildcard subdomain managed by
Zuplo. For example, if your account name is `acme`, the preview environment urls
are hosted at `*.acme.zuplo.work`, so each environment will have a URL like
`https://my-environment-123.acme.zuplo.work`.

Some customer want to use their own domain for preview environments. For
example, `*.dev.acme.com`. This is supported with Zuplo Managed Dedicated
instances. Depending on your cloud provider, this may require you to create a
wildcard certificate for your domain.
