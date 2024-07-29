---
title: Zuplo Platform Limits
sidebar_label: Platform Limits
---

This document describes the limits that apply to your Zuplo account. Some limits
are fixed while others are specific to your plan. Typically, enterprise plans
have the ability to customize limits to meet their needs.

## General

| Feature                   | Description                                        | Limit                                                                                                                                                                |
| ------------------------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Environment Variables     | The number of environment variables you can create | Free/Builder Plans: 50 variables, Other Plans: 100                                                                                                                   |
| Environment Variable size | The size of an environment variable                | ~5kb                                                                                                                                                                 |
| Request Duration          | The maximum time a request can take to complete    | Free/Builder Plans: 30 seconds, Other Plans: No Limit                                                                                                                |
| Requests per second       | The maximum number of requests per second          | No Limit outside of plan monthly limit                                                                                                                               |
| Log Size                  | The size of a log entry                            | Zuplo Portal live logs are limited to ~10kB. Excess will be truncated. For third-party logging providers, the value depends on the provider. Zuplo imposes no limit. |

## API Keys

### Consumers

The numbers of consumers you can create are limited by your plan. Zuplo does not
impose a hard cap on the number of consumers you can create. However, usage of
the service is subject to "fair use" policies meaning if your usage is deemed
excessive we may limit usage. If you require specific limits please contact
sales to discuss pricing plans.

Our general guidelines for what constitutes fair use are as follows:

- Free Plan: 500 consumers
- Builder Plan: 10,000 consumers
- Business Plan: 100,000 consumers
- Enterprise Plan: Custom

### Consumer Metadata and Tags

- Consumer `metadata` - The JSON encoded object cannot be larger than 1kb.
- Consumer `tags` - Each consumer is limited to 5 key value pair tags.

### API Key Management Operations

Requests to API Key Management operations on the Zuplo Developer API
(dev.zuplo.com) are limited to 100 requests per second.

### API Key Authorizations

API Key authorizations are not limited directly. The limit is equal to one
authorization per request allowed in your plan.
