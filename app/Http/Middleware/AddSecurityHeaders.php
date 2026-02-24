<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AddSecurityHeaders
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

        if ($request->isSecure()) {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        }

        $csp = "default-src 'self'";
        if (app()->environment('local')) {
            $csp .= " http:";
        }
        $csp .= "; script-src 'self'";
        if (app()->environment('local')) {
            $csp .= " 'unsafe-inline' http:";
        }
        $csp .= "; style-src 'self' 'unsafe-inline'";
        if (app()->environment('local')) {
            $csp .= " http:";
        }
        $csp .= " https://fonts.bunny.net; font-src 'self'";
        if (app()->environment('local')) {
            $csp .= " http:";
        }
        $csp .= " https://fonts.bunny.net; connect-src 'self'";
        if (app()->environment('local')) {
            $csp .= " http: ws: wss:";
        }
        $csp .= "; frame-ancestors 'self'; object-src 'none'; base-uri 'self'; form-action 'self';";

        $response->headers->set('Content-Security-Policy', $csp);

        return $response;
    }
}
