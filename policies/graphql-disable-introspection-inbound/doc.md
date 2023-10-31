## GraphQL Disable Introspection

This policy allows you to disable introspection queries on your API.

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
