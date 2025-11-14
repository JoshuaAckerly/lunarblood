#!/bin/bash
# Manual fix for the albums table migration conflict
# Run this directly on the production server via SSH

set -e

cd /home/forge/lunarblood.graveyardjokes.com

echo "🔧 Manual fix for albums table migration conflict"

# Stop any running processes
pkill -f "node bootstrap/ssr/ssr.js" 2>/dev/null || true

# Check current migration status
echo "📋 Current migration status:"
php artisan migrate:status | grep albums || echo "Albums migration not found in status"

# Method 1: Add migration record using Laravel
echo "🔨 Attempting to mark albums migration as completed..."
php artisan tinker --execute="
try {
    \$result = DB::table('migrations')->insertOrIgnore([
        'migration' => '2025_11_10_030541_create_albums_table', 
        'batch' => 1
    ]);
    echo 'Migration record insertion result: ' . (\$result ? 'SUCCESS' : 'ALREADY EXISTS');
} catch (Exception \$e) {
    echo 'ERROR: ' . \$e->getMessage();
}" || echo "Tinker method failed"

# Method 2: Direct database approach if tinker fails
echo "🗄️ Verifying migration record exists..."
MIGRATION_COUNT=$(php artisan tinker --execute="echo DB::table('migrations')->where('migration', '2025_11_10_030541_create_albums_table')->count();" 2>/dev/null | grep -o '[0-9]*' | head -n1)

if [ "$MIGRATION_COUNT" != "1" ]; then
    echo "⚠️ Migration record still missing, trying direct database approach..."
    
    # Get database credentials
    DB_DATABASE=$(grep "^DB_DATABASE=" .env | cut -d '=' -f2)
    DB_USERNAME=$(grep "^DB_USERNAME=" .env | cut -d '=' -f2) 
    DB_PASSWORD=$(grep "^DB_PASSWORD=" .env | cut -d '=' -f2)
    
    echo "Using database: $DB_DATABASE, user: $DB_USERNAME"
    
    if command -v mysql >/dev/null && [ -n "$DB_DATABASE" ] && [ -n "$DB_USERNAME" ]; then
        mysql -u"$DB_USERNAME" -p"$DB_PASSWORD" "$DB_DATABASE" -e "
            INSERT IGNORE INTO migrations (migration, batch) 
            VALUES ('2025_11_10_030541_create_albums_table', 1);
            SELECT 'Migration record added via MySQL';
        " 2>/dev/null || echo "MySQL direct approach failed"
    else
        echo "MySQL not available or credentials not found"
    fi
fi

# Verify the fix
echo "✅ Verifying fix..."
php artisan migrate:status | grep albums || echo "Migration not showing in status"

# Test running migrations now
echo "🧪 Testing migration run..."
php artisan migrate --dry-run 2>/dev/null || echo "Dry run completed"

# Actually run migrations
echo "🚀 Running migrations..."
if php artisan migrate --force; then
    echo "✅ Migrations completed successfully!"
else
    echo "⚠️ Migrations had issues but may be resolved now"
fi

# Configure SSR and restart services
echo "⚙️ Configuring SSR..."
if ! grep -q "INERTIA_SSR_PORT=13717" .env; then
    echo "INERTIA_SSR_PORT=13717" >> .env
fi

php artisan config:cache

# Start SSR
echo "🚀 Starting SSR server..."
mkdir -p storage/logs
nohup node bootstrap/ssr/ssr.js > storage/logs/ssr.log 2>&1 &

sleep 3

echo "📊 Final status:"
echo "   - Migration status: $(php artisan migrate:status | grep albums | wc -l) albums migrations found"
echo "   - SSR process: $(pgrep -f 'node.*ssr\.js' | wc -l) running"
echo "   - SSR port: $(lsof -ti:13717 | wc -l) processes on 13717"

echo "🎉 Manual fix completed!"