# Deployment Guide

Panduan deployment untuk 2 case:
1. **OPSI A**: FE di Hostinger + BE di VPS Free
2. **Netlify**: FE di Netlify + BE di VPS Free

---

## Prerequisites

- Akun Hostinger (untuk OPSI A)
- Akun Netlify (untuk case Netlify)
- VPS Free (Railway, Render, atau VPS sendiri)
- Git repository (GitHub/GitLab)

---

## Case 1: OPSI A - FE di Hostinger + BE di VPS Free

### Step 1: Deploy Backend ke VPS Free

#### A. Menggunakan Railway.app (Recommended)

1. **Buat Akun Railway**
   - Kunjungi https://railway.app
   - Sign up dengan GitHub

2. **Create New Project**
   - Klik "New Project"
   - Pilih "Deploy from GitHub repo"
   - Pilih repository Anda

3. **Configure Environment Variables**
   - Di Railway dashboard, pilih project
   - Klik "Variables" tab
   - Tambahkan:
     ```
     PORT=3001
     ALLOWED_ORIGINS=https://your-hostinger-domain.com
     NODE_ENV=production
     ```

4. **Configure Service**
   - Railway akan auto-detect `package.json`
   - Pastikan start command: `npm start`
   - Railway akan otomatis deploy

5. **Get Backend URL**
   - Setelah deploy, Railway akan memberikan URL
   - Contoh: `https://your-app.railway.app`
   - Backend API: `https://your-app.railway.app/api`

#### B. Menggunakan Render.com

1. **Buat Akun Render**
   - Kunjungi https://render.com
   - Sign up dengan GitHub

2. **Create New Web Service**
   - Klik "New +" → "Web Service"
   - Connect GitHub repository

3. **Configure Service**
   - **Name**: `dalabangunnusa-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. **Environment Variables**
   ```
   PORT=3001
   ALLOWED_ORIGINS=https://your-hostinger-domain.com
   NODE_ENV=production
   ```

5. **Deploy**
   - Klik "Create Web Service"
   - Render akan otomatis deploy
   - Get URL: `https://your-app.onrender.com`

### Step 2: Build Frontend untuk Hostinger

1. **Update Environment Variable**
   ```bash
   # Buat file .env.production
   VITE_API_URL=https://your-vps-domain.com/api
   ```

2. **Build Frontend**
   ```bash
   npm run build
   ```
   - Output akan di folder `dist/`

3. **Upload ke Hostinger**
   - Login ke Hostinger cPanel
   - Buka File Manager
   - Navigate ke `public_html` atau folder domain Anda
   - Upload semua file dari folder `dist/`
   - Pastikan `index.html` ada di root folder

4. **Verify**
   - Buka domain Anda di browser
   - Test semua fitur (portfolio, contact, dll)

---

## Case 2: FE di Netlify + BE di VPS Free

### Step 1: Deploy Backend ke VPS Free

Sama seperti Case 1, Step 1. Tapi update `ALLOWED_ORIGINS`:

```
ALLOWED_ORIGINS=https://your-netlify-domain.netlify.app,https://your-custom-domain.com
```

### Step 2: Deploy Frontend ke Netlify

#### A. Deploy via Netlify Dashboard

1. **Buat Akun Netlify**
   - Kunjungi https://netlify.com
   - Sign up dengan GitHub

2. **Add New Site**
   - Klik "Add new site" → "Import an existing project"
   - Connect GitHub repository

3. **Configure Build Settings**
   - **Base directory**: (kosongkan)
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

4. **Environment Variables**
   - Klik "Site settings" → "Environment variables"
   - Tambahkan:
     ```
     VITE_API_URL=https://your-vps-domain.com/api
     ```

5. **Deploy**
   - Netlify akan otomatis build dan deploy
   - Get URL: `https://your-app.netlify.app`

#### B. Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login**
   ```bash
   netlify login
   ```

3. **Initialize Site**
   ```bash
   netlify init
   ```

4. **Build & Deploy**
   ```bash
   npm run build
   netlify deploy --prod
   ```

5. **Set Environment Variables**
   ```bash
   netlify env:set VITE_API_URL https://your-vps-domain.com/api
   ```

---

## Konfigurasi CORS

Backend sudah dikonfigurasi untuk handle multiple origins. Pastikan di VPS:

1. **Set Environment Variable `ALLOWED_ORIGINS`**
   ```
   ALLOWED_ORIGINS=https://your-hostinger-domain.com,https://your-netlify-domain.netlify.app
   ```

2. **Restart Backend**
   - Setelah update environment variable, restart service

---

## Troubleshooting

### CORS Error
- Pastikan `ALLOWED_ORIGINS` di backend sudah include domain frontend
- Pastikan URL di `VITE_API_URL` benar (dengan `/api` di akhir)
- Check browser console untuk error detail

### API Not Found
- Pastikan backend sudah running
- Test backend URL langsung: `https://your-backend.com/api/health`
- Check environment variable `VITE_API_URL` di frontend

### File Upload Error
- Pastikan folder `public/images/portfolio` ada di VPS
- Check permission folder untuk write access
- Pastikan `multer` dan `sharp` sudah terinstall

### Build Error
- Pastikan semua dependencies terinstall: `npm install`
- Check Node.js version (minimal v18)
- Check error log di build output

---

## Production Checklist

- [ ] Backend deployed dan running
- [ ] Environment variables sudah di-set
- [ ] CORS configured dengan benar
- [ ] Frontend built dengan `VITE_API_URL` yang benar
- [ ] Frontend uploaded/deployed
- [ ] Test semua fitur:
  - [ ] Home page
  - [ ] Portfolio page
  - [ ] Portfolio detail
  - [ ] About page
  - [ ] Contact page
  - [ ] Admin login
  - [ ] Content Management
  - [ ] Portfolio Management
  - [ ] File uploads
- [ ] SSL/HTTPS enabled (untuk production)
- [ ] Domain configured (jika pakai custom domain)

---

## Maintenance

### Update Backend
1. Push changes ke GitHub
2. VPS akan auto-deploy (jika setup auto-deploy)
3. Atau manual deploy via VPS dashboard

### Update Frontend
1. Update `VITE_API_URL` jika backend URL berubah
2. Build: `npm run build`
3. Upload `dist/` ke Hostinger atau push ke Netlify

---

## Support

Jika ada masalah, check:
- Server logs di VPS dashboard
- Browser console untuk frontend errors
- Network tab untuk API requests
