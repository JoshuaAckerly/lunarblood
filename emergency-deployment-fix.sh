#!/bin/bash
# Emergency deployment fix for lunarblood - handles existing albums table
# Copy this ENTIRE script to replace your current Forge deployment script

cd /home/forge/lunarblood.graveyardjokes.com

# Enable maintenance mode
php artisan down --retry=60 --secret="lunar-blood-deploy"

# Kill existing SSR processes
pkill -f "node bootstrap/ssr/ssr.js" 2>/dev/null || true
lsof -ti:13717 | xargs kill -9 2>/dev/null || true

git pull origin $FORGE_SITE_BRANCH

$FORGE_COMPOSER install --no-interaction --prefer-dist --optimize-autoloader --no-dev

npm ci

# Configure SSR environment
sed -i '/^INERTIA_SSR_PORT=/d' .env 2>/dev/null || true
echo "INERTIA_SSR_PORT=13717" >> .env
if ! grep -q "INERTIA_SSR_ENABLED=true" .env; then
    echo "INERTIA_SSR_ENABLED=true" >> .env
fi

# Clear config
php artisan config:clear

# Build assets
npm run build
npm run build:ssr

# Handle database migrations safely - mark existing problematic migration as run
echo "Marking existing migrations as completed to avoid conflicts..."
php artisan migrate:status

# Mark the problematic albums migration as run if it hasn't been recorded
if ! php artisan migrate:status | grep -q "2025_11_10_030541_create_albums_table.*Ran"; then
    php artisan db:statement "INSERT IGNORE INTO migrations (migration, batch) VALUES ('2025_11_10_030541_create_albums_table', 1)"
fi

# Now run remaining migrations safely
php artisan migrate --force

# Laravel optimizations
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set permissions
chmod -R 755 storage bootstrap/cache

# Start SSR server
mkdir -p storage/logs
nohup node bootstrap/ssr/ssr.js > storage/logs/ssr.log 2>&1 &

# Wait for SSR
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

echo "Deployment completed - lunarblood is live!"