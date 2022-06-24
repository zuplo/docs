```json
{
  "export": "SetHeadersOutboundPolicy",
  "module": "$import(@zuplo/runtime)",
  "options": {
    "headers": [
      {
        "name": "fruit",
        "value": "banana",
        "overwrite": true
      }
    ]
  }
}
```

In this example we add a policy that will add (or overwrite an existing) header to the outgoing response, overwriting any existing `fruit` header on the response.
