---
title: Internal Route Handlers
sidebar_label: Internal Route Handlers
---

The Zuplo Runtime automatically registers certain routes on your gateway to
provide enhanced functionality. You may see requests to these routes displayed
within your Analytics page. Below is a list of routes we've reserved:

| Name                    | Method  | Path                              | Description                                                 |
| ----------------------- | ------- | --------------------------------- | ----------------------------------------------------------- |
| cors-preflight          | OPTIONS | `/(.*)`                           | Handles CORS preflight requests.                            |
| developer-portal        | GET     | User configured, default: `/docs` | Handles serving the legacy Developer Portal.                |
| developer-portal-legacy | GET     | `/__zuplo/dev-portal`             | Legacy path for the Developer Portal.                       |
| ping                    | GET     | `/__zuplo/ping`                   | Used to check liveness of deployments.                      |
| unmatched-path          | All     | `/(.*)`                           | Handles requests to endpoints that haven't been configured. |
