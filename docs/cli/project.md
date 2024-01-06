---
title: Project Commands
---

```bash
zup project --help
zup project

Project commands

Commands:
  zup project update          Updates your project structure to the latest
                              conventions
  zup project import-openapi  Imports an OpenAPI file into your Zuplo Project

```

## Common Use Cases

### Importing an existing OpenAPI file

We support importing both JSON and YAML. We will infer the format from the file
extension.

```
zup project import-openapi --source /path/to/openapi.json
zup project import-openapi --source /path/to/openapi.yaml
```

If you have a remote file that you wish to import, you can also use the
`--source` option. This downloads the file to a temporary directory and imports
it. The `--source` option infers if this is a remote file by checking the URL.

```
zup project import-openapi --source https://example.com/path/to/openapi.json
```

Lastly, if you wish to rename the destination file, you can use the
`--destination` option.

```
zup project import-openapi --source https://example.com/path/to/openapi.json --destination new-name
```
