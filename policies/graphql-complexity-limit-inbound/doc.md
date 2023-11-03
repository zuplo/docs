## GraphQL Complexity Limit

This policy allows you to add a limit for the depth and a limit for the complexity of a GraphQL query.

### Depth Limit

Limit the depth a GraphQL query is allowed to query for.

- **maxDepth** - Number of levels a GraphQL query is allowed to query for.

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

###  Complexity Limit
Example:

- **maxComplexity** - Maximum complexity allowed for a query.


```
{
  me { 
    name  # Complexity +1
    age   # Complexity +1
    email # Complexity +1
    friends { 
      name   # Complexity +1
      height # Complexity +1
    }
  }
}
# Total complexity = 5
```
