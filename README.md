# PT. DaLa Bangun Nusa - React Vite Application

This is the official website for PT. DaLa Bangun Nusa, an experienced architecture and construction company established in 2015, specializing in designing and building temples, villas, pool bars, and restaurants.

**"Inspired by Bali, Designed for the Sacred."**

## Tech Stack

- **React** 18.3.1 - UI library
- **Vite** 5.4.1 - Build tool and dev server
- **React Router** 6.26.2 - Client-side routing
- **Bootstrap** 5.3.3 - CSS framework
- **Express** 4.18.2 - API server for visitor logs
- **ESLint** - Code linting

## Project Structure

```
dalabangunnusa/
├── public/                    # Static assets
│   └── images/               # Images and portfolio photos
├── src/
│   ├── assets/               # CSS and fonts
│   ├── components/          # Reusable React components
│   ├── pages/               # Page components
│   │   └── administrator/   # Admin pages (Login, Visitor Log, Content/Portfolio Management)
│   ├── utils/               # Utility functions
│   ├── App.jsx              # Main app component with routes
│   └── main.jsx             # Application entry point
├── data/                     # Server data files (JSON)
│   ├── visitor_logs.json    # Visitor logs
│   ├── content.json         # CMS content
│   └── portfolios.json      # Portfolio data
├── scripts/                  # Build and deployment scripts
│   ├── build-production.sh # Production build script (Linux/Mac)
│   ├── build-production.bat # Production build script (Windows)
│   └── deploy-hostinger.sh  # Hostinger deployment script
├── docs/                     # Documentation files
│   ├── DEPLOYMENT.md        # Deployment guide
│   ├── ENV_SETUP.md         # Environment setup
│   ├── VISITOR_LOG_SETUP.md # Visitor log setup
│   └── ...                  # Other documentation
├── netlify/                  # Netlify serverless functions
├── server.js                 # Express API server
├── railway.json             # Railway.app configuration
├── render.yaml              # Render.com configuration
├── netlify.toml             # Netlify configuration
└── package.json             # Dependencies and scripts
```

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
# Frontend only
npm run dev

# API server only
npm run dev:server

# Both (frontend + API server)
npm run dev:all
```

### Build

```bash
npm run build
```

Build output akan berada di folder `dist/`.

## Deployment

Website ini dapat di-deploy dengan 2 opsi:

### OPSI A: FE di Hostinger + BE di VPS Free
- **Frontend**: Hostinger (static hosting)
- **Backend**: VPS Free (Railway, Render, dll)

### OPSI B: FE di Netlify + BE di VPS Free
- **Frontend**: Netlify (static hosting)
- **Backend**: VPS Free (Railway, Render, dll)

**Lihat `docs/DEPLOYMENT.md` untuk panduan lengkap deployment.**

### Quick Deploy

**OPSI A - Hostinger:**
1. ✅ Backend sudah di Railway (atau deploy ke Render.com/Railway - lihat `docs/RENDER_QUICK_START.md` atau `docs/RAILWAY_QUICK_START.md`)
2. **Buat `.env.production`** dengan Railway backend URL:
   ```
   VITE_API_URL=https://your-railway-backend.up.railway.app/api
   VITE_USE_API=true
   ```
3. **Build:** `npm run build` (atau `./scripts/build-production.sh hostinger https://your-railway-backend.up.railway.app/api`)
4. **Upload:** Upload semua file dari `dist/` ke Hostinger `public_html/`
5. **Lihat:** `docs/HOSTINGER_RAILWAY_DEPLOY.md` untuk panduan lengkap

**OPSI B - Netlify:**
1. Deploy backend ke Render.com (recommended - free forever) atau Railway (lihat `docs/RENDER_QUICK_START.md` atau `docs/DEPLOYMENT.md`)
2. Connect repository ke Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Set environment variable: `VITE_API_URL=https://your-backend-url.com/api`

## Features

- ✅ Responsive design (Desktop & Mobile)
- ✅ Portfolio gallery dengan lightbox
- ✅ Visitor log system dengan admin panel
- ✅ Auto-scroll client logos
- ✅ WhatsApp floating button
- ✅ SEO-friendly routing

## Routes

- `/` - Home
- `/about` - About Us
- `/portfolio` - Portfolio List
- `/portfolio/:id` - Portfolio Detail
- `/contact` - Contact Us
- `/dcg-login` - Admin Login
- `/dcg-visitor` - Visitor Log (Protected)
- `/dcg-content` - Content Management (Protected)

## Environment Variables

### Development
Create `.env` file:
```env
VITE_API_URL=http://localhost:3001/api
PORT=3001
```

### Production
Lihat `env.example.txt` untuk contoh konfigurasi production.

**Backend (VPS):**
- `PORT=3001` - Server port
- `ALLOWED_ORIGINS=https://your-domain.com,https://your-netlify.netlify.app` - CORS origins

**Frontend:**
- `VITE_API_URL=https://your-backend-url.com/api` - Backend API URL

## License

© 2024 PT. DaLa Bangun Nusa. All Rights Reserved.
