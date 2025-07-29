---
title: Zuplo Managed WAF
---

Zuplo's Managed WAF provides enterprise customers using our **managed edge
deployment** with comprehensive security protection purpose-built for API
Gateways. This service offers multiple layers of protection against common
threats, attacks, and malicious traffic without requiring you to manage complex
security configurations.

:::note

Zuplo Managed WAF is only available for customers using Zuplo's managed edge
deployment model. Customers using managed dedicated deployments should refer to
the [Managed Dedicated WAF Options](#managed-dedicated-waf-options) section
below.

:::

## Available Protection Rules

### OWASP Core Ruleset

Zuplo's Managed WAF includes protection based on the
[OWASP Core Ruleset](https://owasp.org/www-project-top-ten/), which defends
against the most critical web application security risks. This includes
protection against:

- **SQL Injection** - Prevents attackers from inserting malicious SQL code
- **Cross-Site Scripting (XSS)** - Blocks malicious scripts from being injected
  into your API responses
- **Remote Code Execution** - Prevents attackers from executing arbitrary code
- **Local File Inclusion** - Blocks attempts to access local server files
- **Remote File Inclusion** - Prevents loading of remote malicious files
- **PHP Code Injection** - Blocks malicious PHP code execution attempts
- **HTTP Protocol Violations** - Detects and blocks malformed HTTP requests
- **Session Fixation** - Prevents session hijacking attempts
- **Scanner Detection** - Identifies and blocks automated vulnerability scanners
- **Metadata/Error Leakages** - Prevents exposure of sensitive system
  information

### OFAC Sanctioned Country Blocking

Zuplo's Managed WAF includes automatic blocking of traffic from countries on the
[OFAC Sanctions Programs list](https://ofac.treasury.gov/sanctions-programs-and-country-information).
This helps ensure compliance with U.S. Treasury regulations by preventing API
access from sanctioned regions.

The blocked country list is automatically updated as OFAC sanctions change,
ensuring your API remains compliant without manual intervention.

### DDoS Protection

All Zuplo API Gateways include automatic DDoS protection that defends against:

- **Layer 3/4 Attacks** - Network and transport layer flood attacks
- **Layer 7 Attacks** - Application layer attacks targeting your API endpoints
- **Amplification Attacks** - DNS, NTP, and other amplification-based attacks
- **SYN Floods** - TCP connection exhaustion attempts
- **HTTP Floods** - High-volume HTTP request attacks

DDoS protection is always-on and automatically scales to handle attacks of any
size without impacting legitimate traffic.

### Zero-Day Vulnerability Protection

Zuplo's Managed WAF includes rapid response protection against emerging threats
and zero-day vulnerabilities. When critical vulnerabilities are discovered,
protection rules are automatically deployed across all protected gateways
without requiring any action from your team.

## Custom WAF Rules

Enterprise customers can work with Zuplo to create and enable custom WAF rules
tailored to their specific security requirements. Custom rules can be configured
to:

- Block or allow traffic based on specific patterns
- Create IP allowlists or blocklists
- Implement rate limiting for specific endpoints
- Add custom request validation
- Create geography-based access controls beyond OFAC requirements
- Implement custom bot detection and mitigation

To discuss custom WAF rule requirements, contact your Zuplo account team.

## Enabling Zuplo Managed WAF

Zuplo's Managed WAF is available to enterprise customers. The service can be
enabled with different protection levels based on your security requirements:

- **Standard Protection** - OWASP Core Rules and DDoS protection
- **Enhanced Protection** - Includes OFAC blocking and zero-day protection
- **Custom Protection** - All features plus custom rules tailored to your needs

To enable Zuplo's Managed WAF on your API Gateway, contact our
[sales team](mailto:sales@zuplo.com).

## Benefits

- **Edge-deployed protection** - Security rules run at the same edge locations
  as your API, ensuring no additional latency
- **Automatic updates** - Protection rules are continuously updated without
  requiring deployments
- **No configuration complexity** - Pre-configured rulesets based on security
  best practices
- **Compliance support** - Automatic OFAC sanctions compliance
- **24/7 protection** - Always-on security monitoring and threat mitigation

## Complementary Zuplo Policies

In addition to Zuplo Managed WAF, you can implement many security features
directly using Zuplo's built-in policies:

- **IP Restriction** - Block or allow specific IP addresses with the
  [IP Restriction policy](../policies/ip-restriction-inbound)
- **Geolocation Controls** - Route or block requests based on geographic
  location using [custom policies](../guides/geolocation-backend-routing)
- **Rate Limiting** - Implement granular rate limits with
  [rate limiting policies](../policies/rate-limit-inbound)
- **Custom Security Rules** - Create any custom security logic with
  [custom code policies](../policies/custom-code-inbound)

These policies can be used alongside Zuplo Managed WAF for defense-in-depth
security or independently for specific security requirements.

## Managed Dedicated WAF Options

For customers using Zuplo's managed dedicated deployment model, WAF and DDoS
protection options depend on your chosen cloud provider. Unlike the standardized
Zuplo Managed WAF available for edge deployments, managed dedicated customers
can leverage the full range of security services offered by their cloud
platform.

For managed dedicated deployments, our team will:

1. Assess your security requirements during the deployment planning phase
2. Configure the appropriate WAF and DDoS services based on your cloud provider
3. Implement custom rules and policies specific to your use case
4. Provide ongoing support for security configuration updates

Contact our [sales team](mailto:sales@zuplo.com) to discuss security options for
your managed dedicated deployment.

## Next Steps

If you're interested in Zuplo's Managed WAF services for edge deployments or
need custom security configurations for managed dedicated deployments, contact
our [sales team](mailto:sales@zuplo.com) to discuss your requirements.

For customers requiring full control over WAF configurations, see our guides for
integrating with [Cloudflare WAF](./waf-ddos.md#cloudflare-waf--ddos),
[Fastly Next-Gen WAF](./waf-ddos-fastly.md), or
[AWS WAF + Shield](./waf-ddos-aws-waf-shield.md).
