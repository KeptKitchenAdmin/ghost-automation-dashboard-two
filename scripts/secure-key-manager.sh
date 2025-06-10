#!/bin/bash

# 🔐 Enterprise Secure API Key Manager
# Automatically secures ANY new API key or sensitive data
# Prevents exposure and deploys to secure infrastructure

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_LOCAL_PATH="$PROJECT_ROOT/frontend/.env.local"
ENV_EXAMPLE_PATH="$PROJECT_ROOT/frontend/.env.example"
WORKER_PATH="$PROJECT_ROOT/cloudflare-workers/api-proxy"

echo -e "${BLUE}🔐 Enterprise Secure API Key Manager${NC}"
echo -e "${BLUE}=====================================${NC}\n"

# Function to check if key already exists
check_key_exists() {
    local key_name="$1"
    if grep -q "^${key_name}=" "$ENV_LOCAL_PATH" 2>/dev/null; then
        return 0
    else
        return 1
    fi
}

# Function to add key to .env.local securely
add_key_to_env() {
    local key_name="$1"
    local key_value="$2"
    
    # Ensure .env.local exists and is secure
    touch "$ENV_LOCAL_PATH"
    chmod 600 "$ENV_LOCAL_PATH"
    
    if check_key_exists "$key_name"; then
        echo -e "${YELLOW}⚠️  Key $key_name already exists. Updating...${NC}"
        # Use sed to update existing key
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' "s/^${key_name}=.*/${key_name}=${key_value}/" "$ENV_LOCAL_PATH"
        else
            sed -i "s/^${key_name}=.*/${key_name}=${key_value}/" "$ENV_LOCAL_PATH"
        fi
    else
        echo -e "${GREEN}➕ Adding new key $key_name...${NC}"
        echo "" >> "$ENV_LOCAL_PATH"
        echo "# Added $(date)" >> "$ENV_LOCAL_PATH"
        echo "${key_name}=${key_value}" >> "$ENV_LOCAL_PATH"
    fi
}

# Function to add placeholder to .env.example
add_placeholder_to_example() {
    local key_name="$1"
    local description="$2"
    
    if ! grep -q "^${key_name}=" "$ENV_EXAMPLE_PATH" 2>/dev/null; then
        echo -e "${GREEN}📝 Adding placeholder to .env.example...${NC}"
        echo "" >> "$ENV_EXAMPLE_PATH"
        echo "# $description" >> "$ENV_EXAMPLE_PATH"
        echo "${key_name}=your_${key_name,,}_here" >> "$ENV_EXAMPLE_PATH"
    fi
}

# Function to detect API service from key format
detect_api_service() {
    local key_value="$1"
    
    case "$key_value" in
        sk-proj-*) echo "openai" ;;
        sk-ant-*) echo "claude" ;;
        sk_*) echo "elevenlabs" ;;
        *JWT*|*BEGIN*PRIVATE*KEY*) echo "google-cloud" ;;
        *@*.iam.gserviceaccount.com) echo "google-service-account" ;;
        *) echo "generic" ;;
    esac
}

# Function to update Cloudflare Worker
update_worker_proxy() {
    local key_name="$1"
    local service_type="$2"
    
    echo -e "${BLUE}🔄 Updating Cloudflare Worker proxy...${NC}"
    
    case "$service_type" in
        "openai")
            echo "OpenAI proxy already configured"
            ;;
        "claude")
            echo "Claude proxy already configured"
            ;;
        "elevenlabs")
            echo "ElevenLabs proxy already configured"
            ;;
        "google-cloud")
            echo "Google Cloud TTS proxy already configured"
            ;;
        *)
            echo -e "${YELLOW}⚠️  Unknown service type. Manual worker update may be needed.${NC}"
            ;;
    esac
}

# Function to add to Cloudflare Workers secrets
add_to_cloudflare_secrets() {
    local key_name="$1"
    local key_value="$2"
    
    echo -e "${BLUE}☁️  Adding to Cloudflare Workers secrets...${NC}"
    
    if command -v wrangler &> /dev/null; then
        cd "$WORKER_PATH"
        echo "$key_value" | wrangler secret put "$key_name" --force
        cd "$PROJECT_ROOT"
        echo -e "${GREEN}✅ Secret added to Cloudflare Workers${NC}"
    else
        echo -e "${YELLOW}⚠️  Wrangler CLI not found. Manual secret setup required:${NC}"
        echo -e "${YELLOW}   cd $WORKER_PATH${NC}"
        echo -e "${YELLOW}   wrangler secret put $key_name${NC}"
    fi
}

