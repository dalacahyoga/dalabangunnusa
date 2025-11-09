@echo off
REM Production Build Script for Windows
REM Usage: build-production.bat [hostinger|netlify]

echo 🚀 Starting production build...

REM Check argument
if "%1"=="hostinger" (
    echo 📦 Building for Hostinger deployment...
    if "%2"=="" (
        echo ⚠️  Warning: No Railway URL provided
        echo 📝 Please create .env.production manually with:
        echo    VITE_API_URL=https://your-railway-backend.up.railway.app/api
        echo    VITE_USE_API=true
        echo.
        echo Or run: scripts\build-production.bat hostinger https://your-railway-backend.up.railway.app/api
        exit /b 1
    ) else (
        echo VITE_API_URL=%2 > .env.production
        echo VITE_USE_API=true >> .env.production
        echo ✅ Created .env.production with Railway URL: %2
    )
) else if "%1"=="netlify" (
    echo 📦 Building for Netlify deployment...
    if "%2"=="" (
        echo ⚠️  Warning: No backend URL provided
        echo 📝 Please create .env.production manually with:
        echo    VITE_API_URL=https://your-backend-url.com/api
        echo    VITE_USE_API=true
        exit /b 1
    ) else (
        echo VITE_API_URL=%2 > .env.production
        echo VITE_USE_API=true >> .env.production
        echo ✅ Created .env.production with backend URL: %2
    )
) else (
    echo ❌ Please specify deployment target: hostinger or netlify
    echo Usage: scripts\build-production.bat [hostinger^|netlify] [backend-url]
    echo.
    echo Example:
    echo   scripts\build-production.bat hostinger https://your-railway.up.railway.app/api
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

