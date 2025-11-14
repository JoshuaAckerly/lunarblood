#!/bin/bash
# Emergency SSR fix for Lunar Blood production deployment
# Run this after a failed deployment to get SSR working

set -e

cd /home/forge/lunarblood.graveyardjokes.com

echo "🔧 Emergency SSR fix for Lunar Blood"

# Stop any existing SSR processes
echo "🛑 Stopping existing SSR processes..."
pkill -f "node bootstrap/ssr/ssr.js" 2>/dev/null || true
lsof -ti:13717 | xargs kill -9 2>/dev/null || true

# Update .env with SSR configuration
echo "⚙️ Configuring SSR environment..."
sed -i '/^INERTIA_SSR_PORT=/d' .env 2>/dev/null || true
sed -i '/^INERTIA_SSR_ENABLED=/d' .env 2>/dev/null || true
echo "INERTIA_SSR_PORT=13717" >> .env
echo "INERTIA_SSR_ENABLED=true" >> .env

# Clear config cache to pick up new environment
php artisan config:clear
php artisan config:cache

# Build SSR bundle
echo "🔨 Building SSR bundle..."
npm run build:ssr

# Verify SSR bundle exists
if [ ! -f "bootstrap/ssr/ssr.js" ]; then
    echo "❌ SSR bundle still missing after build!"
    echo "📋 Checking build output..."
    ls -la bootstrap/ssr/ || echo "bootstrap/ssr directory doesn't exist"
    exit 1
fi

# Start SSR server
echo "🚀 Starting SSR server on port 13717..."
mkdir -p storage/logs
nohup node bootstrap/ssr/ssr.js > storage/logs/ssr.log 2>&1 &
SSR_PID=$!

# Wait and verify
sleep 5
if kill -0 $SSR_PID 2>/dev/null; then
    echo "✅ SSR started successfully (PID: $SSR_PID)"
    
    # Test endpoint
    if curl -s -f "http://127.0.0.1:13717" > /dev/null; then
        echo "✅ SSR endpoint responding on port 13717"
        echo "🎉 Emergency fix completed successfully!"
    else
        echo "⚠️ SSR endpoint not responding"
        echo "📋 Recent log output:"
        tail -10 storage/logs/ssr.log
    fi
else
    echo "❌ SSR failed to start"
    echo "📋 Recent log output:"
    tail -10 storage/logs/ssr.log
    exit 1
fi

echo ""
echo "📊 Lunar Blood Status Summary:"
echo "   - SSR Bundle: $([ -f bootstrap/ssr/ssr.js ] && echo '✅ Present' || echo '❌ Missing')"
echo "   - SSR Process: $(kill -0 $SSR_PID 2>/dev/null && echo '✅ Running' || echo '❌ Stopped')"
echo "   - SSR Port: 13717"
echo "🌙 Lunar Blood SSR is ready!"