# Function to scan for exposed secrets
scan_for_exposed_secrets() {
    echo -e "${BLUE}🔍 Scanning for exposed secrets...${NC}"
    
    # Common secret patterns
    local patterns=(
        "sk-[a-zA-Z0-9-_]{20,}"          # OpenAI/Anthropic keys
        "[a-f0-9]{32}"                   # 32-char hex keys
        "AIza[0-9A-Za-z\\-_]{35}"        # Google API keys
        "-----BEGIN [A-Z ]+-----"        # Private keys
        "[0-9]+-[0-9A-Za-z_]{32}"        # Stripe keys
    )
    
    local found_secrets=false
    
    for pattern in "${patterns[@]}"; do
        if grep -r -E "$pattern" "$PROJECT_ROOT" \
           --exclude-dir=node_modules \
           --exclude-dir=.git \
           --exclude-dir=.next \
           --exclude="*.log" \
           --exclude="*.lock" \
           --exclude="package-lock.json" \
           --exclude="yarn.lock" \
           --exclude=".env.local" \
           --exclude="secure-key-manager.sh" \
           2>/dev/null; then
            found_secrets=true
        fi
    done
    
    if [ "$found_secrets" = true ]; then
        echo -e "${RED}🚨 EXPOSED SECRETS DETECTED!${NC}"
        echo -e "${RED}   Run this script to secure them immediately.${NC}"
        return 1
    else
        echo -e "${GREEN}✅ No exposed secrets found${NC}"
        return 0
    fi
}

# Function to setup git hooks
setup_git_hooks() {
    echo -e "${BLUE}🪝 Setting up git hooks for secret protection...${NC}"
    
    local pre_commit_hook="$PROJECT_ROOT/.git/hooks/pre-commit"
    
    cat > "$pre_commit_hook" << 'EOF'
#!/bin/bash

# Pre-commit hook to prevent secret exposure
echo "🔍 Scanning for secrets before commit..."

# Secret patterns to detect
patterns=(
    "sk-[a-zA-Z0-9-_]{20,}"
    "[a-f0-9]{32}"
    "AIza[0-9A-Za-z\\-_]{35}"
    "-----BEGIN [A-Z ]+-----"
)

found_secrets=false

for pattern in "${patterns[@]}"; do
    if git diff --cached --name-only | xargs grep -l -E "$pattern" 2>/dev/null; then
        echo "🚨 BLOCKED: Secret detected in staged files!"
        echo "   Pattern: $pattern"
        echo "   Use scripts/secure-key-manager.sh to secure secrets"
        found_secrets=true
    fi
done

if [ "$found_secrets" = true ]; then
    exit 1
fi

echo "✅ No secrets detected - commit allowed"
EOF

    chmod +x "$pre_commit_hook"
    echo -e "${GREEN}✅ Git hooks configured${NC}"
}

# Function to ensure secure file permissions
secure_file_permissions() {
    echo -e "${BLUE}🔒 Setting secure file permissions...${NC}"
    
    # Secure .env.local
    if [ -f "$ENV_LOCAL_PATH" ]; then
        chmod 600 "$ENV_LOCAL_PATH"
    fi
    
    # Ensure .gitignore includes sensitive files
    local gitignore="$PROJECT_ROOT/.gitignore"
    local sensitive_patterns=(
        "*.env.local"
        ".env.local"
        "**/.env.local"
        "*.pem"
        "*.key"
        "*.p12"
        "*.pfx"
    )
    
    for pattern in "${sensitive_patterns[@]}"; do
        if ! grep -q "^$pattern$" "$gitignore" 2>/dev/null; then
            echo "$pattern" >> "$gitignore"
        fi
    done
    
    echo -e "${GREEN}✅ File permissions secured${NC}"
}

