# Deployment Guide - Hostinger & Netlify

## Overview

Website ini dapat di-deploy ke dua platform:
1. **Hostinger** - Shared hosting dengan Apache
2. **Netlify** - Static site hosting dengan CDN

## Prerequisites

- Node.js 18+ installed
- Git repository setup
- Account Hostinger & Netlify

---

## 🚀 Deployment ke Netlify

### Method 1: Netlify Dashboard (Recommended)

1. **Login ke Netlify** dan buat site baru
2. **Connect to Git** - Pilih repository GitHub
3. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `18` (atau sesuai)

4. **Environment Variables** (di Netlify Dashboard → Site settings → Environment variables):
   ```
   VITE_API_URL = https://your-api-domain.com/api
   ```

5. **Deploy** - Netlify akan otomatis build dan deploy setiap push ke main branch

### Method 2: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
npm run build
netlify deploy --prod
```

### Netlify Configuration

File `netlify.toml` sudah dikonfigurasi untuk:
- SPA routing (redirect semua ke index.html)
- Security headers
- Cache optimization
- Build settings

---

## 🌐 Deployment ke Hostinger

### Step 1: Build Project

```bash
npm install
npm run build
```

### Step 2: Upload Files

1. **Login ke Hostinger cPanel**
2. **File Manager** → Navigate ke `public_html` (atau domain folder)
3. **Upload semua file dari folder `dist/`** ke `public_html/`
4. **Upload file `.htaccess`** dari `public/.htaccess` ke `public_html/`

### Step 3: Setup API Server (Optional)

Jika ingin menggunakan visitor log API:

1. **Upload `server.js`** ke server
2. **Install Node.js** di Hostinger (via cPanel → Node.js Selector)
3. **Setup Node.js App:**
   - Application root: `/home/username/your-domain.com`
   - Application URL: `your-domain.com/api` (atau subdomain)
   - Application startup file: `server.js`
   - Node.js version: 18.x

4. **Environment Variables** (di cPanel Node.js):
   ```
   PORT=3001
   ```

5. **Start Application**

### Step 4: Update Environment Variables

Set `VITE_API_URL` di build time atau update di `src/utils/visitorLogger.js`:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'https://your-domain.com/api'
```

### File Structure di Hostinger

```
public_html/
├── index.html
├── assets/
│   ├── index-*.js
│   └── index-*.css
├── images/
└── .htaccess
```

---

## 📝 Environment Variables

### Development
Buat file `.env` di root project:
```env
VITE_API_URL=http://localhost:3001/api
PORT=3001
```

### Production

**Netlify:**
- Set di Netlify Dashboard → Site settings → Environment variables

**Hostinger:**
- Set di cPanel Node.js environment variables
- Atau hardcode di `visitorLogger.js` untuk production

---

## 🔧 Build Commands

```bash
# Development
npm run dev              # Frontend only
npm run dev:server       # API server only
npm run dev:all          # Both (requires concurrently)

# Production
npm run build           # Build frontend to dist/
npm run preview          # Preview production build locally
```

---

## 📁 Important Files

- `netlify.toml` - Netlify configuration
- `public/.htaccess` - Apache configuration untuk Hostinger
- `server.js` - API server untuk visitor logs
- `dist/` - Build output (jangan commit ke git)

---

## 🔐 Security Notes

1. **File `.htaccess`** sudah dikonfigurasi untuk:
   - Block access ke sensitive files
   - Security headers
   - SPA routing

2. **Visitor Logs:**
   - File `visitor_logs.json` tidak di-commit (ada di `.gitignore`)
   - Pastikan file permissions di server (chmod 644)

3. **API Server:**
   - Gunakan HTTPS di production
   - Set CORS properly jika API di domain berbeda

---

## 🐛 Troubleshooting

### Netlify

**Build fails:**
- Check Node.js version (set di Netlify dashboard)
- Check build logs di Netlify dashboard
- Pastikan semua dependencies terinstall

**404 on routes:**
- Pastikan `netlify.toml` ada redirect rules
- Check `[[redirects]]` configuration

### Hostinger

**404 on routes:**
- Pastikan `.htaccess` sudah di-upload
- Check Apache mod_rewrite enabled
- Check file permissions (644 untuk files, 755 untuk folders)

**API server tidak jalan:**
- Check Node.js version di cPanel
- Check application logs
- Pastikan PORT tidak conflict dengan service lain

---

## 📦 What Gets Deployed

### Netlify
- Frontend build (`dist/` folder)
- Static assets (images, fonts, CSS, JS)

### Hostinger
- Frontend build (`dist/` folder contents)
- `.htaccess` file
- Optional: `server.js` untuk API

---

## 🔄 Continuous Deployment

### Netlify
- Automatic: Setiap push ke `main` branch akan auto-deploy
- Manual: Bisa trigger deploy dari Netlify dashboard

### Hostinger
- Manual: Upload file via cPanel File Manager atau FTP
- Git: Jika Hostinger support Git, bisa setup auto-deploy

---

## 📞 Support

Jika ada masalah deployment, check:
1. Build logs (Netlify dashboard atau terminal)
2. Server logs (Hostinger cPanel)
3. Browser console untuk frontend errors
4. Network tab untuk API errors

