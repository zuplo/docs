---
title: Setting up a Custom CI/CD Pipeline
sidebar_label: Custom CI/CD
---

Zuplo provides the Zuplo deployer, a GitHub app that can be used to automatically deploy your APIs from your GitHub repository to the Zuplo platform. However, we realized that sometimes you might not be using GitHub as your version control system. Or, that you might want to exercise more control over your CI/CD pipeline. For these cases, we provide a CLI that can be used to deploy your APIs to the Zuplo platform.

## Getting Started

1. Contact [support](mailto:support@zuplo.com) to enable API keys for your Zuplo project.
2. Navigate to [dev.zuplo.com/docs](https://dev.zuplo.com/docs) and click on "Sign in" on the top right corner.
3. Navigate to [authentication](https://dev.zuplo.com/docs/v1/#authentication) and generate some API keys. You will use these keys to authenticate with the Zuplo CLI.

:::tip

The API Key generated is specific for each project. If you have multiple projects, you will need to generate a new API key for each project. Contact [support](mailto:support@zuplo.com) to enable API keys for every Zuplo project that you want to use the CLI with.

:::

4. Write some tests for your API. We provide a rich set of test helpers and utils based on BDD. You can see examples of tests at [samples](https://github.com/zuplo/zup-cli-example-project/tree/main/tests).

:::tip

Your test files need to be under the `tests` folder and end with `.test.ts` to be picked up by the Zuplo CLI.

:::

## Setting up a custom workflow with GitHub Actions

The full example is available at https://github.com/zuplo/zup-cli-example-project

1. Create a workflow file. You can use the following to help you get started:

```yaml title="/.github/workflows/main.yaml"
name: Zuplo CI on Pull Request

on:
  pull_request:

jobs:
  run-zup-test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      # This explicitly tells action to use the latest version of Zuplo from the public NPM registry
      - uses: actions/setup-node@v3
        with:
          node-version: "18.x"
          registry-url: "https://registry.npmjs.com"
          scope: "@zuplo"

      - name: NPM Install
        run: npm install

      # shell: bash is required so that pipefail is set.
      # See https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#exit-codes-and-error-action-preference
      # This way if the deploy fails, we fail before piping to tee.
      - name: Zup Deploy
        shell: bash
        env:
          ZUPLO_API_KEY: ${{ secrets.ZUPLO_API_KEY }}
        run: |
          npx @zuplo/cli deploy --apiKey "$ZUPLO_API_KEY" | tee ./DEPLOYMENT_STDOUT

      - name: Zup Test
        shell: bash
        run: |
          npx @zuplo/cli test --endpoint $(cat ./DEPLOYMENT_STDOUT |  sed -E 's/Deployed to (.*)/\1/')
```

2. Create a secret for your GitHub Action and be sure to set `ZUPLO_API_KEY` to the API key you generated in the previous step.

## Setting up a custom workflow with Bitbucket Pipelines

The full example is available at https://bitbucket.org/zuplocom/zup-cli-example-project/

```yaml title="/bitbucket-pipelines.yml"
image: node:18

pipelines:
  pull-requests:
    "**": #this runs as default for any branch not elsewhere defined
      - step:
          name: NPM Install
          script:
            - npm install
      - step:
          name: Zup Deploy
          # set -o pipefail
          # This way if the deploy fails, we fail before piping to tee.
          script:
            - set -o pipefail
            - npx @zuplo/cli deploy --apiKey "$ZUPLO_API_KEY" | tee
              ./DEPLOYMENT_STDOUT
          artifacts:
            - DEPLOYMENT_STDOUT
      - step:
          name: Zup Test
          script:
            - npx @zuplo/cli test --endpoint $(cat ./DEPLOYMENT_STDOUT |  sed -E
              's/Deployed to (.*)/\1/')
```

2. Create a secret repository variable for your BitBucket Pipelines and be sure to set `ZUPLO_API_KEY` to the API key you generated in the previous step.
