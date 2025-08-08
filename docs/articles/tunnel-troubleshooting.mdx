---
title: Tunnel Troubleshooting
---

Setting up a secure tunnel involves configuring several different networks to
work together. When setting up your tunnel it's common for traffic to initially
not reach your destination initially. This is almost always caused by
configurations (firewalls, VPCs, IAM rules, etc.) in your internal network.

## Tunnel status

As a first step, check if the tunnel is up and running. You can use the
following CLI command to check the status of the tunnel:

```bash
# For brevity, the commands assume that you have exported your API key as an environment variable,
# export ZUPLO_API_KEY=zpka_d67b7e241bb948758f415b79aa8exxxx_2efbxxxx

zuplo tunnel list # Get the list of tunnels
zuplo tunnel describe --tunnel-id tnl_xxxxxxxxxxx # Narrow it down to the problematic tunnel
```

Check the `status` field from the output of `zuplo tunnel describe`. If it's
"down" that means that your tunnel isn't up. If you are using a Docker
container, check the container for errors. It takes a few seconds for new
tunnels to register with the Cloudflare network for the first time.

## Tunnel Logging

If the tunnel is up (as verified in the previous step) but you aren't seeing any
traffic, you can inspect the logs to see if there are any network or IAM issues
that might be blocking a connection.

The tunnel by default logs only errors. For the purposes of debugging, it's
useful to set a more verbose log level. To set logging to a different level,
simply set the environment variable `TUNNEL_LOGLEVEL` on your Zuplo tunnel
instance to `debug`. Other log levels available are `info`, `warn`, `error`, and
`fatal`, but `debug` is recommended for troubleshooting.

The way you set an environment variable will vary depending on where you
deployed the tunnel. If you are using a Docker container, you can set it as the
environment variables for the container. See your cloud provider's documentation
for more details.

```txt
TUNNEL_LOGLEVEL=debug
```

Once you are done debugging, we recommend resetting the log level to something
less verbose since the `debug` level can generate a lot of logs.
