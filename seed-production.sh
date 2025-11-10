#!/bin/bash

# Production Database Seeding Script
echo "🌱 Seeding production database..."

# Check if data already exists to avoid duplicates
VENUE_COUNT=$(php artisan tinker --execute="echo App\Models\Venue::count();")
PRODUCT_COUNT=$(php artisan tinker --execute="echo App\Models\Product::count();")
ALBUM_COUNT=$(php artisan tinker --execute="echo App\Models\Album::count();")

if [ "$VENUE_COUNT" -eq 0 ]; then
    echo "📍 Seeding venues..."
    php artisan db:seed --force --class=VenueSeeder
else
    echo "📍 Venues already exist, skipping..."
fi

if [ "$PRODUCT_COUNT" -eq 0 ]; then
    echo "🛍️ Seeding products..."
    php artisan db:seed --force --class=ProductSeeder
else
    echo "🛍️ Products already exist, skipping..."
fi

if [ "$ALBUM_COUNT" -eq 0 ]; then
    echo "🎵 Seeding albums..."
    php artisan db:seed --force --class=AlbumSeeder
else
    echo "🎵 Albums already exist, skipping..."
fi

echo "✅ Production seeding completed!"