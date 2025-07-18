---
title: Route to Different Backends Based on Geolocation
sidebar_label: Geolocation Backend Routing
---

This guide explains how to create a Zuplo policy that routes requests to
different backend URLs based on the user's country.

## Overview

When running a global API, you may want to route requests to region-specific
backends for better performance, compliance, or data residency requirements.
Zuplo makes this easy with built-in geolocation capabilities.

## How It Works

Zuplo provides geolocation information for every request through the
`context.incomingRequestProperties` object. This includes the country code,
city, region, and other geographic details automatically determined from the
request's IP address.

## Creating a Geolocation Routing Policy

Create a new policy file in your project:

```typescript
// policies/geolocation-routing.ts
import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

export default async function policy(
  request: ZuploRequest,
  context: ZuploContext,
) {
  const country = context.incomingRequestProperties.country;

  // Route based on country
  switch (country) {
    case "US":
      context.custom.backendUrl = "https://us-east.example.com";
      break;
    case "CA":
      context.custom.backendUrl = "https://ca-central.example.com";
      break;
    case "GB":
    case "FR":
    case "DE":
      // Route European countries to EU backend
      context.custom.backendUrl = "https://eu-west.example.com";
      break;
    case "JP":
    case "KR":
      // Route Asian countries to Asia-Pacific backend
      context.custom.backendUrl = "https://asia-pacific.example.com";
      break;
    default:
      // Default backend for all other countries
      context.custom.backendUrl = "https://global.example.com";
  }

  return request;
}
```

## Using Environment Variables

For better maintainability, store backend URLs in environment variables:

```typescript
// policies/geolocation-routing.ts
import { ZuploContext, ZuploRequest, environment } from "@zuplo/runtime";

export default async function policy(
  request: ZuploRequest,
  context: ZuploContext,
) {
  const country = context.incomingRequestProperties.country;

  // Use environment variables for backend URLs
  switch (country) {
    case "US":
      context.custom.backendUrl = environment.US_BACKEND_URL;
      break;
    case "GB":
    case "FR":
    case "DE":
      context.custom.backendUrl = environment.EU_BACKEND_URL;
      break;
    default:
      context.custom.backendUrl = environment.DEFAULT_BACKEND_URL;
  }

  return request;
}
```

## Advanced: Using a Configuration Map

For more complex routing rules, use a configuration map:

```typescript
// policies/geolocation-routing.ts
import { ZuploContext, ZuploRequest, environment } from "@zuplo/runtime";

// Define routing configuration
const ROUTING_CONFIG: Record<string, string> = {
  // North America
  US: "https://us-east.example.com",
  CA: "https://ca-central.example.com",
  MX: "https://us-east.example.com",

  // Europe
  GB: "https://eu-west.example.com",
  FR: "https://eu-west.example.com",
  DE: "https://eu-central.example.com",
  IT: "https://eu-south.example.com",

  // Asia Pacific
  JP: "https://asia-northeast.example.com",
  KR: "https://asia-northeast.example.com",
  AU: "https://asia-southeast.example.com",
  SG: "https://asia-southeast.example.com",

  // Default fallback
  DEFAULT: "https://global.example.com",
};

export default async function policy(
  request: ZuploRequest,
  context: ZuploContext,
) {
  const country = context.incomingRequestProperties.country || "DEFAULT";

  // Look up the backend URL for this country
  const backendUrl = ROUTING_CONFIG[country] || ROUTING_CONFIG.DEFAULT;

  context.custom.backendUrl = backendUrl;

  // Optionally, add the country as a header for the backend
  request.headers.set("X-Client-Country", country);

  return request;
}
```

## Using Additional Location Data

Zuplo provides more than just country information. You can use other properties
for more granular routing:

```typescript
// policies/advanced-geolocation-routing.ts
import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

export default async function policy(
  request: ZuploRequest,
  context: ZuploContext,
) {
  const geo = context.incomingRequestProperties;

  // Route based on continent for broader regions
  if (geo.continent === "NA") {
    context.custom.backendUrl = "https://americas.example.com";
  } else if (geo.continent === "EU") {
    context.custom.backendUrl = "https://europe.example.com";
  } else if (geo.continent === "AS") {
    context.custom.backendUrl = "https://asia.example.com";
  } else {
    context.custom.backendUrl = "https://global.example.com";
  }

  // Add detailed location headers for the backend
  request.headers.set("X-Client-Country", geo.country || "");
  request.headers.set("X-Client-City", geo.city || "");
  request.headers.set("X-Client-Region", geo.region || "");
  request.headers.set("X-Client-Timezone", geo.timezone || "");

  // Log detailed routing information
  context.log.info({
    message: "Routing request based on location",
    country: geo.country,
    city: geo.city,
    region: geo.region,
    continent: geo.continent,
    coordinates: `${geo.latitude},${geo.longitude}`,
    backend: context.custom.backendUrl,
  });

  return request;
}
```

