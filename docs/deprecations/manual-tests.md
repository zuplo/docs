---
title: "Deprecation: Manual Test UI"
---

The manually test tab in the Zuplo portal will be removed in January 2024. This
feature allowed developers to create and save "manual" tests that could be run
against their Zuplo API.

This feature has been replaced instead by the inline test running in the
[Route Builder](/docs/articles/step-1-setup-basic-gateway#3-test-your-api).

The below screenshot shows the Manual Test Runner UI. This tab will be
completely removed in the Zuplo portal.

![Legacy Test Console](https://cdn.zuplo.com/assets/5d9e73e2-56d1-42c0-8097-738ff9e8d591.png)

## Migration Options

Instead of using Zuplo-specific test tools, we recommend utilizing purpose built
tooling such as [HTTPie](https://httpie.io/),
[Postman](https://www.postman.com/), or [Hopscotch](https://hoppscotch.io/).

## Zuplo Code Tests

Zuplo code tests written in typescript will move to the main code editor tab
where you can continue to edit or view these files. Running tests with the Zuplo
CLI is still fully supported (and recommended!). For more information on testing
your Zuplo API see [the documentation](/docs/articles/testing).
