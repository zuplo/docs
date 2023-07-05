### Cache-busting

If you need to support cache-busting on demand, we recommend applying a
`cacheId` property based on an Environment Variable. Ensure all your cache
policies are using a cachedId based on a variable and then change that variable
(and trigger a redeploy) to clear the cache.

e.g.

```json
{
  "export": "CachingInboundPolicy",
  "module": "$import(@zuplo/runtime)",
  "options": {
    "cachedId": "$env(CACHE_ID)", // this is reading an env var
    "expirationSecondsTtl": 60,
    "dangerouslyIgnoreAuthorizationHeader": false,
    "headers": ["header_used_as_part_of_cache_key"]
  }
}
```

Then you would setup an env var for this, we recommend using the current date it
was set, e.g. `2023-07-05-11-57` and then simply change this value and trigger a
redeploy to bust your cache.

![Env Var](https://cdn.zuplo.com/uploads/CleanShot%202023-07-05%20at%2011.57.48%402x.png)
