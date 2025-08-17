#!/bin/bash

# Deploy to GitHub Pages script
# This script commits and pushes changes to GitHub for deployment

echo "🚀 Deploying Portfolio to GitHub Pages..."
echo ""

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository"
    echo "Please run 'git init' and set up your GitHub repository first"
    exit 1
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Found uncommitted changes. Adding files..."
    
    # Add all files except those in .gitignore
    git add .
    
    # Get commit message from user or use default
    if [ -n "$1" ]; then
        COMMIT_MSG="$1"
    else
        COMMIT_MSG="Update portfolio content and GitHub Pages compatibility"
    fi
    
    echo "💾 Committing changes..."
    git commit -m "$COMMIT_MSG

🔧 GitHub Pages Compatibility Updates:
- Added JavaScript-embedded configuration
- Fixed navigation for GitHub Pages deployment
- Updated Jekyll configuration
- Enhanced fallback loading system

🎯 Generated with Claude Code
https://claude.ai/code"
    
else
    echo "✅ No uncommitted changes found"
fi

# Check if remote origin exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ Error: No remote repository configured"
    echo "Please add your GitHub repository as origin:"
    echo "git remote add origin https://github.com/USERNAME/REPOSITORY-NAME.git"
    exit 1
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully deployed to GitHub!"
    echo ""
    echo "🌐 Your site will be available at:"
    echo "   https://USERNAME.github.io/REPOSITORY-NAME"
    echo ""
    echo "⏳ Deployment usually takes 1-5 minutes"
    echo "💡 Check GitHub Actions tab for build status"
    echo ""
    echo "🔍 To enable GitHub Pages (if not already enabled):"
    echo "   1. Go to repository Settings"
    echo "   2. Scroll to Pages section" 
    echo "   3. Select 'Deploy from a branch'"
    echo "   4. Choose 'main' branch and '/ (root)'"
    echo "   5. Click Save"
else
    echo ""
    echo "❌ Push failed. Please check:"
    echo "   - Internet connection"
    echo "   - GitHub authentication"
    echo "   - Repository permissions"
fi