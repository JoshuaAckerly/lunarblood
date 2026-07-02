<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\ContactFormMail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function send(Request $request): JsonResponse
    {
        /** @var array{name: string, email: string, message: string} $validated */
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'message' => 'required|string|max:1000',
        ]);

        $name = trim(strip_tags((string) $validated['name']));
        $email = strtolower(trim((string) $validated['email']));
        $message = trim(strip_tags((string) $validated['message']));

        if ($name === '' || $message === '') {
            return response()->json([
                'success' => false,
                'message' => 'Invalid contact data provided',
            ], 422);
        }

        Mail::to(config('mail.from.address'))->send(new ContactFormMail(
            senderName: $name,
            senderEmail: $email,
            messageBody: $message,
        ));

        return response()->json([
            'success' => true,
            'message' => 'Message sent successfully',
        ]);
    }
}
