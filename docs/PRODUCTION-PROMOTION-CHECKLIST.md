# Lunarblood Production Promotion Checklist

Use this checklist to promote verified changes from test/staging to production safely.

## Change Meta

- Date (UTC): __________
- Release Owner: __________
- Approver: __________
- Source Branch: __________
- Target Branch: `main`
- Commit SHA: __________
- Deployment Window: __________
- Rollback Owner: __________

## 1) Pre-Flight Gate (Must Pass Before Deploy)

- [ ] Confirm no unresolved critical/high issues from current sprint notes.
- [ ] Confirm latest code is pushed and reviewed for production (`main`).
- [ ] Confirm maintenance/incident channels are monitored.
- [ ] Confirm database backup exists for current production state.
- [ ] Confirm `.env` values are correct for production (`APP_ENV=production`, `APP_DEBUG=false`, SSR settings present).
- [ ] Confirm required services are healthy: `nginx`, `php8.3-fpm`, `mysql`, `redis-server`.

### Pre-Flight Verification Commands

Run on production server at `/var/www/lunarblood`:

```bash
pwd
php -v
node -v
composer -V
npm -v

git status -sb
git rev-parse --abbrev-ref HEAD

grep -E "^APP_ENV=|^APP_DEBUG=|^INERTIA_SSR_ENABLED=|^INERTIA_SSR_URL=|^INERTIA_SSR_PORT=" .env

sudo systemctl status nginx --no-pager
sudo systemctl status php8.3-fpm --no-pager
sudo systemctl status mysql --no-pager
sudo systemctl status redis-server --no-pager
```

## 2) Deploy Steps (Production)

- [ ] SSH to production host.
- [ ] Move to deployment path: `/var/www/lunarblood`.
- [ ] Run deployment script.
- [ ] Confirm migrations complete.
- [ ] Confirm caches rebuilt and services restarted.

### Deploy Command

```bash
cd /var/www/lunarblood
./deploy-production.sh
```

## 3) Post-Deploy Verification (Must Pass Before Sign-Off)

- [ ] Home page loads successfully.
- [ ] Dashboard route loads for authenticated user.
- [ ] Profile settings page loads and profile update works.
- [ ] SSR process is active on port `13715`.
- [ ] Queue workers healthy (if configured).
- [ ] No new critical errors in Laravel/SSR logs.

### Post-Deploy Verification Commands

Run on production server:

```bash
cd /var/www/lunarblood

php artisan route:list --path=settings/profile
php artisan migrate:status

lsof -i :13715
pm2 list | grep lunarblood-ssr

tail -n 80 storage/logs/laravel.log
tail -n 80 storage/logs/ssr.log
```

## 4) Rollback Plan (If Any Verification Fails)

- [ ] Announce rollback start in ops channel.
- [ ] Identify last known good commit SHA.
- [ ] Reset app to known good commit.
- [ ] Reinstall dependencies and rebuild SSR bundle.
- [ ] Re-run migrations only if safe/required for rollback strategy.
- [ ] Restart services and validate critical routes.
- [ ] Capture rollback cause and follow-up actions.

### Rollback Commands (Server)

```bash
cd /var/www/lunarblood

# Replace with known good commit
git fetch origin main
git reset --hard <KNOWN_GOOD_SHA>

composer install --no-interaction --prefer-dist --no-progress --optimize-autoloader --classmap-authoritative --no-dev
npm ci --production=false
npm run build:ssr

php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

sudo systemctl reload php8.3-fpm
pm2 restart lunarblood-ssr
```

## 5) Sign-Off

- [ ] Deployment completed successfully.
- [ ] Verification checklist completed and attached.
- [ ] Any deviations documented.
- [ ] Monitoring handoff confirmed.

### Sign-Off Record

- Release Owner Sign-Off: __________
- Approver Sign-Off: __________
- Completed At (UTC): __________
- Notes / Deviations: __________________________________________
