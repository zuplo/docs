---
title: Running GitHub Actions After Cloudflare Pages Deploy
authors: nate
tags: [cloudflare, code]
date: 2022-04-28
---

Unfortunately, the Cloudflare Pages integration for GitHub doesn't support GitHub Deployment status, this means you can't trigger actions on `deployment_status`. `deployment_status` is the ideal event to use when running tests after a deployment as the event details include the URL. This is how we run tests on Vercel deployments after they are finished.

Fortunately, there is a pretty hacky way to do this with Cloudflare Pages. The `check_run` event is fired by the pages integration. The check run provides an `output` object in the event. Unfortunately, the contents is meant for human readable output. It looks like this:

```json
"output": {
  "annotations_count": 0,
  "annotations_url": "https://api.github.com/repos/org/repo/check-runs/12356/annotations",
  "summary": "<table><tr><td><strong>Latest commit:</strong> </td><td>\n<code>be76cc6</code>\n</td></tr>\n<tr><td><strong>Status:</strong></td><td>&nbsp;✅&nbsp; Deploy successful!</td></tr>\n<tr><td><strong>Preview URL:</strong></td><td>\n<a href='https://4fcdd3b4.site-name.pages.dev'>https://4fcdd3b4.site-name.pages.dev</a>\n</td></tr>\n</table>\n\n[View logs](https://dash.cloudflare.com/?to=/:account/pages/view/portal/4fcdd3b4-e0a7-42df-b2d9-4a89a1981d9d)\n",
  "text": null,
  "title": "Deployed successfully"
},
```

With a little bit of scripting though it is possible to extract the URL from that `summary` string. I used `grep` and `cut` to do that with the following:

```bash
echo "${{ github.event.check_run.output.summary }}" | grep -o "href\=.*>https" | cut -c 7-43
```

Note the `7-43` at the end is the start index and end index of the string to pull from the grep result. Those numbers need to be adjusted depending on the length of your deployment URL name.

To use the value, just extract it into an environment variable and you can use it later steps in your action.

```yaml
on:
  check_run:
    types: [completed]

jobs:
  build:
    name: Test
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - name: Get Deployment URL
        run: echo "DEPLOYMENT_URL=$(echo "${{ github.event.check_run.output.summary }}" | grep -o "href\=.*>https" | cut -c 7-43)" >> $GITHUB_ENV
      - run: echo $DEPLOYMENT_URL
```

Not a super elegant solution, but it works. At least until Cloudflare changes that status message.
