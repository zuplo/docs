# Zuplo Docs

### Installation

```
npm install
```

### Local Development

```
npm run dev
```

This command starts a local development server and opens up a browser window.
Most changes are reflected live without having to restart the server.

### Local Development (Zuplo Employees Only)

If you are a Zuplo employee, you can run the local development server to live
reload changes to zuplo policies. You must have the `core` repository cloned in
the same paraent directory as this repository.

```
npm run dev:policies
```

### Build

```
npm run build
```

This command generates static content into the `build` directory and can be
served using any static contents hosting service.
