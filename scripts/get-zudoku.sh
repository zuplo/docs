#!/bin/bash

# Exit immediately if any command fails
set -e

# Variables
ASSET_URL="https://github.com/zuplo/zudoku/archive/refs/heads/main.tar.gz"
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

# Download the latest tar.gz release
TAR_FILE="$DOWNLOAD_DIR/zudoku_docs.tar.gz"
log "Downloading the latest release..."
curl -L -o "$TAR_FILE" "$ASSET_URL"

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

if [ -d "$EXTRACTED_DIR/docs/pages" ]; then
    log "Copying 'pages' folder to $DEST_DIR..."
    mkdir -p "$DEST_DIR"
    cp -r "$EXTRACTED_DIR/docs/pages/"* "$DEST_DIR"
else
    log "Error: 'pages' folder not found in the extracted contents."
    exit 1
fi

# npx tsx ./scripts/update-zudoku-sidebar.mts

# Clean up
log "Cleaning up temporary files..."
rm -rf "$DOWNLOAD_DIR"

# Delete unwanted docs
log "Deleting unwanted docs..."
rm -rf "$DEST_DIR/deploy"
rm -f "$DEST_DIR/deployment.md"
rm -f "$DEST_DIR/introduction.md"
rm -f "$DEST_DIR/app-quickstart.md"
rm -f "$DEST_DIR/html-quickstart.md"

# Run the update script
log "Running the update script..."
npx tsx ./scripts/update-zudoku-docs.mts

log "Update complete! The 'docs' folder has been updated."
