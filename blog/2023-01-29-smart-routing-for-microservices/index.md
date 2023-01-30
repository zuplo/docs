---
title: Smart Routing for Microservices (or isolated customer backends)
authors: josh
tags: [microservices, api-key, routing, integration, rate-limiting]
description: Consolidate multiple endpoints behind a single API with smart routing
image: https://og-image.zuplo.com?text=Smart%20Routing%20for%20Microservices
---

We just published a new video showing how you can add smart routing, behind a single common API for multiple backends, in 1 page of TypeScript. Metadata is loaded from an external service (in this case, [Xata](https://xata.io) but you could use Supabase, Mongo etc).

<YouTubeVideo url="https://www.youtube-nocookie.com/embed/SC-HuZqEEPE" />

Here's the code used in the demonstration:

```ts
import {
  ZuploContext,
  ZuploRequest,
  environment,
  ZoneCache,
} from "@zuplo/runtime";

interface RouteInfo {
  customerId: string;
  primaryUrl: string;
  secondaryUrl?: string;
}

const CACHE_KEY = "ROUTE_RECORDS";
const CACHE_NAME = "ROUTE_INFO";

async function loadRouteInfoFromApi(context: ZuploContext) {
  const cache = new ZoneCache(CACHE_NAME, context);

  const records = await cache.get(CACHE_KEY);

  if (!records) {
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${environment.XATA_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: '{"page":{"size":15}}',
    };

    const response = await fetch(
      "https://YOUR-XATA-URL.xata.sh/db/test:main/tables/routing/query",
      options
    );

    const data = await response.json();
    cache.put(CACHE_KEY, data.records, 300); // 5 minutes

    context.log.info("RouteInfo loaded from API");
    return data.records;
  }

  context.log.info("RouteInfo loaded from Cache");
  return records;
}

export default async function (request: ZuploRequest, context: ZuploContext) {
  const customerId = request.user.data.customerId;

  const routing = await loadRouteInfoFromApi(context);

  const routeInfo = routing.find((r) => r.customerId === customerId);

  if (!routeInfo) {
    return new Response(`No route found for customer '${customerId}'`, {
      status: 404,
    });
  }

  const response = await fetch(routeInfo.primaryUrl);
  if (response.status !== 200 && routeInfo.secondaryUrl) {
    context.log.info(
      `First request failed, trying secondary (${response.status})`
    );
    const response2 = await fetch(routeInfo.secondaryUrl);
    return response2;
  }

  return response;
}
```

Got questions or feedback? [Join us on Discord](https://discord.gg/8QbEjr2MgZ).


