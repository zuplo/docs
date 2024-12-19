#!/bin/bash

# Exit immediately if any command fails
set -e

# Variables
ASSET_URL="https://cdn.zudoku.dev/release/docs.zip"
DOWNLOAD_DIR="/tmp/zudoku_download"
DEST_DIR="docs/dev-portal/zudoku"

# Remove existing directories
rm -rf "$DOWNLOAD_DIR"
rm -rf "$DEST_DIR"

# Create download directory
mkdir -p "$DOWNLOAD_DIR"

# Download the latest zip release
ZIP_FILE="$DOWNLOAD_DIR/zudoku_docs.zip"
echo "Downloading the latest release..."
curl -L -o "$ZIP_FILE" "$ASSET_URL"

# Extract the zip file
echo "Extracting the contents..."
unzip -q "$ZIP_FILE" -d "$DOWNLOAD_DIR/extracted"

# Find the docs folder in the extracted contents
EXTRACTED_DIR=$(find "$DOWNLOAD_DIR/extracted" -mindepth 1 -maxdepth 1 -type d | head -n 1)

echo $EXTRACTED_DIR

if [ -d "$EXTRACTED_DIR/pages" ]; then
    echo "Copying 'pages' folder to $DEST_DIR..."
    mkdir -p "$DEST_DIR"
    cp -r "$EXTRACTED_DIR/pages"/* "$DEST_DIR"
else
    echo "'pages' folder not found in the extracted contents."
    exit 1
fi

# Clean up
echo "Cleaning up..."
rm -rf "$DOWNLOAD_DIR"

# Delete Docs we dont want
rm -rf "$DEST_DIR/deploy"
rm -rf "$DEST_DIR/deployment.md"
rm -rf "$DEST_DIR/introduction.md"
rm -rf "$DEST_DIR/app-quickstart.md"
rm -rf "$DEST_DIR/html-quickstart.md"

npx tsx ./scripts/update-zudoku-docs.mts

echo "Update complete! The 'docs' folder has been updated."
