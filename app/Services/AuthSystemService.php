<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class AuthSystemService
{
    protected string $baseUrl;

    public function __construct()
    {
        $url = config('services.auth_system.url', 'http://auth-system.local/api');
        $this->baseUrl = is_string($url) ? $url : 'http://auth-system.local/api';
    }

    /**
     * @return array<string, mixed>|null
     */
    public function getMessages(string $token): ?array
    {
        $response = Http::withToken($token)->get($this->baseUrl.'/messages');
        if ($response->successful()) {
            /** @var array<string, mixed> $data */
            $data = $response->json();
            return $data;
        }

        return null;
    }

    public function markMessageRead(string $token, int $id): bool
    {
        $response = Http::withToken($token)->patch($this->baseUrl.'/messages/'.$id.'/read');

        return $response->successful();
    }

    public function markAllMessagesRead(string $token): bool
    {
        $response = Http::withToken($token)->patch($this->baseUrl.'/messages/read-all');

        return $response->successful();
    }
}
