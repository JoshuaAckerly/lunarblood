#!/bin/bash

# Lunar Blood Error Analysis Script
# Usage: ./analyze-errors.sh [days] [output-format]
# Example: ./analyze-errors.sh 7 json

LOG_FILE="storage/logs/laravel.log"
DAYS=${1:-7}
FORMAT=${2:-text}

if [ ! -f "$LOG_FILE" ]; then
    echo "Error: Log file $LOG_FILE not found"
    exit 1
fi

echo "Analyzing errors from the last $DAYS days..."
echo "=========================================="

# Calculate date threshold
START_DATE=$(date -d "$DAYS days ago" +%Y-%m-%d)

case "$FORMAT" in
    "json")
        # JSON output for integration with other tools
        echo "{"
        echo '  "analysis_period": "'$DAYS' days",'
        echo '  "start_date": "'$START_DATE'",'
        echo '  "total_errors": '$(grep -E "ERROR|CRITICAL|EMERGENCY" "$LOG_FILE" | grep -c "$START_DATE" || echo 0)','
        echo '  "error_breakdown": {'

        # Error levels
        for level in "EMERGENCY" "CRITICAL" "ERROR" "WARNING"; do
            count=$(grep "$level" "$LOG_FILE" | grep -c "$START_DATE" || echo 0)
            echo '    "'$level'": '$count','
        done

        # Top error messages
        echo '    "top_messages": ['
        grep -E "ERROR|CRITICAL|EMERGENCY" "$LOG_FILE" | \
        grep "$START_DATE" | \
        sed 's/.*'"$level"': //' | \
        sort | \
        uniq -c | \
        sort -nr | \
        head -10 | \
        awk 'BEGIN{ORS=""} {print "      {\"count\": "$1", \"message\": \""$2"\"}, "}' | \
        sed 's/, $//' || echo ""
        echo '    ]'

        echo "  }"
        echo "}"
        ;;

    "text"|*)
        echo "Analysis Period: Last $DAYS days (since $START_DATE)"
        echo "Log File: $LOG_FILE"
        echo ""

        # Summary statistics
        echo "=== ERROR SUMMARY ==="
        total_errors=$(grep -E "ERROR|CRITICAL|EMERGENCY" "$LOG_FILE" | grep -c "$START_DATE" 2>/dev/null | tr -d ' ' || echo 0)
        echo "Total Errors: $total_errors"

        # Error levels
        for level in "EMERGENCY" "CRITICAL" "ERROR" "WARNING"; do
            count=$(grep "$level" "$LOG_FILE" | grep -c "$START_DATE" 2>/dev/null | tr -d ' ' || echo 0)
            if [ "$count" -gt 0 ]; then
                echo "$level: $count"
            fi
        done

        echo ""
        echo "=== TOP ERROR MESSAGES ==="
        grep -E "ERROR|CRITICAL|EMERGENCY" "$LOG_FILE" | \
        grep "$START_DATE" | \
        sed 's/.*\(ERROR\|CRITICAL\|EMERGENCY\): //' | \
        sort | \
        uniq -c | \
        sort -nr | \
        head -10 | \
        nl -w2 -s'. '

        echo ""
        echo "=== ERRORS BY HOUR ==="
        grep -E "ERROR|CRITICAL|EMERGENCY" "$LOG_FILE" | \
        grep "$START_DATE" | \
        awk '{print substr($2,1,2)}' | \
        sort | \
        uniq -c | \
        sort -k2 | \
        awk '{printf "%02d:00: %d errors\n", $2, $1}'

        echo ""
        echo "=== RECENT CRITICAL ERRORS ==="
        grep -E "CRITICAL|EMERGENCY" "$LOG_FILE" | \
        grep "$START_DATE" | \
        tail -5

        echo ""
        echo "=== RECOMMENDATIONS ==="
        if [ "$total_errors" -gt 100 ]; then
            echo "⚠️  HIGH ERROR RATE: Investigate immediately"
        elif [ "$total_errors" -gt 50 ]; then
            echo "⚠️  ELEVATED ERROR RATE: Monitor closely"
        else
            echo "✅ ERROR RATE ACCEPTABLE"
        fi

        # Check for patterns
        auth_errors=$(grep -c "Unauthenticated\|Invalid credentials" "$LOG_FILE" 2>/dev/null | tr -d ' ' || echo 0)
        if [ "$auth_errors" -gt 10 ]; then
            echo "⚠️  HIGH AUTHENTICATION FAILURES: Check for brute force attempts"
        fi

        db_errors=$(grep -c "SQLSTATE\|PDOException" "$LOG_FILE" 2>/dev/null | tr -d ' ' || echo 0)
        if [ "$db_errors" -gt 5 ]; then
            echo "⚠️  DATABASE ERRORS DETECTED: Check database connectivity"
        fi
        ;;
esac