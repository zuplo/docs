---
title: Manual OAuth MCP Testing
---

MCP client OAuth support is evolving rapidly and many clients don't yet support
the full flow for dynamic client registration, PKCE, initial tokens during DCR,
etc.

This guide shows you how you can use common tools like `curl` and `openssl` to
manually test a configured authorization server and MCP server.

## Existing auth server client ID and secret

The following guide walks you through manually testing an OAuth provider with a
client ID and secret configuration. This is also useful for debugging OAuth
issues during authorization flows for MCP.

### Prerequisites

- `curl`, `jq`, and `openssl` installed on your system
- An OAuth client ID and client Secret. For the purposes of demonstration, this
  guide uses an Okta Application client ID and secret.

### Testing Script

Create a test script to verify your complete OAuth flow:

```bash
#!/bin/bash

# OAuth 2.1 flow test Script for MCP with pre-configured client.
# Based on MCP Authorization specification:
# https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization

set -e

# !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
# !!!!!!! Configuration !!!!!!!!
#
# Update these values to your MCP server hosted on Zuplo and your auth provider
# config values.

MCP_ENDPOINT="https://your-gateway.zuplo.dev/mcp"
CLIENT_ID="your-client-id"
CLIENT_SECRET="your-client-secret"
REDIRECT_URI="http://localhost:8080/authorization-code/callback"
SCOPE="mcp:access"

# !!!!! Configuration end !!!!!!
# !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

# Colors for pretty output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}=== MCP OAuth 2.1 Testing ===${NC}"

# Step 1: Discover OAuth configuration from MCP endpoint
echo -e "${BLUE}Step 1: Discovering OAuth configuration...${NC}"
MCP_RESPONSE=$(curl -s -i -X POST "${MCP_ENDPOINT}" \
  -H 'content-type: application/json' \
  -d '{"jsonrpc": "2.0", "id": "1", "method": "ping"}')

# Extract resource metadata URL
RESOURCE_METADATA_URL=$(echo "${MCP_RESPONSE}" | grep -i "resource_metadata=" | \
  sed 's/.*resource_metadata=\([^[:space:]]*\).*/\1/' | tr -d '\r\n')

echo "Resource metadata URL: ${RESOURCE_METADATA_URL}"

# Step 2: Get authorization server info
RESOURCE_METADATA=$(curl -s "${RESOURCE_METADATA_URL}")
AUTH_SERVER_URL=$(echo "${RESOURCE_METADATA}" | jq -r '.authorization_servers[0]')

echo "Authorization Server: ${AUTH_SERVER_URL}"

# Step 3: Get OAuth endpoints
OAUTH_METADATA=$(curl -s "${AUTH_SERVER_URL}/.well-known/oauth-authorization-server")
AUTH_ENDPOINT=$(echo "${OAUTH_METADATA}" | jq -r '.authorization_endpoint')
TOKEN_ENDPOINT=$(echo "${OAUTH_METADATA}" | jq -r '.token_endpoint')

# Step 4: Generate PKCE parameters
CODE_VERIFIER=$(openssl rand -base64 32 | tr '/+' '_-' | tr -d '=')
CODE_CHALLENGE=$(echo -n "$CODE_VERIFIER" | openssl dgst -sha256 -binary | openssl base64 | tr '/+' '_-' | tr -d '=')
STATE=$(openssl rand -hex 16)

# Step 5: Build authorization URL
AUTH_URL="${AUTH_ENDPOINT}?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}&state=${STATE}&code_challenge=${CODE_CHALLENGE}&code_challenge_method=S256"

echo -e "${YELLOW}Open this URL in your browser:${NC}"
echo "${AUTH_URL}"
echo
echo -e "${YELLOW}After login, copy the authorization code from the callback URL${NC}"
read -p "Enter the authorization code: " AUTH_CODE

# Step 6: Exchange code for token
TOKEN_RESPONSE=$(curl -s -X POST "${TOKEN_ENDPOINT}" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -u "${CLIENT_ID}:${CLIENT_SECRET}" \
  -d "grant_type=authorization_code&code=${AUTH_CODE}&redirect_uri=${REDIRECT_URI}&code_verifier=${CODE_VERIFIER}")

ACCESS_TOKEN=$(echo "${TOKEN_RESPONSE}" | jq -r '.access_token')

if [[ "$ACCESS_TOKEN" == "null" ]]; then
    echo -e "${RED}Token exchange failed:${NC}"
    echo "${TOKEN_RESPONSE}" | jq .
    exit 1
fi

echo -e "${GREEN}✓ Access token obtained${NC}"

# Step 7: Test MCP endpoint with token
MCP_AUTH_RESPONSE=$(curl -s -X POST "${MCP_ENDPOINT}" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc": "2.0", "id": "1", "method": "ping"}')

echo -e "${GREEN}✓ MCP ping test:${NC}"
echo "${MCP_AUTH_RESPONSE}" | jq .

echo -e "${GREEN}=== OAuth flow test complete ===${NC}"
```

### Running the Test

1. **Update the configuration** at the top of the script with your values:
   - `MCP_ENDPOINT`: Your Zuplo gateway MCP endpoint
   - `CLIENT_ID`: The ID of the client or application for the auth server
   - `CLIENT_SECRET`: The secret for the client or application for the auth
     server
   - `REDIRECT_URI`: Typically, must match exactly what's configured in your
     auth server's redirect

2. **Make the script executable**: `chmod +x test-oauth.sh`

3. **Run the script**: `./test-oauth.sh`

4. **Follow the prompts**:
   - Open the authorization URL in your browser from the terminal output
   - Complete the login flow
   - Copy the authorization code from the callback URL. It will look something
     like:

   ```
   http://localhost:8080/authorization-code/callback?code=ABC123&state=XYZ987
   ```

   - Paste just the code part into the script

   :::warning

   This script does **not** include a web server and does **not** support
   dynamically extracting the authorization callback code. You must manually
   grab the code from the query parameter and enter it into the terminal prompt.

   :::

### Common Issues and Troubleshooting

**"Policy evaluation failed"**: Check that your client has:

- Correct redirect URI configured
- Correct scope assigned and configured
- Authorization code grant enabled
- Proper access policies and rules

**"Invalid client" errors**: Verify your Client ID and Client Secret are
correct.

**"Invalid redirect URI"**: The redirect URI configured in the script may need
to exactly match what's configured in your authorization server and client.

**Browser redirects immediately without login**: You may already be logged into
your auth provider or an existing session exists. To log in from a clean state,
try the following:

- Log out from your authorization provider
- Clear browser cookies, sessions, and caches
- Using an incognito/private browser window

**Token exchange fails**: Check that:

- PKCE is enabled for your client
- The authorization code hasn't expired (use it immediately)
