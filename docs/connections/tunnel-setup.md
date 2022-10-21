---
title: Tunnel Setup
---

:::note

The secure tunnel connection option is available only to customers on a Zuplo enterprise plan. For more information contact [sales@zuplo.com](mailto:sales@zuplo.com).

:::

The easiest way to deploy your tunnel is using a Docker container. The three basic requirements for deploying a secure tunnel with Docker are:

1. A tunnel secret that is provided to the Docker container as an environment variable named `TUNNEL_TOKEN` (the secret is provided by Zuplo)
1. The ability for the tunnel service to make an outbound connection to the public internet to establish the secure tunnel.
1. The ability for the tunnel service to make a request to your internal API by a DNS address. (i.e. `https://my-service.local/api`).

To run the Docker container on your own infrastructure, refer to instructions from your cloud provider or contact [Zuplo support](mailto:support@zuplo.com) for assistance.

- [Deploying Docker containers on Azure](https://docs.microsoft.com/en-us/learn/modules/run-docker-with-azure-container-instances/)
- [Deploying Docker containers on AWS ECS](https://docs.aws.amazon.com/AmazonECS/latest/userguide/getting-started.html)
- [Deploying container images to Google Cloud Run](https://cloud.google.com/run/docs/deploying)

The docker container is `zuplo/tunnel` and is available on [Docker Hub](https://hub.docker.com/r/zuplo/tunnel).

Your running container needs a single environment variable named `TUNNEL_TOKEN`. You should store the value as a secret using the recommended means of secret storage and environment variable injection for your platform.
