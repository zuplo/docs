---
title: Tunnel Troubleshooting
---

Setting up a secure tunnel involves configuring several different networks to
work together. When setting up your tunnel it is common for traffic to initially
not reach your destination initially. This is almost always caused by
configurations (firewalls, VPCs, IAM rules, etc.) in your internal network.

## Tunnel Logging

The tunnel by default logs only errors. For the purposes of debugging, it is
useful to set a more verbose log level. To set logging to a different level,
simply set the environment variable `TUNNEL_LOGLEVEL` on your Zuplo tunnel
instance to `debug`. Other log levels available are `info`, `warn`, `error`, and
`fatal`, but `debug` is recommended for troubleshooting.

The way you set an environment variable will vary depending on where you
deployed the tunnel. See your cloud provider's documentation for more details.

```txt
TUNNEL_LOGLEVEL=debug
```
