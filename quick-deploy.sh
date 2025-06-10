#!/bin/bash

# Quick deploy script for ghost-automation-dashboard-two
# Stages, commits, pushes, and deploys to Cloudflare Pages

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[$(date +%H:%M:%S)]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Start timer
START_TIME=$(date +%s)

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "Not in a git repository"
    exit 1
fi

# Stage all changes
print_status "Staging changes..."
git add -A

# Check if there are changes to commit
if git diff --staged --quiet; then
    print_warning "No changes to commit"
    exit 0
fi

# Create timestamp for commit message
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
COMMIT_MSG="Deploy: $TIMESTAMP"

# Commit changes
print_status "Committing changes..."
git commit -m "$COMMIT_MSG" --quiet

# Push to GitHub
print_status "Pushing to GitHub..."
git push origin main --quiet

# Build the project
print_status "Building project..."
npm run build > /dev/null 2>&1

# Deploy to Cloudflare Pages
print_status "Deploying to Cloudflare Pages..."
if command -v wrangler &> /dev/null; then
    # Using Wrangler CLI if available
    wrangler pages deploy ./out --project-name=ghost-automation-dashboard > /dev/null 2>&1
else
    print_warning "Wrangler CLI not found. Please install it with: npm install -g wrangler"
    print_warning "Manual deployment required via Cloudflare dashboard"
fi

# Calculate elapsed time
END_TIME=$(date +%s)
ELAPSED=$((END_TIME - START_TIME))

print_status "✅ Deployment complete in ${ELAPSED} seconds!"
print_status "Commit: $COMMIT_MSG"