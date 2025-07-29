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
  configurations are enough, consider Zuplo Managed WAF.
- Is your WAF/DDoS service also deployed at the edge?
- How can you ensure that requests can't bypass your WAF/DDoS and make requests
  directly to your API Gateway?

## Zuplo Managed WAF

Zuplo offers different WAF solutions based on your deployment model:

**Managed Edge Deployment:** Customers on Zuplo's enterprise plans using our
managed edge deployment can use Zuplo Managed WAF. This provides
enterprise-grade protection for your API Gateway with minimal configuration
required, including OWASP Core Ruleset, OFAC sanctions compliance, DDoS
protection, and custom rule capabilities.

**Managed Dedicated Deployment:** Customers using Zuplo's managed dedicated
deployment model can leverage custom WAF and DDoS configurations based on the
capabilities of their chosen cloud provider (AWS, Azure, GCP). Our team will
work with you to configure the appropriate security services available in your
cloud environment.

For detailed information about Zuplo Managed WAF for managed edge deployments,
see our [Zuplo Managed WAF guide](./zuplo-waf.md).

:::tip

Many common WAF functions can be implemented directly in Zuplo using policies,
without the need for a separate WAF service:

- **IP Restriction** - Block or allow requests from specific IP addresses using
  the [IP Restriction policy](../policies/ip-restriction-inbound)
- **Geolocation Blocking** - Route or block requests based on country using
  [custom policies](../guides/geolocation-backend-routing)
- **Rate Limiting** - Protect against abuse with built-in
  [rate limiting policies](../policies/rate-limit-inbound)
- **Custom Rules** - Create any custom security logic with
  [custom code policies](../policies/custom-code-inbound)

These policies run at the edge with your API, ensuring no additional latency
while providing powerful security capabilities.

:::

Contact our [sales team](mailto:sales@zuplo.com) to discuss which WAF solution
is right for your deployment model.

## Third-Party WAF Solutions

If you require the ability to finely control your WAF Rules or are using a
third-party WAF provider, Zuplo integrates seamlessly with popular edge-based
WAF solutions.

### Cloudflare WAF + DDoS

Cloudflare is the easiest solution for custom WAF + DDoS in front of your Zuplo
API Gateway. Because Zuplo is already terminated with Cloudflare, the
integration is seamless and requires virtually zero configuration. Simply point
your Cloudflare managed domain to Zuplo and you are protected. You can fully
customize your WAF, firewall, DDoS or any other security configuration offered
by Cloudflare. When a request comes into Cloudflare, it will be routed first
through your account's configuration, then will be sent to your Zuplo API
Gateway. The same thing happens on the outbound as well.

A custom domain configured on Zuplo that utilizes Cloudflare DNS is completely
protected from requests bypassing your WAF and hitting Zuplo directly.
Additionally, because your WAF and DDoS are in the same edge locations that
Zuplo uses to terminate our endpoints, there will be no additional latency.

[Cloudflare Edge Locations](https://www.cloudflare.com/network/)

### Fastly Next-Gen WAF (powered by Signal Sciences)

Fastly's next-gen WAF is another good edge-based solution for WAF/DDoS
protection. Fastly can be configured with minimal setup to work with Zuplo.
Because Fastly is most of the same edge locations as Cloudflare (while they
don't disclose this, we suspect that in many cases they are often in the same
physical colo data centers) there will be virtually no additional latency using
the two products together.

- [Configuring Zuplo + Fastly](./waf-ddos-fastly.md)
- [Fastly Edge Locations](https://www.fastly.com/network-map/)

### AWS Shield + AWS WAF + Cloudfront

AWS offers DDoS (Shield) and WAF products that run at Cloudfront edge locations.
This is another good option for edge-based WAF/DDoS protection in front of your
Zuplo API Gateway. AWS Cloudfront is also in hundreds of edge locations that are
very close to Cloudflare locations (again, this isn't something either company
discloses, but we suspect there is significant overlap in the physical locations
used by AWS and Cloudflare).

For more information on AWS Shield and WAF, see the following links:

- [Configuring Zuplo + AWS WAF & Shield](./waf-ddos-aws-waf-shield.md)
- [AWS Cloudfront Locations](https://aws.amazon.com/cloudfront/features/?whats-new-cloudfront&whats-new-cloudfront.sort-by=item.additionalFields.postDateTime&whats-new-cloudfront.sort-order=desc)

### Akamai App & API Protector

Akamai's App & API Protector provides comprehensive WAF and DDoS protection with
a global edge network. Akamai offers advanced bot management, API security, and
DDoS mitigation that works well with Zuplo's edge-deployed architecture. With
over 4,000 edge locations worldwide, Akamai ensures minimal latency when
protecting your Zuplo API Gateway.

Key features include:

- Advanced bot detection and mitigation
- API-specific security rules and rate limiting
- Real-time threat intelligence
- Automatic protection against OWASP Top 10 vulnerabilities
- DDoS protection across all layers

Akamai's extensive edge network ensures that security checks happen close to
your users, maintaining the low-latency benefits of Zuplo's edge deployment.

- [Akamai Edge Locations](https://www.akamai.com/why-akamai/our-edge-platform)
