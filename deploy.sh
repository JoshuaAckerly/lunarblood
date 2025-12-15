#!/bin/bash
# Laravel Forge Deployment Script for Lunar Blood
# Copy this entire content to your Forge site's deployment script

set -e

# Configuration
SSR_PORT=13717
PROJECT_NAME="lunarblood"
SITE_PATH="/home/forge/lunarblood.graveyardjokes.com"

echo "🚀 Starting deployment for $PROJECT_NAME with SSR on port $SSR_PORT"

cd $SITE_PATH

# Enable maintenance mode
echo "🔧 Enabling maintenance mode..."
php artisan down --retry=60 --secret="lunar-blood-deploy"

# Stop existing SSR processes first
echo "🛑 Stopping existing SSR processes..."
pkill -f "node bootstrap/ssr/ssr.js" 2>/dev/null || true
lsof -ti:$SSR_PORT | xargs kill -TERM 2>/dev/null || true
sleep 2
lsof -ti:$SSR_PORT | xargs kill -9 2>/dev/null || true

# Update Git repository
echo "📦 Pulling latest code..."
git pull origin $FORGE_SITE_BRANCH

# Update PHP dependencies
echo "🐘 Installing PHP dependencies..."
$FORGE_COMPOSER install --no-interaction --prefer-dist --optimize-autoloader --no-dev

# Update Node dependencies
echo "📦 Installing Node dependencies..."
npm ci

# Update environment configuration for SSR
echo "⚙️ Configuring environment..."
# Remove old SSR port entries
sed -i '/^INERTIA_SSR_PORT=/d' .env 2>/dev/null || true
# Add correct SSR port
echo "INERTIA_SSR_PORT=$SSR_PORT" >> .env

# Ensure SSR is enabled
if ! grep -q "INERTIA_SSR_ENABLED=true" .env; then
    echo "INERTIA_SSR_ENABLED=true" >> .env
fi

# Clear caches before building
echo "🧹 Clearing caches..."
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

# Build frontend assets
echo "🎨 Building frontend assets..."
npm run build

# Build SSR bundle
echo "🔨 Building SSR bundle..."
npm run build:ssr

# Verify SSR bundle exists
if [ ! -f "bootstrap/ssr/ssr.js" ]; then
    echo "❌ SSR bundle not found after build!"
    echo "📋 Checking directory structure..."
    ls -la bootstrap/
    exit 1
fi

# Database operations
echo "🗄️ Running database migrations..."
if [ -f artisan ]; then
    # Use regular migrate instead of migrate:fresh to avoid conflicts
    php artisan migrate --force
    
    # Only seed if this is a fresh database (check if users table is empty)
    USER_COUNT=$(php artisan tinker --execute="echo App\Models\User::count();" 2>/dev/null | grep -o '[0-9]*' | head -n1)
    if [ "$USER_COUNT" = "0" ] || [ -z "$USER_COUNT" ]; then
        echo "🌱 Database appears empty, running seeders..."
        php artisan db:seed --force
    else
        echo "📊 Database has existing data, skipping seeders"
    fi
fi

# Cache optimizations
echo "⚡ Optimizing Laravel..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# Set proper permissions
echo "🔐 Setting production file permissions..."
chmod -R 755 storage bootstrap/cache
chown -R forge:forge storage bootstrap/cache

# Create SSR log directory
mkdir -p storage/logs

# Start SSR process
echo "🚀 Starting SSR process on port $SSR_PORT..."
nohup node bootstrap/ssr/ssr.js > storage/logs/ssr.log 2>&1 &
SSR_PID=$!

# Wait for SSR to start
echo "⏳ Waiting for SSR to start..."
sleep 5

# Verify SSR is running
if kill -0 $SSR_PID 2>/dev/null; then
    echo "✅ SSR process started (PID: $SSR_PID)"
    
    # Test SSR endpoint
    for i in {1..10}; do
        if curl -s "http://127.0.0.1:$SSR_PORT" > /dev/null; then
            echo "✅ SSR endpoint responding on port $SSR_PORT"
            break
        fi
        if [ $i -eq 10 ]; then
            echo "⚠️ SSR endpoint not responding after 10 attempts"
            echo "📋 SSR log output:"
            tail -20 storage/logs/ssr.log
            # Don't exit - let the deployment continue
        fi
        sleep 1
    done
else
    echo "❌ SSR process failed to start"
    echo "📋 SSR log output:"
    tail -20 storage/logs/ssr.log
    # Don't exit - deployment should continue without SSR
fi

# Restart queue workers
echo "🔄 Restarting queue workers..."
php artisan queue:restart

# Disable maintenance mode
echo "✅ Disabling maintenance mode..."
php artisan up

# Reload PHP-FPM
echo "🔄 Reloading PHP-FPM..."
if [[ -f /home/forge/.forge/forge-php-version ]]; then
    PHP_VERSION=$(cat /home/forge/.forge/forge-php-version)
    sudo -S service php${PHP_VERSION}-fpm reload
else
    sudo -S service php8.2-fpm reload
fi

echo "🎉 Deployment completed!"
echo "📊 Deployment summary:"
echo "   - Project: $PROJECT_NAME"
echo "   - Site path: $SITE_PATH"
echo "   - SSR port: $SSR_PORT"
echo "   - SSR status: $(if kill -0 $SSR_PID 2>/dev/null; then echo 'Running'; else echo 'Not running'; fi)"

# Final verification
if [ -f bootstrap/ssr/ssr.js ]; then
    echo "   - SSR bundle: ✅ Present"
else
    echo "   - SSR bundle: ❌ Missing"
fi

echo "🌐 Lunar Blood is now live and ready!"