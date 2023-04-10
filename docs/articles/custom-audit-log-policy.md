---
title: Custom Audit Logging Policy
sidebar_label: Audit Logging
---

Audit logging is an important part of API security that plays a critical role in detecting and correcting issues such as unauthorized access or permission elevations within your system. Audit logging is also a requirement for many compliance certifications as well as part of the buying criteria for larger enterprises.

Adding Audit Logging to your APIs that are secured with Zuplo is as easy as adding a custom policy. Typically you want to add audit logs to any API that modifies data, however depending on the API you may want it on read operations as well (i.e. retrieve a secret key, etc.)

## Example Policy: WorkOS Audit Logs

WorkOS provides various services that help enable enterprise features on your service such as SSO and Audit Logs. With Zuplo it is easy to create a [custom policy](/docs/policies/custom-code-inbound) that uses [runtime hooks](./runtime-extensions.md) to log API calls using their API.

```ts
import { ZuploContext, ZuploRequest, environment } from "@zuplo/runtime";

export async function auditLogPlugin(
  request: ZuploRequest,
  context: ZuploContext,
  policyName: string
) {
  // Clone the request so the body can be read in the hook
  // note: remove this is you don't need content from the body
  const cloned = request.clone();
  context.addResponseSendingFinalHook(async (response) => {
    const incomingBody = await cloned.json();
    // This is an example event. Extract any additional data needed from the
    // request.
    const body = {
      organization_id: "org_01EHWNCE74X7JSDV0X3SZ3KJNY",
      event: {
        action: "user.signed_in",
        occurred_at: "2022-09-02T16:35:39.317Z",
        version: 1,
        actor: {
          type: "user",
          // Add the use the user sub for authenticated users
          id: request.user.sub,
          metadata: {
            role: "user",
          },
        },
        targets: [
          {
            type: "user",
            id: "user_98432YHF",
            name: "Jon Smith",
          },
          {
            type: "team",
            id: "team_J8YASKA2",
            metadata: {
              owner: "user_01GBTCQ2",
            },
          },
        ],
        context: {
          location: request.headers.get("True-Client-IP"),
          user_agent: request.headers.get("User-Agent"),
        },
        metadata: {
          extra: incomingBody.extra,
        },
      },
    };
    await fetch("https://api.workos.com/audit_logs/events", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${environment.WORKOS_API_KEY}`,
        "Content-Type": "application/json",
        // Optional idempotency key.
        // See: https://workos.com/docs/reference/idempotency
        // "Idempotency-Key": "YOUR_KEY_HERE"
      },
    });
  });

  return request;
}
```
