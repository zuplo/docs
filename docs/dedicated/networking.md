---
title: Networking
---

Your dedicated managed instance of Zuplo will be deployed to the cloud provider
of your choice. Network connectivity can be customized to meet your specific
requirements.

Common configurations include:

- Using Zuplo as the public ingress to your API and using network connectivity
  such as AWS Transit Gateway, PrivateLink, or VPC Peering to connect to your
  backend services.
- Restricting access to the public internet by configuring your API Gateway to
  only accept traffic from specific IP ranges or VPCs allowing you to put WAFs,
  IDS/IPS, or other security appliances in front of your API Gateway.
- Multiple dedicated managed instances of Zuplo can be deployed across multiple
  regions to provide high availability and disaster recovery.

To discuss your networking requirements, please contact your account manager.
