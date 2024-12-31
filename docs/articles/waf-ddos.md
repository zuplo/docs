---
title: Zuplo + WAF/DDoS Services
---

A common setup for customers using Zuplo (or any API Gateway) is how to setup a
WAF and DDoS protection in front of their API Gateway. Because Zuplo is deployed
to the edge (meaning lots of different locations all around the world close to
your customers), it's important that your WAF/DDoS services also support
edge-based deployments. Configuring a legacy WAF solution that runs in one or
only a few data centers in front of Zuplo will result in increased latency and
suboptimal experiences for your end users. This document outlines the various
strategies as well as the recommended setup for several popular services.

When picking WAF + DDoS services to run in front of your Zuplo API Gateway
consider the following:

- What level of customization do you require for your WAF + DDoS? If common
  configurations are enough, consider Zuplo Managed WAF + DDoS.
- Is your WAF/DDoS service also deployed at the edge?
- How can you ensure that requests can't bypass your WAF/DDoS and make requests
  directly to your API Gateway?

## Zuplo Managed WAF + DDoS

Customers on Zuplo’s enterprise plans have the option to use our managed WAF +
DDoS products. All public entry points for Zuplo API Gateways are terminated
with Cloudflare. We use Cloudflare to issue SSL Certificates, DNS, and
networking. Zuplo’s managed security services are built on top of Cloudflare’s
powerful solutions for WAF and DDoS.

Zuplo’s managed WAF + DDoS allows for customers to choose several levels of
protection on their Gateway as well as enable protection for common threats such
as zero-day vulnerabilities, OWASP rules for common attacks like SQL injection,
and more. Zuplo’s managed security services are a good fit for customers who
need common protections, but don’t want to manage specific rules and
configurations.

If you require the ability to finely control your WAF Rules we recommend using
your own solution in front of Zuplo.

If you are interested in using Zuplo’s Managed WAF + DDoS services contact our
sales team today.

### Cloudflare WAF + DDoS

Cloudflare is the easiest solution for custom WAF + DDoS in front of your Zuplo
API Gateway. Because Zuplo is already terminated with Cloudflare, the
integration is seamless and requires virtually zero configuration. Simply point
your Cloudflare managed domain to Zuplo and you are protected. You can fully
customize your WAF, firewall, DDoS or any other security configuration offered
by Cloudflare. When a request comes into Cloudflare, it will be routed first
through your account’s configuration, then will be sent to your Zuplo API
Gateway. The same thing happens on the outbound as well.

A custom domain configured on Zuplo that utilizes Cloudflare DNS is completely
protected from requests bypassing your WAF and hitting Zuplo directly.
Additionally, because your WAF and DDoS are in the same edge locations that
Zuplo uses to terminate our endpoints, there will be no additional latency.

[Cloudflare Edge Locations](https://www.cloudflare.com/network/)

## Fastly Next-Gen WAF (powered by Signal Sciences)

Fastly’s next-gen WAF is another good edge-based solution for WAF/DDoS
protection. Fastly can be configured with minimal setup to work with Zuplo.
Because Fastly is most of the same edge locations as Cloudflare (while they
don’t disclose this, we suspect that in many cases they are often in the same
physical colo data centers) there will be virtually no additional latency using
the two products together.

- [Configuring Zuplo + Fastly](./waf-ddos-fastly.md)
- [Fastly Edge Locations](https://www.fastly.com/network-map/)

## AWS Shield + AWS WAF + Cloudfront

AWS offers DDoS (Shield) and WAF products that run at Cloudfront edge locations.
This is another good option for edge-based WAF/DDoS protection in front of your
Zuplo API Gateway. AWS Cloudfront is also in hundreds of edge locations that are
very close to Cloudflare locations (again, this isn’t something either company
discloses, but we suspect there is significant overlap in the physical locations
used by AWS and Cloudflare).

For more information on AWS Shield and WAF, see the following links:

- [Configuring Zuplo + AWS WAF & Shield](./waf-ddos-aws-waf-shield.md)
- [AWS Cloudfront Locations](https://aws.amazon.com/cloudfront/features/?whats-new-cloudfront&whats-new-cloudfront.sort-by=item.additionalFields.postDateTime&whats-new-cloudfront.sort-order=desc)
