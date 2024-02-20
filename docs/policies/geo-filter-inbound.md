---
title: Geo-location filtering Policy
sidebar_label: Geo-location filtering
---

<!-- WARNING: This document is generated. DO NOT EDIT BY HAND -->

# Geo-location filtering






<!-- start: intro.md -->
Block requests based on geo-location parameters: country, region code, and ASN
<!-- end: intro.md -->

<PolicyStatus isBeta={false} isPaidAddOn={false} />



## Configuration 

The configuration shows how to configure the policy in the 'policies.json' document.

```json title="config/policies.json"
{
  "name": "my-geo-filter-inbound-policy",
  "policyType": "geo-filter-inbound",
  "handler": {
    "export": "GeoFilterInboundPolicy",
    "module": "$import(@zuplo/runtime)",
    "options": {
      "allow": {
        "asns": "395747, 28304",
        "countries": "US, CA",
        "regionCodes": "TX, WA"
      },
      "block": {
        "asns": "395747, 28304",
        "countries": "US, CA",
        "regionCodes": "TX, WA"
      },
      "ignoreUnknown": true
    }
  }
}
```

<div className="policy-options">
<div><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-configuration">Policy Configuration<a href="#policy-configuration" class="hash-link" aria-label="Direct link to Policy Configuration" title="Direct link to Policy Configuration">​</a></h3><ul><li><code>name</code> <span class="type-option">&lt;string&gt;</span> - The name of your policy instance. This is used as a reference in your routes.</li><li><code>policyType</code> <span class="type-option">&lt;string&gt;</span> - The identifier of the policy. This is used by the Zuplo UI. Value should be <code>geo-filter-inbound</code>.</li><li><code>handler.export</code> <span class="type-option">&lt;string&gt;</span> - The name of the exported type. Value should be <code>GeoFilterInboundPolicy</code>.</li><li><code>handler.module</code> <span class="type-option">&lt;string&gt;</span> - The module containing the policy. Value should be <code>$import(@zuplo/runtime)</code>.</li><li><code>handler.options</code> <span class="type-option">&lt;object&gt;</span> - The options for this policy. <a href="#policy-options">See Policy Options</a> below.</li></ul><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-options">Policy Options<a href="#policy-options" class="hash-link" aria-label="Direct link to Policy Options" title="Direct link to Policy Options">​</a></h3><p>The options for this policy are specified below. All properties are optional unless specifically marked as required.</p><ul><li><code>block</code><span class="type-option"> &lt;object&gt;</span> - <ul><li><code>countries</code><span class="type-option"> &lt;string&gt;</span> - <div><p>comma separated string of country codes to allow (e.g. "US, CA").</p></div></li><li><code>regionCodes</code><span class="type-option"> &lt;string&gt;</span> - <div><p>comma separated string of region codes to allow (e.g. "TX, WA").</p></div></li><li><code>asns</code><span class="type-option"> &lt;string&gt;</span> - <div><p>comma separated string of ASNs to allow (e.g. "395747, 28304").</p></div></li></ul></li><li><code>allow</code><span class="type-option"> &lt;object&gt;</span> - <ul><li><code>countries</code><span class="type-option"> &lt;string&gt;</span> - <div><p>comma separated string of country codes to allow (e.g. "US, CA").</p></div></li><li><code>regionCodes</code><span class="type-option"> &lt;string&gt;</span> - <div><p>comma separated string of region codes to allow (e.g. "TX, WA").</p></div></li><li><code>asns</code><span class="type-option"> &lt;string&gt;</span> - <div><p>comma separated string of ASNs to allow (e.g. "395747, 28304").</p></div></li></ul></li><li><code>ignoreUnknown</code><span class="type-option"> &lt;boolean&gt;</span> - <div><p>Specifies whether unknown geo-location parameters should be ignored (allowed through).</p></div><span class="default-value"> Defaults to <code>true</code>.</span></li></ul></div>
</div>

## Using the Policy
<!-- start: doc.md -->
## Geo-location Filter Policy

Specify an allow list or block list of:

- **Countries** - Country of the incoming request. The
  [two-letter country code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) in
  the request, for example, "US".
- **regionCodes** - If known, the
  [ISO 3166-2](https://en.wikipedia.org/wiki/ISO_3166-2) code for the
  first-level region associated with the IP address of the incoming request, for
  example, "TX"
- **ASNs** - ASN of the incoming request, for example, 395747.

:::warning

If you specify an allow and block list for the same location type (e.g.
`country`) may have no effect or block all requests.

```
{
  "allow" : {
    "countries" : "US"
  },
  "block" : {
    "countries" : "MC"
  }
}
```

The policy will only allow requests from US, so any request from MC would be
automatically blocked.

:::

<!-- end: doc.md -->

Read more about [how policies work](/docs/articles/policies)
