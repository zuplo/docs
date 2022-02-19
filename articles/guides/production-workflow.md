---
title: Production Workflow
---

> For customers in production on Zuplo - this is the workflow for pushing
> changes to your live staging and production environments. For our other alpha
> customers, if you're interested in putting your workload in production on
> Zuplo, please contact us at `whatzup@zuplo.com`.

Production customers will have two environments

- `Staging` - where changes can be tested before they go live to your customers
- `Production` - your production gateway, used by your clients & customers

To push changes to your **Staging** environment, simply push those changes to
the `main` branch in your assigned Github repo. They will be automatically built
and deployed to your staging URL.

To push changes to your **Production** environment, simply tag a commit in your
`main` branch and push the tag, the tag will be deployed to production in a few
minutes. Production tags must start with `v` (i.e. v1.0.0).

For example:

```bash
git tag v1.4
git push origin v1.4
```

[Testing Your API](/guides/testing-your-api)
