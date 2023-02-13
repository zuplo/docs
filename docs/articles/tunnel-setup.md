---
title: Tunnel Setup & Use
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
- [Deploying container images to GCP](https://cloud.google.com/compute/docs/containers/deploying-containers)

The docker container is `zuplo/tunnel` and is available on [Docker Hub](https://hub.docker.com/r/zuplo/tunnel).

Your running container needs a single environment variable named `TUNNEL_TOKEN`. You should store the value as a secret using the recommended means of secret storage and environment variable injection for your platform.

## Using Tunnels in Code

Once setup, tunnels can be treated like any API host that you call from your Zuplo gateway. Each named tunnel is called with the URL schema `service://`, so if your tunnel is named `my-awesome-service` your tunnel base URL would be `service://my-awesome-service`.

This URL can be used in code as shown below.

```ts
import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

export default async function (request: ZuploRequest, context: ZuploContext) {
  const response = await fetch("service://my-awesome-service/hello-world");
  if (response.status > 399) {
    return "It didn't work. :(";
  } else {
    return response;
  }
}
```

It is common to have multiple tunnels for each of your internal environments. Each tunnel can be restricted so that it is only accessible by specific Zuplo environments. For example, you might have two tunnels one for production and one for staging.

- `service://my-awesome-service-prod` (Production)
- `service://my-awesome-service-staging` (Staging)

## Using Tunnels in Config

Tunnel services can also be used in config such as with the URL Rewrite handler. To call a tunnel service simply use it as part of the rewrite url as shown in the image below.

![](https://cdn.zuplo.com/assets/0c91be91-a591-4cef-ac29-d266e8a3181e.png)

## Tunnel Environment Variables

When using these tunnels in your code or configuration, it is often useful to store the values as an environment variable. This way you can change which environment calls which tunnel without changing code or configuration.

For the production environment you would set the `BASE_TUNNEL_URL` to the production service name. See [this document](../deployments/environment-variables.md) for more about [Environment Variables](../deployments/environment-variables.md)

```text
BASE_TUNNEL_URL=service://my-awesome-service-prod
```

And for staging, you would use the staging service name.

```text
BASE_TUNNEL_URL=service://my-awesome-service-staging
```

In your handler code or other configuration, the service can be accessed using the environment variable.

```ts
import { ZuploContext, ZuploRequest, environment } from "@zuplo/runtime";

export default async function (request: ZuploRequest, context: ZuploContext) {
  const response = await fetch(`${environment.BASE_TUNNEL_URL}/hello-world`);
  if (response.status > 399) {
    return "It didn't work. :(";
  } else {
    return response;
  }
}
```

Environment variables can also be used in configuration, such as the URL Rewrite handler as shown below.

![](https://cdn.zuplo.com/assets/16b93099-511d-435b-af85-167fab5814b2.png)
