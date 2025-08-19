---
title: Configuring Zuplo with Akamai App & API Protector
sidebar_label: Akamai App & API Protector
---

Akamai App & API Protector runs at Akamai edge locations. Zuplo can be
configured to run as a custom origin behind Akamai.

## Securing Zuplo from Direct Access

With any WAF product, you will want to ensure that network traffic can't bypass
your WAF and hit your API Gateway directly. Akamai offers several ways to ensure
that your API Gateway is only accessible through the WAF.

The information below is a summary of Akamai's own recommendations for securing
your backend - regardless of whether you are using Zuplo, another API Gateway,
or Akamai origins. You can reference the
[Akamai documentation](https://techdocs.akamai.com/application-security/docs/origin-server-protection).

### IP Address Restrictions

Akamai maintains a list of IP addresses that you can use to restrict access to
your API Gateway. This is a good way to ensure that only Akamai can access your
API Gateway. However, as Akamai is a multi-tenant service, this method isn't
sufficient to protect unauthorized traffic from hitting your API Gateway.

In Zuplo, you can utilize the IP Address Restriction policy to limit traffic to
only the Akamai IP addresses. You don't need to provide the address list
manually, instead you can utilize the built-in list as shown below.

```json
{
  "name": "allow-akamai-only",
  "policyType": "ip-address-restriction-inbound",
  "handler": {
    "export": "IPAddressRestrictionInbound",
    "module": "$import(@zuplo/runtime)",
    "options": {
      "allowedIpAddresses": ["list:akamai"]
    }
  }
}
```

With this policy in place, only Akamai traffic will be allowed to hit your Zuplo
API Gateway.

### Custom Headers

Another way to ensure that traffic is coming from Akamai is to use custom
headers. Custom headers can be added to your Akamai configuration and then
checked by your API Gateway. This provides an additional layer of security on
top of IP address restrictions and prevents any unauthorized traffic from
hitting your API Gateway - regardless of the source.

In Akamai, you can configure custom headers using the Property Manager or the
Akamai API. Add a custom header with a secret value that only you and Akamai
know.

In Zuplo, you can utilize the Header Restriction policy to limit traffic to only
those requests that include the custom header and secret value.

```json
{
  "name": "allow-akamai-custom-header",
  "policyType": "require-header-inbound",
  "handler": {
    "export": "RequireHeaderInboundPolicyOptions",
    "module": "$import(@zuplo/runtime)",
    "options": {
      "headerName": "x-akamai-auth",
      "allowedValues": ["$env(AKAMAI_SECRET_HEADER_VALUE)"]
    }
  }
}
```

With this policy in place, only requests that include the custom header with the
secret value will be allowed to hit your Zuplo API Gateway.

## Additional Akamai Origin Security Options

Akamai provides several additional security features to protect your origin
servers beyond IP restrictions and custom headers:

### Mutual TLS (mTLS) Authentication

Use mutual TLS to establish secure, certificate-based authentication between
Akamai edge servers and your origin. This ensures only authenticated Akamai
servers can connect to your backend.

Learn more:
[mTLS Origin Keystore](https://techdocs.akamai.com/property-mgr/docs/mtls-origin-keystore)

### Origin IP Access Control List

Configure an IP-based access control list that specifically defines which Akamai
IP addresses can access your origin servers. This provides more granular control
than general IP restrictions.

Learn more:
[Origin IP ACL](https://techdocs.akamai.com/origin-ip-acl/docs/welcome)

### Site Shield

Site Shield provides a dedicated set of IP addresses that Akamai uses to connect
to your origin servers. This creates a more predictable and secure connection
pattern between Akamai and your backend infrastructure.

Learn more:
[Site Shield](https://techdocs.akamai.com/site-shield/docs/welcome-site-shield)

### Authentication Token 2.0

Implement token-based authentication for origin requests. This method allows you
to validate that requests are coming from legitimate Akamai edge servers using
cryptographic tokens.

Learn more:
[Auth Token 2.0](https://techdocs.akamai.com/property-mgr/docs/auth-token-2-0-ver)

### Custom Request Headers with Shared Secrets

Configure Akamai to modify incoming request headers and add shared secret values
that your origin can validate. This is similar to the custom header approach
mentioned above but provides more advanced header manipulation capabilities.

Learn more:
[Modify Incoming Request Header](https://techdocs.akamai.com/property-mgr/docs/modify-incoming-req-header)

These security measures can be used individually or combined to create multiple
layers of protection for your Zuplo API Gateway when running behind Akamai App &
API Protector.
