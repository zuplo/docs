## GraphQL Complexity Limit

This policy allows you to add a simple limit the complexity of a GraphQL query.

- **maxComplexity** - Total complexity a GraphQL query is allowed to query for.
- **endpointUrl** - The GraphQL endpoint to query, introspection must be allowed.

Example:

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
