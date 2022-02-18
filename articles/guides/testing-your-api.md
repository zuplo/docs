# Testing Your API

Zuplo supports integration tests for your API for production customers. The test
format is [Mocha](https://mochajs.org/) with [chai](https://www.chaijs.com/) for
assertions.

To add an integration test for your project create a test file in the `tests`
folder that looks like the following. Write tests using `fetch` and then reading
the response results.

```ts
import { assert } from "chai";
import { TestHelper } from "@zuplo/core";

describe("My test suite", function () {
  it("Get hello world", async function () {
    const result = await fetch(`${TestHelper.TEST_URL}/v1/hello-world`);
    assert.equal(result.ok, true);
  });
});
```

Instead of hard-coding the url to your api, use `TestHelper.TEST_URL` so that
the url is set dynamically depending on where you are running your test.

Each time you push code to your repository Zuplo's build servers will run these
tests. Additionally, the tests are also run against your staging environment
when it is deployed.
