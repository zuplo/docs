Here's an example of how to specify a schema for validation in a request body in
OpenAPI.

```json
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
