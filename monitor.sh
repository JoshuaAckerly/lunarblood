#!/bin/bash

# Lunar Blood Monitoring Script
# Run this script via cron for regular monitoring
# Usage: ./monitor.sh [daily|weekly|alert-test]

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_DIR="./logs/monitoring"
MONITOR_LOG="$LOG_DIR/monitor.log"
ALERT_LOG="$LOG_DIR/alerts.log"

# Create log directory if it doesn't exist
mkdir -p "$LOG_DIR"

# Configuration
ALERT_EMAIL="alerts@graveyardjokes.com"
SLACK_WEBHOOK="${SLACK_WEBHOOK:-}"
MODE=${1:-"daily"}

# Colors for logging
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') [$MODE] $1" | tee -a "$MONITOR_LOG"
}

alert() {
    local message="$1"
    local severity="${2:-WARNING}"

    echo "$(date '+%Y-%m-%d %H:%M:%S') [$severity] $message" >> "$ALERT_LOG"
    log "${RED}ALERT: $message${NC}"

    # Email alert
    if [ -n "$ALERT_EMAIL" ]; then
        echo "$message" | mail -s "Lunar Blood $severity Alert" "$ALERT_EMAIL"
    fi

    # Slack alert
    if [ -n "$SLACK_WEBHOOK" ]; then
        curl -X POST -H 'Content-type: application/json' \
             --data "{\"text\":\"🚨 Lunar Blood $severity: $message\"}" \
             "$SLACK_WEBHOOK" 2>/dev/null || true
    fi
}

# Run health check and capture exit code
run_health_check() {
    log "Running health check..."
    "$SCRIPT_DIR/health-check.sh" verbose alert

    local exit_code=$?
    case $exit_code in
        0)
            log "${GREEN}Health check passed${NC}"
            ;;
        1)
            alert "Health check failed with errors" "CRITICAL"
            ;;
        2)
            alert "Health check passed with warnings" "WARNING"
            ;;
        *)
            alert "Health check failed with unknown exit code: $exit_code" "ERROR"
            ;;
    esac

    return $exit_code
}

# Analyze error patterns
analyze_errors() {
    if [ ! -f "storage/logs/laravel.log" ]; then
        log "${YELLOW}No log file found for error analysis${NC}"
        return
    fi

    log "Analyzing error patterns..."

    # Count errors by hour (last 24 hours)
    local recent_errors=$(grep -E "ERROR|CRITICAL|EMERGENCY" storage/logs/laravel.log | \
                         grep "$(date -d '24 hours ago' '+%Y-%m-%d')" | wc -l)

    if [ "$recent_errors" -gt 50 ]; then
        alert "High error rate: $recent_errors errors in last 24 hours" "CRITICAL"
    elif [ "$recent_errors" -gt 20 ]; then
        alert "Elevated error rate: $recent_errors errors in last 24 hours" "WARNING"
    fi

    # Check for authentication failures
    local auth_failures=$(grep -c "Unauthenticated\|Invalid credentials" storage/logs/laravel.log)
    if [ "$auth_failures" -gt 10 ]; then
        alert "High authentication failure rate: $auth_failures attempts" "WARNING"
    fi

    # Check for database errors
    local db_errors=$(grep -c "SQLSTATE\|PDOException" storage/logs/laravel.log)
    if [ "$db_errors" -gt 5 ]; then
        alert "Database errors detected: $db_errors occurrences" "ERROR"
    fi
}

# Performance monitoring
check_performance() {
    log "Checking performance metrics..."

    # Response time check
    local response_time=$(curl -s -o /dev/null -w "%{time_total}" "http://localhost:8002/" 2>/dev/null || echo "0")

    if (( $(echo "$response_time > 5.0" | bc -l 2>/dev/null) )); then
        alert "Slow homepage response: ${response_time}s" "WARNING"
    fi

    # Database query performance (if enabled)
    if php artisan tinker --execute="
        \$start = microtime(true);
        \DB::select('SELECT 1');
        \$time = microtime(true) - \$start;
        echo \$time;
    " 2>/dev/null | grep -q "0\."; then
        local db_time=$(php artisan tinker --execute="
            \$start = microtime(true);
            \DB::select('SELECT 1');
            \$time = (microtime(true) - \$start) * 1000;
            echo round(\$time, 2);
        " 2>/dev/null)

        if (( $(echo "$db_time > 100" | bc -l 2>/dev/null) )); then
            alert "Slow database response: ${db_time}ms" "WARNING"
        fi
    fi
}

# Security monitoring
check_security() {
    log "Checking security status..."

    # Check for suspicious patterns in logs
    local suspicious=$(grep -c -E "(sql injection|suspicious|attack|hacking)" storage/logs/laravel.log 2>/dev/null | tr -d ' ' || echo "0")
    if [ "$suspicious" -gt 0 ]; then
        alert "Potential security incidents detected: $suspicious occurrences" "CRITICAL"
    fi

    # Check file permissions
    if [ -w "storage/logs/laravel.log" ] && [ "$(stat -c %a storage/logs/laravel.log 2>/dev/null)" != "644" ]; then
        alert "Incorrect log file permissions" "WARNING"
    fi
}

# Backup verification
check_backups() {
    log "Checking backup status..."

    # Check if backup directory exists and has recent files
    if [ -d "/var/backups/lunarblood" ]; then
        local recent_backup=$(find /var/backups/lunarblood -name "*.sql.gz" -mtime -1 2>/dev/null | wc -l)
        if [ "$recent_backup" -eq 0 ]; then
            alert "No recent database backup found" "WARNING"
        fi
    else
        alert "Backup directory not found" "WARNING"
    fi
}

# Weekly maintenance tasks
weekly_tasks() {
    log "Running weekly maintenance tasks..."

    # Rotate logs if they're too large
    if [ -f "storage/logs/laravel.log" ] && [ "$(stat -f%z storage/logs/laravel.log 2>/dev/null || stat -c%s storage/logs/laravel.log)" -gt 104857600 ]; then
        log "Rotating large log file..."
        mv storage/logs/laravel.log "storage/logs/laravel-$(date +%Y%m%d).log"
        touch storage/logs/laravel.log
    fi

    # Clean old log files (keep last 30 days)
    find storage/logs -name "laravel-*.log" -mtime +30 -delete 2>/dev/null || true

    # Check for outdated packages
    log "Checking for outdated packages..."
    local outdated_count=$(composer outdated --direct 2>/dev/null | grep -c "packages" || echo "0")
    if [ "$outdated_count" -gt 5 ]; then
        alert "Many packages are outdated: $outdated_count packages need updates" "INFO"
    fi
}

# Main execution
case "$MODE" in
    "daily")
        log "${BLUE}Starting daily monitoring...${NC}"
        run_health_check
        analyze_errors
        check_performance
        check_security
        ;;
    "weekly")
        log "${BLUE}Starting weekly monitoring...${NC}"
        run_health_check
        analyze_errors
        check_performance
        check_security
        check_backups
        weekly_tasks
        ;;
    "alert-test")
        log "${BLUE}Testing alert system...${NC}"
        alert "This is a test alert from the monitoring system" "TEST"
        ;;
    *)
        echo "Usage: $0 [daily|weekly|alert-test]"
        exit 1
        ;;
esac

log "${GREEN}Monitoring completed${NC}"