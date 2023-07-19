---
title: Test Command
---

```bash
zup test --help
zup test

Runs the tests under /tests against an endpoint

Options:
  --version   Show version number                                      [boolean]
  --help      Show help                                                [boolean]
  --endpoint  The URL of the zup to test against                        [string]
  --filter    A filter to run a subset of tests (e.g., --filter 'test name' or
              --filter '/test-name-regex/')                             [string]
```

Use the test command to help you test your zup by running integration tests
against it.

## Writing Tests

:::tip

Your test files need to be under the `tests` folder and end with `.test.ts` to
be picked up by the Zuplo CLI.

:::

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

## Running your tests

Once you have written your tests, you can run them using the `test` command.

```bash
zup test --endpoint https:/your-zup.example.com
```

## Tips for writing tests

Look for more testing tips
[here](../articles/testing.md#tips-for-writing-tests).
