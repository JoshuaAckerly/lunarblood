#!/bin/bash
# Complete SSR rebuild and port fix for lunarblood
# This will rebuild the SSR bundle with the correct port configuration

cd /home/forge/lunarblood.graveyardjokes.com

echo "🔧 Complete SSR rebuild to fix port 13714 -> 13717"

# Kill ALL SSR processes (including the one still using 13714)
echo "🛑 Stopping ALL SSR processes..."
pkill -f "node bootstrap/ssr/ssr.js" 2>/dev/null || true
pkill -f "ssr.js" 2>/dev/null || true
lsof -ti:13714 | xargs kill -9 2>/dev/null || true
lsof -ti:13717 | xargs kill -9 2>/dev/null || true
sleep 3

# Clean up old SSR bundle
echo "🧹 Cleaning old SSR bundle..."
rm -f bootstrap/ssr/ssr.js bootstrap/ssr/ssr.mjs 2>/dev/null || true
rm -rf bootstrap/ssr/ 2>/dev/null || true

# Ensure .env has correct configuration
echo "⚙️ Configuring environment for port 13717..."
sed -i '/^INERTIA_SSR_PORT=/d' .env 2>/dev/null || true
sed -i '/^INERTIA_SSR_ENABLED=/d' .env 2>/dev/null || true
echo "INERTIA_SSR_PORT=13717" >> .env
echo "INERTIA_SSR_ENABLED=true" >> .env

# Show current .env SSR config
echo "📋 Current .env SSR configuration:"
grep INERTIA_SSR .env || echo "No INERTIA_SSR entries found"

# Clear all Laravel caches before rebuilding
echo "🧹 Clearing all caches..."
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

# Cache the new configuration
php artisan config:cache

# Verify Laravel can see the correct port
echo "🔍 Verifying Laravel configuration..."
LARAVEL_SSR_PORT=$(php artisan tinker --execute="echo config('inertia.ssr.url');" 2>/dev/null | grep -o 'http://[^:]*:[0-9]*' | grep -o '[0-9]*$' || echo "unknown")
echo "Laravel sees SSR URL with port: $LARAVEL_SSR_PORT"

# Rebuild the SSR bundle completely
echo "🔨 Rebuilding SSR bundle with correct port..."
npm run build:ssr

# Verify the SSR bundle was created
if [ -f "bootstrap/ssr/ssr.js" ]; then
    echo "✅ SSR bundle created successfully"
    
    # Check if the bundle contains the correct port (optional)
    if grep -q "13717" bootstrap/ssr/ssr.js 2>/dev/null; then
        echo "✅ SSR bundle contains port 13717"
    elif grep -q "13714" bootstrap/ssr/ssr.js 2>/dev/null; then
        echo "⚠️ SSR bundle still contains port 13714 - may need environment check"
    fi
else
    echo "❌ SSR bundle creation failed"
    echo "📋 Build output should be above"
    exit 1
fi

# Create logs directory
mkdir -p storage/logs

# Start the new SSR process
echo "🚀 Starting SSR with rebuilt bundle..."
nohup node bootstrap/ssr/ssr.js > storage/logs/ssr.log 2>&1 &
SSR_PID=$!

# Give it time to start
sleep 5

# Verify the new process
if kill -0 $SSR_PID 2>/dev/null; then
    echo "✅ New SSR process started (PID: $SSR_PID)"
    
    # Check which port it's actually using
    if lsof -i:13717 > /dev/null 2>&1; then
        echo "✅ SSR successfully listening on port 13717"
    elif lsof -i:13714 > /dev/null 2>&1; then
        echo "❌ SSR still listening on port 13714 (old port)"
        echo "📋 Last 20 lines of SSR log:"
        tail -20 storage/logs/ssr.log
    else
        echo "⚠️ SSR not listening on either port"
        echo "📋 Last 20 lines of SSR log:"
        tail -20 storage/logs/ssr.log
    fi
    
    # Test the endpoint
    if curl -s "http://127.0.0.1:13717" > /dev/null; then
        echo "✅ SSR endpoint responding on port 13717"
    else
        echo "❌ SSR endpoint not responding on port 13717"
    fi
    
else
    echo "❌ SSR process failed to start"
    echo "📋 SSR log:"
    tail -20 storage/logs/ssr.log
fi

echo ""
echo "📊 Final Status:"
echo "   - Running SSR processes: $(pgrep -f 'node.*ssr\.js' | wc -l)"
echo "   - Port 13714: $(lsof -ti:13714 | wc -l) processes (should be 0)"
echo "   - Port 13717: $(lsof -ti:13717 | wc -l) processes (should be 1)"
echo "   - SSR bundle exists: $([ -f bootstrap/ssr/ssr.js ] && echo 'Yes' || echo 'No')"

echo "🎉 Complete SSR rebuild completed!"