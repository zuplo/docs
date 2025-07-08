---
title: Local Development
description:
  Learn how to work on the Dev Portal locally with live updates and hot
  reloading.
---

Developing the Dev Portal locally is straightforward and provides a great
developer experience with live updates and hot reloading. Follow these steps to
get started.

## Prerequisites

- [Node.js](https://nodejs.org) `>=v22.7.0` (or `>=20.19` will work as well)
- [Git](https://git-scm.com)

## Getting Started

<Stepper>

1. **Clone the Zuplo repository**

   ```bash
   git clone <repository-url>
   ```

1. **Install dependencies**

   ```bash
   npm install
   ```

1. **Navigate to the docs directory**

   ```bash
   cd docs
   ```

1. **Start the development server**

   ```bash
   npm run dev
   ```

1. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to see your Dev
   Portal.

</Stepper>

## Development Workflow

Once the development server is running, you can:

- **Edit content**: Make changes to any Markdown, MDX, or configuration files
- **Live updates**: Your browser will automatically refresh when you save
  changes
- **Hot reloading**: Most changes will be reflected instantly without a full
  page reload
- **Real-time feedback**: See your changes immediately as you develop

The development server watches for file changes and automatically rebuilds the
site, providing an excellent developer experience for creating and maintaining
your documentation.

## What's Next?

- Learn about [writing content](./zudoku/writing.mdx)
- Check out [the configuration file](./zudoku/configuration/overview)
- See how you can
  [customize the Dev Portal](./zudoku/customization/colors-theme)
