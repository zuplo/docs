---
title: "Native GitOps: Better Than Terraform"
sidebar_label: "GitOps vs Terraform"
---

Unlike legacy API management solutions that rely on imperative APIs and require
tools like Terraform for infrastructure as code, Zuplo takes a fundamentally
different approach. Zuplo was built from day one with GitOps at its core, making
Terraform unnecessary and redundant.

## Configuration as Code by Design

Traditional API management products like Kong, Azure API Management, and others
were designed with imperative APIs as their primary interface. These systems
require you to:

- Make API calls to create resources
- Maintain state files to track what exists
- Use tools like Terraform to bridge the gap between code and infrastructure
- Handle complex state reconciliation and drift detection

Zuplo eliminates this complexity entirely. Every aspect of your API gateway
configuration is stored as human-readable code and configuration files in your
repository:

- **Routes** are defined in `config/routes.oas.json`
- **Policies** are configured declaratively
- **Custom code** lives alongside your configuration

## True Atomic Deployments

When you deploy with Zuplo—whether through `zuplo deploy` or our source control
integrations—you get true atomic deployments:

:::tip

Every deployment either succeeds completely or fails entirely. There are no
partial states, no drift, and no manual cleanup required.

:::

This atomic deployment model means:

- **No half-deployed states**: Your API gateway is always in a known, consistent
  state
- **Simple rollbacks**: Just revert your Git commit and redeploy
- **No state management**: Git is your single source of truth
- **No reconciliation**: What's in your repository is what's deployed

## Version Control Built In

Since all configuration is code, you automatically get:

- **Full version history** through Git
- **Code review workflows** through pull requests
- **Branching strategies** that match your development process
- **Audit trails** of who changed what and when
- **Easy rollbacks** by reverting commits

## Why Terraform Would Add Complexity

If Zuplo offered a Terraform provider, it would simply be a wrapper around our
existing GitOps functionality. This would:

- Add an unnecessary abstraction layer
- Introduce state management complexity
- Create potential for drift between Terraform state and actual configuration
- Require learning and maintaining additional tooling
- Provide no additional capabilities beyond what Zuplo already offers

## The GitOps Advantage

Zuplo's native GitOps approach provides significant advantages:

1. **Simplicity**: One system to learn, not two
2. **Reliability**: No state file corruption or drift issues
3. **Speed**: Direct deployments without intermediate tooling
4. **Transparency**: Configuration is exactly what you see in your repository
5. **Integration**: Works seamlessly with your existing Git workflows

## Getting Started with Zuplo's GitOps

To experience the simplicity of Zuplo's GitOps approach:

1. Create a new Zuplo project
2. Clone the repository
3. Make changes to your configuration files
4. Commit and push to deploy

```bash
# Clone your Zuplo project
git clone https://github.com/your-org/your-zuplo-project.git

# Make changes to your API configuration
# Edit config/routes.oas.json, add policies, etc.

# Deploy your changes
git add .
git commit -m "Add rate limiting policy"
git push origin main
```

Your changes deploy automatically through our GitHub integration, or you can use
`zuplo deploy` for manual deployments.

## Conclusion

Zuplo's native GitOps approach represents a fundamental advancement over legacy
API management solutions. By eliminating the need for imperative APIs and
external infrastructure-as-code tools, Zuplo provides a simpler, more reliable,
and more developer-friendly experience. Terraform isn't missing from Zuplo—it's
simply not needed.
