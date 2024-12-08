---
title: Node Modules
sidebar_label: Node Modules
---

Zuplo supports certain node modules, but to ensure the security and
performance of each API Gateway we must approve each module. This
process only takes a few hours so if you need something new please reach
out support by emailing{" "}
<a href="mailto:support@zuplo.com">support@zuplo.com</a>.

Additionally, you can also bundle custom modules inside of your own
project. This process does require some knowledge of node and npm, but
it allows you to use any module or version of the module. To learn how
to bundle your own modules, see the sample <a href="https://github.com/zuplo/zuplo/tree/main/examples/custom-module">Custom Modules on Github</a>.

When referencing a custom module in the Zuplo Portal, you might see
that the module has a red underline in your code editor. Some modules
are not typed or their types cannot be bundled to use with the Zuplo
Portal.

You can ignore these errors as they will not affect the functionality
of the module. Alternatively, if you use{" "}
<a href="/docs/articles/local-development">local development</a> you
can install the module locally to enable code completion and type
checking.

Below are the currently installed modules.

<BundlesTable />