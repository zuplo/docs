This example policy shows how to use `request.json()` to read the incoming
request as a JSON object. The object can then be modified as appropriate. It is
then converted back to a string and a new `Request` is returned in the policy
with the new body.

If the incoming request body is not JSON, you can use `request.text()` or
`request.blob()` to access the contents as raw text or a
[blob](https://developer.mozilla.org/en-US/docs/Web/API/Request/blob).
