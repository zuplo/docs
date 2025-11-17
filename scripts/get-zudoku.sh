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

# Get the main branch tarball URL
MAIN_BRANCH_URL="https://api.github.com/repos/zuplo/zudoku/tarball/main"
log "Main branch URL: $MAIN_BRANCH_URL"

# Download the main branch tar.gz
TAR_FILE="$DOWNLOAD_DIR/zudoku_docs.tar.gz"
log "Downloading from main branch..."
if [ -n "$GITHUB_NPM_TOKEN" ]; then
    log "Using GITHUB_NPM_TOKEN for authentication..."
    curl -L -H "Authorization: token $GITHUB_NPM_TOKEN" -o "$TAR_FILE" "$MAIN_BRANCH_URL"
else
    curl -L -o "$TAR_FILE" "$MAIN_BRANCH_URL"
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
