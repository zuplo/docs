# Zuplo Docs Site

## Local Setup

In order to run this project locally, you need to have both this repo and `https://github.com/zuplo/docs` cloned. They should be in folders next to each other:

```
/dev
  /docs
  /zuplo-docs
```

With both repositories cloned, you can open the `zuplo-docs/docs.code-workspace` to open both projects in one VS Code window.

To setup the project for local dev, you must run `npm run local`. This creates a symbolic link at `zuplo-docs/public/media` pointing to `/docs/media` so that the local next server can serve the image content.
