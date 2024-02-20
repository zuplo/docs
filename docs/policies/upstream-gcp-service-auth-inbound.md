---
title: Upstream GCP Service Auth Policy
sidebar_label: Upstream GCP Service Auth
---

<!-- WARNING: This document is generated. DO NOT EDIT BY HAND -->

# Upstream GCP Service Auth






<!-- start: intro.md -->
This policy allows you to delegate authentication and authorization to your gateway without writing any code on your origin service by adding a GCP Issued ID Token to outgoing header allowing the service to be secured with GCP IAM. This is a useful means of securing your origin server so that only your Zuplo gateway can make requests against it.

This policy works with [GCP Identity Aware Proxy](https://zuplo.com/docs/articles/gke-with-upstream-auth-policy) or services like [Cloud Run](https://cloud.google.com/iap/docs/managing-access) that natively support IAM authorization.

We recommend reading the `serviceAccountJson` from environment variables (so it is not checked in to source control) using the `$env(ENV_VAR)` syntax.

For information on how Google's service based auth works see [Authenticating for invocation](https://cloud.google.com/functions/docs/securing/authenticating)

<!-- end: intro.md -->

<PolicyStatus isBeta={false} isPaidAddOn={false} />



## Configuration 

The configuration shows how to configure the policy in the 'policies.json' document.

```json title="config/policies.json"
{
  "name": "my-upstream-gcp-service-auth-inbound-policy",
  "policyType": "upstream-gcp-service-auth-inbound",
  "handler": {
    "export": "UpstreamGcpServiceAuthInboundPolicy",
    "module": "$import(@zuplo/runtime)",
    "options": {
      "audience": "https://my-service-a2ev-uc.a.run.app",
      "expirationOffsetSeconds": 300,
      "scopes": [
        "https://www.googleapis.com/auth/cloud-platform"
      ],
      "serviceAccountJson": "$env(SERVICE_ACCOUNT_JSON)",
      "tokenRetries": 3
    }
  }
}
```

<div className="policy-options">
<div><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-configuration">Policy Configuration<a href="#policy-configuration" class="hash-link" aria-label="Direct link to Policy Configuration" title="Direct link to Policy Configuration">​</a></h3><ul><li><code>name</code> <span class="type-option">&lt;string&gt;</span> - The name of your policy instance. This is used as a reference in your routes.</li><li><code>policyType</code> <span class="type-option">&lt;string&gt;</span> - The identifier of the policy. This is used by the Zuplo UI. Value should be <code>upstream-gcp-service-auth-inbound</code>.</li><li><code>handler.export</code> <span class="type-option">&lt;string&gt;</span> - The name of the exported type. Value should be <code>UpstreamGcpServiceAuthInboundPolicy</code>.</li><li><code>handler.module</code> <span class="type-option">&lt;string&gt;</span> - The module containing the policy. Value should be <code>$import(@zuplo/runtime)</code>.</li><li><code>handler.options</code> <span class="type-option">&lt;object&gt;</span> - The options for this policy. <a href="#policy-options">See Policy Options</a> below.</li></ul><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-options">Policy Options<a href="#policy-options" class="hash-link" aria-label="Direct link to Policy Options" title="Direct link to Policy Options">​</a></h3><p>The options for this policy are specified below. All properties are optional unless specifically marked as required.</p><ul><li><code>audience</code><span class="type-option"> &lt;string&gt;</span> - <div><p>The audience for the service to be called. This is typically the URL of your service endpoint like '<a href="https://my-service-a2ev-uc.a.run.app">https://my-service-a2ev-uc.a.run.app</a>'. If calling a Google API, leave this empty.</p></div></li><li><code>scopes</code><span class="type-option"> &lt;string[]&gt;</span> - <div><p>The scopes to grant the access token. See <a href="https://developers.google.com/identity/protocols/oauth2/scopes">documentation</a> for details. This is only set with calling a Google API. If calling a service like Cloud Run, etc. leave this empty.</p></div></li><li><code>serviceAccountJson</code><span class="type-option"> &lt;string&gt;</span><span class="required-option"> (Required)</span> - <div><p>The Google Service Account key in JSON format. Note you can load this from environment variables using the <code>$env(ENV_VAR)</code> syntax.</p></div></li><li><code>tokenRetries</code><span class="type-option"> &lt;number&gt;</span> - <div><p>The number of times to retry fetching the token in the event of a failure.</p></div><span class="default-value"> Defaults to <code>3</code>.</span></li><li><code>expirationOffsetSeconds</code><span class="type-option"> &lt;number&gt;</span> - <div><p>The number of seconds less than the token expiration to cache the token.</p></div><span class="default-value"> Defaults to <code>300</code>.</span></li><li><code>useMemoryCacheOnly</code><span class="type-option"> &lt;boolean&gt;</span> - <div><p>This is an advanced option that should only be used if you do not want to persist information in ZoneCache.</p></div></li></ul></div>
</div>

## Using the Policy
<!-- start: doc.md -->
This policy requires a Google Service Account and key that will be used to
identify the Zuplo API Gateway. Once this policy is configured you will need to
configure your GCP backend to only accept authenticated requests.

### Create the GCP Service Account

The first thing you will need to do to use this policy is
[create a service account](https://cloud.google.com/iam/docs/service-accounts-create).
You should create a unique service account for your Zuplo Gateway (i.e.
`zuplo-gateway`).

Give the account permission to call any services you want to proxy with Zuplo.

Next, you will need to
[create the Service Account key](https://cloud.google.com/iam/docs/keys-create-delete)
(using the JSON format). The json file will download.

Next, in your Zuplo project, set the `SERVICE_ACCOUNT_JSON` environment variable
as a secret with the value of the downloaded JSON document.

:::caution

The value of the private key is a JSON file. **Before you save the file to
Zuplo's environment variables**, you must remove all line breaks and all
instances of the `\n` escape character. The JSON file should be a single line.

:::

### Configure the Policy

There are multiple uses for this policy. The way you are using this policy
dictate the configuration options that need to be set.

### Invoking Your GCP Services

When calling your own services like Cloud Run, authenticating using Identity
Aware Proxy, or calling other services that you own, you will specify the
`audience` property.

When using this policy, you need to set the `audience` to the appropriate value
depending on the service you are using.

For backend's secured with Identity Aware Proxy, the value for `audience` should
be the Client ID of your OAuth application.

For backend's using Cloud Run IAM , the value for `audience` should be the full
URL of the Cloud Run instance.

An example configuration of this policy when calling Cloud Run is shown below.

```json
{
  "name": "gcp-service-auth",
  "policyType": "upstream-gcp-service-auth-inbound-policy",
  "handler": {
    "module": "$import(@zuplo/runtime)",
    "export": "UpstreamGcpServiceAuthInboundPolicy",
    "options": {
      "audience": "https://my-app-1235.a.run.app",
      "serviceAccountJson": "$env(GCP_SERVICE_ACCOUNT)"
    }
  }
}
```

### Invoking Google APIs

When using this policy to directly invoke a Google API (i.e. executing a
[Workflow](https://cloud.google.com/workflows/docs/executing-workflow) the
`scopes` property must be set.

The scopes need to be set to the values each Google API call specifies. The way
you can find the required scopes is usually to refer to Google's documentation.
They typically have a section title
[**Authorization scopes**](https://cloud.google.com/resource-manager/reference/rest/v1/projects/get#authorization-scopes).
The scopes will be in the format of a url. For example,
`https://www.googleapis.com/auth/cloud-platform`.

An example configuration of this policy when calling a Google Cloud API is shown
below.

```json
{
  "name": "gcp-service-auth-gcloud-api",
  "policyType": "upstream-gcp-service-auth-inbound-policy",
  "handler": {
    "module": "$import(@zuplo/runtime)",
    "export": "UpstreamGcpServiceAuthInboundPolicy",
    "options": {
      "scopes": [
        "https://www.googleapis.com/auth/cloud-platform",
        "https://www.googleapis.com/auth/cloud-platform.read-only",
        "https://www.googleapis.com/auth/cloudplatformprojects",
        "https://www.googleapis.com/auth/cloudplatformprojects.readonly"
      ],
      "serviceAccountJson": "$env(GCP_SERVICE_ACCOUNT)"
    }
  }
}
```

<!-- end: doc.md -->

Read more about [how policies work](/docs/articles/policies)
