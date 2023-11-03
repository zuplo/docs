---
title: Testing
---

:::tip

These instructions assume that you are using custom GitHub Action workflow, in
conjunction with the Zuplo deployer. If you prefer setting up your own CI/CD for
more fine-grained control, please take a look at
[running your own CI/CD](../articles/custom-ci-cd.md).

:::

Using the Zuplo GitHub integration, tests can be run after a deployment with the
Zuplo deployer and used to block pull requests from being merged. This can help
ensure that changes to your Zuplo gateway won't break your production
environment.

The Zuplo deployer sets
[Deployments](https://docs.github.com/en/rest/deployments/deployments) and
[Deployment Statuses](https://docs.github.com/en/rest/deployments/statuses) for
any push to a GitHub branch.

Here is a simple GitHub Action that uses the Zuplo CLI to run the tests after
the deployment is successful. Notice how the property
`github.event.deployment_status.environment_url` is set to the `API_URL`
environment variable. This is one way you can pass the URL where the preview
environment is deployed into your tests.

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
        run:
          API_URL=${{ toJson(github.event.deployment_status.environment_url) }}
          npx @zuplo/cli test --endpoint $API_URL
```

[GitHub Branch protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches)
can be set in order to enforce policies on when a Pull Request can be merged.
The example below sets the "Zuplo Deployment" and "Test API Gateway" as required
status that must pass.

![](https://cdn.zuplo.com/assets/a1d7c322-125d-4d80-add0-fbfb65ccfea1.png)

When a developer tries to merge their pull request, they will see that the tests
haven't passed and the pull request cannot be merged.

![](https://cdn.zuplo.com/assets/3f3292a3-075c-4568-afb2-00c24e704f03.png)

## Writing Tests

Using Node.js 18 and the Zuplo CLI, it is very easy to write tests that make
requests to your API using `fetch` and then validate expectations with `expect`
from [chai](https://www.chaijs.com/api/bdd/).

```js title="/tests/my-test.test.ts"
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

You can find more sample tests
[here](https://github.com/zuplo/zup-cli-example-project/tree/main/tests).

:::tip

Your test files need to be under the `tests` folder and end with `.test.ts` to
be picked up by the Zuplo CLI.

:::

## Tips for writing tests

This section highlights some of the features of the Zuplo CLI that can help you
write and structure your tests. You can find more sample tests
[here](https://github.com/zuplo/zup-cli-example-project/tree/main/tests).

### Ignoring tests

You can use `.ignore` and `.only` to ignore or run only specific test. The full
example is at
[ignore-only.test.ts](https://github.com/zuplo/zup-cli-example-project/blob/main/tests/ignore-only.test.ts)

```js title="/tests/ignore-only.test.ts"
import { describe, it } from "@zuplo/test";
import { expect } from "chai";

/**
 * This example how to use ignore and only.
 */
describe("Ignore and only test example", () => {
  it.ignore("This is a failing test but it's been ignored", () => {
    expect(1 + 4).to.equals(6);
  });

  //   it.only("This is the only test that would run if it were not commented out", () => {
  //     expect(1 + 4).to.equals(5);
  //   });
});
```

### Filtering tests

You can use the CLI to filter tests by name or regex. The full example is at
[filter.test.ts](https://github.com/zuplo/zup-cli-example-project/blob/main/tests/filter.test.ts)

```js title="/tests/filter.test.ts"
import { describe, it } from "@zuplo/test";
import { expect } from "chai";

/**
 * This example shows how to filter the test by the name in the describe() function.
 * You can run `zup test --filter '#labelA'`
 * If you want to use regex, you can do `zup test --filter '/#label[Aa]/'`
 */
describe("[#labelA #labelB] Addition", () => {
  it("should add positive numbers", () => {
    expect(1 + 4).to.equals(5);
  });
});
```

## Unit Tests & Mocking

:::caution Advanced

Custom testing can be complicated and is best used only to test your own logic
rather than trying to mock large portions of your API Gateway.

:::

It is usually possible to use test frameworks like
[Mocha](https://github.com/zuplo-samples/test-mocks) and mocking tools like
[Sinon](https://sinonjs.org/) to unit tests handlers, policies, or other
modules. To see an example of how that works see this sample on Github:
https://github.com/zuplo-samples/test-mocks
