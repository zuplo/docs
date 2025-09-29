#!/bin/bash

# Exit immediately if any command fails
set -e

# Variables
DOWNLOAD_DIR="/tmp/zudoku_download"
DEST_DIR="docs/dev-portal/zudoku"

# Function to log messages
log() {
    echo "[INFO] $1"
}

# Remove existing directories
log "Removing existing directories..."
rm -rf "$DOWNLOAD_DIR" "$DEST_DIR"

# Create download directory
log "Creating download directory..."
mkdir -p "$DOWNLOAD_DIR"

# Get the latest release tarball URL from GitHub API
log "Fetching latest release information..."
if [ -n "$GITHUB_NPM_TOKEN" ]; then
    log "Using GITHUB_NPM_TOKEN for authentication..."
    LATEST_RELEASE_URL=$(curl -s -H "Authorization: Bearer $GITHUB_NPM_TOKEN" https://api.github.com/repos/zuplo/zudoku/releases/latest | grep -o '"tarball_url": "[^"]*"' | cut -d'"' -f4)
else
    LATEST_RELEASE_URL=$(curl -s https://api.github.com/repos/zuplo/zudoku/releases/latest | grep -o '"tarball_url": "[^"]*"' | cut -d'"' -f4)
fi

if [ -z "$LATEST_RELEASE_URL" ]; then
    log "Error: Unable to fetch latest release URL."
    exit 1
fi

log "Latest release URL: $LATEST_RELEASE_URL"

# Download the latest tar.gz release
TAR_FILE="$DOWNLOAD_DIR/zudoku_docs.tar.gz"
log "Downloading the latest release..."
if [ -n "$GITHUB_NPM_TOKEN" ]; then
    curl -L -H "Authorization: token $GITHUB_NPM_TOKEN" -o "$TAR_FILE" "$LATEST_RELEASE_URL"
else
    curl -L -o "$TAR_FILE" "$LATEST_RELEASE_URL"
fi

# Extract the tar.gz file
log "Extracting the contents..."
mkdir -p "$DOWNLOAD_DIR/extracted"
tar -xzf "$TAR_FILE" -C "$DOWNLOAD_DIR/extracted"

# Find the docs folder in the extracted contents
export EXTRACTED_DIR=$(find "$DOWNLOAD_DIR/extracted" -mindepth 1 -maxdepth 1 -type d | head -n 1)

if [ -z "$EXTRACTED_DIR" ]; then
    log "Error: Unable to find extracted directory."
    exit 1
fi

log "Extracted directory: $EXTRACTED_DIR"

if [ -d "$EXTRACTED_DIR/docs/pages/docs" ]; then
    log "Copying 'pages' folder to $DEST_DIR..."
    mkdir -p "$DEST_DIR"
    cp -r "$EXTRACTED_DIR/docs/pages/docs/"* "$DEST_DIR"
else
    log "Error: 'pages' folder not found in the extracted contents."
    exit 1
fi

npx tsx ./scripts/update-zudoku-sidebar.mts

# Clean up
log "Cleaning up temporary files..."
rm -rf "$DOWNLOAD_DIR"

# Delete unwanted docs
log "Deleting unwanted docs..."
rm -rf "$DEST_DIR/deploy"
rm -f "$DEST_DIR/deployment.md"
rm -f "$DEST_DIR/introduction.md"
rm -f "$DEST_DIR/quickstart.md"

# Run the update script
log "Running the update script..."
npx tsx ./scripts/update-zudoku-docs.mts

log "Update complete! The 'docs' folder has been updated."
