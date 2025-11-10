#!/bin/bash

# Laravel Forge Production Deployment Script
echo "🚀 Deploying Lunar Blood to Production..."

cd $FORGE_SITE_PATH

# Enable maintenance mode
echo "🔧 Enabling maintenance mode..."
php artisan down --retry=60 --secret="lunar-blood-deploy"

# Pull latest changes
echo "📥 Pulling latest changes from Git..."
git pull origin main

# Install PHP dependencies (production optimized)
echo "📦 Installing PHP dependencies..."
composer install --no-dev --optimize-autoloader --no-interaction

# Install Node dependencies
echo "📦 Installing Node dependencies..."
npm ci --production

# Build frontend assets for production
echo "🏗️ Building production assets..."
npm run build

# Run database migrations
echo "🗄️ Running database migrations..."
php artisan migrate --force

# Clear all caches and optimize
echo "⚡ Optimizing application for production..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# Restart queue workers
echo "🔄 Restarting queue workers..."
php artisan queue:restart

# Set proper permissions
echo "🔐 Setting production file permissions..."
chmod -R 755 storage bootstrap/cache
chown -R forge:forge storage bootstrap/cache

# Disable maintenance mode
echo "✅ Disabling maintenance mode..."
php artisan up

echo "🎉 Production deployment completed successfully!"
echo "🌐 Application is live and ready!"

# Optional: Run tests in production (uncomment if needed)
# echo "🧪 Running production tests..."
# php artisan test --env=testing