## Geo-location Filter Policy

Specify an allow list or block list of:

- **Countries** - Country of the incoming request. The two-letter country code
  in the request, for example, "US".
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
