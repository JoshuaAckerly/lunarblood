# Monitoring & Error Review Cadence - Lunar Blood

## Overview

This document outlines the monitoring and error review processes for the Lunar Blood application. Regular monitoring ensures system health, performance, and security while enabling rapid response to issues.

## 🏥 Health Monitoring

### Automated Health Checks

The application includes automated health monitoring via `health-check.sh`:

```bash
# Run health check
./health-check.sh

# Run with verbose output
./health-check.sh verbose

# Run with alert notifications
./health-check.sh verbose alert
```

**Enhanced Monitoring Features:**
- Application endpoints (`/`, `/up`, `/login`, `/register`)
- Response time monitoring (<2s target)
- Service health (Laravel, Vite, SSR)
- Log file error analysis with thresholds
- Database connectivity
- System resources (CPU, memory, disk)
- SSL certificate expiry (if HTTPS)

### Comprehensive Monitoring Script

Use `monitor.sh` for scheduled monitoring with alerting:

```bash
# Daily monitoring
./monitor.sh daily

# Weekly monitoring (includes maintenance tasks)
./monitor.sh weekly

# Test alert system
./monitor.sh alert-test
```

**Monitoring Features:**
- Automated health checks with alerting
- Error pattern analysis
- Performance monitoring
- Security incident detection
- Backup verification
- Weekly maintenance tasks

### Health Check Integration

**Daily Cadence:**
- Run health checks every 4 hours during business hours
- Alert on any service failures
- Review health check logs daily

**Weekly Cadence:**
- Analyze health check trends
- Review service uptime percentages
- Update monitoring thresholds as needed

## 📊 Error Monitoring & Review

### Log Analysis Process

**Primary Log Location:** `storage/logs/laravel.log`

#### Daily Error Review (15 minutes)

```bash
# Quick error count check
grep -c "ERROR\|CRITICAL\|EMERGENCY" storage/logs/laravel.log

# Review recent errors
tail -50 storage/logs/laravel.log | grep -E "ERROR|CRITICAL|EMERGENCY"

# Check for patterns
grep "ERROR" storage/logs/laravel.log | tail -20
```

**Review Criteria:**
- Any CRITICAL or EMERGENCY level errors
- Repeated ERROR patterns (>5 occurrences)
- Authentication/authorization failures
- Database connection issues
- File upload/storage errors

#### Weekly Error Analysis (30 minutes)

```bash
# Use the automated error analysis script
./analyze-errors.sh 7

# For JSON output (useful for dashboards)
./analyze-errors.sh 7 json
```

**Analysis Features:**
- Error count summaries by severity
- Top error messages with frequencies
- Errors grouped by hour
- Recent critical error details
- Automated recommendations
- Pattern detection (auth failures, DB errors)

**Manual Analysis Commands:**
```bash
# Error frequency analysis
grep "ERROR\|CRITICAL" storage/logs/laravel.log | \
  awk '{print $1,$2}' | \
  sort | \
  uniq -c | \
  sort -nr | \
  head -10

# Check for unusual error spikes
grep "ERROR" storage/logs/laravel.log | \
  awk '{print substr($1,1,10)}' | \
  sort | \
  uniq -c
```

**Analysis Focus:**
- Error rate trends over time
- New error types or sources
- Performance-related errors
- User-facing error patterns

### Error Classification

| Severity | Criteria | Response Time | Action |
|----------|----------|---------------|--------|
| **Critical** | System down, data loss, security breach | Immediate | Alert team, investigate |
| **High** | Core functionality broken, user impact | <1 hour | Investigate, fix or mitigate |
| **Medium** | Feature degradation, performance issues | <4 hours | Investigate, plan fix |
| **Low** | Minor issues, edge cases | <24 hours | Log, plan for future release |

## 🚨 Alert Configuration

### Slack Integration

Configure Slack alerts for critical issues:

```php
// config/logging.php
'slack' => [
    'driver' => 'slack',
    'url' => env('LOG_SLACK_WEBHOOK_URL'),
    'username' => env('LOG_SLACK_USERNAME', 'Lunar Blood'),
    'emoji' => env('LOG_SLACK_EMOJI', ':boom:'),
    'level' => env('LOG_LEVEL', 'critical'),
],
```

**Environment Variables:**
```bash
LOG_SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
LOG_SLACK_USERNAME="Lunar Blood Monitor"
LOG_SLACK_EMOJI=":lunar_blood:"
```

### Email Alerts

For high-priority errors, configure email notifications:

```php
// config/logging.php
'channels' => [
    'important' => [
        'driver' => 'stack',
        'channels' => ['single', 'mail'],
    ],
    'mail' => [
        'driver' => 'monolog',
        'handler' => 'Monolog\Handler\SwiftMailerHandler',
        'level' => 'error',
    ],
],
```

## 📈 Performance Monitoring

### Response Time Monitoring

**Key Metrics to Track:**
- Page load times (<2 seconds target)
- API response times (<500ms target)
- Database query performance
- Asset loading times

