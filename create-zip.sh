#!/bin/bash

# ChamaPay - Create ZIP Archive Script
# This script creates a zip file of all project files

echo "Creating ChamaPay ZIP archive..."

# Create a temporary directory for clean packaging
TEMP_DIR="chamapay-package"
mkdir -p "$TEMP_DIR"

# Copy all necessary files
cp -r src "$TEMP_DIR/"
cp index.html "$TEMP_DIR/"
cp package.json "$TEMP_DIR/"
cp tsconfig.json "$TEMP_DIR/"
cp vite.config.js "$TEMP_DIR/"
cp README.md "$TEMP_DIR/"
cp LICENSE "$TEMP_DIR/"
cp .gitignore "$TEMP_DIR/"
cp GITHUB_UPLOAD.md "$TEMP_DIR/"
cp UPLOAD_SUMMARY.md "$TEMP_DIR/"

# Create the zip file
zip -r chamapay.zip "$TEMP_DIR"

# Clean up temporary directory
rm -rf "$TEMP_DIR"

echo "✅ Successfully created chamapay.zip"
echo "📦 Archive contains all source files, documentation, and configuration"
echo ""
echo "To use:"
echo "1. Extract: unzip chamapay.zip"
echo "2. Install: cd chamapay-package && npm install"
echo "3. Run: npm run dev"
