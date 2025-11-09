# Deployment Guide: Hostinger (Frontend) + Railway (Backend)

Panduan lengkap untuk deploy frontend ke Hostinger dan backend ke Railway.

## Prerequisites

- ✅ Repository sudah terintegrasi dengan Railway
- ✅ Backend sudah running di Railway
- ✅ Railway backend URL sudah tersedia

## Step 1: Get Railway Backend URL

1. Buka Railway dashboard: https://railway.app
2. Pilih project Anda
3. Klik service backend
4. Di tab **"Settings"** → **"Domains"**
5. Copy Railway URL (contoh: `https://dalabangunnusa-backend-production.up.railway.app`)
6. Backend API URL: `https://dalabangunnusa-backend-production.up.railway.app/api`

## Step 2: Configure Railway CORS

1. Di Railway dashboard, klik service backend
2. Klik tab **"Variables"**
3. Tambahkan/update variable:
   ```
   ALLOWED_ORIGINS=https://your-hostinger-domain.com
   ```
   - Ganti `your-hostinger-domain.com` dengan domain Hostinger Anda
   - Contoh: `ALLOWED_ORIGINS=https://dalabangunnusa.com`

4. Railway akan auto-restart setelah update variable

## Step 3: Build Frontend untuk Production

### Option A: Manual Build (Recommended)

1. **Buat `.env.production` file** di root project:
   ```bash
   VITE_API_URL=https://your-railway-backend.up.railway.app/api
   VITE_USE_API=true
   ```
   - Ganti `your-railway-backend.up.railway.app` dengan Railway URL Anda
   - Pastikan ada `/api` di akhir URL

2. **Build frontend:**
   ```bash
   npm run build
   ```

3. **Output:** Folder `dist/` akan berisi file-file yang siap di-upload

### Option B: Menggunakan Build Script

**Windows:**
```bash
# Edit scripts/build-production.bat terlebih dahulu untuk update Railway URL
# Atau buat .env.production manual seperti Option A
scripts\build-production.bat hostinger
```

**Linux/Mac:**
```bash
# Edit scripts/build-production.sh terlebih dahulu untuk update Railway URL
# Atau buat .env.production manual seperti Option A
./scripts/build-production.sh hostinger
```

## Step 4: Upload ke Hostinger

### Via cPanel File Manager

1. Login ke cPanel Hostinger
2. Buka **File Manager**
3. Navigate ke `public_html/` (atau folder root website Anda)
4. **Hapus semua file lama** (backup dulu jika perlu)
5. **Upload semua file dari folder `dist/`**:
   - Pilih semua file di `dist/`
   - Upload ke `public_html/`
   - Pastikan `index.html` ada di root `public_html/`

### Via FTP

1. Gunakan FTP client (FileZilla, WinSCP, dll)
2. Connect ke Hostinger FTP
3. Navigate ke `public_html/`
4. Upload semua file dari folder `dist/` ke `public_html/`
5. Pastikan `index.html` ada di root

### Via Git (jika Hostinger support)

1. Push `dist/` folder ke branch khusus
2. Setup auto-deploy di Hostinger (jika tersedia)

## Step 5: Verify Deployment

1. **Test Frontend:**
   - Buka website: `https://your-hostinger-domain.com`
   - Pastikan semua halaman bisa diakses
   - Test navigation

2. **Test API Connection:**
   - Buka browser console (F12)
   - Check Network tab
   - Pastikan API calls ke Railway berhasil
   - Test admin panel: `/dcg-login`

3. **Test Admin Panel:**
   - Login di `/dcg-login`
   - Test Content Management
   - Test Portfolio Management
   - Test Visitor Log

## Troubleshooting

### Website tidak tampil
- Pastikan `index.html` ada di root `public_html/`
- Check file permissions (644 untuk files, 755 untuk folders)
- Check `.htaccess` sudah di-upload (jika ada)

### API tidak connect
- Check `VITE_API_URL` di build sudah benar
- Check Railway backend masih running
- Check CORS setting di Railway (`ALLOWED_ORIGINS`)
- Check browser console untuk error

### Admin panel tidak bisa login
- Pastikan backend Railway masih running
- Check API URL di browser console
- Pastikan `VITE_USE_API=true` saat build

### Portfolio/Content tidak tampil
- Check `VITE_USE_API` value (harus `true` untuk production)
- Check browser console untuk error
- Pastikan backend Railway accessible

## Important Notes

1. **Build Time Variables:**
   - `VITE_API_URL` dan `VITE_USE_API` harus di-set saat build
   - Tidak bisa diubah setelah build tanpa rebuild

2. **Railway Auto-Deploy:**
   - Railway akan auto-deploy setiap push ke branch yang terhubung
   - Pastikan Railway service selalu running

3. **CORS Configuration:**
   - Railway `ALLOWED_ORIGINS` harus include domain Hostinger
   - Format: `https://your-domain.com` (tanpa trailing slash)

4. **File Structure di Hostinger:**
   ```
   public_html/
   ├── index.html
   ├── assets/
   │   ├── index-xxx.js
   │   └── index-xxx.css
   └── images/
       └── ...
   ```

## Next Steps

Setelah deployment berhasil:
- Monitor Railway usage (free tier $5/month)
- Setup custom domain di Railway (optional)
- Setup SSL certificate di Hostinger (jika belum)
- Monitor website performance

## Support

Jika ada masalah:
1. Check Railway logs
2. Check browser console
3. Check Hostinger error logs
4. Review `docs/DEPLOYMENT.md` untuk detail lebih lengkap

