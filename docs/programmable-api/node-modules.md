---
title: Node Modules
sidebar_label: Node Modules
---

Zuplo provides certain node modules that you can use in your API Gateway. Zuplo
itself does NOT run Node.js, but instead runs a custom JavaScript engine that is
designed to be fast and secure. The Zuplo engine is compatible with certain node
modules that don't use native code or certain Node.js specific features.

:::caution{title="Advanced Usage"}

Using node modules is an advanced feature of Zuplo. In most cases, you should
use the built-in Zuplo features to build your API Gateway. Node modules are not
fully tested and may not work as you expect.

Instead of using node modules, we recommend calling APIs directly using fetch.
In most cases, it is easy to have ChatGPT or other AI tools write the code
required to call an API.

:::

If you require a module that is not in this list, you can also bundle custom
modules inside of your own project. This process does require some knowledge of
node and npm, but it allows you to use any module or version of the module. To
learn how to bundle your own modules, see the sample
<a href="https://github.com/zuplo/zuplo/tree/main/examples/custom-module">Custom
Modules on GitHub</a>.

## Zuplo Portal Types

When referencing a custom module in the Zuplo Portal, you might see that the
module has a red underline in your code editor. Some modules aren't typed or
their types can't be bundled to use with the Zuplo Portal.

You can ignore these errors as they won't affect the functionality of the
module. Alternatively, if you use
[local development](../articles/local-development.mdx) you can
[install the module locally](../articles/local-development-installing-packages.md)
to enable code completion and type checking.

## Node Modules

Below are the currently installed modules.

:::caution{title="Test Carefully"}

It is important to test your use of any node module carefully. Zuplo does not
run Node.js, it runs a custom JavaScript engine that is designed to be fast and
secure. This means that these modules may not work as you expect or certain
functionality in these modules may not work at all. Even when we say a module is
"Working", that doesn't guarantee it will work in your specific use case. Test
your code thoroughly before deploying it to production.

:::

<BundlesTable />
