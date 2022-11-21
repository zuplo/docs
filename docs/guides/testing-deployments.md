---
title: Testing Deployments
---

:::tip

These instructions assume that you are using custom GitHub Action workflow, in conjunction with the Zuplo deployer. If you prefer setting up your own CI/CD for more fine-grained control, please take a look at [running your own CI/CD](../guides/custom-ci-cd.md).
:::

Using the Zuplo GitHub integration, tests can be run after a deployment with the Zuplo deployer and used to block pull requests from being merged. This can help ensure that changes to your Zuplo gateway won't break your production environment.

The Zuplo deployer sets [Deployments](https://docs.github.com/en/rest/deployments/deployments) and [Deployment Statuses](https://docs.github.com/en/rest/deployments/statuses) for any push to a GitHub branch.

Here is a simple GitHub Action that uses the Zuplo CLI to run the tests after the deployment is successful. Notice how the property `github.event.deployment_status.environment_url` is set to the `API_URL` environment variable. This is one way you can pass the URL where the preview environment is deployed into your tests.

```yaml title="/.github/workflows/main.yaml"
name: Main
on: [deployment_status]

jobs:
  test:
    name: Test API Gateway
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18.x

      - name: Run Tests
        # Useful properties 'environment', 'state', and 'environment_url'
        run: API_URL=${{ toJson(github.event.deployment_status.environment_url) }} npx @zuplo/cli test --endpoint $API_URL
```

Using Node.js 18 and the Zuplo CLI, it is very easy to write tests that make requests to your API using `fetch` and then validate expectations with `expect` from [chai](https://www.chaijs.com/api/bdd/).

```js title="/tests/my-test.spec.mjs"
import { describe, it, TestHelper } from "@zuplo/test";
import { expect } from "chai";

describe("API", () => {
  it("should have a body", async () => {
    const response = await fetch(TestHelper.TEST_URL);
    const result = await response.text();
    expect(result).to.equal(JSON.stringify("What zup?"));
  });
});
```

You can find more sample tests [here](https://github.com/zuplo/zup-cli-example-project/tree/main/tests).

::: tip

Your test files need to be under the `tests` folder and end with `.test.ts` to be picked up by the Zuplo CLI.

:::

[GitHub Branch protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches) can be set in order to enforce policies on when a Pull Request can be merged. The example below sets the "Zuplo Deployment" and "Test API Gateway" as required status that must pass.

![](https://cdn.zuplo.com/assets/a1d7c322-125d-4d80-add0-fbfb65ccfea1.png)

When a developer tries to merge their pull request, they will see that the tests haven't passed and the pull request cannot be merged.

![](https://cdn.zuplo.com/assets/3f3292a3-075c-4568-afb2-00c24e704f03.png)