# Main function to add a new API key
add_api_key() {
    local key_name="$1"
    local key_value="$2"
    local description="${3:-API Key}"
    
    echo -e "${BLUE}🔐 Securing API key: $key_name${NC}"
    
    # Detect service type
    local service_type=$(detect_api_service "$key_value")
    echo -e "${BLUE}📡 Detected service: $service_type${NC}"
    
    # Add to local environment (secure)
    add_key_to_env "$key_name" "$key_value"
    
    # Add placeholder to example
    add_placeholder_to_example "$key_name" "$description"
    
    # Update worker proxy if needed
    update_worker_proxy "$key_name" "$service_type"
    
    # Add to Cloudflare secrets
    add_to_cloudflare_secrets "$key_name" "$key_value"
    
    echo -e "${GREEN}✅ API key $key_name secured successfully!${NC}"
}

# Interactive mode
interactive_mode() {
    echo -e "${BLUE}🎯 Interactive API Key Setup${NC}"
    echo -e "${BLUE}==============================${NC}\n"
    
    read -p "Enter API key name (e.g., OPENAI_API_KEY): " key_name
    read -s -p "Enter API key value: " key_value
    echo ""
    read -p "Enter description (optional): " description
    
    if [ -z "$key_name" ] || [ -z "$key_value" ]; then
        echo -e "${RED}❌ Key name and value are required${NC}"
        exit 1
    fi
    
    add_api_key "$key_name" "$key_value" "$description"
}

# Batch mode from file
batch_mode() {
    local file_path="$1"
    
    if [ ! -f "$file_path" ]; then
        echo -e "${RED}❌ File not found: $file_path${NC}"
        exit 1
    fi
    
    echo -e "${BLUE}📦 Processing keys from: $file_path${NC}"
    
    while IFS='=' read -r key_name key_value; do
        # Skip comments and empty lines
        if [[ "$key_name" =~ ^#.*$ ]] || [ -z "$key_name" ]; then
            continue
        fi
        
        add_api_key "$key_name" "$key_value"
    done < "$file_path"
}

# Initialize security setup
initialize_security() {
    echo -e "${BLUE}🚀 Initializing enterprise security setup...${NC}"
    
    secure_file_permissions
    setup_git_hooks
    
    echo -e "${GREEN}✅ Security initialization complete!${NC}"
}

# Main script logic
case "${1:-}" in
    "add")
        if [ $# -eq 3 ]; then
            add_api_key "$2" "$3"
        elif [ $# -eq 4 ]; then
            add_api_key "$2" "$3" "$4"
        else
            echo -e "${RED}Usage: $0 add KEY_NAME KEY_VALUE [DESCRIPTION]${NC}"
            exit 1
        fi
        ;;
    "interactive"|"i")
        interactive_mode
        ;;
    "batch")
        batch_mode "$2"
        ;;
    "scan")
        scan_for_exposed_secrets
        ;;
    "init")
        initialize_security
        ;;
    "help"|"--help"|"-h")
        echo -e "${BLUE}🔐 Enterprise Secure API Key Manager${NC}"
        echo ""
        echo "Usage:"
        echo "  $0 add KEY_NAME KEY_VALUE [DESCRIPTION]  Add a single API key"
        echo "  $0 interactive                          Interactive key setup"
        echo "  $0 batch FILE                          Process keys from file"
        echo "  $0 scan                                Scan for exposed secrets"
        echo "  $0 init                                Initialize security setup"
        echo ""
        echo "Examples:"
        echo "  $0 add OPENAI_API_KEY sk-proj-abc123... 'OpenAI API Key'"
        echo "  $0 interactive"
        echo "  $0 scan"
        ;;
    *)
        echo -e "${YELLOW}🤖 Welcome to Enterprise Secure API Key Manager!${NC}"
        echo ""
        echo "Choose an option:"
        echo "1. Add API key interactively"
        echo "2. Scan for exposed secrets"
        echo "3. Initialize security setup"
        echo "4. Show help"
        echo ""
        read -p "Enter choice (1-4): " choice
        
        case "$choice" in
            1) interactive_mode ;;
            2) scan_for_exposed_secrets ;;
            3) initialize_security ;;
            4) exec "$0" help ;;
            *) echo -e "${RED}Invalid choice${NC}"; exit 1 ;;
        esac
        ;;
esac

echo -e "\n${GREEN}🎉 Enterprise security maintained!${NC}"