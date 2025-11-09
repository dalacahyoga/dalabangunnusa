@echo off
REM Production Build Script for Windows
REM Usage: build-production.bat [hostinger|netlify]

echo 🚀 Starting production build...

REM Check argument
if "%1"=="hostinger" (
    echo 📦 Building for Hostinger deployment...
    echo VITE_API_URL=https://your-vps-domain.com/api > .env.production
) else if "%1"=="netlify" (
    echo 📦 Building for Netlify deployment...
    echo VITE_API_URL=https://your-vps-domain.com/api > .env.production
) else (
    echo ❌ Please specify deployment target: hostinger or netlify
    echo Usage: build-production.bat [hostinger^|netlify]
    exit /b 1
)

REM Install dependencies
echo 📥 Installing dependencies...
call npm install

REM Build
echo 🔨 Building frontend...
call npm run build

echo ✅ Build complete! Output in 'dist/' folder
echo.
echo Next steps:
if "%1"=="hostinger" (
    echo 1. Upload contents of 'dist/' folder to Hostinger
    echo 2. Make sure index.html is in the root directory
) else (
    echo 1. Push to GitHub (if using auto-deploy)
    echo 2. Or run: netlify deploy --prod
)

