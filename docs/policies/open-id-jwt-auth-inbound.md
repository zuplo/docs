---
title: JWT Auth Policy
sidebar_label: JWT Auth
---

<!-- WARNING: This document is generated. DO NOT EDIT BY HAND -->

# JWT Auth






<!-- start: intro.md -->
The Open ID JWT Authentication policy allows you to authenticate incoming requests using an Open ID-compliant bearer token. It works with common authentication services like Auth0 (sample here) but should also work with any valid Open ID JWT token.

When configured, you can have Zuplo check incoming requests for a JWT token and automatically populate the `ZuploRequest` 's `user` property with a user object. This `user` object will have a `sub` property - taking the `sub` id from the JWT token. It will also have a `data` property populated by other data returned in the JWT token (including any claims).

See [this document](https://zuplo.com/docs/articles/oauth-authentication) for more information about OAuth authorization in Zuplo.

<!-- end: intro.md -->

<PolicyStatus isBeta={false} isPaidAddOn={false} />



## Configuration 

The configuration shows how to configure the policy in the 'policies.json' document.

```json title="config/policies.json"
{
  "name": "my-open-id-jwt-auth-inbound-policy",
  "policyType": "open-id-jwt-auth-inbound",
  "handler": {
    "x-example-name": "Public Key Validation with JWKS (Recommended)",
    "x-example-description": "This example shows how to configure the policy using a Public Key from an OpenID Connect provider.",
    "export": "OpenIdJwtInboundPolicy",
    "module": "$import(@zuplo/runtime)",
    "options": {
      "audience": "$env(AUTH_AUDIENCE)",
      "issuer": "$env(AUTH_ISSUER)",
      "jwkUrl": "https://zuplo-demo.us.auth0.com/.well-known/jwks.json"
    }
  }
}
```

<div className="policy-options">
<div><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-configuration">Policy Configuration<a href="#policy-configuration" class="hash-link" aria-label="Direct link to Policy Configuration" title="Direct link to Policy Configuration">​</a></h3><ul><li><code>name</code> <span class="type-option">&lt;string&gt;</span> - The name of your policy instance. This is used as a reference in your routes.</li><li><code>policyType</code> <span class="type-option">&lt;string&gt;</span> - The identifier of the policy. This is used by the Zuplo UI. Value should be <code>open-id-jwt-auth-inbound</code>.</li><li><code>handler.export</code> <span class="type-option">&lt;string&gt;</span> - The name of the exported type. Value should be <code>OpenIdJwtInboundPolicy</code>.</li><li><code>handler.module</code> <span class="type-option">&lt;string&gt;</span> - The module containing the policy. Value should be <code>$import(@zuplo/runtime)</code>.</li><li><code>handler.options</code> <span class="type-option">&lt;object&gt;</span> - The options for this policy. <a href="#policy-options">See Policy Options</a> below.</li></ul><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-options">Policy Options<a href="#policy-options" class="hash-link" aria-label="Direct link to Policy Options" title="Direct link to Policy Options">​</a></h3><p>The options for this policy are specified below. All properties are optional unless specifically marked as required.</p><ul><li><code>issuer</code><span class="type-option"> &lt;string&gt;</span> - <div><p>The expected issuer claim in the JWT token.</p></div></li><li><code>audience</code><span class="type-option"> &lt;string&gt;</span> - <div><p>The expected audience claim in the JWT token.</p></div></li><li><code>jwkUrl</code><span class="type-option"> &lt;string&gt;</span> - <div><p>the url of the JSON Web Key Set (JWKS) - this is used to validate the JWT token signature (either this or <code>secret</code> must be set).</p></div></li><li><code>secret</code><span class="type-option"> &lt;string&gt;</span> - <div><p>The key used to verify the signature of the JWT token (either this or <code>jwkUrl</code> must be set).</p></div></li><li><code>allowUnauthenticatedRequests</code><span class="type-option"> &lt;boolean&gt;</span> - <div><p>indicates whether the request should continue if authentication fails. Defaults is <code>false</code> which means unauthenticated users will automatically receive a 401 response.</p></div></li><li><code>subPropertyName</code><span class="type-option"> &lt;string&gt;</span> - <div><p>The name of the property in the JWT token that contains the user's unique identifier.</p></div></li><li><code>headers</code><span class="type-option"> &lt;object&gt;</span> - <div><p>Additional headers to send with the JWK request.</p></div></li></ul></div>
</div>

## Using the Policy
<!-- start: doc.md -->
Note that sometimes the `issuer` and `audience` will vary between your
environments (e.g. dev, staging and prod). We recommend storing these values in
your environment variables and using `$env(VARIABLE_NAME)` to include them in
your policy configuration.

:::note

Note you can have multiple instances of the same policy with different `name`s
if you want to have slightly different rules (such as settings for the
`allowUnauthenticatedRequests` setting.

:::

```json
{
  "path": "/products/:123",
  "methods": ["POST"],
  "handler": {
    "module": "$import(./modules/products)",
    "export": "postProducts"
  },
  "corsPolicy": "None",
  "version": "none",
  "policies": {
    "inbound": ["your-jwt-policy-name"]
  }
}
```

## Using the user property in code

For an example of using the user object in a
[RequestHandler](../handlers/custom-handler.md), see
[Setting up JWT auth with Auth0](../policies/auth0-jwt-auth-inbound.md).

<!-- end: doc.md -->

Read more about [how policies work](/docs/articles/policies)
