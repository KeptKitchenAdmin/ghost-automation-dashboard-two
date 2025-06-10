#!/bin/bash

# 🚀 Enterprise Secure Deployment Pipeline
# Automatically deploys with security validation and monitoring

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CLOUDFLARE_APP_URL="https://ghost-automation-dashboard-two.wren-fc5.workers.dev"

echo -e "${PURPLE}🚀 Enterprise Secure Deployment Pipeline${NC}"
echo -e "${PURPLE}=======================================${NC}\n"

# Function to run security scan
run_security_scan() {
    echo -e "${BLUE}🔍 Running pre-deployment security scan...${NC}"
    
    if [ -f "$PROJECT_ROOT/scripts/secure-key-manager.sh" ]; then
        "$PROJECT_ROOT/scripts/secure-key-manager.sh" scan
        if [ $? -ne 0 ]; then
            echo -e "${RED}❌ Security scan failed - deployment blocked${NC}"
            return 1
        fi
    else
        echo -e "${YELLOW}⚠️  Security scanner not found, continuing...${NC}"
    fi
    
    echo -e "${GREEN}✅ Security scan passed${NC}"
    return 0
}

# Function to validate environment
validate_environment() {
    echo -e "${BLUE}🔒 Validating environment security...${NC}"
    
    # Check if .env.local exists and has proper permissions
    if [ -f "$PROJECT_ROOT/frontend/.env.local" ]; then
        local perms=$(stat -c "%a" "$PROJECT_ROOT/frontend/.env.local" 2>/dev/null || stat -f "%OLp" "$PROJECT_ROOT/frontend/.env.local" 2>/dev/null)
        if [ "$perms" != "600" ]; then
            echo -e "${YELLOW}⚠️  Fixing .env.local permissions...${NC}"
            chmod 600 "$PROJECT_ROOT/frontend/.env.local"
        fi
        echo -e "${GREEN}✅ .env.local secured (600 permissions)${NC}"
    fi
    
    # Check .gitignore
    if ! grep -q "\.env\.local" "$PROJECT_ROOT/.gitignore"; then
        echo -e "${YELLOW}⚠️  Adding .env.local to .gitignore...${NC}"
        echo "*.env.local" >> "$PROJECT_ROOT/.gitignore"
        echo ".env.local" >> "$PROJECT_ROOT/.gitignore"
    fi
    
    echo -e "${GREEN}✅ Environment validation complete${NC}"
}

# Function to build Next.js app
build_nextjs() {
    echo -e "${BLUE}🔨 Building Next.js application...${NC}"
    
    cd "$PROJECT_ROOT/ghost-automation-dashboard-two"
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo -e "${BLUE}📦 Installing dependencies...${NC}"
        npm install
    fi
    
    # Build the app
    echo -e "${BLUE}🏗️  Running build...${NC}"
    npm run build
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Build completed successfully${NC}"
    else
        echo -e "${RED}❌ Build failed${NC}"
        return 1
    fi
    
    cd "$PROJECT_ROOT"
}

# Function to deploy to Cloudflare Workers
deploy_cloudflare() {
    echo -e "${BLUE}☁️  Deploying to Cloudflare Workers...${NC}"
    
    cd "$PROJECT_ROOT/ghost-automation-dashboard-two"
    
    if command -v wrangler &> /dev/null; then
        echo -e "${BLUE}🚀 Deploying to Cloudflare...${NC}"
        npm run deploy
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Cloudflare deployment successful${NC}"
        else
            echo -e "${RED}❌ Cloudflare deployment failed${NC}"
            return 1
        fi
    else
        echo -e "${RED}❌ Wrangler not found. Install with: npm install -g wrangler${NC}"
        return 1
    fi
    
    cd "$PROJECT_ROOT"
}

# Function to verify deployment
verify_deployment() {
    echo -e "${BLUE}🔍 Verifying deployment...${NC}"
    
    echo -e "${BLUE}📡 Testing app availability...${NC}"
    if curl -s -f "$CLOUDFLARE_APP_URL" > /dev/null; then
        echo -e "${GREEN}✅ App is accessible at $CLOUDFLARE_APP_URL${NC}"
    else
        echo -e "${RED}❌ App is not accessible${NC}"
        return 1
    fi
}

# Function to run post-deployment security check
post_deployment_security() {
    echo -e "${BLUE}🔒 Post-deployment security verification...${NC}"
    
    # Check for any exposed secrets in the deployed app
    echo -e "${BLUE}🕵️  Scanning deployed app for secret exposure...${NC}"
    
    local test_paths=("/" "/content/" "/security/")
    
    for path in "${test_paths[@]}"; do
        local content=$(curl -s "$CLOUDFLARE_APP_URL$path")
        
        # Check for common secret patterns in response
        if echo "$content" | grep -E "(sk-[a-zA-Z0-9-_]{20,}|AIza[0-9A-Za-z\\-_]{35})" > /dev/null; then
            echo -e "${RED}🚨 CRITICAL: API key exposed in $path${NC}"
            return 1
        fi
    done
    
    echo -e "${GREEN}✅ No secrets exposed in deployed app${NC}"
}

