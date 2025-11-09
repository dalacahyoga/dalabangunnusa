#!/bin/bash
# Script to update .env.production with Railway backend URL
# Usage: ./scripts/update-production-env.sh [railway-url]

if [ -z "$1" ]; then
    echo "❌ Error: Railway URL is required"
    echo "Usage: ./scripts/update-production-env.sh [railway-url]"
    echo ""
    echo "Example:"
    echo "  ./scripts/update-production-env.sh https://dalabangunnusa-backend-production.up.railway.app"
    exit 1
fi

RAILWAY_URL="$1"

# Remove trailing slash if present
RAILWAY_URL="${RAILWAY_URL%/}"

# Ensure URL ends with /api
if [[ ! "$RAILWAY_URL" == */api ]]; then
    RAILWAY_URL="$RAILWAY_URL/api"
fi

# Create .env.production file
cat > .env.production << EOF
# Production Environment Variables
# Generated automatically - DO NOT EDIT manually unless you know what you're doing

VITE_API_URL=$RAILWAY_URL
VITE_USE_API=true
EOF

echo "✅ .env.production updated successfully!"
echo "   VITE_API_URL=$RAILWAY_URL"
echo "   VITE_USE_API=true"
echo ""
echo "Next step: Run 'npm run build' to rebuild with the new API URL"

