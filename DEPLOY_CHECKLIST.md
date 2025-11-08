# Deployment Checklist

## Pre-Deployment

- [ ] Test build lokal: `npm run build`
- [ ] Test preview: `npm run preview`
- [ ] Pastikan semua dependencies terinstall
- [ ] Check tidak ada error linting
- [ ] Test semua halaman berfungsi
- [ ] Test admin login (`/dcg-login`)
- [ ] Test visitor log API (jika menggunakan server)

## Netlify Deployment

- [ ] Connect repository ke Netlify
- [ ] Set build command: `npm run build`
- [ ] Set publish directory: `dist`
- [ ] Set Node.js version: `18` (atau sesuai)
- [ ] Set environment variable: `VITE_API_URL`
- [ ] Deploy dan test website
- [ ] Test semua routes berfungsi
- [ ] Test admin panel (`/dcg-login` → `/dcg`)

## Hostinger Deployment

- [ ] Build project: `npm run build`
- [ ] Upload semua file dari `dist/` ke `public_html/`
- [ ] Upload `.htaccess` dari `public/.htaccess` ke `public_html/`
- [ ] Set file permissions (644 untuk files, 755 untuk folders)
- [ ] Test website di browser
- [ ] Test semua routes berfungsi
- [ ] Test admin panel (`/dcg-login` → `/dcg`)
- [ ] (Optional) Setup API server jika menggunakan `server.js`

## Post-Deployment

- [ ] Test website di berbagai browser
- [ ] Test responsive design (mobile & desktop)
- [ ] Test semua links dan navigation
- [ ] Test portfolio gallery dan lightbox
- [ ] Test WhatsApp button
- [ ] Test admin login dan visitor log
- [ ] Check console untuk errors
- [ ] Test performance (PageSpeed Insights)

## Troubleshooting

### Netlify
- Check build logs di Netlify dashboard
- Verify environment variables
- Check redirect rules di `netlify.toml`

### Hostinger
- Check `.htaccess` sudah di-upload
- Verify file permissions
- Check Apache error logs di cPanel
- Verify mod_rewrite enabled

