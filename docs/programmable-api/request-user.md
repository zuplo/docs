---
title: RequestUser
---

The `RequestUser` interface represents authenticated user information attached
to a [ZuploRequest](./zuplo-request.md). This interface is used when
authentication policies validate and identify users.

## Interface

```ts
interface RequestUser<TUserData> {
  sub: string;
  data: TUserData;
}
```

## Properties

- `sub` - The subject identifier (unique user ID) from the authentication token
- `data` - Additional user data of generic type `TUserData`

## Usage

The `user` property is available on `ZuploRequest` after successful
authentication:

```ts
import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

export default async function handler(
  request: ZuploRequest,
  context: ZuploContext,
) {
  // Check if user is authenticated
  if (!request.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Access user information
  const userId = request.user.sub;
  const userData = request.user.data;

  context.log.info("Request from user", { userId });

  return new Response(`Hello, user ${userId}!`);
}
```

## Type-Safe User Data

You can define custom types for user data:

```ts
import { ZuploContext, ZuploRequest, RequestUser } from "@zuplo/runtime";

// Define your user data structure
interface MyUserData {
  email: string;
  roles: string[];
  organizationId: string;
  permissions?: string[];
}

// Use typed request
type MyRequest = ZuploRequest<{
  UserData: MyUserData;
}>;

export default async function handler(
  request: MyRequest,
  context: ZuploContext,
) {
  if (!request.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  // TypeScript knows the shape of user.data
  const { email, roles, organizationId } = request.user.data;

  if (!roles.includes("admin")) {
    return new Response("Forbidden: Admin role required", { status: 403 });
  }

  return new Response(`Welcome admin ${email} from org ${organizationId}`);
}
```

## Common Authentication Patterns

### JWT Authentication

When using JWT authentication policies, the user data typically includes claims
from the token:

```ts
// After JWT validation
request.user = {
  sub: "auth0|123456789",
  data: {
    email: "user@example.com",
    name: "John Doe",
    picture: "https://example.com/avatar.jpg",
    // Custom claims
    organization: "acme-corp",
    roles: ["user", "admin"],
  },
};
```

### API Key Authentication

For API key authentication, user data might include consumer information:

```ts
// After API key validation
request.user = {
  sub: "consumer-id-123",
  data: {
    name: "Mobile App Client",
    metadata: {
      appVersion: "2.0.1",
      platform: "iOS",
    },
  },
};
```

## Working with User Data

### Role-Based Access Control

```ts
import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

interface UserWithRoles {
  roles: string[];
  permissions?: string[];
}

export function requireRole(role: string) {
  return async function handler(
    request: ZuploRequest<{ UserData: UserWithRoles }>,
    context: ZuploContext,
  ) {
    if (!request.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { roles } = request.user.data;

    if (!roles.includes(role)) {
      context.log.warn("Access denied", {
        userId: request.user.sub,
        requiredRole: role,
        userRoles: roles,
      });

      return new Response(`Forbidden: ${role} role required`, {
        status: 403,
      });
    }

    // User has required role, continue processing
    return null; // Continue to next handler
  };
}

// Usage in a route
export const adminOnly = requireRole("admin");
```

### User Context in Logging

```ts
export default async function handler(
  request: ZuploRequest,
  context: ZuploContext,
) {
  const userContext = request.user
    ? {
        userId: request.user.sub,
        userEmail: request.user.data?.email,
        organization: request.user.data?.organizationId,
      }
    : { userId: "anonymous" };

  context.log.info("Processing request", {
    ...userContext,
    path: request.url,
    method: request.method,
  });

  try {
    const result = await processBusinessLogic(request, request.user);

    context.log.info("Request completed", {
      ...userContext,
      success: true,
    });

    return new Response(JSON.stringify(result));
  } catch (error) {
    context.log.error("Request failed", {
      ...userContext,
      error: error.message,
    });

    throw error;
  }
}
```

### Passing User to Upstream Services

```ts
export default async function handler(
  request: ZuploRequest,
  context: ZuploContext,
) {
  if (!request.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Forward user information to upstream service
  const upstreamRequest = new Request(request, {
    headers: {
      ...Object.fromEntries(request.headers),
      "X-User-Id": request.user.sub,
      "X-User-Email": request.user.data.email || "",
      "X-User-Roles": JSON.stringify(request.user.data.roles || []),
    },
  });

  return fetch("https://api.internal.example.com", upstreamRequest);
}
```

## Authentication Policy Integration

Authentication policies automatically populate the `user` property:

```ts
// In your routes configuration
{
  "path": "/api/protected",
  "methods": ["GET"],
  "handler": {
    "export": "default",
    "module": "$import(./modules/protected-handler)"
  },
  "policies": {
    "inbound": ["jwt-auth-policy", "rate-limit-policy"]
  }
}
```

After the JWT authentication policy validates the token, it sets:

```ts
request.user = {
  sub: tokenClaims.sub,
  data: {
    ...tokenClaims,
    // Additional data from policy configuration
  },
};
```

## See Also

- [ZuploRequest](./zuplo-request.md) - The request object that contains user
  information
- [API Key Authentication](../policies/api-key-inbound.md) - Built-in API key
  authentication
- [JWT Authentication](../policies/open-id-jwt-auth-inbound.md) - JWT/OpenID
  authentication
