<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateShowRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, string> */
    public function rules(): array
    {
        return [
            'venue_id' => 'required|exists:venues,id',
            'date' => 'required|date|after:today',
            'time' => 'required|date_format:H:i',
            'status' => 'required|in:coming-soon,on-sale,sold-out,cancelled',
            'ticket_url' => 'nullable|url',
            'price' => 'nullable|numeric|min:0',
            'description' => 'nullable|string|max:1000',
        ];
    }
}
