---
title: Caching Policy
sidebar_label: Caching
---

<!-- WARNING: This document is generated. DO NOT EDIT BY HAND -->

# Caching






<!-- start: intro.md -->
Respond to matched incoming requests with cached content
<!-- end: intro.md -->

<PolicyStatus isBeta={false} isPaidAddOn={false} />



## Configuration 

The configuration shows how to configure the policy in the 'policies.json' document.

```json title="config/policies.json"
{
  "name": "my-caching-inbound-policy",
  "policyType": "caching-inbound",
  "handler": {
    "export": "CachingInboundPolicy",
    "module": "$import(@zuplo/runtime)",
    "options": {
      "cacheHttpMethods": [
        "GET"
      ],
      "expirationSecondsTtl": 60,
      "headers": "content-type",
      "statusCodes": [
        200,
        201,
        404
      ]
    }
  }
}
```

<div className="policy-options">
<div><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-configuration">Policy Configuration<a href="#policy-configuration" class="hash-link" aria-label="Direct link to Policy Configuration" title="Direct link to Policy Configuration">​</a></h3><ul><li><code>name</code> <span class="type-option">&lt;string&gt;</span> - The name of your policy instance. This is used as a reference in your routes.</li><li><code>policyType</code> <span class="type-option">&lt;string&gt;</span> - The identifier of the policy. This is used by the Zuplo UI. Value should be <code>caching-inbound</code>.</li><li><code>handler.export</code> <span class="type-option">&lt;string&gt;</span> - The name of the exported type. Value should be <code>CachingInboundPolicy</code>.</li><li><code>handler.module</code> <span class="type-option">&lt;string&gt;</span> - The module containing the policy. Value should be <code>$import(@zuplo/runtime)</code>.</li><li><code>handler.options</code> <span class="type-option">&lt;object&gt;</span> - The options for this policy. <a href="#policy-options">See Policy Options</a> below.</li></ul><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-options">Policy Options<a href="#policy-options" class="hash-link" aria-label="Direct link to Policy Options" title="Direct link to Policy Options">​</a></h3><p>The options for this policy are specified below. All properties are optional unless specifically marked as required.</p><ul><li><code>cacheId</code><span class="type-option"> &lt;string&gt;</span> - <div><p>Specifies an id or 'key' for this policy to store cache. This is useful for cache-busting. For example, set this property to an env var and if you change that env var value, you invalidate the cache.</p></div></li><li><code>dangerouslyIgnoreAuthorizationHeader</code><span class="type-option"> &lt;boolean&gt;</span> - <div><p>By default, the Authorization header is always considered in the caching policy. You can disable by setting this to <code>true</code>.</p></div></li><li><code>headers</code><span class="type-option"> &lt;string[]&gt;</span> - <div><p>The headers to be considered when caching.</p></div><span class="default-value"> Defaults to <code></code>.</span></li><li><code>cacheHttpMethods</code><span class="type-option"> &lt;string[]&gt;</span> - <div><p>HTTP Methods to be cached. Valid methods are: GET, POST, PUT, PATCH, DELETE, HEAD.</p></div><span class="default-value"> Defaults to <code>GET</code>.</span></li><li><code>expirationSecondsTtl</code><span class="type-option"> &lt;number&gt;</span> - <div><p>The timeout of the cache in seconds.</p></div><span class="default-value"> Defaults to <code>60</code>.</span></li><li><code>statusCodes</code><span class="type-option"> &lt;number[]&gt;</span> - <div><p>Response status codes to be cached.</p></div><span class="default-value"> Defaults to <code>200,206,301,302,303,404,410</code>.</span></li></ul></div>
</div>

## Using the Policy
<!-- start: doc.md -->
### Cache-busting

If you need to support cache-busting on demand, we recommend applying a
`cacheId` property based on an Environment Variable. Ensure all your cache
policies are using a cachedId based on a variable and then change that variable
(and trigger a redeploy) to clear the cache.

e.g.

```json
{
  "export": "CachingInboundPolicy",
  "module": "$import(@zuplo/runtime)",
  "options": {
    "cachedId": "$env(CACHE_ID)", // this is reading an env var
    "expirationSecondsTtl": 60,
    "dangerouslyIgnoreAuthorizationHeader": false,
    "headers": ["header_used_as_part_of_cache_key"]
  }
}
```

Then you would setup an env var for this, we recommend using the current date it
was set, e.g. `2023-07-05-11-57` and then simply change this value and trigger a
redeploy to bust your cache.

![Env Var](https://cdn.zuplo.com/uploads/CleanShot%202023-07-05%20at%2011.57.48%402x.png)

<!-- end: doc.md -->

Read more about [how policies work](/docs/articles/policies)
