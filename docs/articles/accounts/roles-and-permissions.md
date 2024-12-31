---
title: Role Permissions
---

<EnterpriseFeature name="Role Based Access Control" />

:::info{title="Beta"}

The specific permissions of each role are currently in beta and may change
without notice.

:::

Accounts in Zuplo can have multiple members with different roles. Each account
member can be a role that defines the permissions they have in the account.

The following roles are available at the account level:

- **Admin**: Admins have full access to the account and can manage all aspects
  of the account, including billing, members, and roles. Admins can also access
  all projects and environments in the Account.
- **Developer**: Developers can create and manage projects and environments in
  the account. They also have wide access to resources such as tunnels, custom
  domains, API key buckets, etc. Developers can edit preview and development
  resources, but not production resources.
- **Member**: Members of an account don't have any account level or project
  level permissions. Members can be granted project level permissions by an
  admin.

Projects can have multiple members with different roles. Some account level
roles also grant access to project resources. Users can also be assigned project
level roles to grant them access to specific project resources.

The following roles are available at the project level:

- **Admin**: Admins have full access to the project and can manage all aspects
  of the project, including environment variables, secrets, and members.
- **Developer**: Developers have access to all preview and development resources
  in a project. They can't modify production resources.
- **Member**: Members of a project can view resources in the project but can't
  modify them.

## Account Role Permissions

The following table outlines the permissions available to each account role.

| Resource       | Action          | Admin | Developer | Member |
| -------------- | --------------- | ----- | --------- | ------ |
| Account        | Edit            | ✅    | ❌        | ❌     |
|                | View            | ✅    | ✅        | ✅     |
| Projects       | Edit            | ✅    | ❌        | ❌     |
|                | View            | ✅    | ✅        | ❌     |
| Custom Domains | Edit            | ✅    | ❌        | ❌     |
|                | View            | ✅    | ✅        | ❌     |
| Tunnels        | Edit            | ✅    | ❌        | ❌     |
|                | View            | ✅    | ✅        | ❌     |
| Zuplo API Keys | Edit (All Keys) | ✅    | ❌        | ❌     |
|                | View (All Keys) | ✅    | ❌        | ❌     |
| Zuplo API Keys | Edit (Own Keys) | ✅    | ✅        | ❌     |
|                | View (Own Keys) | ✅    | ✅        | ❌     |
| Billing        | Manage          | ✅    | ❌        | ❌     |
| Usage          | View            | ✅    | ✅        | ❌     |
| Members        | Edit            | ✅    | ❌        | ❌     |
|                | View            | ✅    | ✅        | ❌     |

## Project Role Permissions

The following table outlines the permissions available to each project role.

| Resource              | Environment | Action | Admin | Developer | Member |
| --------------------- | ----------- | ------ | ----- | --------- | ------ |
| Project               |             | Edit   | ✅    | ❌        | ❌     |
|                       |             | View   | ✅    | ✅        | ✅     |
| Environment           | Production  | Edit   | ✅    | ❌        | ❌     |
|                       |             | View   | ✅    | ✅        | ✅     |
|                       |             | Deploy | ✅    | ❌        | ❌     |
|                       | Preview     | Edit   | ✅    | ✅        | ❌     |
|                       |             | View   | ✅    | ✅        | ✅     |
|                       |             | Deploy | ✅    | ✅        | ❌     |
|                       | Development | Edit   | ✅    | ✅        | ❌     |
|                       |             | View   | ✅    | ✅        | ✅     |
|                       |             | Deploy | ✅    | ✅        | ❌     |
| Environment Variables | Production  | Edit   | ✅    | ❌        | ❌     |
|                       |             | View   | ✅    | ✅        | ✅     |
|                       | Preview     | Edit   | ✅    | ✅        | ❌     |
|                       |             | View   | ✅    | ✅        | ✅     |
|                       | Development | Edit   | ✅    | ✅        | ❌     |
|                       |             | View   | ✅    | ✅        | ✅     |
| Source Control        | N/A         | Edit   | ✅    | ❌        | ❌     |
|                       |             | View   | ✅    | ✅        | ✅     |
| Members               | N/A         | Edit   | ✅    | ❌        | ❌     |
|                       |             | View   | ✅    | ✅        | ✅     |
| Custom Domains        | N/A         | Edit   | ✅    | ❌        | ❌     |
|                       |             | View   | ✅    | ✅        | ✅     |
| Logs                  | Production  | View   | ✅    | ✅        | ❌     |
|                       | Preview     | View   | ✅    | ✅        | ✅     |
|                       | Development | View   | ✅    | ✅        | ✅     |
| Builds                | Production  | View   | ✅    | ✅        | ✅     |
|                       | Preview     | View   | ✅    | ✅        | ✅     |
|                       | Development | View   | ✅    | ✅        | ✅     |
| Analytics             | Production  | View   | ✅    | ✅        | ✅     |
|                       | Preview     | View   | ✅    | ✅        | ✅     |
|                       | Development | View   | ✅    | ✅        | ✅     |
| API Key Buckets       | Production  | Edit   | ✅    | ❌        | ❌     |
|                       |             | View   | ✅    | ✅        | ✅     |
|                       | Preview     | Edit   | ✅    | ✅        | ❌     |
|                       |             | View   | ✅    | ✅        | ✅     |
|                       | Development | Edit   | ✅    | ❌        | ❌     |
|                       |             | View   | ✅    | ✅        | ✅     |
| Monetization Buckets  | Production  | Edit   | ✅    | ❌        | ❌     |
|                       |             | View   | ✅    | ✅        | ✅     |
|                       | Preview     | Edit   | ✅    | ✅        | ❌     |
|                       |             | View   | ✅    | ✅        | ✅     |
|                       | Development | Edit   | ✅    | ❌        | ❌     |
|                       |             | View   | ✅    | ✅        | ✅     |
