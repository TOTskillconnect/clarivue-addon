#!/bin/bash

# Clarivue Google Meet Add-on Deployment Script
# Prepares and validates files for Google Workspace Marketplace publishing

set -e  # Exit on any error

echo "🚀 Clarivue Google Meet Add-on Deployment Script"
echo "================================================"

# Configuration
PROJECT_NAME="clarivue-meet-addon"
VERSION="1.0.0"
BUILD_DIR="./build/meet-addon"
ASSETS_DIR="./publishing/assets"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Create build directory
log_info "Creating build directory..."
mkdir -p "$BUILD_DIR"
mkdir -p "$BUILD_DIR/publishing"
mkdir -p "$ASSETS_DIR"

# Step 1: Validate required files
log_info "Validating required files..."

required_files=(
    "src/meet/Code.gs"
    "src/meet/appsscript.json"
    "GOOGLE_MEET_PUBLISHING_GUIDE.md"
    "publishing/marketplace-listing.md"
)

missing_files=()
for file in "${required_files[@]}"; do
    if [[ ! -f "$file" ]]; then
        missing_files+=("$file")
    fi
done

if [[ ${#missing_files[@]} -gt 0 ]]; then
    log_error "Missing required files:"
    for file in "${missing_files[@]}"; do
        echo "  - $file"
    done
    exit 1
fi

log_success "All required files found"

# Step 2: Validate Apps Script code
log_info "Validating Apps Script code..."

# Check for required functions in Code.gs
required_functions=(
    "onHomepage"
    "onMeetingStart"
    "onMeetingEnd"
    "refreshContent"
    "openSettings"
    "createClarivueMeetingPanel"
)

code_file="src/meet/Code.gs"
missing_functions=()

for func in "${required_functions[@]}"; do
    if ! grep -q "function $func" "$code_file"; then
        missing_functions+=("$func")
    fi
done

if [[ ${#missing_functions[@]} -gt 0 ]]; then
    log_error "Missing required functions in Code.gs:"
    for func in "${missing_functions[@]}"; do
        echo "  - $func()"
    done
    exit 1
fi

log_success "Apps Script code validation passed"

# Step 3: Validate manifest (appsscript.json)
log_info "Validating manifest configuration..."

manifest_file="src/meet/appsscript.json"

# Check for required OAuth scopes
required_scopes=(
    "https://www.googleapis.com/auth/script.external_request"
    "https://www.googleapis.com/auth/script.storage"
    "https://www.googleapis.com/auth/userinfo.email"
)

for scope in "${required_scopes[@]}"; do
    if ! grep -q "$scope" "$manifest_file"; then
        log_error "Missing required OAuth scope: $scope"
        exit 1
    fi
done

# Check for Meet add-on configuration
if ! grep -q '"meet"' "$manifest_file"; then
    log_error "Missing Google Meet add-on configuration in manifest"
    exit 1
fi

log_success "Manifest validation passed"

# Step 4: Copy files to build directory
log_info "Copying files to build directory..."

cp "src/meet/Code.gs" "$BUILD_DIR/"
cp "src/meet/appsscript.json" "$BUILD_DIR/"
cp -r "publishing/" "$BUILD_DIR/"
cp "GOOGLE_MEET_PUBLISHING_GUIDE.md" "$BUILD_DIR/"

log_success "Files copied to build directory"

# Step 5: Check for asset files
log_info "Checking for required asset files..."

required_assets=(
    "clarivue-logo-128.png"
    "clarivue-logo-64.png"
    "clarivue-icon-24.png"
)

missing_assets=()
for asset in "${required_assets[@]}"; do
    if [[ ! -f "$ASSETS_DIR/$asset" ]]; then
        missing_assets+=("$asset")
    fi
done

if [[ ${#missing_assets[@]} -gt 0 ]]; then
    log_warning "Missing recommended asset files (you'll need these for publishing):"
    for asset in "${missing_assets[@]}"; do
        echo "  - $ASSETS_DIR/$asset"
    done
else
    log_success "All asset files found"
fi

# Step 6: Validate image dimensions (if files exist)
log_info "Validating image dimensions..."

if command -v identify &> /dev/null; then
    for asset in "${required_assets[@]}"; do
        if [[ -f "$ASSETS_DIR/$asset" ]]; then
            dimensions=$(identify -format "%wx%h" "$ASSETS_DIR/$asset")
            case "$asset" in
                "clarivue-logo-128.png")
                    if [[ "$dimensions" != "128x128" ]]; then
                        log_warning "$asset should be 128x128px, currently $dimensions"
                    fi
                    ;;
                "clarivue-logo-64.png")
                    if [[ "$dimensions" != "64x64" ]]; then
                        log_warning "$asset should be 64x64px, currently $dimensions"
                    fi
                    ;;
                "clarivue-icon-24.png")
                    if [[ "$dimensions" != "24x24" ]]; then
                        log_warning "$asset should be 24x24px, currently $dimensions"
                    fi
                    ;;
            esac
        fi
    done
else
    log_warning "ImageMagick not installed - skipping image dimension validation"
fi

# Step 7: Generate deployment checklist
log_info "Generating deployment checklist..."

cat > "$BUILD_DIR/DEPLOYMENT_CHECKLIST.md" << EOF
# 🚀 Clarivue Google Meet Add-on Deployment Checklist

Generated on: $(date)
Version: $VERSION

## ✅ Pre-Deployment Validation

- [x] Apps Script code validated
- [x] Manifest configuration validated  
- [x] Required files present
- [x] Build directory prepared

## 📋 Next Steps

### 1. Google Apps Script Setup
- [ ] Create new Apps Script project at https://script.google.com
- [ ] Copy Code.gs content from: \`$BUILD_DIR/Code.gs\`
- [ ] Copy appsscript.json content to manifest
- [ ] Test all functions manually
- [ ] Deploy as add-on

### 2. Google Cloud Console Setup
- [ ] Create/configure Google Cloud Project
- [ ] Enable required APIs
- [ ] Configure OAuth consent screen
- [ ] Verify domain ownership (clarivue.com)

### 3. Asset Upload
- [ ] Upload app icons (128x128, 64x64, 24x24)
- [ ] Prepare screenshots (1280x800px, 5-8 images)
- [ ] Create promotional materials

### 4. Legal & Compliance
- [ ] Publish privacy policy at clarivue.com/privacy
- [ ] Publish terms of service at clarivue.com/terms
- [ ] Complete GDPR compliance documentation

### 5. Marketplace Submission
- [ ] Navigate to Google Workspace Marketplace SDK
- [ ] Create app configuration
- [ ] Upload all assets and documentation
- [ ] Submit for review

### 6. Testing
- [ ] Internal testing with team members
- [ ] Beta testing with select users
- [ ] Performance and security testing
- [ ] Cross-browser compatibility testing

## 📞 Support Resources

- Publishing Guide: See \`GOOGLE_MEET_PUBLISHING_GUIDE.md\`
- Marketplace Listing: See \`publishing/marketplace-listing.md\`
- Google Documentation: https://developers.google.com/workspace/marketplace

---

**Estimated Timeline**: 2-4 weeks from submission to approval
**Support**: support@clarivue.com
EOF

log_success "Deployment checklist generated"

# Step 8: Create deployment package
log_info "Creating deployment package..."

cd "$BUILD_DIR/.."
tar -czf "clarivue-meet-addon-v$VERSION.tar.gz" meet-addon/
cd ..

package_size=$(du -h "build/clarivue-meet-addon-v$VERSION.tar.gz" | cut -f1)
log_success "Deployment package created: clarivue-meet-addon-v$VERSION.tar.gz ($package_size)"

# Step 9: Final summary
echo ""
echo "🎉 Deployment preparation complete!"
echo "=================================="
echo ""
echo "📦 Build directory: $BUILD_DIR"
echo "📁 Package: build/clarivue-meet-addon-v$VERSION.tar.gz"
echo "📋 Checklist: $BUILD_DIR/DEPLOYMENT_CHECKLIST.md"
echo ""
echo "📚 Next steps:"
echo "1. Review the deployment checklist"
echo "2. Follow the publishing guide"
echo "3. Upload to Google Apps Script"
echo "4. Submit to Google Workspace Marketplace"
echo ""
echo "🆘 Need help? Check GOOGLE_MEET_PUBLISHING_GUIDE.md"
echo ""
log_success "Ready for Google Workspace Marketplace submission! 🚀" 