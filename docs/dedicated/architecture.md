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
  [Rate Limiting](../articles/step-2-add-rate-limiting.md),
  [API Key Authentication](../articles/api-key-management.md), and
  [Monetization](../articles/monetization.md).
- **Control Plane**: The Control Plane manages the configuration of the API
  Gateway. It deploys new configurations, manages the lifecycle of the API
  Gateway, and monitors its health.
- **Analytics and Logging**: Zuplo provides analytics and logging for your API
  Gateway. This includes request/response logging, error logging, and analytics
  on request volume, latency, and other metrics.
- **Developer Portal**: The Developer Portal is a web-based interface that
  enables developers to interact with your API. It provides documentation,
  testing tools, and other features to help developers integrate with your API.

## Custom requirements

Customize a managed dedicated instance of Zuplo to meet your specific
requirements. Examples include:

- **Regions & Availability Zones** - Zuplo can deploy to multiple regions,
  availability zones, or data centers to provide high availability and low
  latency.
- **Developer Portal Hosting** - Zuplo manages the developer portal hosting from
  a CDN. By default, the developer portal's static assets serve from a global
  CDN. However, you can configure it to use only regional CDN locations if
  required.
- **Networking** - Zuplo can deploy with a variety of network configurations. To
  learn more, see [Networking](./networking.md).
- **Disabling Features** - Zuplo can disable unnecessary features for specific
  use cases or those that don't meet security or compliance requirements. For
  example, if you prefer custom analytics over the built-in API analytics, you
  can disable the built-in analytics. When disabled, Zuplo stops collecting or
  storing analytics data for the APIs.
- **Custom Logging & Monitoring** - Zuplo can integrate with your existing
  logging and monitoring systems. Logs and other data go directly from the API
  Gateway to your logging provider. Zuplo doesn't collect or store this data.

## Security

All deployment models of Zuplo are secure and provide isolation between each
customer and environment. Managed dedicated instances of Zuplo add the ability
for you to customize the networking and connectivity to meet your specific
security requirements.

- **IAM Authorization**: Managed dedicated instances of Zuplo can use the IAM
  capabilities to control traffic between the API Gateway and other services.
- **Encryption**: Zuplo encrypts data both in transit and at rest. TLS secures
  all data sent to or from the API Gateway. Zuplo encrypts stored data at rest.
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
instance of Zuplo and how the components interact with each other.

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
access to your APIs for end-users around the world. The load balancer also
handles failover in case of an outage in one region.

<ManagedDedicatedMultiRegionArchitecture />

### Instances

Customers running managed dedicated Zuplo typically have multiple instances of
Zuplo deployed. The most common case is to have a production instance and a
non-production instance. The non-production instance is used to deploy and test
changes to your API Gateway before deploying them to production. Each instance
can run many different deployments. A typical setup, the production instance
hosts only the production deployment, while the non-production instance hosts
many other deployments (for example staging, development, QA, or any feature
branch deployments).

Each instance operates in isolation and runs within its own VPC or network.

It's possible to have multiple instances depending on your requirements. For
example, some customers have separate instances for production, staging, and
development. For most customers, though, a single production and a single
development instance are sufficient.

During the onboarding process to Zuplo, an account manager will assist in
determining the configuration that best meets the requirements. The project will
be pre-configured with the agreed-upon number of instances, and rules will be
set up to determine where each environment gets deployed.

The most common setup is where your `main` branch deploys to production and all
other branches deploy to a non-production environment, but this is fully
customizable.

<ManagedDedicatedEnvironmentsArchitecture />
