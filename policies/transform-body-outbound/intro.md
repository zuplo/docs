This example policy shows how to use `response.json()` to read the outgoing
response as a JSON object. The object can then be modified as appropriate. It is
then converted back to a string and a new `Response` is returned in the policy
with the new body.

If the incoming response body is not JSON, you can use `response.text()` or
`response.blob()` to access the contents as raw text or a
[blob](https://developer.mozilla.org/en-US/docs/Web/API/Response/blob).
