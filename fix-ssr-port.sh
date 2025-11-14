#!/bin/bash
# Quick SSR port fix for lunarblood
# Run this to ensure SSR is properly configured on port 13717

cd /home/forge/lunarblood.graveyardjokes.com

echo "🔧 Fixing SSR port configuration..."

# Stop any existing SSR processes
pkill -f "node bootstrap/ssr/ssr.js" 2>/dev/null || true
sleep 2

# Check and fix .env configuration
echo "⚙️ Checking .env configuration..."
if ! grep -q "INERTIA_SSR_PORT=13717" .env; then
    echo "Adding INERTIA_SSR_PORT=13717 to .env"
    echo "INERTIA_SSR_PORT=13717" >> .env
fi

if ! grep -q "INERTIA_SSR_ENABLED=true" .env; then
    echo "Adding INERTIA_SSR_ENABLED=true to .env"
    echo "INERTIA_SSR_ENABLED=true" >> .env
fi

# Clear config cache and rebuild
php artisan config:clear
php artisan config:cache

# Check if SSR bundle exists
if [ ! -f "bootstrap/ssr/ssr.js" ]; then
    echo "🔨 Building SSR bundle..."
    npm run build:ssr
fi

# Start SSR with proper configuration
echo "🚀 Starting SSR on port 13717..."
mkdir -p storage/logs
nohup node bootstrap/ssr/ssr.js > storage/logs/ssr.log 2>&1 &
SSR_PID=$!

# Wait and verify
sleep 5

if kill -0 $SSR_PID 2>/dev/null; then
    echo "✅ SSR process started (PID: $SSR_PID)"
    
    # Check if it's listening on the correct port
    if lsof -i:13717 > /dev/null 2>&1; then
        echo "✅ SSR listening on port 13717"
    else
        echo "⚠️ SSR not listening on port 13717"
        echo "📋 Recent SSR log:"
        tail -10 storage/logs/ssr.log
    fi
else
    echo "❌ SSR process failed to start"
    echo "📋 SSR log:"
    tail -10 storage/logs/ssr.log
fi

echo ""
echo "📊 Final Status Check:"
echo "   - SSR processes: $(pgrep -f 'node.*ssr\.js' | wc -l) running"
echo "   - Port 13717: $(lsof -ti:13717 | wc -l) connections"
echo "   - .env SSR config: $(grep -c INERTIA_SSR .env) entries"

# Test SSR endpoint
if curl -s "http://127.0.0.1:13717" > /dev/null; then
    echo "   - SSR endpoint: ✅ Responding"
else
    echo "   - SSR endpoint: ❌ Not responding"
fi

echo "🎉 SSR configuration check completed!"