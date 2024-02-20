---
title: Request Validation Policy
sidebar_label: Request Validation
---

<!-- WARNING: This document is generated. DO NOT EDIT BY HAND -->

# Request Validation






<!-- start: intro.md -->
The Request Validation policy is used to validate incoming requests based on schemas in OpenAPI specifications.

When configured, any requests that do not conform to your OpenAPI schema will be rejected with a `400: Bad Request` response containing a detailed error message (in JSON) explaining why the request was not accepted.

<!-- end: intro.md -->

<PolicyStatus isBeta={false} isPaidAddOn={false} />



## Configuration 

The configuration shows how to configure the policy in the 'policies.json' document.

```json title="config/policies.json"
{
  "name": "my-request-validation-inbound-policy",
  "policyType": "request-validation-inbound",
  "handler": {
    "export": "RequestValidationInboundPolicy",
    "module": "$import(@zuplo/runtime)",
    "options": {
      "includeRequestInLogs": false,
      "logLevel": "info",
      "validateBody": "reject-and-log",
      "validatePathParameters": "log-only",
      "validateQueryParameters": "log-only"
    }
  }
}
```

<div className="policy-options">
<div><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-configuration">Policy Configuration<a href="#policy-configuration" class="hash-link" aria-label="Direct link to Policy Configuration" title="Direct link to Policy Configuration">​</a></h3><ul><li><code>name</code> <span class="type-option">&lt;string&gt;</span> - The name of your policy instance. This is used as a reference in your routes.</li><li><code>policyType</code> <span class="type-option">&lt;string&gt;</span> - The identifier of the policy. This is used by the Zuplo UI. Value should be <code>request-validation-inbound</code>.</li><li><code>handler.export</code> <span class="type-option">&lt;string&gt;</span> - The name of the exported type. Value should be <code>RequestValidationInboundPolicy</code>.</li><li><code>handler.module</code> <span class="type-option">&lt;string&gt;</span> - The module containing the policy. Value should be <code>$import(@zuplo/runtime)</code>.</li><li><code>handler.options</code> <span class="type-option">&lt;object&gt;</span> - The options for this policy. <a href="#policy-options">See Policy Options</a> below.</li></ul><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-options">Policy Options<a href="#policy-options" class="hash-link" aria-label="Direct link to Policy Options" title="Direct link to Policy Options">​</a></h3><p>The options for this policy are specified below. All properties are optional unless specifically marked as required.</p><ul><li><code>logLevel</code><span class="type-option"> &lt;string&gt;</span> - <div><p>The log level to use when logging validation errors.</p></div><span class="allow-values"> Allowed values are <span><code>error</code>, </span><span><code>warn</code>, </span><span><code>info</code>, </span><span>and <code>debug</code></span>.</span><span class="default-value"> Defaults to <code>info</code>.</span></li><li><code>validateBody</code><span class="type-option"> &lt;string&gt;</span> - <div><p>The action to perform when validation fails.</p></div><span class="allow-values"> Allowed values are <span><code>none</code>, </span><span><code>log-only</code>, </span><span><code>reject-and-log</code>, </span><span>and <code>reject-only</code></span>.</span></li><li><code>validateQueryParameters</code><span class="type-option"> &lt;string&gt;</span> - <div><p>The action to perform when validation fails.</p></div><span class="allow-values"> Allowed values are <span><code>none</code>, </span><span><code>log-only</code>, </span><span><code>reject-and-log</code>, </span><span>and <code>reject-only</code></span>.</span></li><li><code>validatePathParameters</code><span class="type-option"> &lt;string&gt;</span> - <div><p>The action to perform when validation fails.</p></div><span class="allow-values"> Allowed values are <span><code>none</code>, </span><span><code>log-only</code>, </span><span><code>reject-and-log</code>, </span><span>and <code>reject-only</code></span>.</span></li><li><code>validateHeaders</code><span class="type-option"> &lt;string&gt;</span> - <div><p>The action to perform when validation fails.</p></div><span class="allow-values"> Allowed values are <span><code>none</code>, </span><span><code>log-only</code>, </span><span><code>reject-and-log</code>, </span><span>and <code>reject-only</code></span>.</span></li><li><code>includeRequestInLogs</code><span class="type-option"> &lt;boolean&gt;</span> - <div><p>Whether to include the request in the logs.</p></div></li></ul></div>
</div>

## Using the Policy
<!-- start: doc.md -->
Here's an example of how to specify a schema for validation in a request body in
OpenAPI.

```json
  "requestBody": {
    "description": "user to add to the system",
    "content": {
      "application/json": {
        "schema": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string"
            },
            "age": {
              "type": "integer"
            }
          },
          "required": [
            "name",
            "age"
          ]
        }
      }
    }
  }
```

<!-- end: doc.md -->

Read more about [how policies work](/docs/articles/policies)
