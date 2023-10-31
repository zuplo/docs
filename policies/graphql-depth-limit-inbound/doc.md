## GraphQL Depth Limit

Limit the depth a GraphQL query is allowed to query for.

- **depthLimit** - Number of levels a GraphQL query is allowed to query for.

This allows you to limit the depth of a GraphQL query. This is useful to prevent
DoS attacks on your GraphQL server.

```
{
  # Level 0
  me {
    # Level 1
    name
    friends {
      # Level 2
      name
      friends {
        # Level 3
        name
        # ...
      }
    }
  }
}
```
