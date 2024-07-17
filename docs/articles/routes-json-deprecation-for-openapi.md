---
title: Deprecating routes.json, adding support for OpenAPI
sidebar_label: Moving to OpenAPI
---

Zuplo is going native in support for the
[OpenAPI standard](https://www.openapis.org/). This means we will be deprecating
support for our proprietary `routes.json` file format.

The old `routes.json` file contained both the route information and policies.
This will change in the new version with policies being defined in a separate
`policies.json` file and the routes defined in one or more `*.oas.json` files.
New projects will automatically get a `routes.oas.json` and `policies.json`
file.

You can still use the old `routes.json` format until it is formally deprecated.

We identify new project simply by the presence of `*.oas.json` files, so if your
project has both a `routes.json` file and OpenAPI files the `routes.json` will
be ignored.

You can delete the `routes.json` file by deleting this file in GitHub and doing
a **Pull Hard**.

If you need to create a new project with support for the old routing format,
please contact [support](mailto:support@zuplo.com) and we can share a template
with you and guidance to recreate an old-format project in GitHub. Note - we
will be removing support for `routes.json` in mid-2023 when most customers are
off-boarded.

We hope you're as excited about our support for open standards like Open API and
Problem Details for APIs. As always,
[join our Discord](https://discord.zuplo.com) to chat with the team about any
question or concerns you have.

## Migrating from `routes.json`

It's easy to convert your project from the old `routes.json` format to use our
new OpenAPI support. We have provided a CLI tool that can be invoked via
[`npx`](https://www.npmjs.com/package/npx).

Simply execute the following cmd in your root Zuplo folder (at the level of the
`/config` and `/module` folders):

```bash
npx @zuplo/cli@latest convert
```

This will generate a new `routes.oas.json` and `policies.json` file in your
`/config` folder based on your `routes.json` file. Use git to add these to your
repo and do a **Pull Hard** to sync these changes with your development (i.e.
working copy) environment (in [portal.zuplo.com](https://portal.zuplo.com)).
Once your ready and confident everything is working, you can delete the
`routes.json` file and sync via git/GitHub again.

You're now on the OpenAPI train 🚂 (choo choo).

For more on GitHub Source Control integration see
[GitHub integration](/docs/articles/source-control).