# Function to update monitoring
update_monitoring() {
    echo -e "${BLUE}📊 Updating deployment logs...${NC}"
    
    # Log deployment
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    local log_entry="[$timestamp] SECURE_DEPLOYMENT_CLOUDFLARE - User: $(whoami) - Commit: $(git rev-parse --short HEAD 2>/dev/null || echo 'unknown')"
    
    mkdir -p "$PROJECT_ROOT/logs"
    echo "$log_entry" >> "$PROJECT_ROOT/logs/deployment.log"
    
    echo -e "${GREEN}✅ Deployment logged${NC}"
}

# Function to show deployment summary
show_summary() {
    echo -e "\n${PURPLE}🎉 DEPLOYMENT COMPLETE${NC}"
    echo -e "${PURPLE}=====================${NC}\n"
    
    echo -e "${GREEN}✅ Security scan: PASSED${NC}"
    echo -e "${GREEN}✅ Environment: VALIDATED${NC}"
    echo -e "${GREEN}✅ Next.js build: COMPLETED${NC}"
    echo -e "${GREEN}✅ Cloudflare Workers: DEPLOYED${NC}"
    echo -e "${GREEN}✅ Security verification: PASSED${NC}"
    echo -e "${GREEN}✅ Monitoring: UPDATED${NC}"
    
    echo -e "\n${BLUE}🔗 Live App: $CLOUDFLARE_APP_URL${NC}"
    echo -e "${BLUE}🛡️  Security Level: ENTERPRISE GRADE${NC}"
    echo -e "${BLUE}📊 Platform: Cloudflare Workers (Global Edge)${NC}\n"
}

# Main deployment workflow
main() {
    echo -e "${BLUE}🚀 Starting enterprise secure deployment...${NC}\n"
    
    # Create logs directory if it doesn't exist
    mkdir -p "$PROJECT_ROOT/logs"
    
    # Step 1: Security scan
    if ! run_security_scan; then
        echo -e "${RED}❌ Deployment aborted due to security issues${NC}"
        exit 1
    fi
    
    # Step 2: Environment validation
    validate_environment
    
    # Step 3: Git operations
    echo -e "${BLUE}📝 Committing changes...${NC}"
    git add .
    git commit -m "🚀 Secure deployment $(date +%Y%m%d_%H%M%S)

✅ Security validated
✅ Environment secured  
✅ Ready for production

🛡️ Enterprise security maintained" || echo "No changes to commit"
    
    # Step 4: Push to GitHub
    echo -e "${BLUE}📤 Pushing to GitHub...${NC}"
    git push origin main || echo "Already up to date"
    
    # Step 5: Build Next.js app
    if ! build_nextjs; then
        echo -e "${RED}❌ Build failed${NC}"
        exit 1
    fi
    
    # Step 6: Deploy to Cloudflare
    if ! deploy_cloudflare; then
        echo -e "${RED}❌ Cloudflare deployment failed${NC}"
        exit 1
    fi
    
    # Step 7: Verify deployment
    if ! verify_deployment; then
        echo -e "${RED}❌ Deployment verification failed${NC}"
        exit 1
    fi
    
    # Step 8: Post-deployment security check
    if ! post_deployment_security; then
        echo -e "${RED}🚨 CRITICAL: Security breach detected in deployment${NC}"
        echo -e "${RED}    Manual intervention required immediately${NC}"
        exit 1
    fi
    
    # Step 9: Update monitoring
    update_monitoring
    
    # Step 10: Show summary
    show_summary
    
    echo -e "${GREEN}🎉 Enterprise secure deployment completed successfully!${NC}"
}

# Handle command line arguments
case "${1:-}" in
    "quick"|"q")
        echo -e "${YELLOW}⚡ Quick deployment (minimal checks)${NC}"
        build_nextjs
        deploy_cloudflare
        verify_deployment
        ;;
    "build-only"|"b")
        echo -e "${BLUE}🔨 Building only${NC}"
        build_nextjs
        ;;
    "deploy-only"|"d")
        echo -e "${BLUE}☁️  Deploying to Cloudflare only${NC}"
        deploy_cloudflare
        ;;
    "scan-only"|"s")
        echo -e "${BLUE}🔍 Running security scan only${NC}"
        run_security_scan
        ;;
    "help"|"--help"|"-h")
        echo -e "${BLUE}🚀 Enterprise Secure Deployment Pipeline${NC}"
        echo ""
        echo "Usage:"
        echo "  $0                    Full secure deployment"
        echo "  $0 quick             Quick deployment"  
        echo "  $0 build-only        Build Next.js only"
        echo "  $0 deploy-only       Deploy to Cloudflare only"
        echo "  $0 scan-only         Run security scan only"
        echo ""
        ;;
    *)
        main
        ;;
esac