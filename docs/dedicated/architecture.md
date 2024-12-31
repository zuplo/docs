---
title: Managed Dedicated Architecture
sidebar_label: Architecture
---

Zuplo's managed dedicated instances are highly available, scalable, and secure.
With a managed dedicated instance of Zuplo, your API Gateway runs on isolated
instances and, when running on a cloud provider that supports it, a dedicated
VPC. This document outlines the components and architecture of a managed
dedicated instance of a Zuplo API Gateway.

## Components

A managed dedicated instance of Zuplo consists of the following components:

- **API Gateway**: The API Gateway is the core component of Zuplo. It receives
  incoming requests, routes them to the appropriate backend, and returns the
  response to the client. The API Gateway handles authentication, authorization,
  rate limiting, and other features.
- **Gateway Services**: Zuplo, being a highly distributed API Gateway, uses
  services to facilitate features such as
  [Rate Limiting](../articles/rate-limiting.md),
  [API Key Authentication](../articles/api-key-management.md), and
  [Monetization](../articles/monetization.md).
- **Control Plane**: The Control Plane manages the configuration of the API
  Gateway. It deploys new configurations, manages the lifecycle of the API
  Gateway, and monitors its health.
- **Analytics and Logging**: Zuplo provides analytics and logging for your API
  Gateway. This includes request/response logging, error logging, and analytics
  on request volume, latency, and other metrics.
- **Developer Portal**: The Developer Portal is a web-based interface that
  allows developers to interact with your API. It provides documentation,
  testing tools, and other features to help developers integrate with your API.

## Custom requirements

Customize a managed dedicated instance of Zuplo to meet your specific
requirements. Examples include:

- **Regions & Availability Zones** - Zuplo can deploy to multiple regions,
  availability zones, or data centers to provide high availability and low
  latency.
- **Developer Portal Hosting** - The developer portal typically hosts from a CDN
  managed by Zuplo. Our default configuration serves the developer portal's
  static assets from a global CDN, but we can configure your developer portal to
  use only regional CDN locations if required.
- **Networking** - Zuplo can deploy with a variety of network configurations. To
  learn more, see [Networking](./networking.md).
- **Disabling Features** - Zuplo can disable features that aren't needed for
  your use case or that don't meet your security or compliance requirements. For
  example, if you don't want to use the built-in API analytics and instead want
  to use your own analytics, we can disable the built-in analytics. When we
  disable our built-in analytics, we don't collect or store analytics data for
  your APIs.
- **Custom Logging & Monitoring** - Zuplo can integrate with your existing
  logging and monitoring systems. Logs and other data are sent directly from the
  API Gateway to your logging provider. Zuplo doesn't collect or store this
  data.

## Security

Security is a top priority for Zuplo. A managed dedicated instance of Zuplo is
isolated from other customers and is secure by default. Some security features
of a managed dedicated instance of Zuplo include:

- **Isolation**: Each dedicated managed instance of Zuplo runs on its own VPC or
  network. This isolates it from other customers and ensures that your data is
  secure.
- **Encryption**: Zuplo encrypts data in transit and at rest. All data sent to
  or from the API Gateway is encrypted using TLS. Data stored by Zuplo is
  encrypted at rest.
- **Access Control**: Zuplo provides robust authentication and access control
  mechanisms. You control who has access to your API Gateway management
  capabilities, what they can do, and what data they can access.
- **Audit Logs**: Zuplo provides detailed audit logs of all management
  operations. You can see who did what, when they did it, and what data they
  accessed. Additionally, Zuplo maintains internal audit logs of all activity
  performed by the Zuplo team.

## Architecture

The architecture of a managed dedicated instance of Zuplo provides you with all
the benefits of a SaaS platform while giving you the control and isolation of a
dedicated instance. The architecture is highly available, scalable, and secure.

The following diagram shows the high-level architecture of a managed dedicated
instance of Zuplo.

<ManagedDedicatedArchitecture />

### Deployments

When you deploy to your managed dedicated instance of Zuplo, you upload your
source code and configuration files to the Control Plane. The Control Plane then
deploys your API Gateway to the appropriate infrastructure. The API Gateway
deploys to multiple nodes in multiple regions to provide high availability and
low latency. If you run in multiple regions, the Control Plane manages the
deployment to each region without any downtime.

If you use Zuplo's Developer Portal, the control plane also deploys the web
application that powers the Developer Portal. The Developer Portal hosts on a
CDN to provide low latency access to end-users. The CDN configuration can be
customized to meet your specific requirements.

<ManagedDedicatedDeploymentArchitecture />

### Multiple regions

It's common practice to deploy your API Gateway to multiple regions to provide
higher availability, lower latency, and meet regulatory requirements. Zuplo can
deploy your API Gateway to multiple regions and manage the deployment to each
region without any downtime.

When you deploy your API Gateway to multiple regions, Zuplo uses a global load
balancer to route traffic to the closest region. This provides low latency
access to your API's for end-users around the world. The load balancer also
handles fail over in case of an outage in one region.

<ManagedDedicatedMultiRegionArchitecture />

### Environments

Customers running managed dedicated Zuplo typically have multiple instances of
Zuplo deployed. The most common case is to have a production instance and a
non-production instance. The non-production instance is used to deploy and test
changes to your API Gateway before deploying them to production.

Each instance is isolated and runs in its own VPC or network.

It's possible to have multiple instances depending on your requirements. For
example, some customers have separate instances for production, staging, and
development. For most customers, though, a single production and a single
development instance are sufficient.

When you onboard to Zuplo, you will work with your account manager to determine
the configuration that best meets your requirements. When we create your
project, we pre-configure it with the agreed-upon number of instances and set up
rules that determine where each environment gets deployed.

The most common setup is where your `main` branch deploys to production and all
other branches deploy to a non-production environment, but this is fully
customizable.

<ManagedDedicatedEnvironmentsArchitecture />
