---
title: Zuplo Self-Hosted
sidebar_label: Overview
---

Zuplo Self-Hosted (also known as on-premises) is a deployment model where you
run Zuplo on your own infrastructure in any cloud or private data center. Zuplo
Self-Hosted runs exclusively on Kubernetes and can be deployed to any Kubernetes
environment. Deployment is simple and uses Helm charts.

Self-hosted deployment might be the right choice for you if you need:

- Complete control over your infrastructure and deployment environment
- To run Zuplo in a private data center or on-premises environment
- To meet strict data sovereignty or regulatory requirements that require data
  to remain within your infrastructure
- To integrate with existing on-premises systems and networks
- To customize the deployment architecture to match your organization's specific
  requirements

## Deployment Options

Zuplo Self-Hosted offers two deployment models:

### Hybrid Deployment

In a hybrid deployment, you run the Zuplo API Gateway on your infrastructure
while leveraging shared services for features such as rate limiting. This
approach provides a balance between control and operational simplicity, allowing
you to maintain your gateway infrastructure while benefiting from managed
services for specific features.

### Full Self-Hosted

In a full self-hosted deployment, you run all Zuplo components on your
infrastructure. This provides complete control and isolation, ensuring that all
data and processing remain within your environment.

## Features

The self-hosted deployment model provides the same core features as other Zuplo
deployment models. You can use all the same policies, integrations, and features
as you would with edge-based or managed dedicated deployments.

In addition to the standard features, self-hosted deployment provides:

- **Kubernetes-Based**: Deploy to any Kubernetes environment using simple Helm
  charts
- **Complete Control**: Full control over your infrastructure, networking, and
  security configurations
- **Data Sovereignty**: Keep all data and processing within your infrastructure
- **Custom Networking**: Integrate with your existing network architecture and
  security policies
- **Compliance**: Meet regulatory and compliance requirements that require
  on-premises deployment

## Getting Started

To learn more about self-hosting Zuplo or to discuss your specific requirements,
[book a meeting](https://zuplo.com/meeting) with us.
