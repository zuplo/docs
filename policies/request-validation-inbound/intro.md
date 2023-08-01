The Request Validation policy is used to validate incoming requests based on
schemas in OpenAPI specifications.

When configured, any requests that do not conform to your OpenAPI schema will be
rejected with a `400: Bad Request` response containing a detailed error message
(in JSON) explaining why the request was not accepted.

Here's an example of how to specify a schema for validation in a request body in
OpenAPI.

```
        "requestBody": {
          "description": "user to add to the system",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "name": {
                    "type": "string"
                  },
                  "age": {
                    "type": "integer"
                  }
                },
                "required": [
                  "name",
                  "age"
                ]
              }
            }
          }
        }
```
