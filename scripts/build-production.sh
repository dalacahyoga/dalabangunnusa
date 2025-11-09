#!/bin/bash

# Production Build Script
# Usage: ./build-production.sh [hostinger|netlify]

echo "🚀 Starting production build..."

# Check argument
if [ "$1" = "hostinger" ]; then
    echo "📦 Building for Hostinger deployment..."
    if [ -z "$2" ]; then
        echo "⚠️  Warning: No Railway URL provided"
        echo "📝 Please create .env.production manually with:"
        echo "   VITE_API_URL=https://your-railway-backend.up.railway.app/api"
        echo "   VITE_USE_API=true"
        echo ""
        echo "Or run: ./scripts/build-production.sh hostinger https://your-railway-backend.up.railway.app/api"
        exit 1
    else
        echo "VITE_API_URL=$2" > .env.production
        echo "VITE_USE_API=true" >> .env.production
        echo "✅ Created .env.production with Railway URL: $2"
    fi
elif [ "$1" = "netlify" ]; then
    echo "📦 Building for Netlify deployment..."
    if [ -z "$2" ]; then
        echo "⚠️  Warning: No backend URL provided"
        echo "📝 Please create .env.production manually with:"
        echo "   VITE_API_URL=https://your-backend-url.com/api"
        echo "   VITE_USE_API=true"
        exit 1
    else
        echo "VITE_API_URL=$2" > .env.production
        echo "VITE_USE_API=true" >> .env.production
        echo "✅ Created .env.production with backend URL: $2"
    fi
else
    echo "❌ Please specify deployment target: hostinger or netlify"
    echo "Usage: ./scripts/build-production.sh [hostinger|netlify] [backend-url]"
    echo ""
    echo "Example:"
    echo "  ./scripts/build-production.sh hostinger https://your-railway.up.railway.app/api"
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

