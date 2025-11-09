#!/bin/bash
# Deployment script untuk Hostinger
# Usage: ./deploy-hostinger.sh

echo "🚀 Building project for Hostinger..."

# Build project
npm run build

echo "✅ Build completed!"
echo ""
echo "📦 Files ready for upload:"
echo "   - Upload all files from 'dist/' folder to public_html/"
echo "   - Upload 'public/.htaccess' to public_html/.htaccess"
echo ""
echo "📝 Next steps:"
echo "   1. Login to Hostinger cPanel"
echo "   2. Go to File Manager"
echo "   3. Navigate to public_html (or your domain folder)"
echo "   4. Upload all files from dist/ folder"
echo "   5. Upload .htaccess file"
echo ""
echo "🔧 Optional: Setup API server"
echo "   - Upload server.js to server"
echo "   - Setup Node.js app in cPanel"
echo "   - Set PORT environment variable"

