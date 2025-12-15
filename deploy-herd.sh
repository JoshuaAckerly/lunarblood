#!/bin/bash

# Laravel Herd Local Development Deployment Script
echo "🚀 Deploying Lunar Blood to Laravel Herd..."

# Pull latest changes
echo "📥 Pulling latest changes from Git..."
git pull origin main

# Install/Update PHP dependencies
echo "📦 Installing PHP dependencies..."
composer install --no-dev --optimize-autoloader

# Install/Update Node dependencies
echo "📦 Installing Node dependencies..."
npm ci

# Build frontend assets
echo "🏗️ Building frontend assets..."
npm run build

# Wipe and rebuild database with seeding  
echo "🗄️ Wiping and rebuilding database..."
php artisan migrate:fresh --force --seed

# Clear and cache config
echo "⚡ Optimizing application..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set proper permissions
echo "🔐 Setting file permissions..."
chmod -R 755 storage bootstrap/cache

echo "✅ Deployment to Herd completed successfully!"
echo "🌐 Your application is ready at: http://lunarblood.test"