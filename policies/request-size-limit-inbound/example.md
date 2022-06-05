```json
{
  "export": "RequestSizeLimitInboundPolicy",
  "module": "$import(@zuplo/runtime)",
  "options": {
    "maxSizeInBytes": 4098,
    "trustContentLengthHeader": true
  }
}
```

In this example, the max request size is 4098 bytes. Note how the `trustContentLengthHeader` is set to true - the policy will reject any request with a `content-length` header in excess of 4098 bytes but will not verify the actual size of the request. This is more efficient and offers slightly better memory usage but should only be used if you trust/control the clients calling the gateway to send an accurate content-length. If `trustContentLengthHeader` is
set to false, the gateway will actually verify the request size and reject any
request with a size in excess of the stated maximum.
