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
│   ├── images/               # Images and portfolio photos
│   └── .htaccess             # Apache config for Hostinger
├── src/
│   ├── assets/               # CSS and fonts
│   ├── components/          # Reusable React components
│   ├── pages/               # Page components
│   │   ├── administrator/   # Admin pages (Login, Visitor Log)
│   │   └── portfolio/        # Portfolio detail pages
│   ├── utils/               # Utility functions
│   ├── App.jsx              # Main app component with routes
│   └── main.jsx             # Application entry point
├── netlify/                  # Netlify serverless functions
├── server.js                 # Express API server
├── netlify.toml             # Netlify configuration
├── DEPLOYMENT.md            # Deployment guide
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

Website ini dapat di-deploy ke:
- **Netlify** - Static site hosting
- **Hostinger** - Shared hosting dengan Apache

Lihat `DEPLOYMENT.md` untuk panduan lengkap deployment.

### Quick Deploy

**Netlify:**
1. Connect repository ke Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Set environment variable: `VITE_API_URL`

**Hostinger:**
1. Build project: `npm run build`
2. Upload semua file dari `dist/` ke `public_html/`
3. Upload `.htaccess` dari `public/.htaccess` ke `public_html/`

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
- `/dcg` - Admin Dashboard (Protected)

## Environment Variables

Create `.env` file:
```env
VITE_API_URL=http://localhost:3001/api
PORT=3001
```

## License

© 2024 PT. DaLa Bangun Nusa. All Rights Reserved.
