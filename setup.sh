#!/bin/bash

# FleetTrack Setup Script
# Automated installation and configuration

set -e

echo "🚛 FleetTrack Enhanced Setup"
echo "=============================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if PHP is installed
check_php() {
    if ! command -v php &> /dev/null; then
        print_error "PHP is not installed. Please install PHP 7.4 or higher."
        exit 1
    fi
    
    PHP_VERSION=$(php -r "echo PHP_VERSION;")
    print_status "PHP $PHP_VERSION detected"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 14 or higher."
        exit 1
    fi
    
    NODE_VERSION=$(node --version)
    print_status "Node.js $NODE_VERSION detected"
}

# Check if MySQL is available
check_mysql() {
    if ! command -v mysql &> /dev/null; then
        print_warning "MySQL client not found. Make sure MySQL server is running."
    else
        print_status "MySQL client detected"
    fi
}

# Create necessary directories
create_directories() {
    print_info "Creating necessary directories..."
    mkdir -p dist
    mkdir -p logs
    mkdir -p classes
    mkdir -p js
    mkdir -p api
    print_status "Directories created"
}

# Install Node.js dependencies
install_dependencies() {
    print_info "Installing Node.js dependencies..."
    if [ -f "package.json" ]; then
        npm install
        print_status "Node.js dependencies installed"
    else
        print_error "package.json not found"
        exit 1
    fi
}

# Build CSS assets
build_assets() {
    print_info "Building CSS assets..."
    npm run build
    print_status "CSS assets built successfully"
}

# Set file permissions
set_permissions() {
    print_info "Setting file permissions..."
    chmod 755 .
    chmod 644 *.php *.html *.css *.js 2>/dev/null || true
    chmod 755 classes/ js/ api/ 2>/dev/null || true
    chmod 755 logs/
    chmod 666 logs/ 2>/dev/null || true
    print_status "File permissions set"
}

# Create .htaccess file for Apache
create_htaccess() {
    if [ ! -f ".htaccess" ]; then
        print_info "Creating .htaccess file..."
        cat > .htaccess << 'EOF'
# FleetTrack .htaccess Configuration

# Enable rewrite engine
RewriteEngine On

# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://cdnjs.cloudflare.com; img-src 'self' data:; font-src 'self' https://cdnjs.cloudflare.com;"

# Hide sensitive files
<Files "config.php">
    Order allow,deny
    Deny from all
</Files>

<Files "*.log">
    Order allow,deny
    Deny from all
</Files>

# Block access to classes directory
<Directory "classes">
    Order allow,deny
    Deny from all
</Directory>

# Block access to logs directory
<Directory "logs">
    Order allow,deny
    Deny from all
</Directory>

# Custom error pages
ErrorDocument 404 /404.html
ErrorDocument 403 /403.html
ErrorDocument 500 /500.html

# Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Browser caching
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
</IfModule>
EOF
        print_status ".htaccess file created"
    fi
}

# Initialize database
initialize_database() {
    print_info "Initializing database..."
    if [ -f "init.php" ]; then
        php init.php
        print_status "Database initialized with sample data"
    else
        print_warning "init.php not found, skipping database initialization"
    fi
}

# Display completion message
show_completion() {
    echo ""
    echo "🎉 FleetTrack Setup Complete!"
    echo "=============================="
    echo ""
    print_info "Next steps:"
    echo "1. Update database credentials in config.php"
    echo "2. Start the development server: npm start"
    echo "3. Open http://localhost:8000 in your browser"
    echo ""
    print_info "Default admin credentials:"
    echo "Email: admin@fleettrack.com"
    echo "Password: FleetTrack2024!"
    echo ""
    print_info "Available commands:"
    echo "• npm start      - Start development server"
    echo "• npm run dev    - Watch for CSS changes"
    echo "• npm run build  - Build production assets"
    echo "• npm run init   - Reinitialize database"
    echo ""
}

# Main setup process
main() {
    echo "Starting FleetTrack setup process..."
    echo ""
    
    check_php
    check_node
    check_mysql
    
    create_directories
    install_dependencies
    build_assets
    set_permissions
    create_htaccess
    
    # Ask user if they want to initialize the database
    echo ""
    read -p "Do you want to initialize the database with sample data? (y/N): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        initialize_database
    else
        print_info "Skipping database initialization"
        print_warning "You'll need to run 'npm run init' later to set up the database"
    fi
    
    show_completion
}

# Run main function
main "$@"