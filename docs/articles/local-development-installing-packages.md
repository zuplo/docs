---
title: "Installing Packages"
---

You can install packages from npm to use in your Zuplo Gateway. This can help
with code completion and hover tips.

However, bear in mind, these might not work out-of-the-box in the cloud (i.e.,
working-copy and edge environments), as Zuplo for security reasons does not
allow all packages to be installed. Consult
[Node Modules](https://zuplo.com/docs/articles/node-modules) for the official
list of supported modules.

There are workarounds though. If you need a package to be available, you can try
to _bundle_ it. This will bypass the `npm install` step since the module is
already bundled and available. We have an example at
[Custom Modules](https://github.com/zuplo/zuplo/tree/main/examples/custom-module)
that you can follow.

We are looking into ways to simplify bringing in your own modules. We are
proceeding carefully as we want to ensure that we can provide a secure and
reliable experience for our users. Please contact
[Zuplo support](mailto:support@zuplo.com) if you need more assistance.
