---
title: RBAC Authorization Policy
sidebar_label: RBAC Authorization
---

<!-- WARNING: This document is generated. DO NOT EDIT BY HAND -->

# RBAC Authorization

<CustomPolicyNotice name="RBAC Authorization" id="rbac-policy-inbound" />




<!-- start: intro.md -->
RBAC policies can be built many ways depending on your requirements. This
example shows how to perform a simple check of whether or not the current user
is a member of a set of allowed roles.

<!-- end: intro.md -->

<PolicyStatus isBeta={false} isPaidAddOn={false} />


## Example Custom Policy

The code below is an example of how this custom policy module could be implemented.

```ts title="modules/rbac-policy-inbound.ts"
import { HttpProblems, ZuploContext, ZuploRequest } from "@zuplo/runtime";

interface PolicyOptions {
  allowedRoles: string[];
}

export default async function (
  request: ZuploRequest,
  context: ZuploContext,
  options: PolicyOptions,
  policyName: string,
) {
  // Check that an authenticated user is set
  // NOTE: This policy requires an authentication policy to run before
  if (!request.user) {
    context.log.error(
      "User is not authenticated. A authorization policy must come before the RBAC policy.",
    );
    return HttpProblems.unauthorized(request, context);
  }

  // Check that the user has roles
  if (!request.user.data.roles) {
    context.log.error("The user is not assigned any roles.");
    return HttpProblems.unauthorized(request, context);
  }

  // Check that the user has one of the allowed roles
  if (
    !options.allowedRoles.some(
      (allowedRole) => request.user?.data.roles.includes(allowedRole),
    )
  ) {
    context.log.error(
      `The user '${request.user.sub}' is not authorized to perform this action.`,
    );
    return HttpProblems.forbidden(request, context);
  }

  // If they made it here, they are authorized
  return request;
}

```

## Configuration 

The example below shows how to configure a custom code policy in the 'policies.json' document that utilizes the above example policy code.

```json title="config/policies.json"
{
  "name": "my-rbac-policy-inbound-policy",
  "policyType": "rbac-policy-inbound",
  "handler": {
    "export": "default",
    "module": "$import(./modules/YOUR_MODULE)",
    "options": {
      "allowedRoles": [
        "admin",
        "editor"
      ]
    }
  }
}
```

<div className="policy-options">
<div><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-configuration">Policy Configuration<a href="#policy-configuration" class="hash-link" aria-label="Direct link to Policy Configuration" title="Direct link to Policy Configuration">​</a></h3><ul><li><code>name</code> <span class="type-option">&lt;string&gt;</span> - The name of your policy instance. This is used as a reference in your routes.</li><li><code>policyType</code> <span class="type-option">&lt;string&gt;</span> - The identifier of the policy. This is used by the Zuplo UI. Value should be <code>rbac-policy-inbound</code>.</li><li><code>handler.export</code> <span class="type-option">&lt;string&gt;</span> - The name of the exported type. Value should be <code>default</code>.</li><li><code>handler.module</code> <span class="type-option">&lt;string&gt;</span> - The module containing the policy. Value should be <code>$import(./modules/YOUR_MODULE)</code>.</li><li><code>handler.options</code> <span class="type-option">&lt;object&gt;</span> - The options for this policy. <a href="#policy-options">See Policy Options</a> below.</li></ul><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-options">Policy Options<a href="#policy-options" class="hash-link" aria-label="Direct link to Policy Options" title="Direct link to Policy Options">​</a></h3><p>The options for this policy are specified below. All properties are optional unless specifically marked as required.</p><ul><li><code>allowedRoles</code><span class="type-option"> &lt;string[]&gt;</span> - <div><p>The roles allowed to access the resource</p></div><span class="default-value"> Defaults to <code></code>.</span></li></ul></div>
</div>

## Using the Policy
<!-- start: doc.md -->

<!-- end: doc.md -->

Read more about [how policies work](/docs/articles/policies)
