# Contributing

General notes on editing docs and blog posts.

## Embedded Forms

You can embed Hubspot forms using the react component as shown below:

```
<HubSpotForm region="na1" portalId="21624128" formId="c3d1fde1-b51e-406d-9e68-030ff770bd88"/>
```

## Error Pages

Every error message in Zuplo's runtime has a `help_url` that points to `https://zup.fail/ERROR_MESSAGE`. These url's redirect to the docs site to a url in the format `https://zuplo.com/docs/errors/error-message/`. When adding a new new error message create a page in `./docs/errors` to document the error.
