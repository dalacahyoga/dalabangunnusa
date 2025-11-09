# Visitor Log Setup Guide

## Overview

Sistem visitor log sekarang menyimpan data ke **file JSON di server** (`visitor_logs.json`), bukan hanya localStorage. Semua akses user akan ter-write ke file yang sama di server.

## Cara Menjalankan

### 1. Install Dependencies

```bash
npm install
```

### 2. Jalankan Server API

Server API berjalan di port 3001 untuk menyimpan log ke file:

```bash
npm run dev:server
```

Atau jalankan bersamaan dengan Vite dev server:

```bash
npm run dev:all
```

**Note:** Untuk menjalankan `dev:all`, install `concurrently` terlebih dahulu:
```bash
npm install --save-dev concurrently
```

### 3. Jalankan Frontend (Terminal Terpisah)

```bash
npm run dev
```

## File Log

Log disimpan di file: **`visitor_logs.json`** di root project.

File ini berisi array JSON dengan semua log pengunjung dari semua user yang mengakses website.

## Konfigurasi

### Environment Variables

Buat file `.env` di root project:

```env
VITE_API_URL=http://localhost:3001/api
```

Untuk production, ubah ke URL server production Anda.

### Port Server

Default port: **3001**

Untuk mengubah port, set environment variable:
```bash
PORT=3002 npm run dev:server
```

## API Endpoints

- `POST /api/log-visitor` - Menyimpan log pengunjung
- `GET /api/visitor-logs` - Mendapatkan semua log
- `DELETE /api/visitor-logs` - Menghapus semua log
- `GET /api/visitor-stats` - Mendapatkan statistik
- `GET /api/health` - Health check

## Production Deployment

### Option 1: Deploy Server Terpisah

1. Deploy `server.js` ke server Node.js (misalnya menggunakan PM2)
2. Set `VITE_API_URL` di environment production
3. Deploy frontend seperti biasa

### Option 2: Serverless Function

Anda bisa mengubah `server.js` menjadi serverless function (Vercel, Netlify, dll)

### Option 3: PHP Alternative

Jika hosting tidak support Node.js, bisa dibuat PHP endpoint sederhana untuk menyimpan ke file.

## Backup

Sistem juga menyimpan log ke **localStorage** sebagai backup jika server tidak tersedia. Tapi untuk centralized logging, semua data akan tersimpan di `visitor_logs.json` di server.

## Security Note

File `visitor_logs.json` berisi data sensitif. Pastikan:
- File tidak di-commit ke git (sudah ada di `.gitignore`)
- Set proper file permissions di server
- Jangan expose file langsung via web server

## Troubleshooting

### Server tidak bisa diakses

- Pastikan port 3001 tidak digunakan aplikasi lain
- Cek firewall settings
- Pastikan CORS sudah di-enable di server

### Log tidak tersimpan

- Cek console browser untuk error
- Pastikan server API berjalan
- Cek file `visitor_logs.json` permissions

