---
title: GraphQL Complexity Limit Policy
sidebar_label: GraphQL Complexity Limit
---

<!-- WARNING: This document is generated. DO NOT EDIT BY HAND -->

# GraphQL Complexity Limit






<!-- start: intro.md -->
This policy allows you to add a limit for the depth and a limit for the complexity of a GraphQL query.

<!-- end: intro.md -->

<PolicyStatus isBeta={false} isPaidAddOn={false} />



## Configuration 

The configuration shows how to configure the policy in the 'policies.json' document.

```json title="config/policies.json"
{
  "name": "my-graphql-complexity-limit-inbound-policy",
  "policyType": "graphql-complexity-limit-inbound",
  "handler": {
    "export": "GraphQLComplexityLimitInboundPolicy",
    "module": "$import(@zuplo/runtime)",
    "options": {
      "useComplexityLimit": {
        "complexityLimit": 10
      },
      "useDepthLimit": {
        "ignore": []
      }
    }
  }
}
```

<div className="policy-options">
<div><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-configuration">Policy Configuration<a href="#policy-configuration" class="hash-link" aria-label="Direct link to Policy Configuration" title="Direct link to Policy Configuration">​</a></h3><ul><li><code>name</code> <span class="type-option">&lt;string&gt;</span> - The name of your policy instance. This is used as a reference in your routes.</li><li><code>policyType</code> <span class="type-option">&lt;string&gt;</span> - The identifier of the policy. This is used by the Zuplo UI. Value should be <code>graphql-complexity-limit-inbound</code>.</li><li><code>handler.export</code> <span class="type-option">&lt;string&gt;</span> - The name of the exported type. Value should be <code>GraphQLComplexityLimitInboundPolicy</code>.</li><li><code>handler.module</code> <span class="type-option">&lt;string&gt;</span> - The module containing the policy. Value should be <code>$import(@zuplo/runtime)</code>.</li><li><code>handler.options</code> <span class="type-option">&lt;object&gt;</span> - The options for this policy. <a href="#policy-options">See Policy Options</a> below.</li></ul><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-options">Policy Options<a href="#policy-options" class="hash-link" aria-label="Direct link to Policy Options" title="Direct link to Policy Options">​</a></h3><p>The options for this policy are specified below. All properties are optional unless specifically marked as required.</p><ul><li><code>useComplexityLimit</code><span class="type-option"> &lt;object&gt;</span><span class="required-option"> (Required)</span> - <ul><li><code>complexityLimit</code><span class="type-option"> &lt;number&gt;</span> - <div><p>The maximum complexity a query is allowed to have.</p></div></li><li><code>endpointUrl</code><span class="type-option"> &lt;string&gt;</span> - <div><p>The endpoint URL to use for the complexity calculation.</p></div></li></ul></li><li><code>useDepthLimit</code><span class="type-option"> &lt;object&gt;</span><span class="required-option"> (Required)</span> - <ul><li><code>depthLimit</code><span class="type-option"> &lt;number&gt;</span> - <div><p>The maximum depth a query is allowed to have.</p></div></li><li><code>ignore</code><span class="type-option"> &lt;string[]&gt;</span> - <div><p>The fields to ignore when calculating the depth of a query.</p></div></li></ul></li></ul></div>
</div>

## Using the Policy
<!-- start: doc.md -->
### Depth Limit

Limit the depth a GraphQL query is allowed to query for.

- **maxDepth** - Number of levels a GraphQL query is allowed to query for.

This allows you to limit the depth of a GraphQL query. This is useful to prevent
DoS attacks on your GraphQL server.

```
{
  # Level 0
  me {
    # Level 1
    name
    friends {
      # Level 2
      name
      friends {
        # Level 3
        name
        # ...
      }
    }
  }
}
```

### Complexity Limit

Example:

- **maxComplexity** - Maximum complexity allowed for a query.

```
{
  me {
    name  # Complexity +1
    age   # Complexity +1
    email # Complexity +1
    friends {
      name   # Complexity +1
      height # Complexity +1
    }
  }
}
# Total complexity = 5
```

<!-- end: doc.md -->

Read more about [how policies work](/docs/articles/policies)
