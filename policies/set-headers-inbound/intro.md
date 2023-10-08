The set header policy adds a header to the request in the inbound pipeline. This
can be used to set a security header required by the downstream service. For
example, if your backend service uses basic authentication you might use this
policy to attach the Basic auth header to the request:

```json
{
  "export": "SetHeadersInboundPolicy",
  "module": "$import(@zuplo/runtime)",
  "options": {
    "headers": [
      {
        "name": "Authorization",
        "value": "Basic DIGEST_HERE",
        "overwrite": true
      }
    ]
  }
}
```

When doing this, you most likely want to set the secret as an environment
variable, which can be accessed in the policy as follows

```json
{
  "export": "SetHeadersInboundPolicy",
  "module": "$import(@zuplo/runtime)",
  "options": {
    "headers": [
      {
        "name": "Authorization",
        "value": "$env(BASIC_AUTHORIZATION_HEADER_VALUE)",
        "overwrite": true
      }
    ]
  }
}
```

And you would set the environment variable `BASIC_AUTHORIZATION_HEADER_VALUE` to
`Basic DIGEST_HERE`.
