# LunarBlood API Documentation

## Overview

The LunarBlood API provides endpoints for message management, payment processing, health monitoring, and contact form submissions. All endpoints return JSON responses unless otherwise specified.

**Base URL**: `https://lunarblood.local` (or your configured domain)

## Authentication

Message-related endpoints require **Bearer token authentication** in the `Authorization` header:

```
Authorization: Bearer YOUR_AUTH_TOKEN
```

Public endpoints (health, contact, payment) do not require authentication.

## Rate Limiting

- **Payment Processing**: 5 attempts per minute per IP
- **Health Check**: 60 requests per minute per IP
- **Contact Submissions**: 3 requests per minute per IP

When rate limited, endpoints return `429 Too Many Requests`.

## API Endpoints

### 1. Get Messages

Retrieves all messages for the authenticated user.

**Endpoint**: `GET /api/messages`

**Authentication**: Required (Bearer token)

**Response Format**:
```json
[
  {
    "id": "string",
    "subject": "string",
    "body": "string",
    "read": false,
    "created_at": "ISO 8601 timestamp",
    "updated_at": "ISO 8601 timestamp"
  }
]
```

**Success Response** (200):
```json
[
  {
    "id": "msg_001",
    "subject": "Welcome to LunarBlood",
    "body": "Thank you for joining our platform!",
    "read": false,
    "created_at": "2026-04-09T10:30:00Z",
    "updated_at": "2026-04-09T10:30:00Z"
  }
]
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing authentication token
- `500 Internal Server Error`: Server error retrieving messages

---

### 2. Mark All Messages as Read

Marks all unread messages for the authenticated user as read.

**Endpoint**: `PATCH /api/messages/read-all`

**Authentication**: Required (Bearer token)

**Request Body**: (empty)

**Success Response** (200):
```json
{
  "success": true
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing authentication token
- `500 Internal Server Error`: Server error updating messages

---

### 3. Mark Single Message as Read

Marks a specific message as read.

**Endpoint**: `PATCH /api/messages/{id}/read`

**Authentication**: Required (Bearer token)

**URL Parameters**:
- `id` (required): Message ID

**Request Body**: (empty)

**Success Response** (200):
```json
{
  "success": true
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing authentication token
- `404 Not Found`: Message not found or not owned by user
- `500 Internal Server Error`: Server error updating message

---

### 4. Process Payment

Processes a credit card payment for the user.

**Endpoint**: `POST /api/process-payment`

**Authentication**: Not required

**Content-Type**: `application/json`

**Rate Limit**: 5 attempts per minute per IP

**Request Body**:
```json
{
  "email": "string (required, valid email)",
  "firstName": "string (required, max: 255)",
  "lastName": "string (required, max: 255)",
  "address": "string (required, max: 255)",
  "city": "string (required, max: 100)",
  "state": "string (required, 2 character state code)",
  "zip": "string (required, 5-10 digits)",
  "cardNumber": "string (required, 12-19 digits, no spaces)",
  "expiry": "string (required, MM/YY format)",
  "cvv": "string (required, 3-4 digits)"
}
```

**Example Request**:
```json
{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "address": "123 Main Street",
  "city": "Springfield",
  "state": "IL",
  "zip": "62701",
  "cardNumber": "4111111111111111",
  "expiry": "12/25",
  "cvv": "123"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Payment processed successfully",
  "order_id": "LB-a1b2c3d4e5f6g7h8"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid input format
  ```json
  {
    "success": false,
    "message": "Validation failed",
    "errors": {
      "email": ["Invalid email format"],
      "cardNumber": ["Card number must be 12-19 digits"]
    }
  }
  ```
- `422 Unprocessable Entity`: Payment processing failed
  ```json
  {
    "success": false,
    "message": "Payment declined. Please check your card details."
  }
  ```
- `429 Too Many Requests`: Rate limited
  ```json
  {
    "success": false,
    "message": "Too many payment attempts. Please try again later."
  }
  ```
- `500 Internal Server Error`: Server error

**Validation Rules**:
- Email must be a valid email format
- First/Last names: max 255 characters
- Address: max 255 characters
- City: max 100 characters
- State: 2-character US state code (e.g., "IL", "CA", "NY")
- Zip: 5-10 digits (supports US and Canada)
- Card Number: 12-19 digits (no spaces or hyphens)
- Expiry: MM/YY format (must not be expired)
- CVV: 3-4 digits

---

### 5. Health Check

Checks the API health status.

**Endpoint**: `GET /api/health`

**Authentication**: Not required

**Rate Limit**: 60 requests per minute per IP

**Response Format**:
```json
{
  "status": "ok",
  "timestamp": "ISO 8601 timestamp"
}
```

**Success Response** (200):
```json
{
  "status": "ok",
  "timestamp": "2026-04-09T10:45:30Z"
}
```

**Error Responses**:
- `503 Service Unavailable`: API is temporarily unavailable

---

### 6. Contact Form Submission

Submits a contact form message.

**Endpoint**: `POST /api/contact`

**Authentication**: Not required

**Content-Type**: `application/json` or `application/x-www-form-urlencoded`

**Rate Limit**: 3 requests per minute per IP

**Request Body**:
```json
{
  "name": "string (required, max: 255)",
  "email": "string (required, valid email, max: 255)",
  "message": "string (required, max: 5000)"
}
```

**Example Request**:
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "message": "I would like to inquire about your services."
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Your message has been sent successfully. We'll be in touch soon!"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid input format
  ```json
  {
    "success": false,
    "message": "Validation failed",
    "errors": {
      "email": ["Invalid email format"],
      "message": ["Message is required"]
    }
  }
  ```
- `429 Too Many Requests`: Rate limited
  ```json
  {
    "success": false,
    "message": "Please wait before submitting another message."
  }
  ```
- `500 Internal Server Error`: Server error (message may still be logged)

**Validation Rules**:
- Name: required, max 255 characters
- Email: required, valid email format, max 255 characters
- Message: required, max 5000 characters

---

## Error Handling

All error responses follow a consistent format:

```json
{
  "success": false,
  "message": "Human-readable error message",
  "errors": {
    "field_name": ["Error description"]
  }
}
```

## Common HTTP Status Codes

- `200 OK`: Request successful
- `400 Bad Request`: Invalid request format or validation failed
- `401 Unauthorized`: Authentication required or invalid token
- `404 Not Found`: Resource not found
- `422 Unprocessable Entity`: Request validation failed
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error
- `503 Service Unavailable`: Server temporarily unavailable

---

## Integration Examples

### JavaScript Fetch

```javascript
// Get messages
const response = await fetch('/api/messages', {
  headers: {
    'Authorization': `Bearer ${authToken}`,
    'Accept': 'application/json'
  }
});

const messages = await response.json();
```

### PHP cURL

```php
$ch = curl_init('https://lunarblood.local/api/health');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
$data = json_decode($response, true);
```

---

## Best Practices

1. **Always include the Authorization header** for authenticated endpoints
2. **Implement exponential backoff** for rate-limited responses (429)
3. **Validate input** on the client side before sending API requests
4. **Handle errors gracefully** and display user-friendly messages
5. **Store auth tokens securely** (not in localStorage if sensitive)
6. **Use HTTPS** in production for all API requests
