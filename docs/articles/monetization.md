---
title: API Monetization with Zuplo
sidebar_label: Overview
---

Zuplo provides a flexible and powerful approach to API monetization, allowing
you to choose the billing provider that best fits your business needs while
leveraging our world-class API management platform.

## Our Approach: Best of Both Worlds

Rather than building monetization features from scratch, Zuplo partners with
leading billing and metering platforms to give you:

- **Industry-leading API management** - Zuplo's blazing-fast gateway, beautiful
  developer portal, and comprehensive management features
- **Best-in-class monetization** - Purpose-built billing solutions with all the
  features your business needs
- **Seamless integration** - Pre-built policies, examples, and documentation to
  connect everything together

## Available Integrations

### OpenMeter Integration

Our [OpenMeter Metering Policy](../policies/openmeter-metering-inbound.mdx)
provides production-ready integration with [OpenMeter](https://openmeter.io/), a
modern usage-based billing platform. Features include:

- **Real-time usage tracking** - Track API requests and custom metrics as they
  happen
- **Flexible pricing models** - Support pay-as-you-go, credits, tiers, and
  custom models
- **Usage enforcement** - Automatically block requests when customers exceed
  their limits
- **CloudEvents support** - Industry-standard event format for maximum
  compatibility

[Learn more about monetization with OpenMeter →](./monetization-using-openmeter.md)

### Amberflo Integration

Our [Amberflo Metering Policy](../policies/amberflo-metering-inbound.mdx)
enables real-time usage metering and billing through
[Amberflo](https://www.amberflo.io/), a usage-based billing platform. Features
include:

- **Real-time event ingestion** - Track usage events with sub-second latency
- **Flexible metering** - Define custom meters for any billable metric
- **Usage-based pricing** - Support complex pricing models and tiers
- **Customer dashboards** - Provide usage visibility to your customers

### Moesif Integration

The [Moesif Analytics Policy](../policies/moesif-inbound.mdx) integrates with
[Moesif](https://www.moesif.com/), providing API analytics and monetization
capabilities. Features include:

- **API analytics** - Deep insights into API usage patterns and customer
  behavior
- **Usage tracking** - Monitor API calls, latency, and error rates
- **Customer segmentation** - Analyze usage by customer cohorts
- **Billing alerts** - Set up notifications for usage thresholds

Learn how Zuplo and Moesif work together in this blog post:
[API Observability and Monetization at the Edge](https://www.moesif.com/blog/api-monetization/Moesif-Zuplo-API-Observability-and-Monetization-At-The-Edge/)

### Stripe Integration

[Stripe](https://stripe.com) is a powerful option for API monetization when
combined with Zuplo's API management capabilities. You can:

- **Build custom integrations** - Use Stripe's APIs with Zuplo's programmable
  gateway
- **Leverage webhooks** - Process subscription events and update access in
  real-time with our
  [Stripe Webhook Verification Policy](../policies/stripe-webhook-verification-inbound.mdx)
- **Implement quality-based pricing** - Charge more for better API performance
- **Create tiered access** - Different rate limits and features per subscription
  level

Learn how improving API quality can increase revenue in this blog post:
[Increase Revenue by Improving API Quality](https://zuplo.com/blog/2024/02/02/increase-revenue-by-improving-api-quality)

## Enterprise Solutions

For organizations with complex monetization requirements that go beyond standard
billing integrations, Zuplo offers advanced enterprise solutions. Our enterprise
monetization is built on our globally distributed infrastructure and provides:

- **Custom billing systems** - Integrate with any billing provider or
  proprietary systems
- **Global quota enforcement** - Consistent usage tracking across all edge
  locations
- **Advanced analytics** - Real-time revenue monitoring and predictive insights
- **White-label solutions** - Fully branded experiences for your customers

[Learn more about enterprise monetization →](./monetization-enterprise.md)

## Developer Portal Integration

The [Zuplo Developer Portal](../dev-portal/introduction.md) can be customized to
integrate with any monetization provider.

### Custom Pages and Plugins

Build tailored experiences for your customers:

- [Custom pages](../dev-portal/zudoku/guides/custom-pages.md) for pricing,
  billing, and account management
- [Custom plugins](../dev-portal/zudoku/custom-plugins.md) to integrate billing
  widgets and dashboards

### Example Implementation

Check out our
[complete OpenMeter example](https://github.com/zuplo/zuplo/tree/main/examples/metered-monetization)
that demonstrates:

- Self-service API key creation
- Automatic customer provisioning
- Plan assignment on creation of API key
- Usage tracking and quota enforcement

## Programmable API Gateway

Zuplo's API gateway is fully programmable, allowing you to implement any
monetization logic your business requires:

### Custom Policies

Create [custom inbound](../policies/custom-code-inbound.mdx) and
[outbound policies](../policies/custom-code-outbound.mdx) to:

- Calculate dynamic pricing based on request/response characteristics
- Track custom metrics and dimensions
- Integrate with any external billing API

### Event-Driven Architecture

Use Zuplo's [hooks system](/docs/programmable-api/hooks) to:

- Send usage events to your billing system
- Update customer limits in real-time
- Send metrics to external systems using plugins like the
  [Azure Event Hubs Plugin](./plugin-azure-event-hubs.md)

## Resources

<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
  <div className="border rounded-lg p-6">
    <h3 className="text-lg font-semibold mb-2">Try OpenMeter Integration</h3>
    <p className="mb-4">Get started with usage-based billing in minutes</p>
    <a href="./monetization-using-openmeter" className="text-primary hover:underline">View guide →</a>
  </div>
  
  <div className="border rounded-lg p-6">
    <h3 className="text-lg font-semibold mb-2">Explore Examples</h3>
    <p className="mb-4">See complete monetization implementations</p>
    <a href="https://github.com/zuplo/zuplo/tree/main/examples/metered-monetization" className="text-primary hover:underline">Browse examples →</a>
  </div>
</div>
