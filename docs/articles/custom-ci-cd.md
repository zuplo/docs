---
title: Setting up a Custom CI/CD Pipeline
sidebar_label: Custom CI/CD
---

Zuplo provides the Zuplo deployer, a GitHub app that can be used to
automatically deploy your APIs from your GitHub repository to the Zuplo
platform. However, sometimes you might not be using GitHub as your version
control provider. Or, that you might want to exercise more control over your
CI/CD pipeline. For these cases, we provide a CLI that can be used to deploy
your APIs to the Zuplo platform.

## Getting Started

:::tip

The API key is scoped to your account. So you can use the same one for all
projects under the same account. If you are a member of multiple accounts, be
sure to select the right one.

:::

The Zuplo CLI(../cli/installation.md), which you be using in you custom CI/CD
script, uses API Keys to authenticate. You can find your API Key by following
these steps:

1. Navigate to [portal.zuplo.com](https://portal.zuplo.com) and log in.
2. Select the account that you want to work on.
3. Click the **Settings** tab and navigate to the **API Keys** section.
4. Write some tests for your API. We provide a rich set of test helpers and
   utils based on BDD. You can see examples of tests at
   [samples](https://github.com/zuplo/zup-cli-example-project/tree/main/tests).

:::tip

Your test files need to be under the `tests` folder and end with `.test.ts` to
be picked up by the Zuplo CLI.

:::

## Provider Instructions

Below you will find examples of how to set up a custom CI/CD pipeline with
various providers.

### GitHub Actions

The full example is available at
https://github.com/zuplo/zup-cli-example-project/blob/main/.github/workflows/ci.yml

1. Create a workflow file. You can use the following to help you get started:

```yaml title=".github/workflows/ci.yaml"
name: Zuplo CI

on:
  push:
    branches:
      - main
  pull_request:

jobs:
  run-zup-test:
    runs-on: ubuntu-latest
    env:
      ZUPLO_API_KEY: ${{ secrets.ZUPLO_API_KEY }}

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - run: npm install

      # shell: bash is required so that pipefail is set.
      # See https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#exit-codes-and-error-action-preference
      # This way if the deploy fails, we fail before piping to tee.
      # Note that you are not required to use tee. We are using it in this example
      # so that the output is available to the terminal and written to the file.
      - name: Zuplo Deploy
        shell: bash
        run: |
          npx zuplo deploy --apiKey "$ZUPLO_API_KEY" | tee ./DEPLOYMENT_STDOUT

      - name: Zuplo Test
        shell: bash
        run: |
          npx zuplo test --endpoint $(cat ./DEPLOYMENT_STDOUT |  sed -E 's/Deployed to (.*)/\1/')

      - name: Zuplo Delete
        if: ${{ github.event_name == 'pull_request' }}
        shell: bash
        run: |
          npx zuplo delete --url $(cat ./DEPLOYMENT_STDOUT |  sed -E 's/Deployed to (.*)/\1/') --apiKey "$ZUPLO_API_KEY" --wait

      # This is not necessary but it showcases how you can list your zups
      - name: Zuplo List
        shell: bash
        run: |
          npx zuplo list --apiKey "$ZUPLO_API_KEY"
```

2. Create a secret for your GitHub Action and be sure to set `ZUPLO_API_KEY` to
   the API key you generated in the previous step.

### Bitbucket Pipelines

The full example is available at
https://github.com/zuplo/zup-cli-example-project/blob/main/bitbucket-pipelines.yml

1. Create a pipelines file. You can use the following to help you get started:

```yaml title="bitbucket-pipelines.yml"
image: node:18

pipelines:
  branches:
    # If your default branch is not main, change this to match
    main:
      - step:
          name: NPM Install
          script:
            - npm install
      - step:
          name: Zuplo Deploy
          # set -o pipefail
          # This way if the deploy fails, we fail before piping to tee.
          # Note that you are not required to use tee. We are using it in this example so that the output is available to the terminal and written to the file.
          script:
            - set -o pipefail
            - npx zuplo deploy --apiKey "$ZUPLO_API_KEY" | tee
              ./DEPLOYMENT_STDOUT
          artifacts:
            - DEPLOYMENT_STDOUT
      - step:
          name: Zuplo Test
          script:
            - npx zuplo test --endpoint $(cat ./DEPLOYMENT_STDOUT |  sed -E
              's/Deployed to (.*)/\1/')
  pull-requests:
    "**":
      - step:
          name: NPM Install
          script:
            - npm install
      - step:
          name: Zuplo Deploy
          # set -o pipefail
          # This way if the deploy fails, we fail before piping to tee.
          # Note that you are not required to use tee. We are using it in this example so that the output is available to the terminal and written to the file.
          script:
            - set -o pipefail
            - npx zuplo deploy --apiKey "$ZUPLO_API_KEY" | tee
              ./DEPLOYMENT_STDOUT
          artifacts:
            - DEPLOYMENT_STDOUT
      - step:
          name: Zuplo Test
          script:
            - npx zuplo test --endpoint $(cat ./DEPLOYMENT_STDOUT |  sed -E
              's/Deployed to (.*)/\1/')
      - step:
          name: Zuplo Delete (if necessary)
          script:
            - echo $BITBUCKET_PR_ID
            - if [[ -n "$BITBUCKET_PR_ID" ]]; then npx zuplo delete --url $(cat
              ./DEPLOYMENT_STDOUT |  sed -E 's/Deployed to (.*)/\1/') --apiKey
              "$ZUPLO_API_KEY" --wait; exit; fi
      # This is not necessary but it showcases how you can list your zups
      - step:
          name: Zuplo List
          script:
            - npx zuplo list --apiKey "$ZUPLO_API_KEY"
```

2. Create a secret repository variable for your BitBucket Pipelines and be sure
   to set `ZUPLO_API_KEY` to the API key you generated in the previous step.

### Azure Pipelines

The full example is available at
https://github.com/zuplo/zup-cli-example-project/blob/main/azure-pipelines.yml

1. Create a pipelines file. You can use the following to help you get started:

```yaml title="azure-pipelines.yml"
trigger:
  - main

pool:
  vmImage: ubuntu-latest

steps:
  - task: NodeTool@0
    inputs:
      versionSpec: "20.x"
    displayName: "Install Node.js"

  - script: |
      npm install
    displayName: "npm install"

  # set -o pipefail
  # This way if the deploy fails, we fail before piping to tee.
  # Note that you are not required to use tee. We are using it in this example so that the output is available to the terminal and written to the file.
  - script: |
      set -o pipefail 
      npx zuplo deploy --api-key $(ZUPLO_API_KEY) | tee ./DEPLOYMENT_STDOUT
    displayName: "Zuplo Deploy"

  - script: |
      npx zuplo test --endpoint $(cat ./DEPLOYMENT_STDOUT |  sed -E 's/Deployed to (.*)/\1/')
    displayName: "Zuplo Test"

  - script: |
      npx zuplo delete --url $(cat ./DEPLOYMENT_STDOUT |  sed -E 's/Deployed to (.*)/\1/') --api-key $(ZUPLO_API_KEY) --wait
    displayName: "Zuplo Delete"
    # Only run this step if the build is a pull request
    condition: eq(variables['Build.Reason'], 'PullRequest')

  # This is not necessary but it showcases how you can list your zups
  - script: |
      npx zuplo list --api-key $(ZUPLO_API_KEY)
    displayName: "Zuplo List"
```

2. Create a secret for your Azure Pipelines and be sure to set `ZUPLO_API_KEY`
   to the API key you generated in the previous step.

### Gitlab Pipelines

The full example is available at
https://github.com/zuplo/zup-cli-example-project/blob/main/.gitlab-ci.yml

1. Create a pipelines file. You can use the following to help you get started:

```yaml title=".gitlab-ci.yml"
image: node:latest
workflow:
  rules:
    - if: $CI_PIPELINE_SOURCE == "push"
      when: always

npm_install:
  stage: build
  script:
    - npm install

zup_deploy:
  stage: deploy
  script:
    - npx zuplo deploy --apiKey "$ZUPLO_API_KEY" | tee ./DEPLOYMENT_STDOUT
  artifacts:
    expire_in: 30 minutes
    paths:
      - "./DEPLOYMENT_STDOUT"

zup_test:
  stage: deploy
  needs: [zup_deploy]
  script:
    - npx zuplo test --endpoint $(cat ./DEPLOYMENT_STDOUT |  sed -E 's/Deployed
      to (.*)/\1/')
```

:::note

GitLab CI/CD does not have a built-in way to delete deployments. You can use the
Zuplo UI to delete old environments.

:::

2. [Create a variable](https://docs.gitlab.com/ee/ci/variables/#for-a-project)
   for `ZUPLO_API_KEY` on your GitLab project. Set it to the API key you
   generated in the previous step. You can choose to
   [mask](https://docs.gitlab.com/ee/ci/variables/#mask-a-cicd-variable) the
   variable so it does not display in job logs.

## Advanced Use Cases

The above samples showcase the most common use case for our customers. However,
you might have more advanced use cases that require more control. The following
sections describe some other parameters that you can control.

### Multiple Projects

You might end up with this structure because you are using git submodules to
connect multiple repositories together. Or, you might have multiple projects in
the same repository because you are trying to migrate to a monorepo.

If you have multiple sub-folders in your repository, each representing a
different Zuplo project, you can deploy each one separately.

1. Ensure you use the right API key for each project. You can specify the API
   key by passing it with the `--apiKey` flag.
2. Ensure that you have the project name configured in the zuplo.jsonc file in
   the subfolder. This tells the Zuplo CLI which project to deploy to.
3. You might need to use the --no-verify-remote flag to bypass verification. By
   default, the CLI checks that the repository matches what is configured on the
   server. If you have moved or renamed your repository, you must bypass the
   verification.

Here's a complete example.

Assuming you have the following structure and the appropriate zuplo.jsonc
configured for each project. Take a look at
[https://github.com/zuplo/zup-cli-example-project/tree/main/nested-projects](https://github.com/zuplo/zup-cli-example-project/tree/main/nested-projects)

```bash
nested-projects
├── zup-cli-nested-project1
│   ├── README.md
│   ├── config
│   ├── docs
│   ├── local-config
│   ├── modules
│   ├── package.json
│   ├── schemas
│   ├── tests
│   ├── tsconfig.json
│   └── zuplo.jsonc
└── zup-cli-nested-project2
    ├── README.md
    ├── config
    ├── docs
    ├── local-config
    ├── modules
    ├── package.json
    ├── schemas
    ├── tests
    ├── tsconfig.json
    └── zuplo.jsonc
```

And here's how you would deploy it using the CLI

```bash
# Let's deploy the first project
cd zup-cli-nested-project1
npx zuplo deploy --api-key $YOUR_API_KEY_FOR_THE_ACCOUNT_THAT_CONTAINS_PROJECT1 --no-verify-remote


# Let's deploy the second project
cd ..
cd zup-cli-nested-project2
npx zuplo deploy --api-key $YOUR_API_KEY_FOR_THE_ACCOUNT_THAT_CONTAINS_PROJECT2 --no-verify-remote
```

The `npx zuplo deploy` command takes the current Git branch that you are on into
consideration when deploying. If you are on your `main` branch, it will deploy
to your production. If you are on any other branch, it will deploy to a staging
environment with the name of your branch.
