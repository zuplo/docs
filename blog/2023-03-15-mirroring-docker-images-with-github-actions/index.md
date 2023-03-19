---
title: Mirroring Docker Images with Github Actions
authors: nate
tags: []
description: Mirroring Docker Images to external registries with Github Actions
image: https://og-image.zuplo.com/?text=Mirroring%20Docker%20Images%20with%20Github%20Actions
---

In light of some recent news about Docker deleting organizations and the containers that are registered with those organizations I figured I would share how we manage our Docker Containers. Zuplo uses a simple Github Action that runs on a cron schedule that mirrors containers we depend on. We initially built this because we experienced some downtime with Docker Hub that caused interruptions to our deployments. The other reason we mirror images is to keep them close to where we use them - in our case that means GCP Artifact Registry.

The Github Action is fairly simple (see below). This has worked well for us and has removed our dependency on Docker Hub for day to day deployments.

```yaml
name: Mirror Docker Images
on:
  workflow_dispatch:
  schedule:
    - cron: "0 1 * * *"

jobs:
  release:
    name: Mirror Images
    runs-on: ubuntu-latest

    permissions:
      contents: "read"
      id-token: "write"

    env:
      PROJECT_ID: my-project
      REPO_NAME: docker-registry

    strategy:
      fail-fast: false
      matrix:
        image:
          - "ubuntu:latest"
          - "node:18-alpine3.16"

    steps:
      - uses: actions/checkout@v3

      # Uses workload federation: https://github.com/google-github-actions/auth#setting-up-workload-identity-federation
      - id: "auth-gcp"
        name: "Authenticate to Google Cloud"
        uses: "google-github-actions/auth@v1"
        with:
          token_format: "access_token"
          workload_identity_provider: "your-provider"
          service_account: "your-service-account"
          access_token_lifetime: "300s"

      - name: Set up Cloud SDK
        uses: google-github-actions/setup-gcloud@v1.1.0
        with:
          project_id: ${{ env.PROJECT_ID }}

      - name: Authenticate Docker
        run: gcloud auth configure-docker us-docker.pkg.dev

      - name: Pull Image from Docker Hub
        run: docker pull ${{ matrix.image }}

      - name: Tag Image
        run: docker tag ${{ matrix.image }} us-docker.pkg.dev/${{ env.PROJECT_ID }}/${{ env.REPO_NAME }}/${{ matrix.image }}

      - name: Push Image
        run: docker push us-docker.pkg.dev/${{ env.PROJECT_ID }}/${{ env.REPO_NAME }}/${{ matrix.image }}
```
