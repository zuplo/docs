# Portal Shortcut Links Reference

When docs instruct readers to navigate to a page in the Zuplo Portal, link
directly using the `/+/` shortcut URL format. These URLs auto-resolve to the
reader's active account or project — no need to know their slugs.

## URL formats

- **Account-level:** `https://portal.zuplo.com/+/account/{path}` resolves to
  `/accounts/{their-account}/{path}`
- **Project-level:** `https://portal.zuplo.com/+/account/project/{path}`
  resolves to `/{their-account}/{their-project}/{path}`

The reader's active project comes from their MRU (most-recently-used)
account+project. If they have no MRU project for the active account, the project
shortcut falls back to the projects list.

## Available account-level paths

| Shortcut path                          | Page                     |
| -------------------------------------- | ------------------------ |
| `/+/account/`                          | Account home (projects)  |
| `/+/account/settings/general`          | Account general settings |
| `/+/account/settings/members`          | Members                  |
| `/+/account/settings/security`         | Security (SSO/SAML)      |
| `/+/account/settings/audit-logs`       | Audit logs               |
| `/+/account/settings/compliance-trust` | Compliance & Trust       |
| `/+/account/settings/upgrade-billing`  | Billing & plan           |
| `/+/account/settings/support`          | Support                  |
| `/+/account/settings/api-keys`         | Zuplo API keys list      |
| `/+/account/settings/api-keys/create`  | Create API key           |
| `/+/account/settings/custom-domains`   | Custom domains           |
| `/+/account/settings/feature-previews` | Feature previews         |
| `/+/account/usage`                     | Usage                    |
| `/+/account/analytics`                 | Account-level analytics  |
| `/+/account/projects/new`              | New project              |
| `/+/account/projects/import`           | Import project           |

## Available project-level paths

### General

| Shortcut path                         | Page                    |
| ------------------------------------- | ----------------------- |
| `/+/account/project/`                 | Project overview        |
| `/+/account/project/services`         | Services (buckets list) |
| `/+/account/project/environments`     | Environments            |
| `/+/account/project/analytics`        | Project analytics       |
| `/+/account/project/settings/general` | Project settings        |

### AI Gateway

| Shortcut path                                 | Page                  |
| --------------------------------------------- | --------------------- |
| `/+/account/project/ai/analytics`             | AI Gateway Analytics  |
| `/+/account/project/ai/logs`                  | AI Gateway Logs       |
| `/+/account/project/ai/teams`                 | AI Gateway Teams      |
| `/+/account/project/ai/apps`                  | AI Gateway Apps       |
| `/+/account/project/ai/apps/new`              | Create app            |
| `/+/account/project/ai/settings/general`      | AI Gateway settings   |
| `/+/account/project/ai/settings/members`      | AI Gateway members    |
| `/+/account/project/ai/settings/data-models`  | AI providers / models |
| `/+/account/project/ai/settings/usage-limits` | Usage limits          |

### MCP

| Shortcut path                             | Page         |
| ----------------------------------------- | ------------ |
| `/+/account/project/mcp/catalog`          | MCP catalog  |
| `/+/account/project/mcp/origin-mcp`       | Origin MCP   |
| `/+/account/project/mcp/virtual-mcp`      | Virtual MCP  |
| `/+/account/project/mcp/teams`            | MCP teams    |
| `/+/account/project/mcp/settings/general` | MCP settings |
| `/+/account/project/mcp/settings/members` | MCP members  |

## Writing rules

### 1. Always keep the navigation breadcrumb in prose

A reader who can't or doesn't click the link should still know where to go in
the UI. The link text or surrounding sentence must describe the location.

**Bad** (link works, but prose alone doesn't tell the reader where to go):

```md
Open
[Custom Domains](https://portal.zuplo.com/+/account/settings/custom-domains) in
the Zuplo Portal.
```

**Good** (breadcrumb is the link text):

```md
Open
[**Account Settings → Custom Domains**](https://portal.zuplo.com/+/account/settings/custom-domains)
in the Zuplo Portal.
```

**Good** (breadcrumb in surrounding prose):

```md
Open
[Custom Domains](https://portal.zuplo.com/+/account/settings/custom-domains)
under **Account Settings**.
```

**Good** (clarifies position in nav hierarchy):

```md
Open the [**Apps**](https://portal.zuplo.com/+/account/project/ai/apps) tab of
your AI Gateway project.
```

### 2. Don't deep-link past pages that require slugs

Specific environments, builds, buckets, apps, teams, etc. all require an ID in
the URL. The shortcut format can't resolve those for the reader. Link to the
parent list instead and let them click through.

**Wrong** — there's no shortcut that auto-resolves a specific bucket:

```md
Open your
[API key bucket](https://portal.zuplo.com/+/account/project/services/keys/abc123).
```

**Right** — link to the Services list:

```md
In your project's
[**Services**](https://portal.zuplo.com/+/account/project/services) tab, open
your API key bucket.
```

### 3. Use shortcut links only when prose directs the reader to a specific page

Don't link generic mentions of "the Zuplo Portal" or "sign in" if no specific
destination is implied.

**Don't link this** — no specific destination:

```md
Sign in to [the Zuplo Portal](https://portal.zuplo.com/+/account/) and follow
the wizard.
```

Just write `Sign in to the [Zuplo Portal](https://portal.zuplo.com).`

### 4. Don't invent paths

Only use paths that exist in this reference. If the destination isn't listed,
either the route doesn't exist as a shortcut, or it requires a slug — don't make
one up.

### 5. Keep one breadcrumb per link

If the same destination is mentioned multiple times in close proximity, only the
first reference needs a full breadcrumb. Subsequent mentions can use a short
label.

## How the shortcut feature works

The portal route `/+/account/{rest}` redirects to the user's active account.
Active-account selection mirrors the home page: MRU account → first
non-`FREE_V1` account → first account.

The route `/+/account/project/{rest}` reads the user's MRU project for the
active account from `localStorage.mru`. If no MRU project is stored, the
shortcut falls back to `/accounts/{account}/projects` so the user picks a
project, then subsequent shortcut hits work directly.

Search and hash are preserved through every redirect. Logged-out visits go
through Auth0 and resume the shortcut after sign-in.

Source: [zuplo/portal#4740](https://github.com/zuplo/portal/pull/4740).
