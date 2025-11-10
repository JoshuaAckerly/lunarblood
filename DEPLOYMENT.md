# Deployment Guide - Lunar Blood

## 🏠 Local Development (Laravel Herd)

### Prerequisites
- Laravel Herd installed
- Node.js 18+ and npm
- Git configured

### Quick Deploy
```bash
chmod +x deploy-herd.sh
./deploy-herd.sh
```

### Manual Steps
1. **Pull latest changes**
   ```bash
   git pull origin main
   ```

2. **Install dependencies**
   ```bash
   composer install
   npm ci
   ```

3. **Build assets**
   ```bash
   npm run build
   ```

4. **Setup database**
   ```bash
   php artisan migrate
   php artisan db:seed
   ```

5. **Access application**
   - URL: `http://lunarblood.test`

---

## 🌐 Production (Laravel Forge)

### Prerequisites
- Laravel Forge server configured
- Domain pointed to server
- SSL certificate installed
- Database created

### Forge Setup
1. **Create new site in Forge**
   - Repository: `https://github.com/JoshuaAckerly/lunarblood.git`
   - Branch: `main`
   - Web Directory: `/public`

2. **Environment Variables**
   - Copy `.env.production` template
   - Update database credentials
   - Set `APP_KEY` (run `php artisan key:generate`)
   - Configure mail settings
   - Set proper `APP_URL`

3. **Deploy Script**
   - Use `deploy-forge.sh` as Forge deploy script
   - Enable "Quick Deploy" for automatic deployments

### Manual Production Deploy
```bash
chmod +x deploy-forge.sh
./deploy-forge.sh
```

### Post-Deploy Checklist
- [ ] SSL certificate active
- [ ] Database migrations completed
- [ ] Assets built and cached
- [ ] Queue workers running
- [ ] Cron jobs configured
- [ ] Error monitoring setup

---

## 🔧 Configuration

### Required Environment Variables
```env
APP_NAME="Lunar Blood"
APP_ENV=production
APP_KEY=base64:...
APP_DEBUG=false
APP_URL=https://yourdomain.com
DB_CONNECTION=mysql
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### Forge Daemon (Queue Worker)
```bash
Command: php artisan queue:work --sleep=3 --tries=3 --max-time=3600
Directory: /home/forge/yourdomain.com
User: forge
```

### Forge Scheduler
```bash
Command: php artisan schedule:run
User: forge
Frequency: Every Minute
```

---

## 🚨 Troubleshooting

### Common Issues

**Assets not loading**
```bash
npm run build
php artisan config:cache
```

**Database connection errors**
- Check `.env` database credentials
- Verify database exists in Forge
- Test connection: `php artisan tinker` → `DB::connection()->getPdo()`

**Permission errors**
```bash
chmod -R 755 storage bootstrap/cache
chown -R forge:forge storage bootstrap/cache
```

**Queue not processing**
```bash
php artisan queue:restart
# Check Forge daemon is running
```

### Rollback Procedure
```bash
git log --oneline -5  # Find previous commit
git reset --hard COMMIT_HASH
./deploy-forge.sh
```

---

## 📊 Monitoring

### Health Checks
- Application: `/up`
- API Status: `/api/health`

### Log Locations
- Laravel: `storage/logs/laravel.log`
- Nginx: `/var/log/nginx/`
- PHP: `/var/log/php8.2-fpm.log`

### Performance Monitoring
- Enable OPcache in production
- Monitor database query performance
- Set up application monitoring (Sentry, Bugsnag)

---

## 🔐 Security

### Production Security Checklist
- [ ] `APP_DEBUG=false`
- [ ] Strong `APP_KEY` generated
- [ ] Database credentials secure
- [ ] HTTPS enforced
- [ ] Rate limiting configured
- [ ] CSRF protection enabled
- [ ] Input validation implemented
- [ ] Error pages don't expose sensitive info