#!/bin/bash

# Lunar Blood Health Check Script
# Usage: ./health-check.sh [verbose]

BASE_URL="http://lunarblood.graveyardjokes.local"
LOG_FILE="/tmp/lunarblood-health-check.log"
VERBOSE=${1:-false}

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
    if [ "$VERBOSE" = "true" ]; then
        echo -e "$1"
    fi
}

check_endpoint() {
    local url=$1
    local expected_code=$2
    local description=$3

    local response=$(curl -s -o /dev/null -w "%{http_code}" "$url")

    if [ "$response" -eq "$expected_code" ]; then
        log "${GREEN}✓ $description: HTTP $response${NC}"
        return 0
    else
        log "${RED}✗ $description: HTTP $response (expected $expected_code)${NC}"
        return 1
    fi
}

check_service() {
    local service=$1
    local pid_file=$2

    if [ -f "$pid_file" ] && kill -0 $(cat "$pid_file") 2>/dev/null; then
        log "${GREEN}✓ $service is running${NC}"
        return 0
    else
        log "${RED}✗ $service is not running${NC}"
        return 1
    fi
}

log "${YELLOW}Starting Lunar Blood health check...${NC}"

# Application endpoints
check_endpoint "$BASE_URL/" 200 "Homepage"
check_endpoint "$BASE_URL/up" 200 "Health check endpoint"

# Service checks
check_service "Laravel" "/tmp/lunarblood-laravel.pid"
check_service "Vite" "/tmp/lunarblood-vite.pid"
check_service "SSR" "/tmp/lunarblood-ssr.pid"

# Log file check
if [ -f "storage/logs/laravel.log" ]; then
    error_count=$(grep -c "ERROR\|CRITICAL" storage/logs/laravel.log 2>/dev/null || echo "0")
    if [ "$error_count" -gt 10 ]; then
        log "${RED}⚠ High error count in logs: $error_count${NC}"
    else
        log "${GREEN}✓ Error count acceptable: $error_count${NC}"
    fi
else
    log "${YELLOW}⚠ Laravel log file not found${NC}"
fi

# Database connectivity (basic check)
if php artisan tinker --execute="echo 'DB OK';" > /dev/null 2>&1; then
    log "${GREEN}✓ Database connection OK${NC}"
else
    log "${RED}✗ Database connection failed${NC}"
fi

log "${YELLOW}Health check completed. See $LOG_FILE for details.${NC}"