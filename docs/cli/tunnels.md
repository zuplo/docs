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
# export ZUPLO_API_KEY=zpka_79192455000204849918945812060565_517xxxx

zup tunnel create --tunnel-name my-tunnel
zup tunnel list
```

### Running the tunnel

Refer to the [tunnel documentation](../articles/tunnel-setup.md) for more
information.

### Specifying services

Once you have created a tunnel, you can specify which services it should expose
using a configuration file. Here's a sample configuration file:

```json
{
  "version": 1,
  "services": [
    {
      // This is the name of the service that you will use from your zup
      "name": "my-service",
      // This is the local endpoint of your service that you tunnel can connect to
      "endpoint": "http://localhost:8000",
      "configurations": [
        // You can specify which projects and which environments can access this service
        {
          "project": "my-project",
          "accessibleBy": ["preview", "production"]
        },
        {
          "project": "my-other-project",
          "accessibleBy": ["working-copy"]
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
