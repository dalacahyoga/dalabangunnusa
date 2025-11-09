# Scripts

Folder ini berisi script-script untuk build dan deployment.

## Files

- **build-production.sh** - Production build script untuk Linux/Mac
- **build-production.bat** - Production build script untuk Windows
- **deploy-hostinger.sh** - Script untuk deploy ke Hostinger

## Usage

### Build Production

**Linux/Mac:**
```bash
./scripts/build-production.sh hostinger
# atau
./scripts/build-production.sh netlify
```

**Windows:**
```bash
scripts\build-production.bat hostinger
# atau
scripts\build-production.bat netlify
```

### Deploy ke Hostinger

**Linux/Mac:**
```bash
./scripts/deploy-hostinger.sh
```

## Notes

- Script akan membuat `.env.production` file
- Build output akan berada di folder `dist/`
- Pastikan sudah set environment variables sebelum build

