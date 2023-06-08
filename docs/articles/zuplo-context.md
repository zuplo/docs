---
title: ZuploContext
---

## Properties

- `log` - a logger you can use to help debug your code. Logs will appear in your
  log tail in the portal and in your integrated log solution (e.g. DataDog).
  Note that pre-production environments are typically set to an **Info** log
  level, while production is set to **Error**.

```ts
context.log.debug({ some: "debug-info" });
context.log.info('info level stuff');
context.log.warn(['a', 'warning']);
context.log.error({ "Oh" : "my!"}
```

- `requestId` - a UUID for every request. This is used in logging and can be
  handy to tie events together. Note that we automatically log the requestId
  with every use of request.logger.
- `route` - a pointer to the read-only configuration for the matched route.
  Includes the label, path, methods supported, name of the version, and names of
  policies. This type is immutable - the routing table cannot be updated at
  runtime.

- `incomingRequestProperties` - information about the incoming request such as
  geolocation data. This is an object with the following properties.

  - `asn` [number] - ASN of the incoming request, for example, 395747.
  - `asOrganization` [string] - The organization which owns the ASN of the
    incoming request, for example, Google Cloud.
  - `city` [string] - City of the incoming request, for example, "Austin".
  - `continent` [string] - Continent of the incoming request, for example, "NA".
  - `country` [string] - The
    [two-letter country code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)
    in the request.
  - `latitude` [string] - Latitude of the incoming request, for example,
    "30.27130".
  - `longitude` [string] - Longitude of the incoming request, for example,
    "-97.74260".
  - `colo` [string] - The three-letter
    [IATA airport code](https://en.wikipedia.org/wiki/IATA_airport_code) of the
    data center that the request hit, for example, "DFW".
  - `postalCode` [string] - Postal code of the incoming request, for example,
    "78701".
  - `metroCode` [string] - Metro code (DMA) of the incoming request, for
    example, "635".
  - `region` [string] - If known, the [ISO
    3166-2](https://en.wikipedia.org/wiki/ISO_3166-2|ISO 3166-2) name for the
    first level region associated with the IP address of the incoming request,
    for example, "Texas".
  - `regionCode` [string] - If known, the [ISO
    3166-2](https://en.wikipedia.org/wiki/ISO_3166-2|ISO 3166-2) code for the
    first-level region associated with the IP address of the incoming request,
    for example, "TX".
  - `timezone` [string] - Timezone of the incoming request, for example,
    "America/Chicago".

## Methods

- `waitUntil` - the Zuplo runtime is a high-density serverless runtime with near
  0ms startup time. The platform will try to reclaim resources quickly and so
  may shut down your process as soon as we think you’re finished. If you have
  async work happening after you send a response (maybe an async logging request
  or similar), you should notify the runtime using `waitUntil`. Here’s an
  example - note the runtime now knows to wait until the enqueued method
  completes before shutting down.

```ts
const asyncWork = async () => {
  await fetch("https://supa-logger.io/my-logging-url", {
    method: "POST",
    body: "some-logging-info",
  });
};

// start the call and tell the runtime to stay alive until it's done
context.waitUntil(asyncWork());

return response;
```

- `invokeInboundPolicy` - this allows you to programmatically execute a policy
  in your policy library (e.g. one defined in `policies.json`). This is useful
  if you want to conditionally execute policies, for example if a query param
  'foo' equals 'bar'. Here is an example of a
  [custom policy](/docs/policies/custom-code-inbound.md) that would achieve
  this:

```ts
import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

export default async function (request: ZuploRequest, context: ZuploContext) {
  if (request.query.foo === "bar") {
    // "my-policy" is the name given to your policy in policies.json
    return context.invokeInboundPolicy("my-policy", request);
  }
  return request;
}
```
**Important** - If you call a policy using `context.invokeInboundPolicy` it will return a `Request` or `Response` object (example checking the type is shown below). A `Response` indicates that the policy wants to short-circuit the command chain and stop processing, returning that response to the client. Most likely you simply want to return that object depending on your scenario. If it returns a `Request` object then that is probably a freshly minted `Request` object that was created by the policy. In most scenarios you should use this request and return it to the runtime. The original request will now be in a locked state, cannot be cloned and any body cannot be read. This could result in errors like `This ReadableStream is currently locked to a reader`.

```ts
const result = await context.invokeInboundPolicy("my-policy", request);

if (result instanceof Response) {
  // if you want to do something special if type is Response, maybe log for example
  context.log.warn(`My policy wanted to short circuit with a status code of '${result.status}'`);
}

// You almost certainly want to return the result - whether a Response or Request to ensure
// Returning something else is an advanced use case and care needs to be taken not to break 
// downstream processing.
return result; 

```
