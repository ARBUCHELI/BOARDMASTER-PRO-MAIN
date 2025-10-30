#!/usr/bin/env bash
# Build script for Render frontend deployment

set -o errexit

# Install dependencies
npm install

# Build the frontend
npm run build
