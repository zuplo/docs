---
title: Conversion Commands
---

```bash
zuplo convert --help
zuplo convert

Converts routes.json to routes.oas.json
```

If you have an older Zuplo project, use this command to convert your old
`routes.json` to the new routes.oas.json, which is based on OpenAPI 3.x. Run
this command from the root of your Zuplo project. It will search for a
`config/routes.json` and generate a `config/routes.oas.json` from it.
