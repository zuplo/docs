---
title: Test Command
---

```bash
zuplo test --help
zuplo test

Runs the tests under /tests against an endpoint

Options:
  --version   Show version number                                      [boolean]
  --help      Show help                                                [boolean]
  --endpoint  The URL of the environment to test against                        [string]
  --filter    A filter to run a subset of tests (e.g., --filter 'test name' or
              --filter '/test-name-regex/')                             [string]
```

Use the test command to help you test your API by running integration tests
against it.

## Writing Tests

:::tip

Your test files need to be under the `tests` folder and end with `.test.ts` to
be picked up by the Zuplo CLI.

:::

Using Node.js 18 and the Zuplo CLI, it's very easy to write tests that make
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

Checkout our
[other sample tests](https://github.com/zuplo/zup-cli-example-project/tree/main/tests)
to find one that matches your use-case.

## Running your tests

Once you have written your tests, you can run them using the `test` command.

```bash
zuplo test --endpoint https://your-zup.example.com
```

## Environment Variables

Environment variables can be used in tests and referenced using the `TestHelper`
object.

Environment variables can be loaded from the shell or set in a `.env` file at
the root of your project.

For example, to set a value inline run the test command as shown.

```bash
MY_VAR=example zuplo test --endpoint https:/your-zup.example.com
```

Alternatively, create an `.env` file and set a value as shown.

```text
MY_VAR=example
```

Any global environment variables on the system will also be available inside
your tests.

Using environment variables in the test is done via the `TestHelper` as
demonstrated below.

```ts title="/tests/auth-test.test.ts"
import { describe, it, TestHelper } from "@zuplo/test";
import { expect } from "chai";

describe("API", () => {
  it("should make authorized request", async () => {
    const response = await fetch(TestHelper.TEST_URL, {
      headers: {
        Authorization: `Bearer ${TestHelper.environment.TEST_TOKEN}`,
      },
    });
    expect(response.status).to.equal(200);
  });
});
```

:::tip

When running tests in a CI environment, secrets such as API Keys or tokens can
be stored in the secret variable store of your test system and injected at the
time you run the tests.

:::

## Tips for writing tests

Take a look at our other
[testing tips](../articles/testing#tips-for-writing-tests).
