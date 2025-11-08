# Environment Variables Setup

## Development

Buat file `.env` di root project:

```env
VITE_API_URL=http://localhost:3001/api
PORT=3001
```

## Production

### Netlify

Set di Netlify Dashboard → Site settings → Environment variables:

```
VITE_API_URL = https://your-netlify-site.netlify.app/.netlify/functions/api
```

Atau jika menggunakan separate API server:

```
VITE_API_URL = https://your-api-domain.com/api
```

### Hostinger

**Option 1: Hardcode di production build**

Edit `src/utils/visitorLogger.js`:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'https://your-domain.com/api'
```

**Option 2: Set di Node.js environment (jika menggunakan server.js)**

Di cPanel → Node.js → Environment variables:
```
PORT=3001
```

## Important Notes

- File `.env` tidak di-commit ke git (sudah ada di `.gitignore`)
- Environment variables dengan prefix `VITE_` akan di-expose ke client-side
- Jangan simpan sensitive data di `VITE_*` variables

