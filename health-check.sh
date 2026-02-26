#!/bin/bash

# Lunar Blood Enhanced Health Check Script
# Usage: ./health-check.sh [verbose] [alert]

BASE_URL="http://lunarblood.graveyardjokes.local"
LOG_FILE="/tmp/lunarblood-health-check.log"
ALERT_EMAIL=${ALERT_EMAIL:-"admin@graveyardjokes.com"}
VERBOSE=false
SEND_ALERT=false

if [ "$1" = "verbose" ]; then
    VERBOSE=true
fi

if [ "$2" = "alert" ]; then
    SEND_ALERT=true
fi

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Error counters
ERROR_COUNT=0
WARNING_COUNT=0

log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
    if [ "$VERBOSE" = "true" ]; then
        echo -e "$1"
    fi
}

alert() {
    local message=$1
    local severity=${2:-"WARNING"}

    if [ "$SEND_ALERT" = "true" ]; then
        echo "$message" | mail -s "Lunar Blood $severity Alert" "$ALERT_EMAIL"
    fi

    log "${RED}ALERT: $message${NC}"
}

check_endpoint() {
    local url=$1
    local expected_code=$2
    local description=$3
    local timeout=${4:-10}

    local response=$(curl -s -o /dev/null -w "%{http_code}" --max-time "$timeout" "$url")

    if [ "$response" -eq "$expected_code" ]; then
        log "${GREEN}✓ $description: HTTP $response${NC}"
        return 0
    else
        log "${RED}✗ $description: HTTP $response (expected $expected_code)${NC}"
        ERROR_COUNT=$((ERROR_COUNT + 1))
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
        ERROR_COUNT=$((ERROR_COUNT + 1))
        return 1
    fi
}

check_response_time() {
    local url=$1
    local max_time=$2
    local description=$3

    local response_time=$(curl -s -o /dev/null -w "%{time_total}" "$url")

    if (( $(echo "$response_time < $max_time" | bc -l) )); then
        log "${GREEN}✓ $description: ${response_time}s${NC}"
        return 0
    else
        log "${YELLOW}⚠ $description: ${response_time}s (slow)${NC}"
        WARNING_COUNT=$((WARNING_COUNT + 1))
        return 1
    fi
}

log "${BLUE}Starting Lunar Blood enhanced health check...${NC}"

# Application endpoints
check_endpoint "$BASE_URL/" 200 "Homepage"
check_endpoint "$BASE_URL/up" 200 "Health check endpoint"
check_endpoint "$BASE_URL/login" 200 "Login page"
check_endpoint "$BASE_URL/register" 200 "Registration page"

# Response time checks
check_response_time "$BASE_URL/" 2.0 "Homepage response time"
check_response_time "$BASE_URL/up" 1.0 "Health endpoint response time"

# Service checks
check_service "Laravel" "/tmp/lunarblood-laravel.pid"
check_service "Vite" "/tmp/lunarblood-vite.pid"
check_service "SSR" "/tmp/lunarblood-ssr.pid"

# Log file analysis
if [ -f "storage/logs/laravel.log" ]; then
    # Count different error levels
    error_count=$(grep -E "ERROR|CRITICAL|EMERGENCY" storage/logs/laravel.log 2>/dev/null | wc -l | tr -d ' ')
    warning_count=$(grep -c "WARNING" storage/logs/laravel.log 2>/dev/null | tr -d ' ' || echo 0)

    if [ "$error_count" -gt 10 ]; then
        log "${RED}⚠ High error count in logs: $error_count${NC}"
        ERROR_COUNT=$((ERROR_COUNT + 1))
    elif [ "$error_count" -gt 0 ]; then
        log "${YELLOW}⚠ Some errors in logs: $error_count${NC}"
        WARNING_COUNT=$((WARNING_COUNT + 1))
    else
        log "${GREEN}✓ No errors in logs${NC}"
    fi

    if [ "$warning_count" -gt 20 ]; then
        log "${YELLOW}⚠ High warning count: $warning_count${NC}"
        WARNING_COUNT=$((WARNING_COUNT + 1))
    fi

    # Check for recent critical errors (last hour)
    # recent_critical=$(grep -E "CRITICAL|EMERGENCY" storage/logs/laravel.log 2>/dev/null | grep "$(date -d '1 hour ago' '+%Y-%m-%d %H')" 2>/dev/null | wc -l | tr -d ' ')
    # if [ "$recent_critical" -gt 0 ]; then
    #     alert "Found $recent_critical critical errors in the last hour" "CRITICAL"
    # fi

else
    log "${YELLOW}⚠ Laravel log file not found${NC}"
    WARNING_COUNT=$((WARNING_COUNT + 1))
fi

# Database connectivity
if php artisan tinker --execute="echo 'DB OK';" > /dev/null 2>&1; then
    log "${GREEN}✓ Database connection OK${NC}"
else
    log "${RED}✗ Database connection failed${NC}"
    ERROR_COUNT=$((ERROR_COUNT + 1))
fi

# System resource checks
cpu_usage=$(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1}')
if (( $(echo "$cpu_usage > 80" | bc -l) )); then
    log "${RED}⚠ High CPU usage: ${cpu_usage}%${NC}"
    WARNING_COUNT=$((WARNING_COUNT + 1))
else
    log "${GREEN}✓ CPU usage: ${cpu_usage}%${NC}"
fi

mem_usage=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100.0}')
if [ "$mem_usage" -gt 85 ]; then
    log "${RED}⚠ High memory usage: ${mem_usage}%${NC}"
    WARNING_COUNT=$((WARNING_COUNT + 1))
else
    log "${GREEN}✓ Memory usage: ${mem_usage}%${NC}"
fi

disk_usage=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
if [ "$disk_usage" -gt 90 ]; then
    log "${RED}⚠ High disk usage: ${disk_usage}%${NC}"
    ERROR_COUNT=$((ERROR_COUNT + 1))
else
    log "${GREEN}✓ Disk usage: ${disk_usage}%${NC}"
fi

# SSL certificate check (if HTTPS)
if [[ "$BASE_URL" == https://* ]]; then
    domain=$(echo "$BASE_URL" | sed 's|https://||' | sed 's|/.*||')
    expiry_days=$(openssl s_client -connect "$domain:443" -servername "$domain" 2>/dev/null | openssl x509 -noout -checkend $((30*24*3600)) 2>/dev/null && echo "30+" || echo "expiring")
    if [ "$expiry_days" = "expiring" ]; then
        log "${RED}⚠ SSL certificate expires within 30 days${NC}"
        WARNING_COUNT=$((WARNING_COUNT + 1))
    else
        log "${GREEN}✓ SSL certificate valid${NC}"
    fi
fi

# Summary
log "${BLUE}Health check completed. Errors: $ERROR_COUNT, Warnings: $WARNING_COUNT${NC}"

if [ "$VERBOSE" = "true" ]; then
    echo -e "${BLUE}Summary:${NC}"
    echo -e "  Errors: $ERROR_COUNT"
    echo -e "  Warnings: $WARNING_COUNT"
    echo -e "  Log file: $LOG_FILE"
fi

# Exit with error code if there are critical issues
if [ "$ERROR_COUNT" -gt 0 ]; then
    exit 1
elif [ "$WARNING_COUNT" -gt 3 ]; then
    exit 2
else
    exit 0
fi