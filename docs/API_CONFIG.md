# API Configuration Guide

Panduan konfigurasi untuk memilih mode API atau static data.

## Environment Variable: `VITE_USE_API`

Konfigurasi untuk memilih apakah website akan menggunakan API atau langsung menggunakan static/default data.

### Mode API (Default)
- **Value**: `true` atau tidak di-set (default)
- **Behavior**: Website akan fetch data dari backend API
- **Fallback**: Jika API gagal/timeout, akan menggunakan default data

### Mode Static (No API)
- **Value**: `false`
- **Behavior**: Website langsung menggunakan default data tanpa fetch API
- **Use Case**: 
  - Backend tidak tersedia
  - Static hosting tanpa backend
  - Development tanpa backend
  - Testing offline

---

## Setup

### Development

**File**: `.env`

```env
# Mode API (default)
VITE_API_URL=http://localhost:3001/api
VITE_USE_API=true

# Mode Static (no API)
VITE_API_URL=http://localhost:3001/api
VITE_USE_API=false
```

### Production

**File**: `.env.production` (untuk build)

```env
# Mode API
VITE_API_URL=https://your-backend-url.com/api
VITE_USE_API=true

# Mode Static (no API)
VITE_USE_API=false
# VITE_API_URL tidak diperlukan jika false
```

---

## Cara Menggunakan

### Mode API (Default)

1. **Set Environment Variable**:
   ```env
   VITE_USE_API=true
   VITE_API_URL=https://your-backend-url.com/api
   ```

2. **Build**:
   ```bash
   npm run build
   ```

3. **Result**:
   - Website akan fetch data dari API
   - Jika API gagal, fallback ke default data

### Mode Static (No API)

1. **Set Environment Variable**:
   ```env
   VITE_USE_API=false
   ```

2. **Build**:
   ```bash
   npm run build
   ```

3. **Result**:
   - Website langsung menggunakan default data
   - Tidak ada API call
   - Lebih cepat, tidak perlu menunggu API

---

## Data yang Tersedia

### Portfolio Data (Static)
- 7 portfolio default dengan data lengkap
- Semua images, descriptions, dan metadata
- Sama dengan data di `data/portfolios.json`

### Content Data (Static)
- Home page content
- Portfolio page content
- About page content (termasuk principal section)
- Contact page content
- Sama dengan default content di server

---

## Use Cases

### 1. Development tanpa Backend
```env
VITE_USE_API=false
```
- Cocok untuk development frontend saja
- Tidak perlu run backend server
- Data langsung dari default

### 2. Static Hosting (Hostinger)
```env
VITE_USE_API=false
```
- Deploy ke static hosting tanpa backend
- Website tetap berfungsi penuh
- Portfolio dan content tetap tampil

### 3. Production dengan Backend
```env
VITE_USE_API=true
VITE_API_URL=https://your-backend-url.com/api
```
- Menggunakan data dari backend
- CMS tetap berfungsi
- Data bisa di-update via admin panel

### 4. Fallback Mode
```env
VITE_USE_API=true
VITE_API_URL=https://your-backend-url.com/api
```
- Default behavior
- Jika API gagal, otomatis fallback ke default data
- Website tetap berfungsi meskipun backend mati

---

## Testing

### Test Mode Static

1. **Set `.env`**:
   ```env
   VITE_USE_API=false
   ```

2. **Restart dev server**:
   ```bash
   npm run dev
   ```

3. **Check browser console**:
   - Harus ada log: "Using static portfolio data (API disabled)"
   - Harus ada log: "Using static content data (API disabled)"
   - Tidak ada API call di Network tab

### Test Mode API

1. **Set `.env`**:
   ```env
   VITE_USE_API=true
   VITE_API_URL=http://localhost:3001/api
   ```

2. **Run backend**:
   ```bash
   npm run dev:server
   ```

3. **Run frontend**:
   ```bash
   npm run dev
   ```

4. **Check browser console**:
   - Harus ada API calls di Network tab
   - Data dari API, bukan default

---

## Build Scripts

### Build untuk Static Mode

**Windows** (`scripts/build-production.bat`):
```bash
scripts\build-production.bat hostinger
# Edit .env.production: VITE_USE_API=false
npm run build
```

**Linux/Mac** (`scripts/build-production.sh`):
```bash
./scripts/build-production.sh hostinger
# Edit .env.production: VITE_USE_API=false
npm run build
```

### Build untuk API Mode

**Windows**:
```bash
# Edit .env.production: VITE_USE_API=true
# Edit .env.production: VITE_API_URL=https://your-backend-url.com/api
npm run build
```

**Linux/Mac**:
```bash
# Edit .env.production: VITE_USE_API=true
# Edit .env.production: VITE_API_URL=https://your-backend-url.com/api
npm run build
```

---

## Important Notes

1. **Build Time**: `VITE_USE_API` harus di-set saat build, tidak bisa diubah setelah build
2. **Default Value**: Jika tidak di-set, default adalah `true` (use API)
3. **Fallback**: Meskipun `VITE_USE_API=true`, jika API gagal akan fallback ke default data
4. **CMS**: Admin panel (Content Management, Portfolio Management) hanya berfungsi jika `VITE_USE_API=true` dan backend tersedia

---

## Troubleshooting

### Portfolio tidak tampil
- Check `VITE_USE_API` value
- Check browser console untuk error
- Pastikan default data ada di `portfolioLoader.js`

### Content tidak tampil
- Check `VITE_USE_API` value
- Check browser console untuk error
- Pastikan default content ada di `contentLoader.js`

### API masih dipanggil meskipun `VITE_USE_API=false`
- Pastikan rebuild setelah update `.env`
- Check `.env.production` untuk production build
- Clear browser cache

---

## Summary

| Mode | VITE_USE_API | Behavior | Use Case |
|------|--------------|----------|----------|
| API | `true` | Fetch dari API, fallback ke default | Production dengan backend |
| Static | `false` | Langsung pakai default data | Static hosting, development tanpa backend |