## Using the Backend URL in a Handler

After the policy sets the backend URL in `context.custom.backendUrl`, you need a
handler that uses this value.

### Option 1: Custom Handler

Create a custom handler that reads the backend URL from context:

```typescript
// modules/geolocation-handler.ts
import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

export default async function handler(
  request: ZuploRequest,
  context: ZuploContext,
) {
  // Get the backend URL set by the geolocation policy
  const backendUrl = context.custom.backendUrl;

  if (!backendUrl) {
    return new Response("Backend URL not configured", { status: 500 });
  }

  // Create the full URL by combining backend URL with the request path
  const url = new URL(request.url);
  const targetUrl = `${backendUrl}${url.pathname}${url.search}`;

  // Forward the request to the backend
  const response = await fetch(targetUrl, {
    method: request.method,
    headers: request.headers,
    body: request.body,
  });

  return response;
}
```

### Option 2: Using URL Forward Handler

You can use Zuplo's built-in `urlForwardHandler` with a dynamic `baseUrl` that
reads from `context.custom`:

```json
{
  "paths": {
    "/api/data": {
      "get": {
        "x-zuplo-route": {
          "corsPolicy": "anything-goes",
          "handler": {
            "export": "urlForwardHandler",
            "module": "$import(@zuplo/runtime)",
            "options": {
              "baseUrl": "${context.custom.backendUrl}"
            }
          },
          "policies": {
            "inbound": ["geolocation-routing"]
          }
        }
      }
    }
  }
}
```

This approach is the simplest - the `urlForwardHandler` will automatically
forward requests to the backend URL set by your geolocation policy.

## Adding the Policy to Your Route

Choose one of the handler options above and configure your route accordingly.

For Option 1 (Custom Handler):

```json
{
  "paths": {
    "/api/data": {
      "get": {
        "x-zuplo-route": {
          "corsPolicy": "anything-goes",
          "handler": {
            "export": "default",
            "module": "$import(./modules/geolocation-handler)"
          },
          "policies": {
            "inbound": ["geolocation-routing"]
          }
        }
      }
    }
  }
}
```

For Option 2 (URL Rewrite Handler), see the configuration shown above.

## Testing Your Policy

### 1. Using a VPN

Test from different countries using a VPN service to verify the routing works
correctly.

### 2. Adding Logging

Add comprehensive logging to debug the routing decisions:

```typescript
export default async function policy(
  request: ZuploRequest,
  context: ZuploContext,
) {
  const geo = context.incomingRequestProperties;
  const country = geo.country || "UNKNOWN";
  const backendUrl = ROUTING_CONFIG[country] || ROUTING_CONFIG.DEFAULT;

  context.custom.backendUrl = backendUrl;

  // Log the routing decision with full context
  context.log.info({
    requestId: context.requestId,
    country: country,
    city: geo.city,
    region: geo.region,
    asn: geo.asn,
    asOrganization: geo.asOrganization,
    backend: backendUrl,
  });

  return request;
}
```

### 3. Using Test Mode

In your development environment, you can create a test policy that simulates
different locations:

```typescript
// policies/test-geolocation-routing.ts
export default async function policy(
  request: ZuploRequest,
  context: ZuploContext,
) {
  // Check for test header
  const testCountry = request.headers.get("X-Test-Country");
  if (testCountry && environment.NODE_ENV !== "production") {
    const backendUrl = ROUTING_CONFIG[testCountry] || ROUTING_CONFIG.DEFAULT;
    context.custom.backendUrl = backendUrl;
    context.log.warn(`TEST MODE: Routing as if from ${testCountry}`);
    return request;
  }

  // Fall back to real geolocation
  const country = context.incomingRequestProperties.country || "DEFAULT";
  context.custom.backendUrl = ROUTING_CONFIG[country] || ROUTING_CONFIG.DEFAULT;
  return request;
}
```

## Considerations

### Performance

The geolocation data is determined at the edge, so there's no additional latency
for IP lookups. All location properties are immediately available in the
context.

### Accuracy

Geolocation based on IP addresses is generally accurate but may occasionally
misidentify locations, especially for:

- VPN users
- Corporate networks with centralized egress
- Mobile networks that may route through different regions
- Proxy servers

### Compliance

When routing based on geolocation for compliance reasons, consider:

- GDPR requirements for EU countries
- Data residency laws in specific countries
- Adding additional verification for sensitive operations
- Documenting your geolocation-based routing for compliance audits

### Fallback Strategy

Always implement a default fallback to ensure requests are handled even when:

- Country information is unavailable
- A new country code appears that isn't in your configuration
- The geolocation service has issues

## Next Steps

- Learn about [custom policies](../policies/custom-code-inbound.mdx)
- Explore [environment variables](../articles/environment-variables.md)
- Set up [monitoring and analytics](../articles/logging.md) for your geolocation
  routing
- Review the [ZuploContext documentation](../programmable-api/zuplo-context.md)
  for all available request properties
