---
title: API Key Leak Prevention
sidebar_label: API Key Leak Prevention
---

## API Key Format

Zuplo uses a specially formatted API Key structure that allows us to partner
with GitHub's secret scanning to protect your users from accidentally leaked
keys.

We think the safety of your API key consumers is paramount, so this feature is
available to all Zuplo customers, including free.

## API Key Leak Prevention

API keys should never be stored in source control. Accidentally committing API
keys to source control is a common attack vector that leads to compromises of
organizations both large and small.

Zuplo participates in
[GitHub's Secret Scanning](https://docs.github.com/en/code-security/secret-scanning/about-secret-scanning)
program to detect if your or your customer's API Keys are accidentally checked
into source control on GitHub.

If an API Key for your Zuplo API Gateway is compromised by checking it into a
public or private GitHub repository, Zuplo will be notified and take action
almost immediately. Depending on your API's configuration Zuplo will either
alert you of the potential compromise or immediately revoke the API Key and
alert you and/or your customer.
