#!/bin/bash
# GitHub Authentication Setup Script
# Run this after creating your Personal Access Token

echo "Setting up GitHub authentication..."
echo "Please enter your GitHub Personal Access Token when prompted:"

read -s -p "GitHub Token: " GITHUB_TOKEN
echo

# Update remote URL with token authentication
git remote set-url origin https://wrenschlegel23:${GITHUB_TOKEN}@github.com/wrenschlegel23/claude-affiliate-automation.git

echo "Testing connection..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo "✅ Success! GitHub authentication configured and repository connected."
    echo "🔒 Your token is now saved securely for this project."
else
    echo "❌ Push failed. Please check your token and try again."
fi

# Clean up - remove this script for security
rm setup-auth.sh