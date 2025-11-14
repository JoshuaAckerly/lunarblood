#!/bin/bash
# Safe Forge deployment script for Lunar Blood - handles existing database
# Copy this entire script to your Forge deployment script

cd /home/forge/lunarblood.graveyardjokes.com

# Enable maintenance mode
php artisan down --retry=60 --secret="lunar-blood-deploy"

# Kill existing SSR processes
pkill -f "node bootstrap/ssr/ssr.js" 2>/dev/null || true
lsof -ti:13717 | xargs kill -9 2>/dev/null || true

git pull origin $FORGE_SITE_BRANCH

$FORGE_COMPOSER install --no-interaction --prefer-dist --optimize-autoloader --no-dev

npm ci

# Configure SSR environment before building
if ! grep -q "INERTIA_SSR_PORT=13717" .env; then
    echo "INERTIA_SSR_PORT=13717" >> .env
fi
if ! grep -q "INERTIA_SSR_ENABLED=true" .env; then
    echo "INERTIA_SSR_ENABLED=true" >> .env
fi

# Clear config before building
php artisan config:clear

# Build frontend assets and SSR
npm run build
npm run build:ssr

# Safe database migration (no fresh)
php artisan migrate --force

# Only seed if database is truly empty
if [ "$(php artisan tinker --execute="echo \App\Models\User::count();" 2>/dev/null)" = "0" ]; then
    php artisan db:seed --force
fi

# Laravel optimizations
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set permissions
chmod -R 755 storage bootstrap/cache

# Start SSR server
mkdir -p storage/logs
nohup node bootstrap/ssr/ssr.js > storage/logs/ssr.log 2>&1 &

# Wait for SSR to start
sleep 3

# Restart queue workers
php artisan queue:restart

# Disable maintenance mode
php artisan up

# Reload PHP-FPM
if [[ -f /home/forge/.forge/forge-php-version ]]; then
    PHP_VERSION=$(cat /home/forge/.forge/forge-php-version)
    sudo -S service php${PHP_VERSION}-fpm reload
fi