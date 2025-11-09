# Railway.app Quick Start Guide

Panduan cepat deploy backend ke Railway.app untuk PT. DaLa Bangun Nusa.

## Prerequisites

- ✅ Akun GitHub dengan repository `dalabangunnusa`
- ✅ Code sudah di-push ke GitHub
- ✅ Akun Railway.app (buat di https://railway.app)
- ⚠️ **Note**: Railway free tier memberikan $5 credit per bulan. Setelah habis, service akan pause.

---

## Step-by-Step Deployment

### 1. Login ke Railway

1. Kunjungi https://railway.app
2. Klik "Start a New Project" atau "Login"
3. Sign up dengan GitHub (recommended) atau email
4. Authorize Railway untuk akses GitHub

### 2. Create New Project

1. Di dashboard, klik **"New Project"**
2. Pilih **"Deploy from GitHub repo"**
3. Pilih repository `dalabangunnusa`
4. Railway akan otomatis detect project

### 3. Configure Service

Railway akan auto-detect konfigurasi dari `package.json` dan `railway.json`.

**Settings yang akan auto-detect:**
- **Build Command**: `npm install` (dari railway.json)
- **Start Command**: `npm start` (dari package.json)
- **Node Version**: Auto-detect dari package.json

**Jika perlu manual configure:**
1. Klik service name
2. Klik **"Settings"** tab
3. Pastikan:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 4. Set Environment Variables

1. Di service dashboard, klik **"Variables"** tab
2. Klik **"New Variable"**
3. Tambahkan variables berikut:

```
NODE_ENV = production
PORT = 3001
ALLOWED_ORIGINS = https://your-hostinger-domain.com
```

**Catatan:**
- Ganti `your-hostinger-domain.com` dengan domain Hostinger Anda
- Jika juga pakai Netlify, tambahkan: `https://your-hostinger-domain.com,https://your-netlify.netlify.app`
- Railway akan otomatis set `PORT`, tapi kita set manual untuk konsistensi

### 5. Deploy

1. Railway akan otomatis deploy setelah connect repository
2. Atau klik **"Deploy"** button jika perlu manual deploy
3. Tunggu sampai status **"Active"** (hijau)
   - Build pertama kali: ~3-5 menit
   - Deploy berikutnya: ~1-2 menit

### 6. Get Backend URL

Setelah deploy selesai:

1. Di service dashboard, klik **"Settings"** tab
2. Scroll ke **"Domains"** section
3. Railway akan generate domain otomatis:
   - Format: `https://your-service-name.up.railway.app`
   - Atau bisa set custom domain
4. Backend API URL: `https://your-service-name.up.railway.app/api`
5. **Simpan URL ini** untuk konfigurasi frontend

### 7. Test Backend

Buka di browser:
```
https://your-service-name.up.railway.app/api/health
```

Harus return:
```json
{"status":"ok","timestamp":"2024-..."}
```

Jika error, check **"Deployments"** tab → klik deployment → **"View Logs"**.

---

## Update Environment Variables

Jika perlu update `ALLOWED_ORIGINS`:

1. Di service dashboard, klik **"Variables"** tab
2. Edit variable yang ingin diubah
3. Klik **"Update"**
4. Service akan auto-redeploy

---

## Auto-Deploy dari GitHub

Railway otomatis deploy setiap kali push ke branch yang terhubung:

1. Push code ke GitHub
2. Railway detect perubahan
3. Auto-trigger build & deploy
4. Check status di Railway dashboard

**Configure Branch:**
1. Di service dashboard, klik **"Settings"**
2. Scroll ke **"Source"** section
3. Pilih branch (default: `main`)

---

## Railway Free Tier Limitations

### $5 Credit per Bulan
- Railway memberikan **$5 credit gratis** per bulan
- Setelah credit habis, service akan **pause**
- Credit reset setiap bulan

### Perkiraan Biaya
- Small service (~512MB RAM): ~$5-10/bulan
- Medium service (~1GB RAM): ~$10-20/bulan
- Dengan $5 credit: biasanya cukup untuk **1-2 minggu** (tergantung usage)

### Service Pause
- Jika credit habis, service akan pause
- Website tidak bisa diakses saat pause
- Perlu top-up atau upgrade untuk lanjut

### Cara Menghindari Pause
1. **Upgrade ke Paid Plan** ($5/bulan minimum)
2. **Monitor Usage** di Railway dashboard
3. **Optimize Resource** (gunakan plan terkecil yang cukup)

---

## Custom Domain (Optional)

1. Di service dashboard, klik **"Settings"** tab
2. Scroll ke **"Domains"** section
3. Klik **"Generate Domain"** (jika belum ada)
4. Atau **"Add Custom Domain"** untuk domain sendiri
5. Follow instructions untuk setup DNS

---

## Monitoring & Logs

### View Logs
1. Di service dashboard, klik **"Deployments"** tab
2. Pilih deployment terbaru
3. Klik **"View Logs"**
4. Real-time logs akan muncul

### Metrics
- **"Metrics"** tab: CPU, Memory, Network usage
- **"Deployments"** tab: Deploy history

---

## Troubleshooting

### Build Failed
- Check logs di **"Deployments"** tab
- Pastikan `package.json` ada di root
- Pastikan `npm start` script ada di `package.json`
- Check Node.js version compatibility

### Service Not Starting
- Check logs untuk error message
- Pastikan `PORT` environment variable sudah di-set
- Pastikan `npm start` command benar
- Check jika ada dependency yang missing

### CORS Error
- Pastikan `ALLOWED_ORIGINS` sudah include domain frontend
- Format: `https://domain1.com,https://domain2.com` (tanpa spasi)
- Restart service setelah update environment variable

### Service Paused
- Check **"Usage"** tab untuk credit status
- Credit habis = service pause
- Top-up atau upgrade untuk lanjut

### 502 Bad Gateway
- Service mungkin sedang build/deploy
- Check **"Deployments"** tab untuk status
- Tunggu sampai deployment selesai

### File Upload Error
- Pastikan folder `public/images/portfolio` ada
- Check logs untuk permission error
- Railway support file system write

---

## Cost Management

### Monitor Usage
1. Di dashboard, klik **"Usage"** tab
2. Lihat credit usage dan remaining
3. Set alerts untuk low credit

### Optimize Costs
1. Gunakan **smallest plan** yang cukup
2. Monitor resource usage
3. Disable unused services
4. Consider upgrade jika usage konsisten

---

## Next Steps

Setelah backend deployed:

1. **Update Frontend**:
   - Set `VITE_API_URL` ke Railway backend URL
   - Build frontend
   - Deploy ke Hostinger/Netlify

2. **Test Integration**:
   - Test API calls dari frontend
   - Test file uploads
   - Test admin features

3. **Monitor Usage**:
   - Check credit usage regularly
   - Set up alerts jika perlu

---

## Support

Jika ada masalah:
1. Check Railway logs
2. Check browser console (untuk frontend errors)
3. Test API endpoints langsung
4. Railway documentation: https://docs.railway.app
5. Railway Discord: https://discord.gg/railway

---

## Important Notes

⚠️ **Railway Free Tier:**
- $5 credit per bulan (bukan free selamanya)
- Service akan pause jika credit habis
- Cocok untuk testing/development
- Untuk production, consider upgrade atau pakai Render.com (free forever)

✅ **Alternatif Free Forever:**
- Render.com (750 jam/bulan, free forever)
- Fly.io (3 VMs, free forever)
- Cyclic.sh (100GB bandwidth, free forever)

