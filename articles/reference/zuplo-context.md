# ZuploContext

## Properties

- `log` - a logger you can use to help debug your code. Logs will appear in your
  log tail in the portal and in your integrated log solution (e.g. DataDog).
  Note that pre-production environments are typically set to a **Info** log
  level, while production is set to **Error**.

```jsx
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

## Methods

- `waitUntil` - the Zuplo runtime is a high-density serverless runtime with near
  0ms startup time. The platform will try to reclaim resources quickly and so
  may shut down your process as soon as we think you’re finished. If you have
  async work happening after you send a response (maybe an async logging request
  or similar), you should notify the runtime using `waitUntil`. Here’s an
  example - note the runtime now knows to wait until the enqueued method
  completes before shutting down.

```jsx
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
