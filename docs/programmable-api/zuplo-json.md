---
title: Zuplo Project Config (zuplo.jsonc)
sidebar_label: Project Config
---

Certain advanced project-level settings can be configured using the
`zuplo.jsonc` file at the root of a project. The `zuplo.jsonc` file is created
by default for new projects and contains the default configuration.

The default `zuplo.jsonc` file is shown below. The only current valid `version`
of the file is `1`.

```jsonc
{
  "version": 1,
  "compatibilityDate": "2025-02-06",
}
```

:::warning

The `zuplo.jsonc` file isn't currently shown or editable in the Zuplo portal.
Connect your project to source control and edit inside your source control
provider or by pushing a local change with git. If your project doesn't have a
`zuplo.jsonc` it can be added using source control

:::

## Compatibility Dates

The `compatibilityDate` field in the `zuplo.jsonc` file allows you to lock in
the bevaior of the runtime environment for your project. This is useful if you
want to ensure that your project continues to build, deploy and operate as you
expect it to.

Refer to the [documentation](./compatibility-dates.md) for compatibility dates
and their changes.
