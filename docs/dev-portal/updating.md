---
title: Updating Versions
---

:::warning

This documentation is for the preview version of the Dev Portal. If you are
using the legacy developer portal, please refer to the
[docs](/docs/legacy/dev-portal/overview).

:::

When developing your Dev Portal locally, you likely want to keep your version of
the Dev Portal up-to-date with the latest changes. This guide will walk you
through the process of installing the latest version of the Dev Portal.

Inside of your project's `/docs` directory, run the following command to update
the Dev Portal's dependencies:

```bash
npm install zudoku@latest
```

Occasionally, there may be peer dependencies such as `react` that need updated.
If you encounter any messages that indicate that peer dependencies need updated,
run the following command:

```bash
npm install react@latest react-dom@latest
```

Updates that require more than just updating the dependencies will be noted in
the changelog.
