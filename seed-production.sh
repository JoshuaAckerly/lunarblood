#!/bin/bash

# Production Database Reset and Seeding Script
echo "🗄️ Resetting and seeding production database..."

# Wipe and rebuild the entire database with fresh migrations and seeding
echo "⚠️  WARNING: This will completely wipe the database!"
echo "🔄 Running migrate:fresh with seeding..."
php artisan migrate:fresh --force --seed

echo "✅ Production database reset and seeding completed!"
echo "📊 Database has been completely rebuilt with fresh data."