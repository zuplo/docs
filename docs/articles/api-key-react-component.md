---
title: API Key Manager React Component
sidebar_label: React Component
---

Zuplo provides an open source react component that can be used on your own UI to
provider users with self-serve access to API Keys for your Zuplo powered API.

![Component Screenshot](https://cdn.zuplo.com/assets/cedd8ad0-9433-4433-80f6-86545ba0d41a.png)

To see a demo of the component visit https://api-key-manager.com.

## Getting Started

This component can be used with any React framework. It's compatible with
Tailwind CSS, but Tailwind isn't required.

:::tip

See our blog for an
[end to end tutorial](https://zuplo.com/blog#tutorial-setup-a-web-app-with-the-newly-release-component)
on using this React component and the translation API.

:::

### Install

Install the component in your React project

```bash
npm install @zuplo/react-api-key-manager
```

### With Tailwind

Import the component's stylesheet into your `global.css` or equivalent file. The
styles will use your project's tailwind configuration to provide a consistent
theme.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
@import "@zuplo/react-api-key-manager/tailwind.css";
```

### Without Tailwind

Import the component's stylesheet into your root component (for example,
`App.jsx`), typically below your other stylesheets.

```jsx
import "./styles/globals.css";
import "@zuplo/react-api-key-manager/index.css";
```

### Custom Styles

The component's CSS can be completely customized by copying either the
`tailwind.css` or `index.css` files from
`node_modules/@zuplo/react-api-key-manager/dist/` and modifying the styles to
suite your needs.

## Usage

You can import the `ReactAPIKeyManager` into your React project directly.

```ts
import {
  ApiKeyManager,
  DefaultApiKeyManagerProvider,
} from "@zuplo/react-api-key-manager";

const MyComponent = () => {
  const defaultProvider = new DefaultApiKeyManagerProvider(
    "<BASE_URL>",
    "<ACCESS_TOKEN>"
  );

  return <ApiKeyManager provider={provider} />;
};
```

## Backend API

The API Key Manager component interacts with an API that allows authorized users
to manage their own keys. The easiest way to get started is to use the
[Auth Translation API](https://github.com/zuplo/sample-auth-translation-api)
sample and deploy it to [Zuplo](https://zuplo.com). By default this sample
connects the
[Zuplo API Key Management Service](https://zuplo.com/docs/articles/api-key-management).
