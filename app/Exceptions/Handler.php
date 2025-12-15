<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Inertia\Inertia;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * Prepare exception for rendering.
     */
    public function render($request, Throwable $e)
    {
        $response = parent::render($request, $e);

        // Only handle Inertia requests or requests expecting HTML
        if ($request->header('X-Inertia') || $request->accepts('text/html')) {
            $status = $response->getStatusCode();

            // Handle specific HTTP error codes with Inertia pages
            if (in_array($status, [404, 403, 500, 503])) {
                return Inertia::render("errors/{$status}", [
                    'status' => $status,
                ])
                ->toResponse($request)
                ->setStatusCode($status);
            }
        }

        return $response;
    }
}
