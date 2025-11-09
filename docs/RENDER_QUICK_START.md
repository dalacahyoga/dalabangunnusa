# Render.com Quick Start Guide

Panduan cepat deploy backend ke Render.com untuk PT. DaLa Bangun Nusa.

## Prerequisites

- ✅ Akun GitHub dengan repository `dalabangunnusa`
- ✅ Code sudah di-push ke GitHub
- ✅ Akun Render.com (buat di https://render.com)

---

## Step-by-Step Deployment

### 1. Login ke Render

1. Kunjungi https://render.com
2. Klik "Get Started for Free"
3. Sign up dengan GitHub (recommended) atau email
4. Verifikasi email jika diperlukan

### 2. Create Web Service

1. Di dashboard, klik **"New +"**
2. Pilih **"Web Service"**
3. Connect GitHub repository:
   - Klik "Connect account" jika belum connect
   - Authorize Render untuk akses GitHub
   - Pilih repository `dalabangunnusa`
   - Klik **"Connect"**

### 3. Configure Service

Isi form dengan settings berikut:

| Field | Value |
|-------|-------|
| **Name** | `dalabangunnusa-backend` |
| **Region** | `Singapore` (atau terdekat) |
| **Branch** | `main` |
| **Root Directory** | (kosongkan) |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Plan** | `Free` |

### 4. Set Environment Variables

Klik **"Advanced"** → scroll ke **"Environment Variables"**

Tambahkan 3 variables:

```
NODE_ENV = production
PORT = 3001
ALLOWED_ORIGINS = https://your-hostinger-domain.com
```

**Catatan:**
- Ganti `your-hostinger-domain.com` dengan domain Hostinger Anda
- Jika juga pakai Netlify, tambahkan: `https://your-hostinger-domain.com,https://your-netlify.netlify.app`

### 5. Deploy

1. Scroll ke bawah
2. Klik **"Create Web Service"**
3. Render akan mulai build
4. Tunggu sampai status **"Live"** (hijau)
   - Build pertama kali: ~5-10 menit
   - Deploy berikutnya: ~2-3 menit

### 6. Get Backend URL

Setelah deploy selesai:

1. Di dashboard, klik service `dalabangunnusa-backend`
2. Copy URL di bagian atas (contoh: `https://dalabangunnusa-backend.onrender.com`)
3. Backend API URL: `https://dalabangunnusa-backend.onrender.com/api`
4. **Simpan URL ini** untuk konfigurasi frontend

### 7. Test Backend

Buka di browser:
```
https://your-backend-url.onrender.com/api/health
```

Harus return:
```json
{"status":"ok","timestamp":"2024-..."}
```

Jika error, check **"Logs"** tab di Render dashboard.

---

## Update Environment Variables

Jika perlu update `ALLOWED_ORIGINS`:

1. Di Render dashboard, pilih service
2. Klik **"Environment"** tab
3. Edit `ALLOWED_ORIGINS`
4. Klik **"Save Changes"**
5. Service akan auto-redeploy

---

## Auto-Deploy dari GitHub

Render otomatis deploy setiap kali push ke branch `main`:

1. Push code ke GitHub
2. Render detect perubahan
3. Auto-trigger build & deploy
4. Check status di Render dashboard

---

## Free Tier Limitations

### Auto-Sleep
- Service akan **auto-sleep** setelah **15 menit** tidak ada request
- Request pertama setelah sleep: **~30 detik** (cold start)
- Request berikutnya: normal speed

### Cara Menghindari Sleep
1. **Setup Uptime Monitor** (gratis):
   - UptimeRobot: https://uptimerobot.com
   - Setup monitor setiap 10 menit
   - URL: `https://your-backend.onrender.com/api/health`

2. **Upgrade ke Paid Plan** ($7/bulan):
   - Tidak ada auto-sleep
   - Always-on service

### Monthly Hours
- **750 jam/bulan** gratis
- Cukup untuk 24/7 (31 hari × 24 jam = 744 jam)
- Jika melebihi, service akan pause sampai bulan berikutnya

---

## Troubleshooting

### Build Failed
- Check **"Logs"** tab di Render
- Pastikan `package.json` ada di root
- Pastikan `npm start` script ada di `package.json`

### Service Not Starting
- Check logs untuk error message
- Pastikan `PORT` environment variable sudah di-set
- Pastikan `npm start` command benar

### CORS Error
- Pastikan `ALLOWED_ORIGINS` sudah include domain frontend
- Format: `https://domain1.com,https://domain2.com` (tanpa spasi)
- Restart service setelah update environment variable

### 502 Bad Gateway
- Service mungkin sedang sleep (free tier)
- Tunggu ~30 detik untuk cold start
- Atau setup uptime monitor

### File Upload Error
- Pastikan folder `public/images/portfolio` ada
- Check logs untuk permission error
- Render free tier support file system write

---

## Monitoring

### View Logs
1. Di Render dashboard, pilih service
2. Klik **"Logs"** tab
3. Real-time logs akan muncul

### Metrics
- **"Metrics"** tab: CPU, Memory usage
- **"Events"** tab: Deploy history

---

## Next Steps

Setelah backend deployed:

1. **Update Frontend**:
   - Set `VITE_API_URL` ke backend URL
   - Build frontend
   - Deploy ke Hostinger/Netlify

2. **Test Integration**:
   - Test API calls dari frontend
   - Test file uploads
   - Test admin features

3. **Setup Uptime Monitor** (optional):
   - Prevent auto-sleep
   - Monitor service health

---

## Support

Jika ada masalah:
1. Check Render logs
2. Check browser console (untuk frontend errors)
3. Test API endpoints langsung
4. Render documentation: https://render.com/docs

