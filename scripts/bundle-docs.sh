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

# 1. Copy markdown docs (preserve directory structure)
rsync -a --include='*/' --include='*.md' --include='*.mdx' --exclude='*' \
  "$PROJECT_DIR/docs/" "$STAGING_DIR/docs/"
# Remove empty directories left by the filter
find "$STAGING_DIR/docs" -type d -empty -delete 2>/dev/null || true

# 2. Copy OpenAPI spec
if [ -f "$PROJECT_DIR/api.json" ]; then
  cp "$PROJECT_DIR/api.json" "$STAGING_DIR/openapi.json"
else
  echo "Warning: api.json not found - run 'pnpm run api:get' first"
fi

# 3. Copy policies index
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

# 5. Create the zip
(cd "$STAGING_DIR" && zip -qr - .) > "$OUTPUT"

echo "Bundle created: $OUTPUT"
echo "Contents:"
unzip -l "$OUTPUT" | tail -1
