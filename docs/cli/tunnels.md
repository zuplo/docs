---
title: Tunnel Commands
---

```bash
[I] ➜ zup tunnel --help
zup tunnel

Tunnel commands

Commands:
  zup tunnel create        Creates a new tunnel in your account
  zup tunnel delete        Deletes a tunnel in your account
  zup tunnel describe      Describes a tunnel in your account
  zup tunnel list          Lists the tunnels in your account
  zup tunnel rotate-token  Rotates the token for a tunnel in your account
  zup tunnel services      Tunnel services commands
```

Use these commands to help your manage your
[tunnels](../articles/secure-tunnel.md). They must be run from the root of your
Zuplo project.

### Creating a tunnel

```bash
# For brevity, the commands assume that you have exported your API key as an environment variable,
# export ZUPLO_API_KEY=zpka_d67b7e241bb948758f415b79aa8exxxx_2efbxxxx

zup tunnel create --tunnel-name my-tunnel
zup tunnel list
```

### Running the tunnel

To run the Docker container on your own infrastructure, refer to instructions
from your cloud provider or contact [Zuplo support](mailto:support@zuplo.com)
for assistance.

- [Deploying Docker containers on Azure](https://docs.microsoft.com/en-us/learn/modules/run-docker-with-azure-container-instances/)
- [Deploying Docker containers on AWS ECS](https://docs.aws.amazon.com/AmazonECS/latest/userguide/getting-started.html)
- [Deploying container images to GCP](https://cloud.google.com/compute/docs/containers/deploying-containers)

Your running container needs a single environment variable named
`TUNNEL_TOKEN``. You should store the value as a secret using the recommended
means of secret storage and environment variable injection for your platform.

### Configuring services

Once you have created a tunnel, you can configure which services it should
expose using a configuration file. Below is a sample configuration file.

The properties in the `services` objects are explained below.

- `name` - This is the name of the service that you will use from your zup
- `endpoint` - This is the local endpoint of your service that you tunnel can
  connect to
- `configurations` - This object specifies which projects and which environments
  can access this service.
  - `project` - The name of the zuplo project
  - `accessibleBy` - The environments which can use the tunnel. Valid values are
    `production`, `preview`, and `working-copy`.

```json
{
  "version": 1,
  "services": [
    {
      "name": "my-awesome-service-prod",
      "endpoint": "http://localhost:8000",
      "configurations": [
        {
          "project": "my-project",
          "accessibleBy": ["production"]
        },
        {
          "project": "my-other-project",
          "accessibleBy": ["production"]
        }
      ]
    },
    {
      "name": "my-awesome-service-staging",
      "endpoint": "http://localhost:9000",
      "configurations": [
        {
          "project": "my-project",
          "accessibleBy": ["preview", "working-copy"]
        },
        {
          "project": "my-other-project",
          "accessibleBy": ["preview", "working-copy"]
        }
      ]
    }
  ]
}
```

```bash
zup tunnel services update \
--configuration-file <path-to-your-configuration-file> \
--tunnel-id <your-tunnel-id>
```
