<?php

return [
    'dsn' => env('SENTRY_LARAVEL_DSN', env('SENTRY_DSN')),

    // Capture errors in production only by default
    'environment' => env('APP_ENV', 'production'),

    // Performance monitoring: capture 5% of transactions in production
    'traces_sample_rate' => (float) env('SENTRY_TRACES_SAMPLE_RATE', 0.05),

    // Profiling: off by default
    'profiles_sample_rate' => (float) env('SENTRY_PROFILES_SAMPLE_RATE', 0.0),

    // Don't attach user PII by default
    'send_default_pii' => false,

    // Breadcrumbs
    'breadcrumbs' => [
        'logs' => true,
        'cache' => false,
        'livewire' => false,
        'sql_queries' => true,
        'sql_bindings' => false,
        'queue_info' => true,
        'command_info' => true,
        'http_client_requests' => true,
    ],

    // Tracing
    'tracing' => [
        'queue_job_transactions' => env('SENTRY_TRACE_QUEUE_JOBS', false),
        'queue_jobs' => true,
        'sql_queries' => true,
        'sql_origin' => true,
        'views' => true,
        'http_client_requests' => true,
        'redis_commands' => env('SENTRY_TRACE_REDIS_COMMANDS', false),
        'redis_origin' => false,
        'default_integrations' => true,
    ],
];
