#!/bin/bash

# Production Build Script
# Usage: ./build-production.sh [hostinger|netlify]

echo "🚀 Starting production build..."

# Check argument
if [ "$1" = "hostinger" ]; then
    echo "📦 Building for Hostinger deployment..."
    echo "VITE_API_URL=https://your-vps-domain.com/api" > .env.production
elif [ "$1" = "netlify" ]; then
    echo "📦 Building for Netlify deployment..."
    echo "VITE_API_URL=https://your-vps-domain.com/api" > .env.production
else
    echo "❌ Please specify deployment target: hostinger or netlify"
    echo "Usage: ./build-production.sh [hostinger|netlify]"
    exit 1
fi

# Install dependencies
echo "📥 Installing dependencies..."
npm install

# Build
echo "🔨 Building frontend..."
npm run build

echo "✅ Build complete! Output in 'dist/' folder"
echo ""
echo "Next steps:"
if [ "$1" = "hostinger" ]; then
    echo "1. Upload contents of 'dist/' folder to Hostinger"
    echo "2. Make sure index.html is in the root directory"
elif [ "$1" = "netlify" ]; then
    echo "1. Push to GitHub (if using auto-deploy)"
    echo "2. Or run: netlify deploy --prod"
fi

