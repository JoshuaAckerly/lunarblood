# Deployment Guide - Lunar Blood

## 🚀 Production Deployment

### Hypervisor Production Deployment

Lunar Blood uses Hypervisor for production deployment to AWS EC2.

### Quick Deploy to Production

```bash
# On production server
cd /var/www/lunarblood
./deploy-production.sh
```

### Production Server Requirements
- PHP 8.3+
- MySQL 8.0+
- Node.js 22+
- Nginx
- Redis
- Supervisor
- PM2 (for SSR management)

### Production Environment Variables

Copy `.env.example` to `.env` and update:

```bash
APP_NAME="Lunar Blood"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://lunarblood.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=lunarblood_prod
DB_USERNAME=lunarblood_prod
DB_PASSWORD=secure_password_here

INERTIA_SSR_ENABLED=true
INERTIA_SSR_URL=http://127.0.0.1:13715
INERTIA_SSR_PORT=13715

MAIL_FROM_ADDRESS=noreply@lunarblood.com
```

## 🧪 Test Server Deployment

For deploying to the polyrepo test server, see the main [TEST_DEPLOYMENT.md](../TEST_DEPLOYMENT.md) guide.

### Quick Deploy to Test Server

```bash
# On test server
cd /var/www/lunarblood
./deploy-test.sh
```

## ⚙️ Server Requirements

- PHP 8.3+
- MySQL 8.0+
- Node.js 22+
- Nginx
- Redis
- Supervisor

## 🔧 Environment Configuration

### Required Environment Variables

```env
APP_NAME="Lunar Blood"
APP_ENV=staging
APP_KEY=base64:...
APP_DEBUG=true
APP_URL=https://test-lunarblood.yourdomain.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=lunarblood
DB_USERNAME=lunarblood
DB_PASSWORD=test123password

INERTIA_SSR_ENABLED=true
INERTIA_SSR_URL=http://127.0.0.1:13715
INERTIA_SSR_PORT=13715
```

## 📝 Manual Deployment Steps

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Update"
   git push origin main
   ```

2. **SSH to test server and deploy**
   ```bash
   ssh user@YOUR_VM_IP
   cd /var/www/lunarblood
   ./deploy-test.sh
   ```

## 🚨 Troubleshooting

### Check Application Logs
```bash
tail -f storage/logs/laravel.log
tail -f storage/logs/ssr.log
```

### Verify SSR Server
```bash
lsof -i :13715  # Should show node process
ps aux | grep ssr.mjs
```

### Database Connection Issues
```bash
# Test database connection
php artisan tinker
>>> DB::connection()->getPdo();
```

### Clear All Caches
```bash
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Fix Permissions
```bash
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

### Restart Services
```bash
# Restart PHP-FPM
sudo systemctl restart php8.3-fpm

# Restart Nginx
sudo systemctl restart nginx

# Restart queue workers
sudo supervisorctl restart lunarblood-worker:*
```

## 📊 Monitoring

### Check Service Status
```bash
# Check all services
sudo systemctl status nginx
sudo systemctl status php8.3-fpm
sudo systemctl status mysql
sudo systemctl status redis-server

# Check queue workers
sudo supervisorctl status
```

### View Nginx Logs
```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```