**Monitoring Commands:**
```bash
# Check response times
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:8002/

# Database query analysis
php artisan tinker --execute="
\DB::listen(function (\$query) {
    if (\$query->time > 1000) {
        echo 'Slow query: ' . \$query->sql . ' (' . \$query->time . 'ms)' . PHP_EOL;
    }
});
"
```

### Resource Usage Monitoring

**System Resources:**
- CPU usage (<70% sustained)
- Memory usage (<80% of available)
- Disk space (>20% free)
- Database connections (<80% of max)

**Monitoring Script:**
```bash
#!/bin/bash
# System resource check
echo "=== System Resources ==="
echo "CPU: $(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1"%"}')"
echo "Memory: $(free | grep Mem | awk '{printf "%.0f%%", $3/$2 * 100.0}')"
echo "Disk: $(df / | tail -1 | awk '{print $5}')"
```

## 🔧 Error Resolution Workflow

### Incident Response Process

1. **Detection**
   - Monitor alerts or user reports
   - Check health status and logs

2. **Assessment**
   - Determine impact and severity
   - Identify root cause
   - Check for similar issues

3. **Containment**
   - Implement temporary fixes if needed
   - Scale resources if required
   - Communicate with stakeholders

4. **Resolution**
   - Deploy permanent fix
   - Test fix in staging
   - Monitor post-deployment

5. **Review**
   - Document incident and resolution
   - Update monitoring if needed
   - Prevent future occurrences

### Common Error Patterns & Solutions

#### Database Connection Issues
```bash
# Check database status
php artisan tinker --execute="DB::connection()->getPdo(); echo 'DB OK';"

# Restart database service
sudo systemctl restart mysql

# Check connection pool
php artisan config:cache
php artisan queue:restart
```

#### Memory Issues
```bash
# Check memory usage
php artisan tinker --execute="echo 'Memory: ' . memory_get_peak_usage(true) / 1024 / 1024 . ' MB';"

# Clear caches
php artisan cache:clear
php artisan config:clear
php artisan view:clear
```

#### File Permission Issues
```bash
# Fix storage permissions
chmod -R 755 storage/
chmod -R 755 bootstrap/cache/
chown -R www-data:www-data storage/
chown -R www-data:www-data bootstrap/cache/
```

## 📋 Weekly Review Checklist

### Monday Morning (30 minutes)
- [ ] Review weekend error logs
- [ ] Check system resource usage
- [ ] Verify backup completion
- [ ] Review security scan results
- [ ] Update monitoring configurations

### Wednesday Mid-week (15 minutes)
- [ ] Analyze error trends
- [ ] Check performance metrics
- [ ] Review user feedback/issues
- [ ] Test critical user flows

### Friday End-of-week (45 minutes)
- [ ] Comprehensive error analysis
- [ ] Performance optimization review
- [ ] Security vulnerability assessment
- [ ] Plan monitoring improvements
- [ ] Document any incidents

## 🛠️ Monitoring Tools & Configuration

### Automation Scripts

**Available Scripts:**
- `health-check.sh` - Basic health monitoring
- `monitor.sh` - Comprehensive monitoring with alerting
- `analyze-errors.sh` - Error analysis and reporting

### Cron Configuration

Set up automated monitoring using the provided cron configuration:

```bash
# Copy to cron configuration
sudo cp cron-monitoring.conf /etc/cron.d/lunarblood

# Or add to user crontab
crontab -e
# Then add the lines from cron-monitoring.conf
```

**Scheduled Tasks:**
- Health checks every 4 hours (business hours)
- Daily monitoring at 6 AM
- Weekly monitoring every Monday at 7 AM
- Log rotation daily at 2 AM
- Backup verification daily at 8 AM
- SSL certificate monitoring weekly
- System resource monitoring (disk, memory)

### Log Management

**Log Rotation Configuration:**
```bash
# Copy logrotate configuration
sudo cp logrotate.conf /etc/logrotate.d/laravel
```

**Log Retention:**
- Daily rotation of Laravel logs
- 30-day retention period
- Automatic compression
- Proper permissions maintained

## 📊 Metrics Dashboard

### Key Performance Indicators (KPIs)

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Uptime | 99.9% | - | - |
| Error Rate | <1% | - | - |
| Response Time | <2s | - | - |
| User Satisfaction | >95% | - | - |

### Monitoring Dashboard Setup

Consider implementing:
- **Grafana** for metrics visualization
- **Prometheus** for time-series data
- **Sentry** for error tracking
- **New Relic** for application performance

## 🚀 Continuous Improvement

### Monthly Review Process
1. Analyze monitoring effectiveness
2. Update alert thresholds
3. Implement new monitoring capabilities
4. Review and update this documentation
5. Train team on new procedures

### Automation Opportunities
- Automated error categorization
- Predictive alerting based on trends
- Automated remediation for common issues
- Integration with CI/CD pipelines

---

**Last Updated:** February 26, 2026
**Review Frequency:** Weekly
**Owner:** Development Team</content>
<parameter name="filePath">/home/joshua/Documents/lunarblood/MONITORING.md