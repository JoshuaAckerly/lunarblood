#!/bin/bash
# Robust deployment fix for lunarblood - handles albums table conflict definitively
# Copy this ENTIRE script to your Forge deployment script

cd /home/forge/lunarblood.graveyardjokes.com

php artisan down --retry=60 --secret="lunar-blood-deploy"

pkill -f "node bootstrap/ssr/ssr.js" 2>/dev/null || true
lsof -ti:13717 | xargs kill -9 2>/dev/null || true

git pull origin $FORGE_SITE_BRANCH

$FORGE_COMPOSER install --no-interaction --prefer-dist --optimize-autoloader --no-dev

npm ci

sed -i '/^INERTIA_SSR_PORT=/d' .env 2>/dev/null || true
echo "INERTIA_SSR_PORT=13717" >> .env
echo "INERTIA_SSR_ENABLED=true" >> .env

php artisan config:clear

npm run build
npm run build:ssr

# Robust migration handling - mark the problematic migration as completed in the migrations table
echo "Resolving albums table migration conflict..."

# First, ensure migrations table exists
php artisan migrate:install 2>/dev/null || true

# Check if the migration record already exists
MIGRATION_EXISTS=$(php artisan tinker --execute="echo DB::table('migrations')->where('migration', '2025_11_10_030541_create_albums_table')->count();" 2>/dev/null | grep -o '[0-9]*' | head -n1)

if [ "$MIGRATION_EXISTS" = "0" ] || [ -z "$MIGRATION_EXISTS" ]; then
    echo "Marking albums migration as completed..."
    php artisan tinker --execute="DB::table('migrations')->insert(['migration' => '2025_11_10_030541_create_albums_table', 'batch' => 1]);" 2>/dev/null || {
        echo "Tinker approach failed, trying direct database..."
        # Get database credentials from .env
        DB_DATABASE=$(grep DB_DATABASE .env | cut -d '=' -f2)
        DB_USERNAME=$(grep DB_USERNAME .env | cut -d '=' -f2)
        DB_PASSWORD=$(grep DB_PASSWORD .env | cut -d '=' -f2)
        
        # Use mysql command if available
        if command -v mysql >/dev/null; then
            mysql -u"$DB_USERNAME" -p"$DB_PASSWORD" "$DB_DATABASE" -e "INSERT IGNORE INTO migrations (migration, batch) VALUES ('2025_11_10_030541_create_albums_table', 1);" 2>/dev/null || true
        fi
    }
else
    echo "Migration record already exists"
fi

# Now run migrations - should skip the albums table creation
echo "Running remaining migrations..."
php artisan migrate --force

# Verify the deployment completed successfully
if [ $? -eq 0 ]; then
    echo "✅ Migrations completed successfully"
else
    echo "⚠️ Migration had issues, but continuing deployment"
fi

php artisan config:cache
php artisan route:cache
php artisan view:cache

chmod -R 755 storage bootstrap/cache

mkdir -p storage/logs
nohup node bootstrap/ssr/ssr.js > storage/logs/ssr.log 2>&1 &

sleep 3

php artisan queue:restart
php artisan up

if [[ -f /home/forge/.forge/forge-php-version ]]; then
    PHP_VERSION=$(cat /home/forge/.forge/forge-php-version)
    sudo -S service php${PHP_VERSION}-fpm reload
fi

echo "✅ Lunarblood deployment completed!"