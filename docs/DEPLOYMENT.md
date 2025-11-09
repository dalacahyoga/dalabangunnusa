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

#### A. Menggunakan Railway.app

⚠️ **Note**: Railway free tier memberikan $5 credit per bulan. Setelah habis, service akan pause.

1. **Buat Akun Railway**
   - Kunjungi https://railway.app
   - Sign up dengan GitHub (recommended) atau email
   - Authorize Railway untuk akses GitHub

2. **Create New Project**
   - Klik "New Project"
   - Pilih "Deploy from GitHub repo"
   - Pilih repository `dalabangunnusa`
   - Railway akan otomatis detect project

3. **Configure Service**
   - Railway akan auto-detect dari `package.json` dan `railway.json`
   - **Build Command**: `npm install` (auto-detect)
   - **Start Command**: `npm start` (auto-detect)
   - Jika perlu manual: Settings → Build & Deploy

4. **Set Environment Variables**
   - Di service dashboard, klik "Variables" tab
   - Klik "New Variable", tambahkan:
     ```
     NODE_ENV=production
     PORT=3001
     ALLOWED_ORIGINS=https://your-hostinger-domain.com
     ```
   - **Catatan**: 
     - Ganti `your-hostinger-domain.com` dengan domain Hostinger Anda
     - Jika juga pakai Netlify: `ALLOWED_ORIGINS=https://your-hostinger-domain.com,https://your-netlify.netlify.app`

5. **Deploy**
   - Railway akan otomatis deploy setelah connect repository
   - Atau klik "Deploy" button untuk manual deploy
   - Tunggu sampai status "Active" (hijau)
   - Build pertama: ~3-5 menit

6. **Get Backend URL**
   - Di service dashboard, klik "Settings" tab
   - Scroll ke "Domains" section
   - Railway akan generate domain: `https://your-service-name.up.railway.app`
   - Backend API: `https://your-service-name.up.railway.app/api`
   - **Simpan URL ini** untuk konfigurasi frontend

7. **Test Backend**
   - Buka: `https://your-service-name.up.railway.app/api/health`
   - Harus return: `{"status":"ok","timestamp":"..."}`
   - Jika error, check logs di "Deployments" tab

8. **Free Tier Note**
   - Railway memberikan $5 credit gratis per bulan
   - Setelah credit habis, service akan pause
   - Credit reset setiap bulan
   - Monitor usage di "Usage" tab
   - **Lihat `docs/RAILWAY_QUICK_START.md` untuk detail lengkap**

#### B. Menggunakan Render.com (Recommended - Free Forever)

1. **Buat Akun Render**
   - Kunjungi https://render.com
   - Sign up dengan GitHub (recommended) atau email
   - Verifikasi email jika diperlukan

2. **Create New Web Service**
   - Klik "New +" di dashboard
   - Pilih "Web Service"
   - Connect GitHub repository
   - Pilih repository `dalabangunnusa`
   - Klik "Connect"

3. **Configure Service Settings**
   - **Name**: `dalabangunnusa-backend` (atau nama lain)
   - **Region**: Pilih yang terdekat (Singapore untuk Indonesia)
   - **Branch**: `main` (atau branch yang digunakan)
   - **Root Directory**: (kosongkan, atau `./` jika perlu)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free` (750 jam/bulan, auto-sleep setelah 15 menit idle)

4. **Set Environment Variables**
   Klik "Advanced" → "Add Environment Variable", tambahkan:
   ```
   NODE_ENV=production
   PORT=3001
   ALLOWED_ORIGINS=https://your-hostinger-domain.com
   ```
   
   **Catatan**: 
   - Ganti `your-hostinger-domain.com` dengan domain Hostinger Anda
   - Jika juga pakai Netlify, tambahkan: `ALLOWED_ORIGINS=https://your-hostinger-domain.com,https://your-netlify.netlify.app`

5. **Deploy**
   - Scroll ke bawah, klik "Create Web Service"
   - Render akan mulai build dan deploy
   - Proses pertama kali bisa memakan waktu 5-10 menit
   - Tunggu sampai status "Live" (hijau)

6. **Get Backend URL**
   - Setelah deploy selesai, Render akan memberikan URL
   - Format: `https://dalabangunnusa-backend.onrender.com`
   - Backend API: `https://dalabangunnusa-backend.onrender.com/api`
   - **Simpan URL ini** untuk konfigurasi frontend

7. **Test Backend**
   - Buka: `https://your-backend-url.onrender.com/api/health`
   - Harus return: `{"status":"ok","timestamp":"..."}`
   - Jika error, check logs di Render dashboard

8. **Auto-Sleep Note**
   - Free tier akan auto-sleep setelah 15 menit tidak ada request
   - Request pertama setelah sleep akan memakan waktu ~30 detik (cold start)
   - Ini normal untuk free tier
   - Untuk menghindari sleep, bisa setup uptime monitor (UptimeRobot, dll)

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
