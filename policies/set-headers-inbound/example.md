```json
{
  "export": "SetHeadersInboundPolicy",
  "module": "$import(@zuplo/runtime)",
  "options": {
    "headers": [
      {
        "name": "shared-secret",
        "value": "$env(SHARED_SECRET)",
        "overwrite": true
      }
    ]
  }
}
```

In this example we add a policy that will add (or overwrite an existing) header to the incoming request. In the example above, the value of the
header will be read from an environment variable `SHARED_SECRET`.
