## Authorization

You can also require certain claims to be valid by specifying this in the options. For example, if you require the claim `user_role` to be either `admin` or `supa_user`, you would configure the policy as follows:

```json
{
  "export": "SupabaseJwtInboundPolicy",
  "module": "$import(@zuplo/runtime)",
  "options": {
    "secret": "$env(SUPABASE_JWT_SECRET)",
    "allowUnauthenticatedRequests": false,
    "requiredClaims": {
      "user_role": ["admin", "supa_user"]
    }
  }
}
```
