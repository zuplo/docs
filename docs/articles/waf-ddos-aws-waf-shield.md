---
title: Configuring Zuplo with AWS WAF + Shield
sidebar_label: AWS WAF + Shield
---

AWS WAF + Shield run at AWS Cloudfront edge locations. Zuplo can be configured
to run as a custom backend behind Cloudfront.

## Securing Zuplo from Direct Access

With any WAF product, you will want to ensure that network traffic can't bypass
your WAF and hit your API Gateway directly. AWS WAF + Shield offer several ways
to ensure that your API Gateway is only accessible through the WAF.

The information below is a summary of Amazon's own recommendations for securing
your backend - regardless of whether you are using Zuplo, another API Gateway,
or AWS origins. You can also reference
[the AWS documentation](https://docs.aws.amazon.com/whitepapers/latest/secure-content-delivery-amazon-cloudfront/custom-origin-with-cloudfront.html)
directly.

### IP Address Restrictions

Amazon maintains a list of Cloudfront IP addresses (separate from other AWS
uses) that you can use to restrict access to your API Gateway. This is a good
way to ensure that only Cloudfront can access your API Gateway. However, as
Cloudfront is available to any AWS customer, this method isn't sufficient to
protect unauthorized traffic from hitting your API Gateway.

In Zuplo, you can utilize the IP Address Restriction policy to limit traffic to
only the Cloudfront IP addresses. You don't need to provide the address list
manually, instead you can utilize the built-in list as shown below.

```json
{
  "name": "allow-cloudfront-only",
  "policyType": "ip-address-restriction-inbound",
  "handler": {
    "export": "IPAddressRestrictionInbound",
    "module": "$import(@zuplo/runtime)",
    "options": {
      "allowedIpAddresses": ["list:aws-cloudfront"]
    }
  }
}
```

With this policy in place, only Cloudfront traffic will be allowed to hit your
Zuplo API Gateway.

### Custom Headers

Another way to ensure that traffic is coming from Cloudfront is to use custom
headers. Custom headers can be added to your Cloudfront distribution and then
checked by your API Gateway. This provides an additional layer of security on
top of IP address restrictions and prevents any unauthorized traffic from
hitting your API Gateway - regardless of the source.

In Zuplo, you can utilize the Header Restriction policy to limit traffic to only
those requests that include the custom header and secret value.

```json
{
  "name": "allow-cloudfront-custom-header",
  "policyType": "require-header-inbound",
  "handler": {
    "export": "RequireHeaderInboundPolicyOptions",
    "module": "$import(@zuplo/runtime)",
    "options": {
      "headerName": "secure-header",
      "allowedValues": ["$env(MY_SECRET_HEADER_VALUE)"]
    }
  }
}
```

With this policy in place, only requests that include the custom header with the
secret value will be allowed to hit your Zuplo API Gateway.

### Identity Based Options

Unfortunately, AWS WAF + Shield don't offer identity-based options like IAM or
network based options for securing your API Gateway. This is true for
[both AWS](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/restrict-access-to-load-balancer.html)
and non-AWS API Gateway products. If you require these options, you will need to
use a different WAF product in front of your Zuplo API Gateway.
