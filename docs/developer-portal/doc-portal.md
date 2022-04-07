---
title: Documentation Portal
---

## Overview

We will automatically generate and host documentation for your Zup using the
data in your [Open API file](/docs/developer-portal/open-api). You can view your
documentation portal at `<your project url>/__zuplo/docs`. The portal supports
sending API requests to your api, allowing developers to easily interact with
it. Here's a demo in the gif below:

![doc-portal.gif](/media/developer-portal/doc-portal/doc-portal.gif)

## Configuration

We use [Rapidoc](https://mrin9.github.io/RapiDoc/) to generate the documentation
page. This page will update automatically when you update your Open API file. We
currently do not support configuring/styling the portal beyond what you can do
through the Open API Spec. You can find the list of supported vendor extensions
[here](https://mrin9.github.io/RapiDoc/api.html#:~:text=Supported%20vendor%20extensions).
