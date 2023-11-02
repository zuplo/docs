This example policy demonstrates how to use a shared secret to create an
[HMAC](https://en.wikipedia.org/wiki/HMAC) signature to sign a payload (in this
case the body). When the request is sent, the signature is sent in the request
header. The policy can then verify that the signature matches the payload - thus
ensuring that the sender had the same shared secret.

This policy is configured with the value of the `secret`. Normally, you would
store this as an environment variable secret. Additionally, the policy option
`headerName` is used to set the header that will be used by the client to send
the signature.
