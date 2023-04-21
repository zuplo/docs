---
title: Zuplo API Key Information
sidebar_label: API Key Info
---

## API Key Format

Zuplo uses the prefix `zpk*_` for all API key values, where the `*` is a letter indicating the type of API key.

Current formats:

- `zpka_` - Zuplo customer API keys
- `zpkd_` - Zuplo deployment secrets (internal use)

## API Key Leak Prevention

API keys should never be stored in source control. Accidentally committing API keys to source control is a common attack vector that leads to compromises of organizations both large and small.

Zuplo participates in [GitHub's Secret Scanning](https://docs.github.com/en/code-security/secret-scanning/about-secret-scanning) program to detect if your or your customer's API Keys are accidentally checked into source control on GitHub.

If an API Key for your Zuplo API Gateway is compromised by checking it into a public or private GitHub repository, Zuplo will be notified and take action almost immediately. Depending on your API's configuration Zuplo will either alert you of the potential compromise or immediately revoke the API Key and alert you and/or your customer.
