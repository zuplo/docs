---
title: Conversion Commands
---

```bash
zup convert --help
zup convert

Converts routes.json to routes.oas.json
```

Use this command to convert your old routes.json to the new routes.oas.json,
which is based on OpenAPI 3.x.x. Run this command from the root of your Zuplo
project. It will search for a config/routes.json and generate a
config/routes.oas.json from it.
