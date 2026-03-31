#!/bin/bash
set -euo pipefail

# Bundle docs content into a zip for distribution in the zuplo npm module.
# Usage: ./scripts/bundle-docs.sh [output-path]
#   output-path: defaults to docs-bundle.zip

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
OUTPUT="${1:-docs-bundle.zip}"
STAGING_DIR="$(mktemp -d)"

trap 'rm -rf "$STAGING_DIR"' EXIT

echo "Staging docs bundle..."

# 1. Copy markdown docs at root (no docs/ wrapper to avoid docs/docs/ nesting in npm).
#    Exclude docs/policies/ since those are generated MDX duplicating the raw policy sources.
rsync -a --exclude='/policies/' --include='*/' --include='*.md' --include='*.mdx' --exclude='*' \
  "$PROJECT_DIR/docs/" "$STAGING_DIR/"
# Remove empty directories left by the filter
find "$STAGING_DIR" -type d -empty -delete 2>/dev/null || true

# 2. Copy policies index
if [ -f "$PROJECT_DIR/generated/policies-index.md" ]; then
  mkdir -p "$STAGING_DIR/policies"
  cp "$PROJECT_DIR/generated/policies-index.md" "$STAGING_DIR/policies/_index.md"
else
  echo "Warning: generated/policies-index.md not found - run 'pnpm run policies:generate' first"
fi

# 4. Copy per-policy source files (schema.json, intro.md, doc.md) from temp/ and policies/
#    temp/ contains policies fetched from the runtime; policies/ has repo-local overrides.
for src_dir in "$PROJECT_DIR/temp" "$PROJECT_DIR/policies"; do
  [ -d "$src_dir" ] || continue
  for policy_dir in "$src_dir"/*/; do
    [ -d "$policy_dir" ] || continue
    policy_id="$(basename "$policy_dir")"
    dest="$STAGING_DIR/policies/$policy_id"
    mkdir -p "$dest"
    for f in schema.json intro.md doc.md policy.ts; do
      [ -f "$policy_dir/$f" ] && cp "$policy_dir/$f" "$dest/$f"
    done
  done
done

# 5. Generate root _index.md as an entry point for agents
cat > "$STAGING_DIR/_index.md" << 'INDEXEOF'
# Zuplo Documentation

This bundle contains the Zuplo documentation for use by AI agents.

## Contents

- `policies/` - Zuplo policy reference
  - `_index.md` - Policy catalog with names and descriptions
  - `{policy-id}/schema.json` - Policy configuration schema (handler export, module, options)
  - `{policy-id}/intro.md` - Short policy description
  - `{policy-id}/doc.md` - Full usage documentation with examples
- `articles/` - General documentation and how-to guides
- `ai-gateway/` - AI Gateway documentation
- `cli/` - Zuplo CLI reference
- `handlers/` - Request handler documentation
- `programmable-api/` - Programmable API reference (ZuploRequest, ZuploContext, etc.)
- `guides/` - Step-by-step tutorials
- `dev-portal/` - Developer Portal documentation
- `errors/` - Error reference pages
- `concepts/` - Core concepts
- `dedicated/` - Dedicated infrastructure documentation
- `mcp-server/` - MCP Server documentation

## Configuring Policies

To configure a Zuplo policy:

1. Read `policies/_index.md` to find the right policy
2. Read the policy's `schema.json` for the handler export, module, and options schema
3. Read the policy's `doc.md` for usage details and examples

Each policy is configured in `config/policies.json` with this structure:

```json
{
  "name": "my-policy",
  "policyType": "<policy-id>",
  "handler": {
    "export": "<from schema.json>",
    "module": "<from schema.json>",
    "options": {}
  }
}
```
INDEXEOF

# 6. Create the zip
(cd "$STAGING_DIR" && zip -qr - .) > "$OUTPUT"

echo "Bundle created: $OUTPUT"
echo "Contents:"
unzip -l "$OUTPUT" | tail -1
